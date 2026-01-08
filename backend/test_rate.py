import requests
import time

print("Rate Limiting Testi Başlıyor...")
print("6 login denemesi yapılacak (5/dakika limiti var)")
print()

for i in range(1, 7):
    try:
        response = requests.post(
            "http://127.0.0.1:8000/api/auth/login",
            json={"email": "test@example.com", "password": "wrongpassword"}
        )
        print(f"Deneme {i}: Status {response.status_code}")
    except requests.exceptions.HTTPError as e:
        if e.response.status_code == 429:
            print(f"Deneme {i}: ✅ Status 429 (RATE LIMIT ÇALIŞIYOR!)")
        else:
            print(f"Deneme {i}: Status {e.response.status_code}")
    
    time.sleep(1)

print("\nTest Tamamlandı!")
print("6. denemede 429 görmelisin.")