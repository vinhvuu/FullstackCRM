# 8. Error Handling

## 8.1 Error Types

```javascript
// src/utils/errors.js

class AppError extends Error {
  constructor(status, code, message, details = null) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends AppError {
  constructor(details) {
    super(400, 'VALIDATION_ERROR', 'Invalid input data', details);
  }
}

class AuthenticationError extends AppError {
  constructor(message = 'Authentication required') {
    super(401, 'UNAUTHORIZED', message);
  }
}

class AuthorizationError extends AppError {
  constructor(message = 'Insufficient permissions') {
    super(403, 'FORBIDDEN', message);
  }
}

class NotFoundError extends AppError {
  constructor(resource = 'Resource') {
    super(404, 'NOT_FOUND', `${resource} not found`);
  }
}

class ConflictError extends AppError {
  constructor(message = 'Resource already exists') {
    super(409, 'CONFLICT', message);
  }
}

class DatabaseError extends AppError {
  constructor(message = 'Database operation failed') {
    super(500, 'DATABASE_ERROR', message);
  }
}
```

## 8.2 Error Handler Middleware

```javascript
// src/middleware/errorHandler.js

function errorHandler(err, req, res, next) {
  // Log error
  console.error(`[${new Date().toISOString()}] Error:`, {
    message: err.message,
    code: err.code,
    stack: err.stack,
    path: req.path,
    method: req.method
  });

  // Handle known operational errors
  if (err.isOperational) {
    return res.status(err.status).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
        ...(err.details && { details: err.details })
      }
    });
  }

  // Handle SQLite errors
  if (err.code === 'SQLITE_CONSTRAINT') {
    if (err.message.includes('UNIQUE')) {
      return res.status(409).json({
        success: false,
        error: {
          code: 'CONFLICT',
          message: 'A record with this value already exists'
        }
      });
    }

    if (err.message.includes('FOREIGN KEY')) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_REFERENCE',
          message: 'Referenced record does not exist'
        }
      });
    }
  }

  // Handle JSON parse errors
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'INVALID_JSON',
        message: 'Invalid JSON in request body'
      }
    });
  }

  // Handle unknown errors
  return res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred'
    }
  });
}
```

## 8.3 Async Handler

```javascript
// src/utils/asyncHandler.js

function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

// Usage
// router.get('/api/users', asyncHandler(async (req, res) => {
//   const users = await userService.getAllUsers();
//   res.json({ success: true, data: users });
// }));
```

## 8.4 Not Found Handler

```javascript
// src/middleware/notFound.js

function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.method} ${req.path} not found`
    }
  });
}
```

## 8.5 Error Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... }
}
```

### Success with Pagination
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      { "field": "email", "message": "Email is required" },
      { "field": "password", "message": "Password must be at least 8 characters" }
    ]
  }
}
```

## 8.6 Custom Error Classes for Services

```javascript
// src/services/errors.js

class LeadNotFoundError extends NotFoundError {
  constructor(id) {
    super(`Lead with id ${id}`);
    this.leadId = id;
  }
}

class DealNotFoundError extends NotFoundError {
  constructor(id) {
    super(`Deal with id ${id}`);
    this.dealId = id;
  }
}

class InvalidStageTransitionError extends AppError {
  constructor(currentStage, targetStage) {
    super(
      400,
      'INVALID_STAGE_TRANSITION',
      `Cannot transition from '${currentStage}' to '${targetStage}'`,
      { currentStage, targetStage }
    );
  }
}

class EmailAlreadyExistsError extends ConflictError {
  constructor(email) {
    super(`Email '${email}' is already registered`);
    this.email = email;
  }
}
```

## 8.7 Service Layer Error Handling

```javascript
// src/services/leadService.js

const { getDb } = require('../repositories/db');
const { ValidationError, NotFoundError } = require('../utils/errors');

function getLeadById(id, userId) {
  const db = getDb();

  const lead = db.prepare(`
    SELECT leads.*, users.name as owner_name
    FROM leads
    JOIN users ON leads.owner_id = users.id
    WHERE leads.id = ? AND leads.owner_id = ?
  `).get(id, userId);

  if (!lead) {
    throw new NotFoundError('Lead');
  }

  return lead;
}

