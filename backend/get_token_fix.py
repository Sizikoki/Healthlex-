# backend/get_token_fix.py
import asyncio
import motor.motor_asyncio
import os
from dotenv import load_dotenv

load_dotenv()

async def check_token_format():
    MONGO_URL = os.environ.get("MONGO_URL")
    DB_NAME = os.environ.get("DB_NAME")
    
    client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    
    # Tüm aktif token'ları getir
    tokens = await db.refresh_tokens.find({"is_active": True}).to_list(10)
    
    print("=" * 60)
    print("🔍 TOKEN FORMAT KONTROLÜ")
    print("=" * 60)
    
    for i, token in enumerate(tokens):
        token_value = token.get('token', '')
        print(f"\nToken {i+1}:")
        print(f"  Değer: {token_value}")
        print(f"  Uzunluk: {len(token_value)}")
        print(f"  Tire var mı: {'-' in token_value}")
        print(f"  User ID: {token.get('user_id')}")
        
        # Bu token'ı iki şekilde ara
        # 1. Olduğu gibi
        found_exact = await db.refresh_tokens.find_one({"token": token_value})
        # 2. Tireleri kaldırarak
        token_no_dash = token_value.replace("-", "")
        found_no_dash = await db.refresh_tokens.find_one({"token": token_no_dash})
        
        print(f"  Exact match: {'EVET' if found_exact else 'HAYIR'}")
        print(f"  No-dash match: {'EVET' if found_no_dash else 'HAYIR'}")
    
    # Özel olarak test ettiğimiz token'ı ara
    test_token = "3868ae95-d8e9-4780-9a79-5e4f8f893b33"
    print(f"\n🔎 TEST TOKEN İÇİN ARA:")
    print(f"  Test token: {test_token}")
    print(f"  Test token (tiresiz): {test_token.replace('-', '')}")
    
    # Tireli arama
    found_with_dash = await db.refresh_tokens.find_one({"token": test_token})
    print(f"  Tireli arama: {'BULUNDU' if found_with_dash else 'BULUNAMADI'}")
    
    # Tiresiz arama  
    found_without_dash = await db.refresh_tokens.find_one({"token": test_token.replace('-', '')})
    print(f"  Tiresiz arama: {'BULUNDU' if found_without_dash else 'BULUNAMADI'}")
    
    # Tüm olası eşleşmeleri kontrol et
    print(f"\n🔎 TÜM OLASI ALANLARDA ARA:")
    all_docs = await db.refresh_tokens.find({}).to_list(100)
    for doc in all_docs:
        for key, value in doc.items():
            if isinstance(value, str) and test_token in value:
                print(f"  {key} alanında bulundu: {value[:50]}...")
            if isinstance(value, str) and test_token.replace('-', '') in value:
                print(f"  {key} alanında (tiresiz) bulundu: {value[:50]}...")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(check_token_format())