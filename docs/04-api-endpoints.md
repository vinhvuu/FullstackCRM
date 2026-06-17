# 4. API Endpoints

## 4.1 Base URL

```
http://localhost:3000/api
```

## 4.2 Authentication

### POST /api/auth/register
Register new user.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "User Name"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "name": "User Name",
    "role": "user"
  }
}
```

### POST /api/auth/login
Login and get token.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": 1,
      "email": "user@example.com",
      "name": "User Name",
      "role": "user"
    }
  }
}
```

### GET /api/auth/me
Get current user (requires auth).

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "name": "User Name",
    "role": "user"
  }
}
```

---

## 4.3 Users

### GET /api/users
List all users (admin only).

**Response (200):**
```json
{
  "success": true,
  "data": [
    { "id": 1, "email": "admin@crm.com", "name": "Admin", "role": "admin" },
    { "id": 2, "email": "user@crm.com", "name": "User", "role": "user" }
  ]
}
```

### GET /api/users/:id
Get user by ID.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "admin@crm.com",
    "name": "Admin User",
    "role": "admin",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

### PUT /api/users/:id
Update user (self or admin).

**Request:**
```json
{
  "name": "New Name",
  "role": "manager"
}
```

---

## 4.4 Leads

### GET /api/leads
List leads (own leads only).

**Query params:**
- `status` - Filter by status
- `source` - Filter by source
- `minScore` - Minimum score
- `maxScore` - Maximum score
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "John Smith",
      "company": "Acme Corp",
      "email": "john@acme.com",
      "phone": "+1234567890",
      "status": "qualified",
      "source": "website",
      "score": 85,
      "owner": { "id": 2, "name": "Sales User" },
      "created_at": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "totalPages": 3
  }
}
```

### POST /api/leads
Create new lead.

**Request:**
```json
{
  "name": "John Smith",
  "company": "Acme Corp",
  "email": "john@acme.com",
  "phone": "+1234567890",
  "source": "website",
  "notes": "Interested in enterprise plan"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Smith",
    "company": "Acme Corp",
    "status": "new",
    "score": 0,
    "owner_id": 2,
    "created_at": "2024-01-15T10:30:00Z"
  }
}
```

### GET /api/leads/:id
Get lead by ID.

### PUT /api/leads/:id
Update lead.

**Request:**
```json
{
  "status": "contacted",
  "score": 75,
  "notes": "Had a call, interested"
}
```

### DELETE /api/leads/:id
Delete lead.

### GET /api/leads/stats
Get lead statistics for current user.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "total": 50,
    "byStatus": {
      "new": 10,
      "contacted": 15,
      "qualified": 20,
      "lost": 3,
      "won": 2
    },
    "avgScore": 68.5
  }
}
```

---

## 4.5 Deals

### GET /api/deals
List deals.

**Query params:**
- `stage` - Filter by stage
- `minValue` - Minimum value
- `maxValue` - Maximum value
- `page` - Page number
- `limit` - Items per page

### POST /api/deals
Create new deal.

**Request:**
```json
{
  "lead_id": 1,
  "title": "Acme Enterprise Deal",
  "value": 50000,
  "stage": "lead",
  "probability": 20,
  "expected_close_date": "2024-03-01"
}
```

### GET /api/deals/:id
Get deal by ID with related data.

### PUT /api/deals/:id
Update deal.

### DELETE /api/deals/:id
Delete deal.

### GET /api/deals/stats
Get deal statistics.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "total": 25,
    "totalValue": 1250000,
    "avgDealSize": 50000,
    "byStage": {
      "lead": { "count": 5, "value": 100000 },
      "qualified": { "count": 8, "value": 400000 },
      "proposal": { "count": 6, "value": 350000 },
      "negotiation": { "count": 4, "value": 300000 },
      "won": { "count": 2, "value": 100000 }
    },
    "winRate": 40.5
  }
}
```

### PUT /api/deals/:id/stage
Update deal stage only (quick action).

**Request:**
```json
{
  "stage": "won"
}
```

---

## 4.6 Contacts

### GET /api/contacts
List contacts.

### POST /api/contacts
Create contact.

**Request:**
```json
{
  "name": "Jane Doe",
  "email": "jane@company.com",
  "phone": "+1234567890",
  "company": "Tech Inc",
  "position": "CTO"
}
```

### GET /api/contacts/:id
Get contact by ID.

### PUT /api/contacts/:id
Update contact.

### DELETE /api/contacts/:id
Delete contact.

---

## 4.7 Activities

### GET /api/activities
List activities.

**Query params:**
- `type` - Filter by type
- `status` - Filter by status
- `dueDate` - Filter by due date
- `page` - Page number
- `limit` - Items per page

### POST /api/activities
Create activity.

**Request:**
```json
{
  "lead_id": 1,
  "contact_id": 2,
  "deal_id": 3,
  "type": "call",
  "description": "Follow up call with John",
  "due_date": "2024-01-20T14:00:00Z"
}
```

### GET /api/activities/:id
Get activity by ID.

### PUT /api/activities/:id
Update activity.

### DELETE /api/activities/:id
Delete activity.

### PUT /api/activities/:id/complete
Mark activity as completed.

---

## 4.8 HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Success |
| 201 | Created - Resource created |
| 204 | No Content - Success, no response body |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Not authenticated |
| 403 | Forbidden - Not authorized |
| 404 | Not Found - Resource doesn't exist |
| 409 | Conflict - Resource already exists |
| 422 | Unprocessable Entity - Validation failed |
| 500 | Internal Server Error |

## 4.9 Error Response Format

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
