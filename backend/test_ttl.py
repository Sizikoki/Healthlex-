# backend/test_ttl.py
import asyncio
import motor.motor_asyncio
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv

load_dotenv()

async def test_ttl_index():
    MONGO_URL = os.environ.get("MONGO_URL")
    DB_NAME = os.environ.get("DB_NAME")
    
    client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    
    print("🔍 TTL INDEX TEST")
    print("=" * 50)
    
    # 1. Index'leri listele
    indexes = await db.refresh_tokens.index_information()
    print("📊 Mevcut Index'ler:")
    for name, index in indexes.items():
        print(f"  - {name}: {index}")
    
    # 2. TTL index'i kontrol et
    ttl_index = None
    for name, index in indexes.items():
        if "expires_at" in index.get("key", {}):
            ttl_index = index
            print(f"\n✅ TTL Index bulundu: {name}")
            print(f"   Key: {index.get('key')}")
            print(f"   expireAfterSeconds: {index.get('expireAfterSeconds', 'YOK')}")
            break
    
    if not ttl_index:
        print("\n❌ TTL Index bulunamadı! Oluşturuluyor...")
        await db.refresh_tokens.create_index(
            "expires_at",
            expireAfterSeconds=30 * 24 * 60 * 60  # 30 gün
        )
        print("✅ TTL Index oluşturuldu")
    
    # 3. Test için eski bir token oluştur (5 dakika sonra expire)
    test_user_id = "test-ttl-user"
    await db.refresh_tokens.delete_many({"user_id": test_user_id})
    
    test_token = {
        "token": "test-ttl-token-" + datetime.utcnow().isoformat(),
        "user_id": test_user_id,
        "created_at": datetime.utcnow(),
        "expires_at": datetime.utcnow() + timedelta(minutes=5),  # 5 dakika sonra
        "is_active": True,
        "test": True  # Test dokümanı olduğunu işaretle
    }
    
    await db.refresh_tokens.insert_one(test_token)
    print(f"\n🧪 Test token oluşturuldu: {test_token['token'][:20]}...")
    print(f"   Expires at: {test_token['expires_at']}")
    print(f"   (5 dakika sonra otomatik silinecek)")
    
    # 4. Mevcut token sayısı
    total = await db.refresh_tokens.count_documents({})
    test_count = await db.refresh_tokens.count_documents({"user_id": test_user_id})
    print(f"\n📊 Token istatistikleri:")
    print(f"   Toplam token: {total}")
    print(f"   Test token'ları: {test_count}")
    
    client.close()
    print("\n✅ TTL test tamamlandı. Test token'ı 5 dakika sonra otomatik silinecek.")

if __name__ == "__main__":
    asyncio.run(test_ttl_index())