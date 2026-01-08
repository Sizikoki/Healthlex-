from contextlib import asynccontextmanager
from fastapi import FastAPI, APIRouter, Depends, HTTPException, Header, Request
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel
from typing import Optional
from pathlib import Path
from datetime import datetime, timedelta, timezone
from collections import defaultdict
import time
import os
import uuid
import jwt
import bcrypt
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from user_agents import parse

# =====================
# ENV / DB
# =====================

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

# ZORUNLU ENV
MONGO_URL = os.environ.get("MONGO_URL")
DB_NAME = os.environ.get("DB_NAME")
if not MONGO_URL or not DB_NAME:
    raise RuntimeError("Missing env: MONGO_URL and/or DB_NAME (backend/.env)")

client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]

JWT_SECRET = os.environ.get("JWT_SECRET", "dev-secret")
JWT_ALGORITHM = "HS256"

# GOOGLE CLIENT ID (ENV varsa onu kullan)
GOOGLE_CLIENT_ID = os.environ.get(
    "GOOGLE_CLIENT_ID",
    "279499913538-gtltbe7fmn95ud955uen6ah5j82g1avs.apps.googleusercontent.com"
)

ACCESS_TOKEN_MINUTES = int(os.environ.get("ACCESS_TOKEN_MINUTES", "60"))
REFRESH_TOKEN_DAYS = int(os.environ.get("REFRESH_TOKEN_DAYS", "7"))

# =====================
# RATE LIMITING
# =====================

rate_limit_store = defaultdict(list)

def check_rate_limit(identifier: str, limit: int, window: int = 60):
    """Basit rate limiting kontrolü - DÜZGÜN ÇALIŞAN VERSİYON"""
    now = time.time()
    
    # Eğer identifier yoksa, boş liste oluştur
    if identifier not in rate_limit_store:
        rate_limit_store[identifier] = []
    
    # Identifier'ın request listesini al
    requests = rate_limit_store[identifier]
    
    # Eski istekleri temizle (window saniye öncesini sil)
    requests = [req_time for req_time in requests if now - req_time < window]
    
    # Limit kontrolü
    if len(requests) >= limit:
        # Listeyi güncelle (temizlenmiş haliyle)
        rate_limit_store[identifier] = requests
        return False
    
    # Yeni isteği kaydet
    requests.append(now)
    # Listeyi güncelle
    rate_limit_store[identifier] = requests
    return True

# =====================
# MONGODB INDEX SETUP
# =====================

async def setup_mongo_indexes():
    """MongoDB index'lerini kur - Startup'ta çalışır"""
    try:
        print("🔧 MongoDB index'leri kuruluyor...")
        
        # 1. Ana TTL Index: expires_at zamanı geldiğinde otomatik sil
        # NOT: Bu tüm expired token'ları siler (aktif olsa bile)
        try:
            await db.refresh_tokens.create_index(
                [("expires_at", 1)],
                expireAfterSeconds=0,  # expires_at zamanında sil
                name="token_expiry_ttl"
            )
            print("✅ Ana TTL Index kuruldu: token_expiry_ttl")
        except Exception as e:
            print(f"ℹ️ Ana TTL Index zaten var: {e}")
        
        # 2. Partial TTL Index: Sadece logout olmuş (is_active=False) token'ları HEMEN sil
        # Bu, logout olduktan sonra token'ların hemen temizlenmesini sağlar
        try:
            await db.refresh_tokens.create_index(
                [("expires_at", 1)],
                expireAfterSeconds=0,
                partialFilterExpression={"is_active": False},
                name="inactive_tokens_immediate_ttl"
            )
            print("✅ Partial TTL Index kuruldu: inactive_tokens_immediate_ttl")
        except Exception as e:
            print(f"ℹ️ Partial TTL Index zaten var: {e}")
        
        # 3. Cleanup index: 90 günden eski tüm token'ları temizle (aktif olsa bile)
        # Güvenlik için çok eski token'ları temizler
        try:
            await db.refresh_tokens.create_index(
                [("created_at", 1)],
                expireAfterSeconds=90 * 24 * 60 * 60,  # 90 gün
                name="old_tokens_cleanup_ttl"
            )
            print("✅ Eski token cleanup TTL Index kuruldu: old_tokens_cleanup_ttl")
        except Exception as e:
            print(f"ℹ️ Cleanup TTL Index zaten var: {e}")
        
        print("✅ Tüm TTL Index'leri kuruldu/kontrol edildi")
        
    except Exception as e:
        print(f"⚠️ TTL Index kurulum hatası: {e}")

