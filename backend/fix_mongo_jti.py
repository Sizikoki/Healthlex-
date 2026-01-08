# backend/fix_mongo_jti.py
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import uuid
import os
from dotenv import load_dotenv

load_dotenv()

async def fix_jti_fields():
    MONGO_URL = os.environ.get("MONGO_URL")
    DB_NAME = os.environ.get("DB_NAME")
    
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    
    print("🔧 MongoDB JTI fix işlemi başlıyor...")
    
    # 1. refresh_tokens koleksiyonunu kontrol et
    collections = await db.list_collection_names()
    if "refresh_tokens" not in collections:
        print("❌ refresh_tokens koleksiyonu yok!")
        client.close()
        return
    
    refresh_tokens = db.refresh_tokens
    
    # 2. jti'si olmayan dokümanları say
    count_no_jti = await refresh_tokens.count_documents({"jti": {"$exists": False}})
    print(f"📊 JTI'si olmayan doküman sayısı: {count_no_jti}")
    
    if count_no_jti > 0:
        # 3. jti'si olmayan tüm dokümanlara jti ata
        cursor = refresh_tokens.find({"jti": {"$exists": False}})
        
        updated_count = 0
        async for doc in cursor:
            new_jti = str(uuid.uuid4())
            await refresh_tokens.update_one(
                {"_id": doc["_id"]},
                {"$set": {"jti": new_jti}}
            )
            updated_count += 1
            
            if updated_count % 100 == 0:
                print(f"  ↳ {updated_count}/{count_no_jti} güncellendi...")
        
        print(f"✅ {updated_count} dokümana jti atandı")
    else:
        print("✅ Tüm dokümanların jti'si var")
    
    # 4. Eski jti index'ini silmeyi dene
    try:
        indexes = await refresh_tokens.index_information()
        if "jti_1" in indexes:
            await refresh_tokens.drop_index("jti_1")
            print("✅ Eski jti index'i silindi")
        else:
            print("ℹ️ Eski jti index'i zaten yok")
    except Exception as e:
        print(f"⚠️ Index silme hatası: {e}")
    
    # 5. Yeni sparse unique index oluştur
    try:
        await refresh_tokens.create_index("jti", unique=True, sparse=True)
        print("✅ Yeni jti index'i oluşturuldu (sparse)")
    except Exception as e:
        print(f"⚠️ Yeni index oluşturma hatası: {e}")
    
    # 6. TTL index'i kontrol et
    try:
        await refresh_tokens.create_index(
            "expires_at",
            expireAfterSeconds=30 * 24 * 60 * 60,
            name="expires_at_ttl"
        )
        print("✅ TTL index kontrol edildi/oluşturuldu")
    except Exception as e:
        print(f"ℹ️ TTL index hatası (zaten var olabilir): {e}")
    
    client.close()
    print("🎉 JTI fix işlemi tamamlandı!")

if __name__ == "__main__":
    asyncio.run(fix_jti_fields())