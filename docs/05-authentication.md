# 5. Authentication

## 5.1 JWT (JSON Web Tokens)

### Token Structure

**Header:**
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

**Payload:**
```json
{
  "sub": "1",
  "email": "user@crm.com",
  "role": "user",
  "iat": 1704067200,
  "exp": 1704153600
}
```

**Signature:**
```
HMACSHA256(
  base64UrlEncode(header) + "." + base64UrlEncode(payload),
  SECRET_KEY
)
```

### Token Expiration
- Access token: 24 hours
- Không có refresh token (simplicity)

## 5.2 Implementation

### Token Generation

```javascript
// src/utils/jwt.js
const crypto = require('crypto');

const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const EXPIRES_IN = 24 * 60 * 60 * 1000; // 24 hours

function signToken(payload) {
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  };

  const now = Date.now();
  const tokenPayload = {
    ...payload,
    iat: now,
    exp: now + EXPIRES_IN
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(tokenPayload));

  const signature = crypto
    .createHmac('sha256', SECRET_KEY)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest('base64url');

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

function verifyToken(token) {
  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new Error('Invalid token format');
  }

  const [encodedHeader, encodedPayload, signature] = parts;

  // Verify signature
  const expectedSignature = crypto
    .createHmac('sha256', SECRET_KEY)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest('base64url');

  if (signature !== expectedSignature) {
    throw new Error('Invalid signature');
  }

  // Decode payload
  const payload = JSON.parse(base64UrlDecode(encodedPayload));

  // Check expiration
  if (payload.exp < Date.now()) {
    throw new Error('Token expired');
  }

  return payload;
}

function base64UrlEncode(str) {
  return Buffer.from(str)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

function base64UrlDecode(str) {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) {
    str += '=';
  }
  return Buffer.from(str, 'base64').toString();
}

module.exports = { signToken, verifyToken };
```

## 5.3 Password Hashing

### Sử dụng bcrypt đơn giản

```javascript
// src/utils/password.js
const crypto = require('crypto');

const SALT_ROUNDS = 10;

function hashPassword(password) {
  // Tạo salt ngẫu nhiên
  const salt = crypto.randomBytes(16).toString('hex');

  // Hash với PBKDF2 (có sẵn trong Node.js)
  const hash = crypto
    .pbkdf2Sync(password, salt, SALT_ROUNDS * 1000, 64, 'sha512')
    .toString('hex');

  return `${salt}:${hash}`;
}

function verifyPassword(password, storedHash) {
  const [salt, hash] = storedHash.split(':');

  const verifyHash = crypto
    .pbkdf2Sync(password, salt, SALT_ROUNDS * 1000, 64, 'sha512')
    .toString('hex');

  return hash === verifyHash;
}

module.exports = { hashPassword, verifyPassword };
```

### Tại sao không dùng bcrypt npm package?
- `bcrypt` requires native compilation
- `crypto` built-in module đã đủ mạnh
- Hiểu rõ cách hashing hoạt động

## 5.4 Auth Middleware

```javascript
// src/middleware/auth.js
const { verifyToken } = require('../utils/jwt');
const { getDb } = require('../repositories/db');

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Authentication required'
      }
    });
  }

  const token = authHeader.substring(7);

  try {
    const payload = verifyToken(token);
    const db = getDb();

    const user = db.prepare('SELECT id, email, name, role FROM users WHERE id = ?').get(payload.sub);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'User not found'
        }
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: error.message
      }
    });
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required'
        }
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Insufficient permissions'
        }
      });
    }

    next();
  };
}

module.exports = { authenticate, requireRole };
```

## 5.5 Auth Service

```javascript
// src/services/authService.js
const { getDb } = require('../repositories/db');
const { hashPassword, verifyPassword } = require('../utils/password');
const { signToken } = require('../utils/jwt');

class AuthService {
  register(email, password, name) {
    const db = getDb();

    // Check if email exists
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existing) {
      throw { status: 409, code: 'EMAIL_EXISTS', message: 'Email already registered' };
    }

    // Hash password
    const hashedPassword = hashPassword(password);

    // Insert user
    const result = db.prepare(`
      INSERT INTO users (email, password, name)
      VALUES (?, ?, ?)
    `).run(email, hashedPassword, name);

    const user = db.prepare('SELECT id, email, name, role FROM users WHERE id = ?').get(result.lastInsertRowid);

    return user;
  }

  login(email, password) {
    const db = getDb();

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user) {
      throw { status: 401, code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' };
    }

    if (!verifyPassword(password, user.password)) {
      throw { status: 401, code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' };
    }

    const token = signToken({
      sub: user.id,
      email: user.email,
      role: user.role
    });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    };
  }

  getProfile(userId) {
    const db = getDb();

    const user = db.prepare('SELECT id, email, name, role, created_at FROM users WHERE id = ?').get(userId);
    if (!user) {
      throw { status: 404, code: 'USER_NOT_FOUND', message: 'User not found' };
    }

    return user;
  }
}

module.exports = new AuthService();
```

## 5.6 Protected Routes Example

```javascript
// src/routes/auth.js
const router = require('../router');
const authService = require('../services/authService');
const { authenticate } = require('../middleware/auth');
const { validate, registerSchema, loginSchema } = require('../middleware/validator');

// POST /api/auth/register
router.post('/api/auth/register', validate(registerSchema), (req, res) => {
  try {
    const { email, password, name } = req.body;
    const user = authService.register(email, password, name);

    res.status(201).json({
      success: true,
      data: user
    });
  } catch (error) {
    handleError(res, error);
  }
});

// POST /api/auth/login
router.post('/api/auth/login', validate(loginSchema), (req, res) => {
  try {
    const { email, password } = req.body;
    const result = authService.login(email, password);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    handleError(res, error);
  }
});

// GET /api/auth/me
router.get('/api/auth/me', authenticate, (req, res) => {
  try {
    const user = authService.getProfile(req.user.id);

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    handleError(res, error);
  }
});
```
