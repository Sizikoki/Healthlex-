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

ACCESS_TOKEN_MINUTES = 15
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


class TokenPairResponse(BaseModel):
    access_token: str
    refresh_token: str


class RefreshRequest(BaseModel):
    refresh_token: str


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
        if scheme.lower() != "bearer":
            raise ValueError()
    except ValueError:
        raise HTTPException(status_code=401, detail="Invalid auth header")

    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid token type")
        return payload["sub"]
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Access token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

# =====================
# STATS HELPERS
# =====================

async def get_learned_terms(user_id: str) -> int:
    return await db.flashcard_progress.count_documents({
        "user_id": user_id,
        "learned": True
    })


async def get_average_quiz_score(user_id: str) -> int:
    cursor = db.quiz_results.find({"user_id": user_id})
    scores = [doc["score"] async for doc in cursor]
    if not scores:
        return 0
    return int(sum(scores) / len(scores))


async def get_current_streak(user_id: str) -> int:
    today = date.today()
    streak = 0
    while True:
        day = today - timedelta(days=streak)
        exists = await db.daily_activity.find_one({
            "user_id": user_id,
            "date": day.isoformat()
        })
        if not exists:
            break
        streak += 1
    return streak

# =====================
# ROUTES – AUTH
# =====================

@api_router.post("/auth/register")
async def register(data: RegisterRequest):
    if await db.users.find_one({"email": data.email}):
        raise HTTPException(status_code=400, detail="Email already registered")

    user_id = str(uuid.uuid4())
    verify_token = create_email_verify_token()

    user = {
        "_id": user_id,
        "email": data.email,
        "name": data.name,
        "password": hash_password(data.password),
        "email_verified": False,
        "email_verify_token": verify_token,
        "email_verify_exp": datetime.utcnow() + timedelta(minutes=EMAIL_VERIFY_MINUTES),
        "created_at": datetime.now(timezone.utc),
    }

    await db.users.insert_one(user)

    # 🔔 BURADA EMAIL GÖNDERİLECEK (şimdilik log)
    logging.info(f"[VERIFY EMAIL] token={verify_token}")

    return {"ok": True}


@api_router.post("/auth/verify-email")
async def verify_email(data: VerifyEmailRequest):
    user = await db.users.find_one({
        "email_verify_token": data.token,
        "email_verify_exp": {"$gt": datetime.utcnow()}
    })

    if not user:
        raise HTTPException(status_code=400, detail="Invalid or expired token")

    await db.users.update_one(
        {"_id": user["_id"]},
        {"$set": {"email_verified": True},
         "$unset": {"email_verify_token": "", "email_verify_exp": ""}}
    )

    return {"ok": True}


@api_router.post("/auth/resend-verification")
async def resend_verification(data: ResendVerifyRequest):
    user = await db.users.find_one({"email": data.email})
    if not user or user.get("email_verified"):
        return {"ok": True}

    verify_token = create_email_verify_token()

    await db.users.update_one(
        {"_id": user["_id"]},
        {"$set": {
            "email_verify_token": verify_token,
            "email_verify_exp": datetime.utcnow() + timedelta(minutes=EMAIL_VERIFY_MINUTES)
        }}
    )

    logging.info(f"[VERIFY EMAIL RESEND] token={verify_token}")
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

    await db.refresh_tokens.insert_one({
        "token": refresh,
        "user_id": user["_id"],
        "expires_at": datetime.utcnow() + timedelta(days=REFRESH_TOKEN_DAYS)
    })

    return {"access_token": access, "refresh_token": refresh}


@api_router.post("/auth/refresh", response_model=TokenPairResponse)
async def refresh(data: RefreshRequest):
    record = await db.refresh_tokens.find_one({"token": data.refresh_token})
    if not record or record["expires_at"] < datetime.utcnow():
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    user_id = record["user_id"]
    await db.refresh_tokens.delete_one({"token": data.refresh_token})

    new_refresh = create_refresh_token()
    await db.refresh_tokens.insert_one({
        "token": new_refresh,
        "user_id": user_id,
        "expires_at": datetime.utcnow() + timedelta(days=REFRESH_TOKEN_DAYS)
    })

    return {
        "access_token": create_access_token(user_id),
        "refresh_token": new_refresh
    }


@api_router.post("/auth/logout")
async def logout(data: RefreshRequest):
    await db.refresh_tokens.delete_one({"token": data.refresh_token})
    return {"ok": True}


@api_router.get("/auth/me", response_model=UserMeResponse)
async def me(user_id: str = Depends(get_current_user_id)):
    user = await db.users.find_one({"_id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "id": user["_id"],
        "email": user["email"],
        "name": user.get("name", ""),
        "stats": {
            "learned_terms": await get_learned_terms(user_id),
            "current_streak": await get_current_streak(user_id),
            "average_quiz_score": await get_average_quiz_score(user_id)
        }
    }

# =====================
# APP CONFIG
# =====================

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
