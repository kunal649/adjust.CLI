import requests
print("Testing dependency installation!")
print(requests.get('https://httpbin.org/get').status_code)