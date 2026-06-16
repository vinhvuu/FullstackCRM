# Phase 2: REST API — Core Entities — Detailed Implementation Plan

**Date:** Jun 07, 2026  
**Prerequisite:** Phase 1 complete  
**Goal:** Build CRUD API endpoints for Leads, Deals, Contacts, Activities, Tags, Reminders

---

## Task 2.1 — Leads API

### Files to Create/Modify

| File | Action |
|------|--------|
| `server/src/repositories/lead-repository.js` | NEW — DB operations |
| `server/src/services/lead-service.js` | NEW — business logic |
| `server/src/routes/leads.js` | NEW — HTTP handlers |

### Steps

**2.1.1 — Create server/src/repositories/lead-repository.js**

```javascript
const { getDb } = require('./db');

function findAll({ status, source, assigneeId, search, scoreMin, scoreMax, dateFrom, dateTo, sortBy = 'created_at', sortOrder = 'DESC', page = 1, limit = 50 }) {
  const db = getDb();
  const conditions = ['1=1'];
  const params = [];

  if (status) {
    conditions.push(`l.status = ?`);
    params.push(status);
  }
  if (source) {
    conditions.push(`l.source = ?`);
    params.push(source);
  }
  if (assigneeId) {
    conditions.push(`l.owner_id = ?`);
    params.push(assigneeId);
  }
  if (search) {
    conditions.push(`(l.name LIKE ? OR l.company LIKE ? OR l.email LIKE ?)`);
    const s = `%${search}%`;
    params.push(s, s, s);
  }
  if (scoreMin !== undefined) {
    conditions.push(`l.score >= ?`);
    params.push(scoreMin);
  }
  if (scoreMax !== undefined) {
    conditions.push(`l.score <= ?`);
    params.push(scoreMax);
  }
  if (dateFrom) {
    conditions.push(`l.created_at >= ?`);
    params.push(dateFrom);
  }
  if (dateTo) {
    conditions.push(`l.created_at <= ?`);
    params.push(dateTo);
  }

  const whereClause = conditions.join(' AND ');
  const offset = (page - 1) * limit;

  const sortColumn = { name: 'l.name', company: 'l.company', score: 'l.score', created_at: 'l.created_at' }[sortBy] || 'l.created_at';
  const order = sortOrder === 'ASC' ? 'ASC' : 'DESC';

  const rows = db.prepare(`
    SELECT l.*, u.name as owner_name,
      GROUP_CONCAT(t.label) as tags,
      GROUP_CONCAT(t.color) as tag_colors,
      GROUP_CONCAT(t.bg_color) as tag_bg_colors
    FROM leads l
    LEFT JOIN users u ON l.owner_id = u.id
    LEFT JOIN lead_tags lt ON l.id = lt.lead_id
    LEFT JOIN tags t ON lt.tag_id = t.id
    WHERE ${whereClause}
    GROUP BY l.id
    ORDER BY ${sortColumn} ${order}
    LIMIT ? OFFSET ?
  `).all(...params, limit, offset);

  const total = db.prepare(`
    SELECT COUNT(*) as count FROM leads l WHERE ${whereClause}
  `).get(...params).count;

  return { data: rows, total, page, limit, totalPages: Math.ceil(total / limit) };
}

function findById(id) {
  const db = getDb();
  const lead = db.prepare(`
    SELECT l.*, u.name as owner_name
    FROM leads l
    LEFT JOIN users u ON l.owner_id = u.id
    WHERE l.id = ?
  `).get(id);

  if (!lead) return null;

  const tags = db.prepare(`
    SELECT t.* FROM tags t
    JOIN lead_tags lt ON t.id = lt.tag_id
    WHERE lt.lead_id = ?
  `).all(id);

  return { ...lead, tags };
}

function create({ name, company, email, phone, source, status = 'new', score = 50, notes, owner_id }) {
  const db = getDb();
  const result = db.prepare(`
    INSERT INTO leads (name, company, email, phone, source, status, score, notes, owner_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(name, company, email, phone, source, status, score, notes || null, owner_id);

  return findById(result.lastInsertRowid);
}

