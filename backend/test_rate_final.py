# backend/test_rate_final.py
import requests
import time

print("🚀 FINAL RATE LIMIT TEST")
print("=" * 60)

success_count = 0
for i in range(1, 7):
    print(f"\n🎯 DENEME {i}/6")
    
    try:
        response = requests.post(
            "http://127.0.0.1:8000/api/auth/login",
            json={"email": "test@example.com", "password": "wrongpassword"},
            timeout=3
        )
        
        status = response.status_code
        print(f"   📡 Status: {status}")
        
        if status == 429:
            print("   ✅ ✅ ✅ MÜKEMMEL! RATE LIMIT ÇALIŞIYOR!")
            success_count += 1
        elif status == 401:
            print("   ⚠️  Yanlış şifre (401 normal)")
        else:
            print(f"   ❓ Beklenmeyen status: {status}")
            
    except requests.exceptions.RequestException as e:
        if hasattr(e, 'response') and e.response:
            status = e.response.status_code
            print(f"   📡 Status: {status}")
            if status == 429:
                print("   ✅ ✅ ✅ MÜKEMMEL! RATE LIMIT ÇALIŞIYOR!")
                success_count += 1
        else:
            print(f"   ❌ Hata: {e}")
    
    time.sleep(1)

print("\n" + "=" * 60)
print(f"📊 SONUÇ: {success_count}/1 başarılı (6. denemede 429 görmeliydin)")
if success_count >= 1:
    print("🎉 TEBRİKLER! RATE LIMITING ÇALIŞIYOR!")
else:
    print("❌ Rate limiting hala çalışmıyor. Backend log'larını kontrol et.")