# =====================
# MODELS
# =====================

class RegisterRequest(BaseModel):
    email: str
    password: str
    name: Optional[str] = ""

class LoginRequest(BaseModel):
    email: str
    password: str

class GoogleLoginRequest(BaseModel):
    credential: str

class TokenPairResponse(BaseModel):
    access_token: str
    refresh_token: str

class RefreshRequest(BaseModel):
    refresh_token: Optional[str] = None

# =====================
# AUTH UTILS
# =====================

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode(), hashed.encode())

def create_access_token(user_id: str) -> str:
    payload = {
        "sub": user_id,
        "exp": datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_MINUTES),
        "type": "access"
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def get_current_user_id(authorization: Optional[str] = Header(None)) -> str:
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization missing")
    
    try:
        scheme, token = authorization.split(" ")
        if scheme.lower() != "bearer":
            raise ValueError("Bad scheme")

        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        
        # HER ZAMAN LOG GÖSTER (debug için)
        expire_time = datetime.fromtimestamp(payload["exp"])
        remaining_minutes = (expire_time - datetime.utcnow()).total_seconds() / 60
        
        print(f"⏰ TOKEN DEBUG - Kalan: {remaining_minutes:.1f} dakika | User: {payload['sub']}")
        
        if payload.get("type") != "access":
            raise ValueError("Bad token type")

        return payload["sub"]
        
    except jwt.ExpiredSignatureError:
        print("⏰ ⚠️ ⚠️ TOKEN EXPIRED - Refresh tetiklenecek!")
        raise HTTPException(status_code=401, detail="Token expired")
    except Exception as e:
        print(f"⏰ ❌ Token decode error: {e}")
        raise HTTPException(status_code=401, detail="Invalid or expired token")

# =====================
# DEVICE & LOCATION HELPERS
# =====================

def parse_device_info(user_agent: str) -> dict:
    """User-Agent string'inden device bilgisi çıkar"""
    try:
        ua = parse(user_agent)
        return {
            "device": ua.device.family if ua.device.family != "Other" else "Desktop",
            "browser": f"{ua.browser.family} {ua.browser.version_string}",
            "os": f"{ua.os.family} {ua.os.version_string}",
            "is_mobile": ua.is_mobile,
            "is_tablet": ua.is_tablet,
            "is_pc": ua.is_pc,
            "raw": user_agent[:100]
        }
    except:
        return {
            "device": "Unknown",
            "browser": "Unknown",
            "os": "Unknown",
            "raw": user_agent[:100] if user_agent else ""
        }


def get_location_from_ip(ip_address: str) -> str:
    """Basit IP location (production'da daha gelişmiş kullanılabilir)"""
    if not ip_address:
        return "Unknown"
    
    # Local IP'ler
    if ip_address.startswith("192.168.") or ip_address.startswith("10.") or ip_address == "127.0.0.1":
        return "Local Network"
    
    # Basit mapping
    return "Turkey"  # Placeholder


def mask_ip(ip_address: str) -> str:
    """IP adresini maskele (gizlilik için)"""
    if not ip_address:
        return ""
    
    parts = ip_address.split(".")
    if len(parts) == 4:
        return f"{parts[0]}.{parts[1]}.***.***"
    
    return ip_address

# =====================
# REFRESH TOKEN HELPERS
# =====================

async def save_refresh_token(user_id: str, request: Request):
    """Güvenli refresh token kaydet - metadata ile"""
    jti = str(uuid.uuid4())
    refresh_token = str(uuid.uuid4())
    
    # User-Agent ve IP
    user_agent = request.headers.get("User-Agent", "")
    ip_address = request.client.host if request.client else ""
    
    # UA parsing
    device_info = "Unknown"
    try:
        ua = parse(user_agent)
        device_info = f"{ua.browser.family} {ua.browser.version_string} on {ua.os.family}"
    except:
        device_info = user_agent[:50]
    
    # CRITICAL FIX: created_at ve expires_at MUTLAKA datetime olmalı!
    created_at = datetime.utcnow()
    expires_at = created_at + timedelta(days=REFRESH_TOKEN_DAYS)
    
    token_data = {
        "jti": jti,
        "token": refresh_token,
        "user_id": user_id,
        "created_at": created_at,  # <-- BU ASLA NULL OLMAMALI!
        "last_used_at": created_at,
        "expires_at": expires_at,  # <-- BU ASLA NULL OLMAMALI!
        "is_active": True,
        "user_agent": user_agent[:200],
        "device_info": device_info[:100],
        "ip_address": ip_address,
        "rotations": 0
    }
    
    await db.refresh_tokens.insert_one(token_data)
    
    print(f"💾 Refresh token kaydedildi: {refresh_token[:12]}... (user: {user_id})")
    print(f"   created_at: {created_at}, expires_at: {expires_at}")
    
    return refresh_token

