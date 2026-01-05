from fastapi import FastAPI, APIRouter, Depends, HTTPException, Header
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from pathlib import Path
from datetime import datetime, timedelta, timezone, date
import os
import uuid
import jwt
import bcrypt
import logging
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

# =====================
# ENV / DB
# =====================

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]

JWT_SECRET = os.environ.get("JWT_SECRET", "dev-secret")
JWT_ALGORITHM = "HS256"

# GOOGLE CLIENT ID
GOOGLE_CLIENT_ID = "279499913538-gtltbe7fmn95ud955uen6ah5j82g1avs.apps.googleusercontent.com"


ACCESS_TOKEN_MINUTES = 60
REFRESH_TOKEN_DAYS = 7
EMAIL_VERIFY_MINUTES = 30

app = FastAPI()
api_router = APIRouter(prefix="/api")

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
    refresh_token: Optional[str] = None # Boş gelirse patlamasın diye Optional yaptık

class VerifyEmailRequest(BaseModel):
    token: str

class ResendVerifyRequest(BaseModel):
    email: str

class UserStats(BaseModel):
    learned_terms: int
    current_streak: int
    average_quiz_score: int

class UserMeResponse(BaseModel):
    id: str
    email: str
    name: str
    stats: UserStats

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

def create_refresh_token() -> str:
    return str(uuid.uuid4())

def create_email_verify_token() -> str:
    return str(uuid.uuid4())

def get_current_user_id(authorization: Optional[str] = Header(None)) -> str:
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization missing")
    try:
        scheme, token = authorization.split(" ")
        if scheme.lower() != "bearer": raise ValueError()
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access": raise ValueError()
        return payload["sub"]
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

# =====================
# ROUTES – AUTH
# =====================

@api_router.post("/auth/google", response_model=TokenPairResponse)
async def google_login(data: GoogleLoginRequest):
    try:
        idinfo = id_token.verify_oauth2_token(data.credential, google_requests.Request(), GOOGLE_CLIENT_ID)
        email = idinfo['email']
        name = idinfo.get('name', '')

        user = await db.users.find_one({"email": email})
        if not user:
            user_id = str(uuid.uuid4())
            user = {
                "_id": user_id,
                "email": email,
                "name": name,
                "email_verified": True,
                "created_at": datetime.now(timezone.utc),
            }
            await db.users.insert_one(user)
        
        access = create_access_token(user["_id"])
        refresh = create_refresh_token()
        await db.refresh_tokens.insert_one({
            "token": refresh,
            "user_id": user["_id"],
            "expires_at": datetime.utcnow() + timedelta(days=REFRESH_TOKEN_DAYS)
        })
        return {"access_token": access, "refresh_token": refresh}
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Google Auth Error: {str(e)}")

@api_router.post("/auth/register")
async def register(data: RegisterRequest):
    if await db.users.find_one({"email": data.email}):
        raise HTTPException(status_code=400, detail="Email already registered")
    user_id = str(uuid.uuid4())
    user = {"_id": user_id, "email": data.email, "name": data.name, "password": hash_password(data.password), "email_verified": False, "created_at": datetime.now(timezone.utc)}
    await db.users.insert_one(user)
    return {"ok": True}

@api_router.post("/auth/login", response_model=TokenPairResponse)
async def login(data: LoginRequest):
    user = await db.users.find_one({"email": data.email})
    if not user or not verify_password(data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    if not user.get("email_verified"):
        raise HTTPException(status_code=403, detail="Email not verified")

    access = create_access_token(user["_id"])
    refresh = create_refresh_token()
    await db.refresh_tokens.insert_one({"token": refresh, "user_id": user["_id"], "expires_at": datetime.utcnow() + timedelta(days=REFRESH_TOKEN_DAYS)})
    return {"access_token": access, "refresh_token": refresh}

# ✅ HATAYI ÖNLEYEN LOGOUT ROTASI
@api_router.post("/auth/logout")
async def logout(data: Optional[RefreshRequest] = None):
    if data and data.refresh_token:
        await db.refresh_tokens.delete_one({"token": data.refresh_token})
    return {"ok": True}

@api_router.get("/auth/me", response_model=UserMeResponse)
async def me(user_id: str = Depends(get_current_user_id)):
    user = await db.users.find_one({"_id": user_id})
    return {
        "id": user["_id"], "email": user["email"], "name": user.get("name", ""),
        "stats": {"learned_terms": 0, "current_streak": 0, "average_quiz_score": 0}
    }

# =====================
# APP CONFIG
# =====================

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_db_client():
    try:
        await client.admin.command('ping')
        print("✅ MongoDB Bağlantısı Başarılı!")
    except Exception as e:
        print(f"❌ MongoDB Hata: {e}")

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()