function createLead(data, userId) {
  const errors = [];

  if (!data.name || data.name.trim().length < 2) {
    errors.push({ field: 'name', message: 'Name must be at least 2 characters' });
  }

  if (data.email && !isValidEmail(data.email)) {
    errors.push({ field: 'email', message: 'Invalid email format' });
  }

  if (data.source && !['referral', 'website', 'linkedin', 'cold_call', 'conference', 'other'].includes(data.source)) {
    errors.push({ field: 'source', message: 'Invalid source' });
  }

  if (errors.length > 0) {
    throw new ValidationError(errors);
  }

  const db = getDb();

  const result = db.prepare(`
    INSERT INTO leads (owner_id, name, company, email, phone, source, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    userId,
    data.name.trim(),
    data.company || null,
    data.email || null,
    data.phone || null,
    data.source || 'other',
    data.notes || null
  );

  return getLeadById(result.lastInsertRowid, userId);
}
```

## 8.8 Logging Errors

```javascript
// src/utils/logger.js

const fs = require('fs');
const path = require('path');

const LOG_DIR = path.join(__dirname, '../../logs');
const ERROR_LOG = path.join(LOG_DIR, 'error.log');
const ACCESS_LOG = path.join(LOG_DIR, 'access.log');

// Ensure log directory exists
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

function formatLog(level, message, data = {}) {
  return JSON.stringify({
    timestamp: new Date().toISOString(),
    level,
    message,
    ...data
  }) + '\n';
}

function logError(message, error = {}) {
  const log = formatLog('error', message, {
    stack: error.stack,
    code: error.code,
    status: error.status
  });

  fs.appendFileSync(ERROR_LOG, log);
  console.error(log);
}

function logAccess(req, statusCode, duration) {
  const log = formatLog('info', 'Request completed', {
    method: req.method,
    path: req.path,
    status: statusCode,
    duration: `${duration}ms`,
    ip: req.ip
  });

  fs.appendFileSync(ACCESS_LOG, log);
}
```

## 8.9 Global Error Handler Setup

```javascript
// src/main.js

const http = require('http');
const { parse } = require('url');
const querystring = require('querystring');

// Middleware imports
const cors = require('./middleware/cors');
const logger = require('./middleware/logger');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const rateLimit = require('./middleware/rateLimit');
const bodyParser = require('./middleware/bodyParser');

// Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const leadRoutes = require('./routes/leads');
const dealRoutes = require('./routes/deals');
const contactRoutes = require('./routes/contacts');
const activityRoutes = require('./routes/activities');

function createServer() {
  const server = http.createServer((req, res) => {
    // Parse URL
    const parsedUrl = parse(req.url, true);
    req.pathname = parsedUrl.pathname;
    req.query = parsedUrl.query;
    req.search = parsedUrl.search;

    // Apply middleware
    cors(req, res, () => {});
    logger(req, res, () => {});
    rateLimit(req, res, () => {});
    bodyParser(req, res, () => {});

    // Route matching
    let matched = false;

    // Try each route handler
    if (!matched && req.pathname.startsWith('/api/auth')) {
      matched = authRoutes(req, res);
    }
    if (!matched && req.pathname.startsWith('/api/users')) {
      matched = userRoutes(req, res);
    }
    if (!matched && req.pathname.startsWith('/api/leads')) {
      matched = leadRoutes(req, res);
    }
    if (!matched && req.pathname.startsWith('/api/deals')) {
      matched = dealRoutes(req, res);
    }
    if (!matched && req.pathname.startsWith('/api/contacts')) {
      matched = contactRoutes(req, res);
    }
    if (!matched && req.pathname.startsWith('/api/activities')) {
      matched = activityRoutes(req, res);
    }

    // 404 if no route matched
    if (!matched) {
      notFoundHandler(req, res);
    }
  });

  // Global error handler
  server.on('error', (err) => {
    logError('Server error', err);
  });

  return server;
}

module.exports = { createServer };
```