# =====================
# LIFESPAN (Startup/Shutdown)
# =====================

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup (uygulama başlarken)
    print("🚀 Uygulama başlatılıyor...")
    try:
        await client.admin.command("ping")
        print("✅ MongoDB Bağlantısı Başarılı!")
        
        await setup_mongo_indexes()
        
        deleted = await db.refresh_tokens.delete_many({
            "expires_at": {"$lt": datetime.utcnow()},
            "is_active": True
        })
        print(f"✅ {deleted.deleted_count} expired token temizlendi")
        
    except Exception as e:
        print(f"❌ MongoDB Hata: {e}")
    
    yield  # Uygulama burada çalışır
    
    # Shutdown (uygulama kapanırken)
    print("🛑 Uygulama kapatılıyor...")
    client.close()
    print("✅ MongoDB bağlantısı kapatıldı")

# =====================
# APP CONFIG
# =====================

app = FastAPI(lifespan=lifespan)
api_router = APIRouter(prefix="/api")

# =====================
# ROUTES – AUTH
# =====================

@api_router.post("/auth/register")
async def register(data: RegisterRequest, request: Request):
    # Rate limiting: IP başına dakikada 3 kayıt
    client_ip = request.client.host if request.client else "unknown"
    if not check_rate_limit(f"register_{client_ip}", limit=3, window=60):
        raise HTTPException(
            status_code=429,
            detail="Too many registration attempts. Please try again later."
        )
    
    if await db.users.find_one({"email": data.email}):
        raise HTTPException(status_code=400, detail="Email already registered")

    user_id = str(uuid.uuid4())
    user = {
        "_id": user_id,
        "email": data.email,
        "name": data.name or "",
        "password": hash_password(data.password),
        "email_verified": True,
        "created_at": datetime.now(timezone.utc),
        "role": "user"
    }
    await db.users.insert_one(user)
    return {"ok": True}

