# 2. Cấu trúc dự án

## 2.1 Folder Structure

```
server/
├── src/
│   ├── main.js           # Entry point, start server
│   ├── router.js         # Routing system
│   ├── middleware/
│   │   ├── auth.js       # Authentication
│   │   ├── cors.js       # CORS handling
│   │   ├── logger.js     # Request logging
│   │   └── validator.js  # Input validation
│   ├── routes/
│   │   ├── auth.js       # /api/auth/*
│   │   ├── users.js      # /api/users/*
│   │   ├── leads.js      # /api/leads/*
│   │   ├── deals.js      # /api/deals/*
│   │   ├── contacts.js   # /api/contacts/*
│   │   └── activities.js # /api/activities/*
│   ├── services/
│   │   ├── authService.js
│   │   ├── userService.js
│   │   ├── leadService.js
│   │   ├── dealService.js
│   │   ├── contactService.js
│   │   └── activityService.js
│   ├── repositories/
│   │   ├── db.js         # Database connection
│   │   ├── userRepo.js
│   │   ├── leadRepo.js
│   │   ├── dealRepo.js
│   │   ├── contactRepo.js
│   │   └── activityRepo.js
│   ├── utils/
│   │   ├── password.js   # Hashing
│   │   ├── jwt.js        # Token generation
│   │   ├── response.js   # Response helpers
│   │   └── validator.js  # Validation helpers
│   └── db/
│       ├── schema.sql    # Database schema
│       └── seed.sql      # Sample data
├── data/
│   └── crm.db            # SQLite database file
├── package.json
└── .env                  # Environment variables
```

## 2.2 Module responsibilities

### main.js
- Khởi tạo HTTP server
- Bind port
- Start listening

### router.js
- Định nghĩa routes
- Match URL patterns
- Call appropriate handler

### middleware/
- **auth.js**: Verify JWT token
- **cors.js**: Handle Cross-Origin
- **logger.js**: Log requests
- **validator.js**: Validate input

### routes/
- Nhận request
- Gọi service tương ứng
- Trả response

### services/
- Business logic
- Validation business rules
- Gọi repository

### repositories/
- Database operations (CRUD)
- Viết SQL thuần
- Không có ORM

### utils/
- Helper functions
- Password hashing
- JWT utilities

## 2.3 Dependency tối thiểu

```json
{
  "dependencies": {
    "better-sqlite3": "^9.x"
  },
  "devDependencies": {
    "nodemon": "^3.x"
  }
}
```

**Không dùng:**
- Express, Fastify, Koa
- Prisma, TypeORM, Sequelize
- Express-validator, Joi
- Morgan, Helmet

**Tự viết tất cả middleware cần thiết**

## 2.4 Entry Point Flow

```javascript
// main.js
const { createServer } = require('./src/http');
const { initDatabase } = require('./src/repositories/db');
const router = require('./src/router');
const middleware = require('./src/middleware');

const PORT = process.env.PORT || 3000;

async function main() {
  // 1. Initialize database
  await initDatabase();

  // 2. Create HTTP server
  const server = createServer();

  // 3. Apply global middleware
  server.use(middleware.cors);
  server.use(middleware.logger);
  server.use(middleware.bodyParser);

  // 4. Apply routes
  server.use(router);

  // 5. Start listening
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

main();
```