function update(id, { name, company, email, phone, source, status, score, notes, order_index }) {
  const db = getDb();
  db.prepare(`
    UPDATE leads SET
      name = COALESCE(?, name),
      company = COALESCE(?, company),
      email = COALESCE(?, email),
      phone = COALESCE(?, phone),
      source = COALESCE(?, source),
      status = COALESCE(?, status),
      score = COALESCE(?, score),
      notes = COALESCE(?, notes),
      order_index = COALESCE(?, order_index),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(name, company, email, phone, source, status, score, notes, order_index, id);

  return findById(id);
}

function remove(id) {
  const db = getDb();
  db.prepare('DELETE FROM leads WHERE id = ?').run(id);
  return { deleted: true };
}

function updateStatus(id, status) {
  const db = getDb();
  db.prepare('UPDATE leads SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(status, id);
  return findById(id);
}

function addTag(leadId, tagId) {
  const db = getDb();
  try {
    db.prepare('INSERT OR IGNORE INTO lead_tags (lead_id, tag_id) VALUES (?, ?)').run(leadId, tagId);
  } catch {}
  return findById(leadId);
}

function removeTag(leadId, tagId) {
  const db = getDb();
  db.prepare('DELETE FROM lead_tags WHERE lead_id = ? AND tag_id = ?').run(leadId, tagId);
  return findById(leadId);
}

module.exports = { findAll, findById, create, update, remove, updateStatus, addTag, removeTag };
```

**2.1.2 — Create server/src/services/lead-service.js**

```javascript
const leadRepo = require('../repositories/lead-repository');

function getLeads(params) {
  return leadRepo.findAll(params);
}

function getLeadById(id) {
  const lead = leadRepo.findById(id);
  if (!lead) {
    const error = new Error('Lead not found');
    error.status = 404;
    throw error;
  }
  return lead;
}

function createLead(data) {
  if (!data.name || data.name.trim() === '') {
    const error = new Error('Lead name is required');
    error.status = 400;
    throw error;
  }
  return leadRepo.create(data);
}

function updateLead(id, data) {
  getLeadById(id); // validate exists
  return leadRepo.update(id, data);
}

function deleteLead(id) {
  getLeadById(id);
  return leadRepo.remove(id);
}

function convertToDeal(leadId, dealData) {
  const lead = getLeadById(leadId);
  if (!lead) {
    const error = new Error('Lead not found');
    error.status = 404;
    throw error;
  }

  const dealRepo = require('../repositories/deal-repository');
  const contactRepo = require('../repositories/contact-repository');

  let contact = null;
  if (dealData.createContact !== false && lead.email) {
    contact = contactRepo.findByEmail(lead.email);
    if (!contact) {
      contact = contactRepo.create({
        owner_id: lead.owner_id,
        name: lead.name,
        company: lead.company,
        email: lead.email,
        phone: lead.phone,
      });
    }
  }

  const deal = dealRepo.create({
    title: dealData.title || `Deal from ${lead.name}`,
    value: dealData.value || 0,
    stage: dealData.stage || 'lead',
    probability: dealData.probability || 10,
    contact_id: contact ? contact.id : null,
    lead_id: leadId,
    owner_id: lead.owner_id,
    expected_close_date: dealData.expected_close_date || null,
  });

  // Update lead status to qualified
  leadRepo.updateStatus(leadId, 'qualified');

  return { deal, contact };
}

module.exports = { getLeads, getLeadById, createLead, updateLead, deleteLead, convertToDeal };
```

**2.1.3 — Create server/src/routes/leads.js**

```javascript
const { get, post, put, del } = require('../router');
const { sendJson } = require('../main');
const { authMiddleware } = require('../middleware/auth');
const leadService = require('../services/lead-service');

// All routes require auth
// NOTE: In main.js we need to apply authMiddleware per route. For now, we call it manually.

// GET /api/leads
get('/api/leads', (req, res) => {
  authMiddleware(req, res, () => {
    const params = {
      status: req.query.status,
      source: req.query.source,
      assigneeId: req.query.assignee,
      search: req.query.search,
      scoreMin: req.query.scoreMin ? parseInt(req.query.scoreMin) : undefined,
      scoreMax: req.query.scoreMax ? parseInt(req.query.scoreMax) : undefined,
      dateFrom: req.query.dateFrom,
      dateTo: req.query.dateTo,
      sortBy: req.query.sortBy,
      sortOrder: req.query.sortOrder,
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 50,
    };

    const result = leadService.getLeads(params);
    sendJson(res, 200, result);
  });
});

// GET /api/leads/:id
get('/api/leads/:id', (req, res) => {
  authMiddleware(req, res, () => {
    try {
      const lead = leadService.getLeadById(parseInt(req.params.id));
      sendJson(res, 200, { data: lead });
    } catch (error) {
      sendJson(res, error.status || 500, { error: error.message });
    }
  });
});

// POST /api/leads
post('/api/leads', (req, res) => {
  authMiddleware(req, res, () => {
    try {
      const lead = leadService.createLead({
        ...req.body,
        owner_id: req.user.id,
      });
      sendJson(res, 201, { data: lead });
    } catch (error) {
      sendJson(res, error.status || 500, { error: error.message });
    }
  });
});

// PUT /api/leads/:id
put('/api/leads/:id', (req, res) => {
  authMiddleware(req, res, () => {
    try {
      const lead = leadService.updateLead(parseInt(req.params.id), req.body);
      sendJson(res, 200, { data: lead });
    } catch (error) {
      sendJson(res, error.status || 500, { error: error.message });
    }
  });
});

// DELETE /api/leads/:id
del('/api/leads/:id', (req, res) => {
  authMiddleware(req, res, () => {
    try {
      const result = leadService.deleteLead(parseInt(req.params.id));
      sendJson(res, 200, result);
    } catch (error) {
      sendJson(res, error.status || 500, { error: error.message });
    }
  });
});

// POST /api/leads/:id/convert
post('/api/leads/:id/convert', (req, res) => {
  authMiddleware(req, res, () => {
    try {
      const result = leadService.convertToDeal(parseInt(req.params.id), req.body);
      sendJson(res, 201, { data: result });
    } catch (error) {
      sendJson(res, error.status || 500, { error: error.message });
    }
  });
});

// POST /api/leads/:id/tags/:tagId
post('/api/leads/:id/tags/:tagId', (req, res) => {
  authMiddleware(req, res, () => {
    const leadRepo = require('../repositories/lead-repository');
    const lead = leadRepo.addTag(parseInt(req.params.id), parseInt(req.params.tagId));
    sendJson(res, 200, { data: lead });
  });
});

// DELETE /api/leads/:id/tags/:tagId
del('/api/leads/:id/tags/:tagId', (req, res) => {
  authMiddleware(req, res, () => {
    const leadRepo = require('../repositories/lead-repository');
    const lead = leadRepo.removeTag(parseInt(req.params.id), parseInt(req.params.tagId));
    sendJson(res, 200, { data: lead });
  });
});
```

---

## Task 2.2 — Deals API

### Files to Create/Modify

| File | Action |
|------|--------|
| `server/src/repositories/deal-repository.js` | NEW |
| `server/src/services/deal-service.js` | NEW |
| `server/src/routes/deals.js` | NEW |

### Steps

**2.2.1 — Create server/src/repositories/deal-repository.js**

```javascript
const { getDb } = require('./db');

function findAll({ stage, ownerId, contactId, search, sortBy = 'created_at', sortOrder = 'DESC', page = 1, limit = 50 }) {
  const db = getDb();
  const conditions = ['1=1'];
  const params = [];

  if (stage) {
    conditions.push(`d.stage = ?`);
    params.push(stage);
  }
  if (ownerId) {
    conditions.push(`d.owner_id = ?`);
    params.push(ownerId);
  }
  if (contactId) {
    conditions.push(`d.contact_id = ?`);
    params.push(contactId);
  }
  if (search) {
    conditions.push(`(d.title LIKE ?)`);
    params.push(`%${search}%`);
  }

  const whereClause = conditions.join(' AND ');
  const offset = (page - 1) * limit;
  const sortColumn = { title: 'd.title', value: 'd.value', stage: 'd.stage', created_at: 'd.created_at' }[sortBy] || 'd.created_at';
  const order = sortOrder === 'ASC' ? 'ASC' : 'DESC';

  const rows = db.prepare(`
    SELECT d.*, u.name as owner_name, c.name as contact_name
    FROM deals d
    LEFT JOIN users u ON d.owner_id = u.id
    LEFT JOIN contacts c ON d.contact_id = c.id
    WHERE ${whereClause}
    ORDER BY ${sortColumn} ${order}
    LIMIT ? OFFSET ?
  `).all(...params, limit, offset);

  const total = db.prepare(`SELECT COUNT(*) as count FROM deals d WHERE ${whereClause}`).get(...params).count;

  return { data: rows, total, page, limit, totalPages: Math.ceil(total / limit) };
}

function findById(id) {
  const db = getDb();
  return db.prepare(`
    SELECT d.*, u.name as owner_name, c.name as contact_name, c.email as contact_email
    FROM deals d
    LEFT JOIN users u ON d.owner_id = u.id
    LEFT JOIN contacts c ON d.contact_id = c.id
    WHERE d.id = ?
  `).get(id);
}

function findByEmail(email) {
  const db = getDb();
  return db.prepare('SELECT * FROM contacts WHERE email = ?').get(email);
}

function create({ title, value, stage = 'lead', probability = 10, contact_id, lead_id, owner_id, expected_close_date }) {
  const db = getDb();
  const result = db.prepare(`
    INSERT INTO deals (title, value, stage, probability, contact_id, lead_id, owner_id, expected_close_date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(title, value, stage, probability, contact_id || null, lead_id || null, owner_id, expected_close_date || null);

  return findById(result.lastInsertRowid);
}

function update(id, { title, value, stage, probability, contact_id, expected_close_date }) {
  const db = getDb();
  db.prepare(`
    UPDATE deals SET
      title = COALESCE(?, title),
      value = COALESCE(?, value),
      stage = COALESCE(?, stage),
      probability = COALESCE(?, probability),
      contact_id = COALESCE(?, contact_id),
      expected_close_date = COALESCE(?, expected_close_date),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(title, value, stage, probability, contact_id, expected_close_date, id);

  return findById(id);
}

function remove(id) {
  const db = getDb();
  db.prepare('DELETE FROM deals WHERE id = ?').run(id);
  return { deleted: true };
}

module.exports = { findAll, findById, findByEmail, create, update, remove };
```

**2.2.2 — Create server/src/services/deal-service.js**

```javascript
const dealRepo = require('../repositories/deal-repository');

function getDeals(params) {
  return dealRepo.findAll(params);
}

function getDealById(id) {
  const deal = dealRepo.findById(id);
  if (!deal) {
    const error = new Error('Deal not found');
    error.status = 404;
    throw error;
  }
  return deal;
}

function createDeal(data) {
  if (!data.title || data.title.trim() === '') {
    const error = new Error('Deal title is required');
    error.status = 400;
    throw error;
  }
  return dealRepo.create(data);
}

function updateDeal(id, data) {
  getDealById(id);
  return dealRepo.update(id, data);
}

function deleteDeal(id) {
  getDealById(id);
  return dealRepo.remove(id);
}

module.exports = { getDeals, getDealById, createDeal, updateDeal, deleteDeal };
```

**2.2.3 — Create server/src/routes/deals.js**

```javascript
const { get, post, put, del } = require('../router');
const { sendJson } = require('../main');
const { authMiddleware } = require('../middleware/auth');
const dealService = require('../services/deal-service');

get('/api/deals', (req, res) => {
  authMiddleware(req, res, () => {
    const params = {
      stage: req.query.stage,
      ownerId: req.query.owner,
      contactId: req.query.contact,
      search: req.query.search,
      sortBy: req.query.sortBy,
      sortOrder: req.query.sortOrder,
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 50,
    };
    const result = dealService.getDeals(params);
    sendJson(res, 200, result);
  });
});

get('/api/deals/:id', (req, res) => {
  authMiddleware(req, res, () => {
    try {
      const deal = dealService.getDealById(parseInt(req.params.id));
      sendJson(res, 200, { data: deal });
    } catch (error) {
      sendJson(res, error.status || 500, { error: error.message });
    }
  });
});

post('/api/deals', (req, res) => {
  authMiddleware(req, res, () => {
    try {
      const deal = dealService.createDeal({ ...req.body, owner_id: req.user.id });
      sendJson(res, 201, { data: deal });
    } catch (error) {
      sendJson(res, error.status || 500, { error: error.message });
    }
  });
});

put('/api/deals/:id', (req, res) => {
  authMiddleware(req, res, () => {
    try {
      const deal = dealService.updateDeal(parseInt(req.params.id), req.body);
      sendJson(res, 200, { data: deal });
    } catch (error) {
      sendJson(res, error.status || 500, { error: error.message });
    }
  });
});

del('/api/deals/:id', (req, res) => {
  authMiddleware(req, res, () => {
    try {
      const result = dealService.deleteDeal(parseInt(req.params.id));
      sendJson(res, 200, result);
    } catch (error) {
      sendJson(res, error.status || 500, { error: error.message });
    }
  });
});
```

---

## Task 2.3 — Contacts API

### Files to Create/Modify

| File | Action |
|------|--------|
| `server/src/repositories/contact-repository.js` | NEW |
| `server/src/services/contact-service.js` | NEW |
| `server/src/routes/contacts.js` | NEW |

### Steps

**2.3.1 — Create server/src/repositories/contact-repository.js**

```javascript
const { getDb } = require('./db');

function findAll({ search, sortBy = 'name', sortOrder = 'ASC', page = 1, limit = 50 }) {
  const db = getDb();
  const conditions = ['1=1'];
  const params = [];

  if (search) {
    conditions.push(`(name LIKE ? OR company LIKE ? OR email LIKE ?)`);
    const s = `%${search}%`;
    params.push(s, s, s);
  }

  const whereClause = conditions.join(' AND ');
  const offset = (page - 1) * limit;
  const sortColumn = { name: 'name', company: 'company', email: 'email', created_at: 'created_at' }[sortBy] || 'name';
  const order = sortOrder === 'ASC' ? 'ASC' : 'DESC';

  const rows = db.prepare(`
    SELECT c.*, u.name as owner_name
    FROM contacts c
    LEFT JOIN users u ON c.owner_id = u.id
    WHERE ${whereClause}
    ORDER BY ${sortColumn} ${order}
    LIMIT ? OFFSET ?
  `).all(...params, limit, offset);

  const total = db.prepare(`SELECT COUNT(*) as count FROM contacts c WHERE ${whereClause}`).get(...params).count;

  return { data: rows, total, page, limit, totalPages: Math.ceil(total / limit) };
}

function findById(id) {
  const db = getDb();
  return db.prepare(`
    SELECT c.*, u.name as owner_name
    FROM contacts c
    LEFT JOIN users u ON c.owner_id = u.id
    WHERE c.id = ?
  `).get(id);
}

function findByEmail(email) {
  const db = getDb();
  return db.prepare('SELECT * FROM contacts WHERE email = ?').get(email);
}

function create({ name, company, email, phone, position, owner_id }) {
  const db = getDb();
  const result = db.prepare(`
    INSERT INTO contacts (name, company, email, phone, position, owner_id)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(name, company, email, phone, position, owner_id);

  return findById(result.lastInsertRowid);
}

function update(id, { name, company, email, phone, position }) {
  const db = getDb();
  db.prepare(`
    UPDATE contacts SET
      name = COALESCE(?, name),
      company = COALESCE(?, company),
      email = COALESCE(?, email),
      phone = COALESCE(?, phone),
      position = COALESCE(?, position),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(name, company, email, phone, position, id);

  return findById(id);
}

function remove(id) {
  const db = getDb();
  db.prepare('DELETE FROM contacts WHERE id = ?').run(id);
  return { deleted: true };
}

module.exports = { findAll, findById, findByEmail, create, update, remove };
```

**2.3.2 — Create server/src/services/contact-service.js**

```javascript
const contactRepo = require('../repositories/contact-repository');

function getContacts(params) {
  return contactRepo.findAll(params);
}

function getContactById(id) {
  const contact = contactRepo.findById(id);
  if (!contact) {
    const error = new Error('Contact not found');
    error.status = 404;
    throw error;
  }
  return contact;
}

function createContact(data) {
  if (!data.name || data.name.trim() === '') {
    const error = new Error('Contact name is required');
    error.status = 400;
    throw error;
  }
  return contactRepo.create(data);
}

function updateContact(id, data) {
  getContactById(id);
  return contactRepo.update(id, data);
}

function deleteContact(id) {
  getContactById(id);
  return contactRepo.remove(id);
}

module.exports = { getContacts, getContactById, createContact, updateContact, deleteContact };
```

**2.3.3 — Create server/src/routes/contacts.js**

```javascript
const { get, post, put, del } = require('../router');
const { sendJson } = require('../main');
const { authMiddleware } = require('../middleware/auth');
const contactService = require('../services/contact-service');

get('/api/contacts', (req, res) => {
  authMiddleware(req, res, () => {
    const params = {
      search: req.query.search,
      sortBy: req.query.sortBy,
      sortOrder: req.query.sortOrder,
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 50,
    };
    const result = contactService.getContacts(params);
    sendJson(res, 200, result);
  });
});

get('/api/contacts/:id', (req, res) => {
  authMiddleware(req, res, () => {
    try {
      const contact = contactService.getContactById(parseInt(req.params.id));
      sendJson(res, 200, { data: contact });
    } catch (error) {
      sendJson(res, error.status || 500, { error: error.message });
    }
  });
});

post('/api/contacts', (req, res) => {
  authMiddleware(req, res, () => {
    try {
      const contact = contactService.createContact({ ...req.body, owner_id: req.user.id });
      sendJson(res, 201, { data: contact });
    } catch (error) {
      sendJson(res, error.status || 500, { error: error.message });
    }
  });
});

put('/api/contacts/:id', (req, res) => {
  authMiddleware(req, res, () => {
    try {
      const contact = contactService.updateContact(parseInt(req.params.id), req.body);
      sendJson(res, 200, { data: contact });
    } catch (error) {
      sendJson(res, error.status || 500, { error: error.message });
    }
  });
});

del('/api/contacts/:id', (req, res) => {
  authMiddleware(req, res, () => {
    try {
      const result = contactService.deleteContact(parseInt(req.params.id));
      sendJson(res, 200, result);
    } catch (error) {
      sendJson(res, error.status || 500, { error: error.message });
    }
  });
});
```

---

## Task 2.4 — Activities API

### Files to Create/Modify

| File | Action |
|------|--------|
| `server/src/repositories/activity-repository.js` | NEW |
| `server/src/services/activity-service.js` | NEW |
| `server/src/routes/activities.js` | NEW |

### Steps

**2.4.1 — Create server/src/repositories/activity-repository.js**

```javascript
const { getDb } = require('./db');

function findAll({ status, type, dealId, contactId, ownerId, dueDateFrom, dueDateTo, sortBy = 'due_date', sortOrder = 'ASC', page = 1, limit = 50 }) {
  const db = getDb();
  const conditions = ['1=1'];
  const params = [];

  if (status) conditions.push(`a.status = ?`) && params.push(status);
  if (type) conditions.push(`a.type = ?`) && params.push(type);
  if (dealId) conditions.push(`a.deal_id = ?`) && params.push(dealId);
  if (contactId) conditions.push(`a.contact_id = ?`) && params.push(contactId);
  if (ownerId) conditions.push(`a.owner_id = ?`) && params.push(ownerId);
  if (dueDateFrom) conditions.push(`a.due_date >= ?`) && params.push(dueDateFrom);
  if (dueDateTo) conditions.push(`a.due_date <= ?`) && params.push(dueDateTo);

  const whereClause = conditions.join(' AND ');
  const offset = (page - 1) * limit;
  const sortColumn = { due_date: 'a.due_date', type: 'a.type', created_at: 'a.created_at' }[sortBy] || 'a.due_date';
  const order = sortOrder === 'ASC' ? 'ASC' : 'DESC';

  const rows = db.prepare(`
    SELECT a.*, u.name as owner_name, d.title as deal_title, c.name as contact_name
    FROM activities a
    LEFT JOIN users u ON a.owner_id = u.id
    LEFT JOIN deals d ON a.deal_id = d.id
    LEFT JOIN contacts c ON a.contact_id = c.id
    WHERE ${whereClause}
    ORDER BY ${sortColumn} ${order}
    LIMIT ? OFFSET ?
  `).all(...params, limit, offset);

  const total = db.prepare(`SELECT COUNT(*) as count FROM activities a WHERE ${whereClause}`).get(...params).count;

  return { data: rows, total, page, limit, totalPages: Math.ceil(total / limit) };
}

function findById(id) {
  const db = getDb();
  return db.prepare(`
    SELECT a.*, u.name as owner_name
    FROM activities a
    LEFT JOIN users u ON a.owner_id = u.id
    WHERE a.id = ?
  `).get(id);
}

function create({ type, title, description, deal_id, contact_id, due_date, owner_id }) {
  const db = getDb();
  const result = db.prepare(`
    INSERT INTO activities (type, title, description, deal_id, contact_id, due_date, owner_id)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(type, title, description || null, deal_id || null, contact_id || null, due_date || null, owner_id);

  return findById(result.lastInsertRowid);
}

function update(id, { title, description, due_date, status }) {
  const db = getDb();
  db.prepare(`
    UPDATE activities SET
      title = COALESCE(?, title),
      description = COALESCE(?, description),
      due_date = COALESCE(?, due_date),
      status = COALESCE(?, status),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(title, description, due_date, status, id);

  return findById(id);
}

function remove(id) {
  const db = getDb();
  db.prepare('DELETE FROM activities WHERE id = ?').run(id);
  return { deleted: true };
}

module.exports = { findAll, findById, create, update, remove };
```

**2.4.2 — Create server/src/services/activity-service.js**

```javascript
const activityRepo = require('../repositories/activity-repository');

function getActivities(params) {
  return activityRepo.findAll(params);
}

function getActivityById(id) {
  const activity = activityRepo.findById(id);
  if (!activity) {
    const error = new Error('Activity not found');
    error.status = 404;
    throw error;
  }
  return activity;
}

function createActivity(data) {
  if (!data.title || data.title.trim() === '') {
    const error = new Error('Activity title is required');
    error.status = 400;
    throw error;
  }
  if (!data.type || !['call', 'email', 'meeting', 'task'].includes(data.type)) {
    const error = new Error('Activity type must be one of: call, email, meeting, task');
    error.status = 400;
    throw error;
  }
  return activityRepo.create(data);
}

function updateActivity(id, data) {
  getActivityById(id);
  return activityRepo.update(id, data);
}

function deleteActivity(id) {
  getActivityById(id);
  return activityRepo.remove(id);
}

module.exports = { getActivities, getActivityById, createActivity, updateActivity, deleteActivity };
```

**2.4.3 — Create server/src/routes/activities.js**

```javascript
const { get, post, put, del } = require('../router');
const { sendJson } = require('../main');
const { authMiddleware } = require('../middleware/auth');
const activityService = require('../services/activity-service');

get('/api/activities', (req, res) => {
  authMiddleware(req, res, () => {
    const params = {
      status: req.query.status,
      type: req.query.type,
      dealId: req.query.deal ? parseInt(req.query.deal) : undefined,
      contactId: req.query.contact ? parseInt(req.query.contact) : undefined,
      dueDateFrom: req.query.dueDateFrom,
      dueDateTo: req.query.dueDateTo,
      sortBy: req.query.sortBy,
      sortOrder: req.query.sortOrder,
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 50,
    };
    const result = activityService.getActivities(params);
    sendJson(res, 200, result);
  });
});

get('/api/activities/:id', (req, res) => {
  authMiddleware(req, res, () => {
    try {
      const activity = activityService.getActivityById(parseInt(req.params.id));
      sendJson(res, 200, { data: activity });
    } catch (error) {
      sendJson(res, error.status || 500, { error: error.message });
    }
  });
});

post('/api/activities', (req, res) => {
  authMiddleware(req, res, () => {
    try {
      const activity = activityService.createActivity({ ...req.body, owner_id: req.user.id });
      sendJson(res, 201, { data: activity });
    } catch (error) {
      sendJson(res, error.status || 500, { error: error.message });
    }
  });
});

put('/api/activities/:id', (req, res) => {
  authMiddleware(req, res, () => {
    try {
      const activity = activityService.updateActivity(parseInt(req.params.id), req.body);
      sendJson(res, 200, { data: activity });
    } catch (error) {
      sendJson(res, error.status || 500, { error: error.message });
    }
  });
});

del('/api/activities/:id', (req, res) => {
  authMiddleware(req, res, () => {
    try {
      const result = activityService.deleteActivity(parseInt(req.params.id));
      sendJson(res, 200, result);
    } catch (error) {
      sendJson(res, error.status || 500, { error: error.message });
    }
  });
});
```

---

## Task 2.5 — Tags & Reminders API

### Files to Create/Modify

| File | Action |
|------|--------|
| `server/src/repositories/tag-repository.js` | NEW |
| `server/src/repositories/reminder-repository.js` | NEW |
| `server/src/services/reminder-service.js` | NEW |
| `server/src/routes/tags.js` | NEW |
| `server/src/routes/reminders.js` | NEW |

### Steps

**2.5.1 — Create server/src/repositories/tag-repository.js**

```javascript
const { getDb } = require('./db');

function findAll() {
  const db = getDb();
  return db.prepare('SELECT * FROM tags ORDER BY id').all();
}

function findById(id) {
  const db = getDb();
  return db.prepare('SELECT * FROM tags WHERE id = ?').get(id);
}

module.exports = { findAll, findById };
```

**2.5.2 — Create server/src/repositories/reminder-repository.js**

```javascript
const { getDb } = require('./db');

function findByLeadId(leadId) {
  const db = getDb();
  return db.prepare(`
    SELECT r.*, l.name as lead_name
    FROM reminders r
    LEFT JOIN leads l ON r.lead_id = l.id
    WHERE r.lead_id = ?
    ORDER BY r.date ASC, r.time ASC
  `).all(leadId);
}

function findUpcoming(ownerId, date) {
  const db = getDb();
  return db.prepare(`
    SELECT r.*, l.name as lead_name
    FROM reminders r
    LEFT JOIN leads l ON r.lead_id = l.id
    WHERE r.date <= ? AND r.status = 'pending'
    AND l.owner_id = ?
    ORDER BY r.date ASC, r.time ASC
  `).all(date, ownerId);
}

function create({ lead_id, date, time, note }) {
  const db = getDb();
  const result = db.prepare(`
    INSERT INTO reminders (lead_id, date, time, note)
    VALUES (?, ?, ?, ?)
  `).run(lead_id, date, time || null, note || null);

  return db.prepare('SELECT * FROM reminders WHERE id = ?').get(result.lastInsertRowid);
}

function updateStatus(id, status) {
  const db = getDb();
  const completedAt = status === 'completed' ? new Date().toISOString() : null;
  db.prepare(`
    UPDATE reminders SET status = ?, completed_at = ? WHERE id = ?
  `).run(status, completedAt, id);

  return db.prepare('SELECT * FROM reminders WHERE id = ?').get(id);
}

function snooze(id, newDate) {
  const db = getDb();
  db.prepare(`
    UPDATE reminders SET status = 'snoozed', date = ? WHERE id = ?
  `).run(newDate, id);

  return db.prepare('SELECT * FROM reminders WHERE id = ?').get(id);
}

function remove(id) {
  const db = getDb();
  db.prepare('DELETE FROM reminders WHERE id = ?').run(id);
  return { deleted: true };
}

module.exports = { findByLeadId, findUpcoming, create, updateStatus, snooze, remove };
```

**2.5.3 — Create server/src/services/reminder-service.js**

```javascript
const reminderRepo = require('../repositories/reminder-repository');

function getRemindersByLeadId(leadId) {
  return reminderRepo.findByLeadId(leadId);
}

function getUpcomingReminders(ownerId) {
  const today = new Date().toISOString().split('T')[0];
  return reminderRepo.findUpcoming(ownerId, today);
}

function createReminder(data) {
  if (!data.lead_id || !data.date) {
    const error = new Error('lead_id and date are required');
    error.status = 400;
    throw error;
  }
  return reminderRepo.create(data);
}

function completeReminder(id) {
  return reminderRepo.updateStatus(id, 'completed');
}

function snoozeReminder(id, newDate) {
  if (!newDate) {
    const error = new Error('newDate is required to snooze');
    error.status = 400;
    throw error;
  }
  return reminderRepo.snooze(id, newDate);
}

function deleteReminder(id) {
  return reminderRepo.remove(id);
}

module.exports = { getRemindersByLeadId, getUpcomingReminders, createReminder, completeReminder, snoozeReminder, deleteReminder };
```

**2.5.4 — Create server/src/routes/tags.js**

```javascript
const { get } = require('../router');
const { sendJson } = require('../main');
const { authMiddleware } = require('../middleware/auth');
const tagRepo = require('../repositories/tag-repository');

get('/api/tags', (req, res) => {
  authMiddleware(req, res, () => {
    const tags = tagRepo.findAll();
    sendJson(res, 200, { data: tags });
  });
});

get('/api/tags/:id', (req, res) => {
  authMiddleware(req, res, () => {
    const tag = tagRepo.findById(parseInt(req.params.id));
    if (!tag) return sendJson(res, 404, { error: 'Tag not found' });
    sendJson(res, 200, { data: tag });
  });
});
```

**2.5.5 — Create server/src/routes/reminders.js**

```javascript
const { get, post, put, del } = require('../router');
const { sendJson } = require('../main');
const { authMiddleware } = require('../middleware/auth');
const reminderService = require('../services/reminder-service');

get('/api/reminders/upcoming', (req, res) => {
  authMiddleware(req, res, () => {
    const reminders = reminderService.getUpcomingReminders(req.user.id);
    sendJson(res, 200, { data: reminders });
  });
});

get('/api/leads/:leadId/reminders', (req, res) => {
  authMiddleware(req, res, () => {
    const reminders = reminderService.getRemindersByLeadId(parseInt(req.params.leadId));
    sendJson(res, 200, { data: reminders });
  });
});

post('/api/leads/:leadId/reminders', (req, res) => {
  authMiddleware(req, res, () => {
    try {
      const reminder = reminderService.createReminder({
        ...req.body,
        lead_id: parseInt(req.params.leadId),
      });
      sendJson(res, 201, { data: reminder });
    } catch (error) {
      sendJson(res, error.status || 500, { error: error.message });
    }
  });
});

put('/api/reminders/:id/complete', (req, res) => {
  authMiddleware(req, res, () => {
    const reminder = reminderService.completeReminder(parseInt(req.params.id));
    sendJson(res, 200, { data: reminder });
  });
});

put('/api/reminders/:id/snooze', (req, res) => {
  authMiddleware(req, res, () => {
    try {
      const { newDate } = req.body;
      const reminder = reminderService.snoozeReminder(parseInt(req.params.id), newDate);
      sendJson(res, 200, { data: reminder });
    } catch (error) {
      sendJson(res, error.status || 500, { error: error.message });
    }
  });
});

del('/api/reminders/:id', (req, res) => {
  authMiddleware(req, res, () => {
    const result = reminderService.deleteReminder(parseInt(req.params.id));
    sendJson(res, 200, result);
  });
});
```

---

## Task 2.6 — Update main.js to Load All Routes

### Modify server/src/main.js

Add these route requires after auth routes:

```javascript
// After require('./routes/auth')
require('./routes/leads');
require('./routes/deals');
require('./routes/contacts');
require('./routes/activities');
require('./routes/tags');
require('./routes/reminders');
```

---

## Verification Steps

```bash
# Start server
cd server && npm run dev

# Test tags
curl http://localhost:3001/api/tags -H "Authorization: Bearer YOUR_TOKEN"

# Test create lead
curl -X POST http://localhost:3001/api/leads \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"name":"Nguyen Van A","company":"ABC Corp","email":"nguyenvana@abc.com","source":"Website","score":75}'

# Test list leads
curl "http://localhost:3001/api/leads?page=1&limit=10" -H "Authorization: Bearer YOUR_TOKEN"

# Test create contact
curl -X POST http://localhost:3001/api/contacts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"name":"Tran Thi B","company":"XYZ Inc","email":"tranthib@xyz.com","position":"CEO"}'

# Test create deal
curl -X POST http://localhost:3001/api/deals \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"title":"Deal with ABC Corp","value":50000000,"stage":"qualified","probability":50}'

# Test create activity
curl -X POST http://localhost:3001/api/activities \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"type":"call","title":"Follow up call","description":"Discuss contract terms","due_date":"2026-06-10"}'
```

---

## File Summary

| File | Action |
|------|--------|
| `server/src/repositories/lead-repository.js` | NEW |
| `server/src/repositories/deal-repository.js` | NEW |
| `server/src/repositories/contact-repository.js` | NEW |
| `server/src/repositories/activity-repository.js` | NEW |
| `server/src/repositories/tag-repository.js` | NEW |
| `server/src/repositories/reminder-repository.js` | NEW |
| `server/src/services/lead-service.js` | NEW |
| `server/src/services/deal-service.js` | NEW |
| `server/src/services/contact-service.js` | NEW |
| `server/src/services/activity-service.js` | NEW |
| `server/src/services/reminder-service.js` | NEW |
| `server/src/routes/leads.js` | NEW |
| `server/src/routes/deals.js` | NEW |
| `server/src/routes/contacts.js` | NEW |
| `server/src/routes/activities.js` | NEW |
| `server/src/routes/tags.js` | NEW |
| `server/src/routes/reminders.js` | NEW |
| `server/src/main.js` | MODIFY — add route requires |