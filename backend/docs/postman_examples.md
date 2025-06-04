# API 接口测试文档

## 用户注册 POST /api/register

请求地址：`http://127.0.0.1:8080/api/register`

Headers:
```
Content-Type: application/json
```

请求体：
```json
{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "nickname": "测试用户"
}
```

成功响应：
```json
{
    "message": "注册成功"
}
```

错误响应：
```json
{
    "message": "用户名已存在"
}
// 或
{
    "message": "邮箱已被使用"
}
```

## 用户登录 POST /api/login

请求地址：`http://127.0.0.1:8080/api/login`

Headers:
```
Content-Type: application/json
```

请求体：
```json
{
    "username": "testuser",
    "password": "password123"
}
```

成功响应：
```json
{
    "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "user": {
        "id": 1,
        "username": "testuser",
        "email": "test@example.com",
        "nickname": "测试用户"
    }
}
```

错误响应：
```json
{
    "message": "用户名或密码错误"
}
```