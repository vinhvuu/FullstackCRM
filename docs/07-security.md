# 7. Security

## 7.1 Input Sanitization

### SQL Injection Prevention

**KHÔNG BAO GIỜ làm thế này:**
```javascript
// ❌ NGUY HIỂM - SQL Injection
const query = `SELECT * FROM users WHERE email = '${email}'`;
db.prepare(query).all();
```

**LUÔN LUÔN làm thế này:**
```javascript
// ✅ AN TOÀN - Parameterized queries
const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
```

### XSS Prevention

```javascript
// src/utils/sanitize.js

function escapeHtml(str) {
  if (!str) return str;

  const escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;'
  };

  return str.replace(/[&<>"'`]/g, char => escapeMap[char]);
}

function sanitizeInput(data) {
  if (typeof data === 'string') {
    return escapeHtml(data.trim());
  }

  if (typeof data === 'object' && data !== null) {
    const sanitized = {};
    for (const [key, value] of Object.entries(data)) {
      sanitized[key] = sanitizeInput(value);
    }
    return sanitized;
  }

  return data;
}
```

## 7.2 Rate Limiting

```javascript
// src/middleware/rateLimit.js

const requestCounts = new Map();
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = 100;

function rateLimit(req, res, next) {
  const ip = req.ip || req.connection.remoteAddress;
  const now = Date.now();

  // Get or create entry
  let entry = requestCounts.get(ip);

  if (!entry || now - entry.start > WINDOW_MS) {
    entry = { start: now, count: 1 };
    requestCounts.set(ip, entry);
    return next();
  }

  entry.count++;

  if (entry.count > MAX_REQUESTS) {
    return res.status(429).json({
      success: false,
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many requests, please try again later'
      }
    });
  }

  next();
}

// Cleanup old entries every 15 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of requestCounts) {
    if (now - entry.start > WINDOW_MS) {
      requestCounts.delete(ip);
    }
  }
}, WINDOW_MS);
```

## 7.3 CORS Configuration

```javascript
// src/middleware/cors.js

const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:3000', 'http://localhost:3001'];

function cors(req, res, next) {
  const origin = req.headers.origin;

  // Check if origin is allowed
  if (ALLOWED_ORIGINS.includes(origin) || ALLOWED_ORIGINS.includes('*')) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours
  }

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.writeHead(204);
    return res.end();
  }

  next();
}
```

## 7.4 Security Headers

```javascript
// src/middleware/security.js

function securityHeaders(req, res, next) {
  // Prevent XSS
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');

  // Referrer policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Content Security Policy (for APIs, strict)
  res.setHeader('Content-Security-Policy', "default-src 'none'");

  next();
}
```

## 7.5 JWT Security

```javascript
// src/utils/jwt.js - Enhanced

const SECRET_KEY = process.env.JWT_SECRET;
if (!SECRET_KEY) {
  console.warn('WARNING: JWT_SECRET not set, using insecure default');
}

// Token blacklist for logout
const tokenBlacklist = new Set();

function invalidateToken(token) {
  tokenBlacklist.add(token);
}

function isTokenBlacklisted(token) {
  return tokenBlacklist.has(token);
}

function verifyToken(token) {
  // Check blacklist
  if (isTokenBlacklisted(token)) {
    throw new Error('Token has been revoked');
  }

  // ... rest of verification
}
```

## 7.6 Password Security

```javascript
// src/utils/password.js - Enhanced

const crypto = require('crypto');

const SALT_LENGTH = 32;
const KEY_LENGTH = 64;
const ITERATIONS = 100000;

function hashPassword(password) {
  const salt = crypto.randomBytes(SALT_LENGTH).toString('hex');
  const hash = crypto
    .pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, 'sha512')
    .toString('hex');

  return `${salt}:${hash}`;
}

function verifyPassword(password, storedHash) {
  const [salt, hash] = storedHash.split(':');

  const verifyHash = crypto
    .pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, 'sha512')
    .toString('hex');

  // Use timing-safe comparison
  return crypto.timingSafeEqual(
    Buffer.from(hash),
    Buffer.from(verifyHash)
  );
}

// Password strength checker
function checkPasswordStrength(password) {
  const checks = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  };

  const score = Object.values(checks).filter(Boolean).length;

  if (score < 3) return { strength: 'weak', score };
  if (score < 5) return { strength: 'medium', score };
  return { strength: 'strong', score };
}
```

## 7.7 Request Validation

```javascript
// src/middleware/validator.js

