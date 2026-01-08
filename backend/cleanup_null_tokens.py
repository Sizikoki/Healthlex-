# backend/cleanup_null_tokens.py
import asyncio
import motor.motor_asyncio
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv

load_dotenv()

async def cleanup_null_tokens():
    MONGO_URL = os.environ.get("MONGO_URL")
    DB_NAME = os.environ.get("DB_NAME")
    
    client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    
    print("🧹 NULL created_at TOKEN TEMİZLİĞİ")
    print("=" * 50)
    
    # 1. created_at = null olan token'ları bul
    null_tokens = await db.refresh_tokens.find({"created_at": None}).to_list(100)
    print(f"📊 created_at = null olan token sayısı: {len(null_tokens)}")
    
    # 2. Bunları düzelt veya sil
    if null_tokens:
        print("\n🔧 Düzeltilecek token'lar:")
        for i, token in enumerate(null_tokens):
            print(f"  {i+1}. Token: {token.get('token', '')[:10]}..., User: {token.get('user_id')}")
            
            # Eğer expires_at varsa, ondan created_at hesapla
            expires_at = token.get('expires_at')
            if isinstance(expires_at, datetime):
                # Refresh token 7 gün geçerli, created_at = expires_at - 7 days
                new_created_at = expires_at - timedelta(days=7)
                await db.refresh_tokens.update_one(
                    {"_id": token["_id"]},
                    {"$set": {"created_at": new_created_at}}
                )
                print(f"     → created_at güncellendi: {new_created_at}")
            else:
                # Hem created_at hem expires_at yoksa, sil
                await db.refresh_tokens.delete_one({"_id": token["_id"]})
                print(f"     → Silindi (geçersiz format)")
    
    # 3. expires_at = null olan token'ları bul
    null_expires = await db.refresh_tokens.find({"expires_at": None}).to_list(100)
    print(f"\n📊 expires_at = null olan token sayısı: {len(null_expires)}")
    
    if null_expires:
        print("\n🔧 Düzeltilecek token'lar (expires_at):")
        for i, token in enumerate(null_expires):
            print(f"  {i+1}. Token: {token.get('token', '')[:10]}..., User: {token.get('user_id')}")
            
            created_at = token.get('created_at')
            if isinstance(created_at, datetime):
                # created_at varsa, expires_at = created_at + 7 days
                new_expires_at = created_at + timedelta(days=7)
                await db.refresh_tokens.update_one(
                    {"_id": token["_id"]},
                    {"$set": {"expires_at": new_expires_at}}
                )
                print(f"     → expires_at güncellendi: {new_expires_at}")
            else:
                # Hiçbiri yoksa sil
                await db.refresh_tokens.delete_one({"_id": token["_id"]})
                print(f"     → Silindi (geçersiz format)")
    
    # 4. Son durum
    total_after = await db.refresh_tokens.count_documents({})
    null_created_after = await db.refresh_tokens.count_documents({"created_at": None})
    null_expires_after = await db.refresh_tokens.count_documents({"expires_at": None})
    
    print(f"\n✅ TEMİZLİK TAMAMLANDI:")
    print(f"   Toplam token: {total_after}")
    print(f"   created_at = null: {null_created_after}")
    print(f"   expires_at = null: {null_expires_after}")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(cleanup_null_tokens())