@api_router.post("/auth/login", response_model=TokenPairResponse)
async def login(data: LoginRequest, request: Request):
    # Rate limiting: IP başına dakikada 5 login
    client_ip = request.client.host if request.client else "unknown"
    identifier = f"login_{client_ip}"
    
    print(f"🔐 Login attempt from {client_ip} - email: {data.email}")
    
    if not check_rate_limit(identifier, limit=5, window=60):
        print(f"🚫 RATE LIMIT HIT! {identifier} - Too many requests")
        raise HTTPException(
            status_code=429,
            detail="Too many login attempts. Please try again later."
        )
    
    print(f"✅ Rate limit OK for {identifier}")
    
    user = await db.users.find_one({"email": data.email})
    if not user or not verify_password(data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access = create_access_token(user["_id"])
    refresh = await save_refresh_token(user["_id"], request)

    return {"access_token": access, "refresh_token": refresh}

@api_router.post("/auth/google", response_model=TokenPairResponse)
async def google_login(data: GoogleLoginRequest, request: Request):
    # Rate limiting: IP başına dakikada 5 Google login
    client_ip = request.client.host if request.client else "unknown"
    if not check_rate_limit(f"google_{client_ip}", limit=5, window=60):
        raise HTTPException(
            status_code=429,
            detail="Too many Google login attempts. Please try again later."
        )
    
    try:
        idinfo = id_token.verify_oauth2_token(
            data.credential,
            google_requests.Request(),
            GOOGLE_CLIENT_ID
        )

        email = idinfo["email"]
        name = idinfo.get("name", "")

        user = await db.users.find_one({"email": email})
        if not user:
            user_id = str(uuid.uuid4())
            user = {
                "_id": user_id,
                "email": email,
                "name": name,
                "email_verified": True,
                "created_at": datetime.now(timezone.utc),
                "role": "user"
            }
            await db.users.insert_one(user)

        access = create_access_token(user["_id"])
        refresh = await save_refresh_token(user["_id"], request)

        return {"access_token": access, "refresh_token": refresh}
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Google Auth Error: {str(e)}")

@api_router.post("/auth/refresh", response_model=TokenPairResponse)
async def refresh_tokens(authorization: Optional[str] = Header(None), request: Request = None):
    """
    Refresh token endpoint - Authorization header'dan refresh token alır
    Format: "Bearer {refresh_token}"
    """
    print("\n" + "="*60)
    print("🔄 /api/auth/refresh ÇAĞRILDI")
    print(f"📅 Zaman: {datetime.utcnow()}")
    
    if not authorization:
        print("❌ HATA: Authorization header eksik")
        raise HTTPException(status_code=401, detail="Refresh token missing")
    
    print(f"📨 Authorization header (ilk 50 karakter): {authorization[:50]}")
    
    if not authorization.startswith("Bearer "):
        print(f"❌ HATA: Yanlış token formatı")
        raise HTTPException(status_code=401, detail="Invalid token format")
    
    refresh_token = authorization[7:]
    print(f"🔑 Alınan refresh token (ilk 20 karakter): {refresh_token[:20]}")
    print(f"🔑 Token uzunluğu: {len(refresh_token)} karakter")
    
    # Önce MongoDB'de bu token var mı kontrol et (aktif olmasa bile)
    any_token = await db.refresh_tokens.find_one({"token": refresh_token})
    print(f"📊 MongoDB'de token var mı (aktif olmasa bile): {'EVET' if any_token else 'HAYIR'}")
    
    if any_token:
        print(f"📊 Token detayları: is_active={any_token.get('is_active', False)}, user_id={any_token.get('user_id', 'N/A')}")
    
    # MongoDB'de refresh token'ı ara (sadece aktif olanlar)
    rec = await db.refresh_tokens.find_one({
        "token": refresh_token,
        "is_active": True
    })
    
    if not rec:
        print(f"❌ HATA: Token bulunamadı veya aktif değil")
        
        # Neden bulunamadığını anlamak için daha fazla debug
        total_tokens = await db.refresh_tokens.count_documents({})
        active_tokens = await db.refresh_tokens.count_documents({"is_active": True})
        print(f"   📊 MongoDB Durumu: Toplam {total_tokens} token, {active_tokens} aktif")
        
        # Tüm koleksiyonları listele
        collections = await db.list_collection_names()
        print(f"   📋 MongoDB koleksiyonları: {collections}")
        
        # Tüm token'ları listele (debug için)
        all_tokens = await db.refresh_tokens.find().limit(5).to_list(5)
        print(f"   📋 İlk 5 token preview:")
        for i, t in enumerate(all_tokens):
            token_preview = t.get("token", "")[:10] + "..." if t.get("token") else "None"
            print(f"     {i+1}. {token_preview} - aktif: {t.get('is_active', False)} - user: {t.get('user_id', 'N/A')}")
        
        # Belki token 'refresh_token' field'ında?
        alt_token = await db.refresh_tokens.find_one({"refresh_token": refresh_token})
        if alt_token:
            print(f"   ⚠️ Token 'refresh_token' field'ında bulundu!")
        
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    print(f"✅ Token BULUNDU!")
    print(f"   👤 user_id: {rec.get('user_id')}")
    print(f"   ✅ is_active: {rec.get('is_active', False)}")
    print(f"   📅 created_at: {rec.get('created_at')}")
    print(f"   🆔 jti: {rec.get('jti', 'N/A')[:10]}...")
    
    # Expire kontrol
    expires_at = rec.get("expires_at")
    if expires_at and isinstance(expires_at, datetime):
        now = datetime.utcnow()
        time_left = expires_at - now
        hours_left = time_left.total_seconds() / 3600
        
        print(f"   ⏰ Token süresi: {expires_at}")
        print(f"   ⏰ Şu an: {now}")
        print(f"   ⏰ Kalan süre: {hours_left:.1f} saat")
        
        if expires_at < now:
            print(f"   ❌ Token süresi DOLMUŞ!")
            await db.refresh_tokens.update_one(
                {"token": refresh_token},
                {"$set": {"is_active": False}}
            )
            raise HTTPException(status_code=401, detail="Refresh token expired")
    else:
        print(f"   ⚠️ expires_at bilgisi yok veya datetime değil: {expires_at}")

    user_id = rec["user_id"]
    old_jti = rec.get("jti", "")
    
    # Rotation limit kontrolü
    rotations = rec.get("rotations", 0)
    print(f"   🔄 Rotation sayısı: {rotations}")
    
    if rotations > 10:
        print(f"   🚫 Çok fazla rotation ({rotations})")
        await db.refresh_tokens.delete_many({"user_id": user_id})
        raise HTTPException(status_code=401, detail="Too many rotations, please re-login")
    
    # Kullanıcıyı kontrol et
    user = await db.users.find_one({"_id": user_id})
    if not user:
        print(f"   ❌ Kullanıcı bulunamadı: {user_id}")
        raise HTTPException(status_code=404, detail="User not found")

    print(f"   ✅ Kullanıcı bulundu: email={user.get('email')}")
    
    # Yeni access token oluştur
    new_access = create_access_token(user_id)
    print(f"   ✅ Yeni access token oluşturuldu (ilk 30 karakter): {new_access[:30]}...")
    
    # Yeni refresh token (rotate)
    new_jti = str(uuid.uuid4())
    new_refresh = str(uuid.uuid4())
    print(f"   🔄 Yeni refresh token oluşturuldu: {new_refresh[:12]}...")
    
    # User-Agent ve IP
    user_agent = request.headers.get("User-Agent", "") if request else ""
    ip_address = request.client.host if request and request.client else ""
    
    print(f"   📱 User-Agent: {user_agent[:50]}")
    print(f"   🌐 IP Address: {ip_address}")
    
    # Eski token'ı inaktif yap
    update_result = await db.refresh_tokens.update_one(
        {"token": refresh_token},
        {
            "$set": {
                "is_active": False,
                "rotated_at": datetime.utcnow(),
                "rotated_to": new_jti
            }
        }
    )
    
    print(f"   🔄 Eski token inaktif yapıldı. Güncellenen: {update_result.modified_count}")
    
    # Yeni refresh token'ı metadata ile kaydet
    new_token_data = {
        "jti": new_jti,
        "token": new_refresh,
        "user_id": user_id,
        "created_at": datetime.utcnow(),
        "last_used_at": datetime.utcnow(),
        "expires_at": datetime.utcnow() + timedelta(days=REFRESH_TOKEN_DAYS),
        "is_active": True,
        "user_agent": user_agent[:200],
        "ip_address": ip_address,
        "rotated_from": old_jti,
        "rotations": rotations + 1
    }
    
    insert_result = await db.refresh_tokens.insert_one(new_token_data)
    print(f"   💾 Yeni token kaydedildi. ID: {insert_result.inserted_id}")
    
    print("✅ REFRESH BAŞARILI!")
    print("="*60 + "\n")
    
    return {
        "access_token": new_access,
        "refresh_token": new_refresh
    }

@api_router.post("/auth/logout")
async def logout(data: Optional[RefreshRequest] = None, authorization: Optional[str] = Header(None)):
    refresh_token = None
    
    if authorization and authorization.startswith("Bearer "):
        refresh_token = authorization[7:]
    elif data and data.refresh_token:
        refresh_token = data.refresh_token
    
    if refresh_token:
        await db.refresh_tokens.update_one(
            {"token": refresh_token},
            {"$set": {"is_active": False, "logged_out_at": datetime.utcnow()}}
        )
    
    return {"ok": True}

@api_router.post("/auth/logout-all")
async def logout_all(
    user_id: str = Depends(get_current_user_id),
    request: Request = None
):
    """
    Tüm cihazlardan çıkış yap (mevcut cihaz hariç)
    """
    # Mevcut cihazın refresh token'ını al (eğer varsa)
    current_refresh_token = None
    auth_header = request.headers.get("Authorization") if request else None
    if auth_header and auth_header.startswith("Bearer "):
        current_refresh_token = auth_header[7:]
    
    # Update query: Tüm aktif token'ları inaktif yap, ama mevcut token'ı hariç tut
    update_query = {"user_id": user_id, "is_active": True}
    if current_refresh_token:
        update_query["token"] = {"$ne": current_refresh_token}
        message = "Diğer tüm cihazlardan çıkış yapıldı. Mevcut cihazda kalmaya devam ediyorsunuz."
    else:
        message = "Tüm cihazlardan çıkış yapıldı."
    
    result = await db.refresh_tokens.update_many(
        update_query,
        {
            "$set": {
                "is_active": False, 
                "logged_out_at": datetime.utcnow(),
                "logged_out_reason": "logout_all"
            }
        }
    )
    
    # Log kaydı
    await db.user_logs.insert_one({
        "user_id": user_id,
        "action": "logout_all",
        "timestamp": datetime.utcnow(),
        "ip_address": request.client.host if request and request.client else None,
        "user_agent": request.headers.get("User-Agent", "")[:200] if request else "",
        "tokens_invalidated": result.modified_count,
        "current_device_excluded": current_refresh_token is not None
    })
    
    return {
        "message": message,
        "tokens_invalidated": result.modified_count,
        "current_device_excluded": current_refresh_token is not None
    }
@api_router.get("/auth/me")
async def me(user_id: str = Depends(get_current_user_id)):
    user = await db.users.find_one({"_id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "id": user["_id"],
        "email": user["email"],
        "name": user.get("name", ""),
        "role": user.get("role", "user"),
        "stats": {"learned_terms": 0, "current_streak": 0, "average_quiz_score": 0}
    }

@api_router.get("/auth/sessions")
async def get_sessions(user_id: str = Depends(get_current_user_id)):
    """Kullanıcının aktif oturumlarını listele"""
    sessions = await db.refresh_tokens.find({
        "user_id": user_id,
        "is_active": True,
        "expires_at": {"$gt": datetime.utcnow()}
    }).sort("created_at", -1).to_list(length=50)
    
    formatted_sessions = []
    for session in sessions:
        formatted_sessions.append({
            "id": str(session.get("_id", "")),
            "device_info": session.get("device_info", "Unknown device"),
            "user_agent": session.get("user_agent", "")[:100],
            "ip_address": session.get("ip_address", ""),
            "created_at": session.get("created_at"),
            "last_used_at": session.get("last_used_at"),
            "expires_at": session.get("expires_at"),
            "location": session.get("location", "Unknown"),  # IP'den location çözebiliriz
            "is_current": False  # Frontend bunu ayarlayacak
        })
    
    return {"sessions": formatted_sessions}

@api_router.delete("/auth/sessions/{session_id}")
async def revoke_session(
    session_id: str,
    user_id: str = Depends(get_current_user_id)
):
    """Belirli bir oturumu sonlandır"""
    result = await db.refresh_tokens.update_one(
        {
            "_id": ObjectId(session_id),
            "user_id": user_id,
            "is_active": True
        },
        {
            "$set": {
                "is_active": False,
                "revoked_at": datetime.utcnow(),
                "revoked_reason": "manual_revoke"
            }
        }
    )
    
    if result.modified_count == 0:
        raise HTTPException(
            status_code=404,
            detail="Session not found or already inactive"
        )
    
    return {"message": "Session revoked successfully"}

# =====================
# DEBUG ENDPOINTS
# =====================

@api_router.get("/auth/debug-tokens")
async def debug_tokens():
    """Debug: MongoDB'deki refresh token'ları göster"""
    try:
        # Tüm token'ları getir
        tokens = await db.refresh_tokens.find().sort("created_at", -1).limit(20).to_list(20)
        
        result = []
        for token in tokens:
            result.append({
                "id": str(token.get("_id", "")),
                "token_preview": f"{token.get('token', '')[:8]}..." if token.get('token') else "None",
                "jti_preview": f"{token.get('jti', '')[:8]}..." if token.get('jti') else "None",
                "user_id": token.get("user_id", ""),
                "is_active": token.get("is_active", False),
                "created_at": token.get("created_at"),
                "expires_at": token.get("expires_at"),
                "rotations": token.get("rotations", 0),
                "user_agent": (token.get("user_agent", "")[:30] + "...") if token.get("user_agent") else ""
            })
        
        total = await db.refresh_tokens.count_documents({})
        active = await db.refresh_tokens.count_documents({"is_active": True})
        
        # Users koleksiyonundan user sayısı
        user_count = await db.users.count_documents({})
        
        return {
            "total_tokens": total,
            "active_tokens": active,
            "total_users": user_count,
            "tokens": result
        }
    except Exception as e:
        return {"error": str(e)}

@api_router.get("/auth/debug-token/{user_id}")
async def debug_get_token(user_id: str):  # <-- İNDENT DÜZELDİ! @api_router ile aynı hizada
    """DEBUG: User ID için access token oluştur"""
    user = await db.users.find_one({"_id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    access_token = create_access_token(user_id)
    
    return {
        "user_id": user_id,
        "email": user.get("email", ""),
        "access_token": access_token,
        "expires_in": "60 minutes"
    }

# =====================
# ENHANCED SESSION MANAGEMENT
# =====================


@api_router.get("/auth/sessions/detailed")
async def get_detailed_sessions(user_id: str = Depends(get_current_user_id)):
    """Detaylı oturum bilgilerini döndür"""
    sessions = await db.refresh_tokens.find({
        "user_id": user_id,
        "expires_at": {"$gt": datetime.utcnow()}
    }).sort("last_used_at", -1).to_list(length=20)
    
    formatted_sessions = []
    
    for session in sessions:
        # Device detection from user_agent
        user_agent = session.get("user_agent", "")
        device_info = parse_device_info(user_agent)
        
        # Location
        location = get_location_from_ip(session.get("ip_address", ""))
        
        formatted_sessions.append({
            "id": str(session.get("_id", "")),
            "device_name": device_info.get("device", "Unknown Device"),
            "browser": device_info.get("browser", "Unknown Browser"),
            "os": device_info.get("os", "Unknown OS"),
            "location": location,
            "ip_address": mask_ip(session.get("ip_address", "")),
            "created_at": session.get("created_at"),
            "last_used_at": session.get("last_used_at") or session.get("created_at"),
            "expires_at": session.get("expires_at"),
            "is_active": session.get("is_active", False),
            "is_current": False  # Frontend localStorage'daki token ile karşılaştıracak
        })
    
    return {"sessions": formatted_sessions}


@api_router.post("/auth/logout-all-enhanced")
async def logout_all_enhanced(
    exclude_current: bool = True,
    user_id: str = Depends(get_current_user_id),
    request: Request = None
):
    """
    Geliştirilmiş logout-all
    - exclude_current: Mevcut cihazı hariç tut (default: True)
    """
    # Mevcut token'ı al
    current_token = None
    auth_header = request.headers.get("Authorization") if request else None
    if auth_header and auth_header.startswith("Bearer "):
        current_token = auth_header[7:]
    
    # Update query
    update_query = {"user_id": user_id, "is_active": True}
    if exclude_current and current_token:
        update_query["token"] = {"$ne": current_token}
        message = f"Diğer tüm cihazlardan çıkış yapıldı. Mevcut cihazda oturumunuz açık kaldı."
    else:
        message = "Tüm cihazlardan çıkış yapıldı."
    
    result = await db.refresh_tokens.update_many(
        update_query,
        {
            "$set": {
                "is_active": False,
                "logged_out_at": datetime.utcnow(),
                "logged_out_reason": "logout_all_enhanced"
            }
        }
    )
    
    return {
        "success": True,
        "message": message,
        "tokens_invalidated": result.modified_count,
        "current_device_excluded": exclude_current and current_token is not None
    }


@api_router.get("/auth/notifications/preferences")
async def get_notification_preferences(user_id: str = Depends(get_current_user_id)):
    """Kullanıcının notification preference'larını getir"""
    user = await db.users.find_one({"_id": user_id})
    
    # Varsayılan preferences
    default_prefs = {
        "learning_reminders": True,
        "achievement_notifications": True,
        "security_alerts": True,
        "email_digest": "weekly"
    }
    
    # Kullanıcının kayıtlı preference'ları
    user_prefs = user.get("notification_preferences", {}) if user else {}
    
    return {**default_prefs, **user_prefs}


@api_router.put("/auth/notifications/preferences")
async def update_notification_preferences(
    preferences: dict,
    user_id: str = Depends(get_current_user_id)
):
    """Notification preference'larını güncelle"""
    await db.users.update_one(
        {"_id": user_id},
        {"$set": {"notification_preferences": preferences}},
        upsert=True
    )
    
    return {
        "success": True, 
        "message": "Tercihleriniz kaydedildi.",
        "preferences": preferences
    }

@api_router.get("/auth/test-refresh")
async def test_refresh():
    """Test için basit bir endpoint"""
    return {
        "message": "Backend çalışıyor!",
        "timestamp": datetime.utcnow().isoformat(),
        "endpoints": {
            "login": "POST /api/auth/login",
            "refresh": "POST /api/auth/refresh",
            "debug": "GET /api/auth/debug-tokens",
            "me": "GET /api/auth/me"
        }
    }

# =====================
# APP SETUP
# =====================

app.include_router(api_router)

# CORS
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
    expose_headers=["Content-Length"],
    max_age=600,
)