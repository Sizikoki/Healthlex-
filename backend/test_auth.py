import requests
import json

BASE_URL = "http://127.0.0.1:8000"

print("🔐 AUTH TEST BAŞLIYOR...")
print("=" * 50)

# 1. Önce kayıt ol
print("\n1️⃣ KAYIT OLUYOR...")
register_data = {
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
}

try:
    register_response = requests.post(
        f"{BASE_URL}/api/auth/register", 
        json=register_data,
        timeout=10
    )
    print(f"Status: {register_response.status_code}")
    print(f"Response: {register_response.text}")
except Exception as e:
    print(f"Hata: {e}")
    register_response = None

# 2. Login ol
print("\n" + "=" * 50)
print("2️⃣ LOGIN OLUYOR...")

login_data = {
    "email": "test@example.com",
    "password": "password123"
}

try:
    login_response = requests.post(
        f"{BASE_URL}/api/auth/login", 
        json=login_data,
        timeout=10
    )
    print(f"Status: {login_response.status_code}")
    
    if login_response.status_code == 200:
        tokens = login_response.json()
        access_token = tokens.get("access_token", "")
        refresh_token = tokens.get("refresh_token", "")
        
        print(f"✓ Login başarılı!")
        print(f"Access Token: {access_token[:30]}...")
        print(f"Refresh Token: {refresh_token}")
        
        # 3. Refresh test
        print("\n" + "=" * 50)
        print("3️⃣ REFRESH TEST EDİLİYOR...")
        
        headers = {
            "Authorization": f"Bearer {refresh_token}",
            "Content-Type": "application/json"
        }
        
        refresh_response = requests.post(
            f"{BASE_URL}/api/auth/refresh", 
            headers=headers,
            timeout=10
        )
        
        print(f"Refresh Status: {refresh_response.status_code}")
        print(f"Refresh Response: {refresh_response.text}")
        
        if refresh_response.status_code == 200:
            new_tokens = refresh_response.json()
            print(f"\n✓ REFRESH BAŞARILI!")
            print(f"Yeni Access Token: {new_tokens.get('access_token', '')[:30]}...")
            print(f"Yeni Refresh Token: {new_tokens.get('refresh_token', '')}")
        else:
            print(f"\n✗ REFRESH BAŞARISIZ!")
            
    else:
        print(f"✗ Login başarısız: {login_response.text}")
        
except Exception as e:
    print(f"Hata: {e}")

print("\n" + "=" * 50)
print("TEST TAMAMLANDI 🎉")