function validate(schema) {
  return (req, res, next) => {
    const errors = [];
    const { body, query, params } = req;

    for (const [field, rules] of Object.entries(schema)) {
      const value = body[field] ?? query[field] ?? params[field];

      // Required check
      if (rules.required && (value === undefined || value === null || value === '')) {
        errors.push({
          field,
          message: `${field} is required`
        });
        continue;
      }

      // Skip further validation if not required and not provided
      if (value === undefined || value === null) continue;

      // Type check
      if (rules.type) {
        const actualType = Array.isArray(value) ? 'array' : typeof value;
        if (actualType !== rules.type) {
          errors.push({
            field,
            message: `${field} must be of type ${rules.type}`
          });
          continue;
        }
      }

      // String validations
      if (typeof value === 'string') {
        if (rules.minLength && value.length < rules.minLength) {
          errors.push({
            field,
            message: `${field} must be at least ${rules.minLength} characters`
          });
        }

        if (rules.maxLength && value.length > rules.maxLength) {
          errors.push({
            field,
            message: `${field} must be at most ${rules.maxLength} characters`
          });
        }

        if (rules.pattern && !rules.pattern.test(value)) {
          errors.push({
            field,
            message: rules.message || `${field} is invalid`
          });
        }
      }

      // Number validations
      if (typeof value === 'number') {
        if (rules.min !== undefined && value < rules.min) {
          errors.push({
            field,
            message: `${field} must be at least ${rules.min}`
          });
        }

        if (rules.max !== undefined && value > rules.max) {
          errors.push({
            field,
            message: `${field} must be at most ${rules.max}`
          });
        }
      }

      // Enum validation
      if (rules.enum && !rules.enum.includes(value)) {
        errors.push({
          field,
          message: `${field} must be one of: ${rules.enum.join(', ')}`
        });
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input data',
          details: errors
        }
      });
    }

    next();
  };
}

// Validation schemas
const schemas = {
  register: {
    email: { required: true, type: 'string', pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' },
    password: { required: true, type: 'string', minLength: 8 },
    name: { required: true, type: 'string', minLength: 2, maxLength: 100 }
  },

  login: {
    email: { required: true, type: 'string' },
    password: { required: true, type: 'string' }
  },

  createLead: {
    name: { required: true, type: 'string', minLength: 2, maxLength: 200 },
    company: { type: 'string', maxLength: 200 },
    email: { type: 'string', pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' },
    phone: { type: 'string', maxLength: 50 },
    source: { type: 'string', enum: ['referral', 'website', 'linkedin', 'cold_call', 'conference', 'other'] }
  },

  createDeal: {
    title: { required: true, type: 'string', minLength: 2, maxLength: 200 },
    value: { type: 'number', min: 0 },
    stage: { type: 'string', enum: ['lead', 'qualified', 'proposal', 'negotiation'] },
    probability: { type: 'number', min: 0, max: 100 },
    lead_id: { type: 'number' }
  }
};

module.exports = { validate, schemas };
```

## 7.8 File Upload Security

```javascript
// src/middleware/upload.js

const fs = require('fs');
const path = require('path');

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

function uploadMiddleware(fieldName, uploadDir) {
  return (req, res, next) => {
    const file = req.files?.[fieldName];

    if (!file) return next();

    // Check file size
    if (file.size > MAX_SIZE) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'FILE_TOO_LARGE',
          message: `File size must be less than ${MAX_SIZE / 1024 / 1024}MB`
        }
      });
    }

    // Check file type
    if (!ALLOWED_TYPES.includes(file.mimetype)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_FILE_TYPE',
          message: 'Only JPEG, PNG, GIF, and PDF files are allowed'
        }
      });
    }

    // Generate safe filename
    const ext = path.extname(file.name);
    const safeName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}${ext}`;
    const filePath = path.join(uploadDir, safeName);

    // Ensure upload directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Move file
    fs.renameSync(file.tempFilePath, filePath);

    // Return file info
    req.uploadedFiles = req.uploadedFiles || {};
    req.uploadedFiles[fieldName] = {
      path: filePath,
      name: safeName,
      originalName: file.name,
      size: file.size,
      mimetype: file.mimetype
    };

    next();
  };
}
```

## 7.9 Security Checklist

- [x] Parameterized SQL queries
- [x] Input sanitization
- [x] Rate limiting
- [x] CORS configuration
- [x] Security headers
- [x] Password hashing (PBKDF2)
- [x] JWT with expiration
- [x] Input validation middleware
- [x] File upload validation
- [x] Error messages don't leak sensitive info
