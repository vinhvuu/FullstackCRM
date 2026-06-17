# VanhCorp CRM - Backend Technical Documentation

## Mục lục

1. [Tổng quan kiến trúc](./01-architecture.md)
2. [Cấu trúc dự án](./02-project-structure.md)
3. [Database Schema](./03-database-schema.md)
4. [API Endpoints](./04-api-endpoints.md)
5. [Authentication](./05-authentication.md)
6. [Business Logic](./06-business-logic.md)
7. [Security](./07-security.md)
8. [Error Handling](./08-error-handling.md)
9. [Deployment](./09-deployment.md)
10. [Hướng dẫn triển khai](./10-implementation.md)

## Yêu cầu

- Node.js >= 18.x
- SQLite (embedded database, không cần cài đặt server riêng)
- Không dùng ORM, viết SQL thuần để hiểu rõ cách hoạt động

## Bắt đầu

```bash
cd server
npm init -y
npm install better-sqlite3
npm install -D nodemon
```

## Chạy development

```bash
npm run dev
```

## Chạy production

```bash
npm start
```

## Mục tiêu

- Code thuần Node.js, không dùng Express/Fastify
- Tự viết router, middleware, validation
- Hiểu rõ cách HTTP works
- Chuẩn bị cho production deployment
