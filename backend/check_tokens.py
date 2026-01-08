# backend/check_tokens.py
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

async def check_user_tokens(email: str):
    MONGO_URL = os.environ.get("MONGO_URL")
    DB_NAME = os.environ.get("DB_NAME")
    
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    
    # Kullanıcıyı bul
    user = await db.users.find_one({"email": email})
    if not user:
        print("Kullanıcı bulunamadı")
        return
    
    user_id = user["_id"]
    print(f"Kullanıcı: {email} (ID: {user_id})")
    
    # Aktif refresh token'ları bul
    tokens = await db.refresh_tokens.find({
        "user_id": user_id,
        "is_active": True
    }).to_list(length=10)
    
    print(f"\nAktif Refresh Token'lar ({len(tokens)} adet):")
    print("=" * 60)
    
    for i, token in enumerate(tokens, 1):
        expires_at = token.get("expires_at")
        if expires_at:
            remaining_days = (expires_at - datetime.utcnow()).days
            status = "✅ AKTİF" if remaining_days > 0 else "❌ EXPIRED"
            
            print(f"{i}. Token: {token['token'][:15]}...")
            print(f"   Expires: {expires_at.strftime('%Y-%m-%d %H:%M:%S')}")
            print(f"   Kalan: {remaining_days} gün - {status}")
            print(f"   Device: {token.get('device_info', 'Unknown')}")
            print(f"   Created: {token.get('created_at').strftime('%Y-%m-%d %H:%M:%S')}")
            print()
    
    client.close()

if __name__ == "__main__":
    asyncio.run(check_user_tokens("test@example.com"))