# 1. Tổng quan kiến trúc

## 1.1 Monolithic Architecture

Backend CRM sử dụng kiến trúc monolithic đơn giản:
- **Single Process**: Tất cả chạy trong 1 process
- **Synchronous**: Không async/await phức tạp, dễ debug
- **Embedded DB**: SQLite với better-sqlite3

```
┌─────────────────────────────────────────────┐
│                  Server                      │
│  ┌─────────────────────────────────────────┐│
│  │           HTTP Server (Node.js)          ││
│  │  ┌─────────────────────────────────────┐││
│  │  │         Router + Middleware          │││
│  │  │  ┌─────────────────────────────────┐ │││
│  │  │  │       Request Handlers          │ │││
│  │  │  │  ┌─────────────────────────────┐ │ │││
│  │  │  │  │      Business Logic        │ │ │││
│  │  │  │  │  ┌─────────────────────────┐│ │ │││
│  │  │  │  │  │      Database Layer     ││ │ │││
│  │  │  │  │  │      (SQLite)           ││ │ │││
│  │  │  │  │  └─────────────────────────┘│ │ │││
│  │  │  │  └─────────────────────────────┘ │ │││
│  │  │  └─────────────────────────────────┘ │││
│  │  └─────────────────────────────────────┘││
│  └─────────────────────────────────────────┘│
└─────────────────────────────────────────────┘
```

## 1.2 Request/Response Flow

```
Client Request
      │
      ▼
┌─────────────┐
│ Middleware  │ ──── Authentication
│             │ ──── CORS
│             │ ──── Body Parser
│             │ ──── Logging
└─────────────┘
      │
      ▼
┌─────────────┐
│   Router    │ ──── Match URL + Method
└─────────────┘
      │
      ▼
┌─────────────┐
│  Handler    │ ──── Call Service Layer
└─────────────┘
      │
      ▼
┌─────────────┐
│  Service    │ ──── Business Logic
└─────────────┘
      │
      ▼
┌─────────────┐
│ Repository  │ ──── Database Operations
└─────────────┘
      │
      ▼
   Response
```

## 1.3 Không dùng Framework

**Lý do:**
1. Hiểu rõ cách HTTP server hoạt động
2. Kiểm soát hoàn toàn flow
3. Không có magic, dễ debug
4. Bundle size nhỏ

**Tự viết:**
- Router (URL matching)
- Middleware system
- Body parser
- Error handling
- Validation

**Tham khảo cách Express hoạt động bên trong**
