# Phase 3: Dashboard & Search API — Detailed Implementation Plan

**Date:** Jun 07, 2026  
**Prerequisite:** Phase 2 complete  
**Goal:** Build Dashboard stats API, Global Search, and Reports endpoints

---

## Task 3.1 — Dashboard Stats API

### Files to Create/Modify

| File | Action |
|------|--------|
| `server/src/repositories/dashboard-repository.js` | NEW |
| `server/src/services/dashboard-service.js` | NEW |
| `server/src/routes/dashboard.js` | NEW |

### Steps

**3.1.1 — Create server/src/repositories/dashboard-repository.js**

```javascript
const { getDb } = require('./db');

function getCounts(ownerId) {
  const db = getDb();
  const ownerClause = ownerId ? `AND l.owner_id = ?` : '';

  const leads = db.prepare(`
    SELECT COUNT(*) as count FROM leads l WHERE 1=1 ${ownerClause}
  `).get(ownerId ? [ownerId] : []).count;

  const activeCustomers = db.prepare(`
    SELECT COUNT(*) as count FROM contacts c WHERE 1=1 ${ownerClause.replace('l.', 'c.')}
  `).get(ownerId ? [ownerId] : []).count;

  const revenue = db.prepare(`
    SELECT COALESCE(SUM(d.value), 0) as total FROM deals d
    WHERE d.stage = 'won' ${ownerId ? 'AND d.owner_id = ?' : ''}
  `).get(ownerId ? [ownerId] : []).total;

  const activeDeals = db.prepare(`
    SELECT COUNT(*) as count FROM deals d
    WHERE d.stage NOT IN ('won', 'lost') ${ownerId ? 'AND d.owner_id = ?' : ''}
  `).get(ownerId ? [ownerId] : []).count;

  return { leads, activeCustomers, revenue, activeDeals };
}

function getTrends(ownerId, days = 30) {
  const db = getDb();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  const startDateStr = startDate.toISOString().split('T')[0];

  // Leads created per day
  const leadsByDay = db.prepare(`
    SELECT DATE(created_at) as date, COUNT(*) as count
    FROM leads
    WHERE created_at >= ? ${ownerId ? 'AND owner_id = ?' : ''}
    GROUP BY DATE(created_at)
    ORDER BY date ASC
  `).all(startDateStr, ownerId ? [ownerId] : []);

  // Deals won per day
  const dealsWonByDay = db.prepare(`
    SELECT DATE(updated_at) as date, COUNT(*) as count, SUM(value) as revenue
    FROM deals
    WHERE stage = 'won' AND updated_at >= ? ${ownerId ? 'AND owner_id = ?' : ''}
    GROUP BY DATE(updated_at)
    ORDER BY date ASC
  `).all(startDateStr, ownerId ? [ownerId] : []);

  // Deals by stage
  const dealsByStage = db.prepare(`
    SELECT stage, COUNT(*) as count, SUM(value) as value
    FROM deals
    WHERE stage NOT IN ('won', 'lost') ${ownerId ? 'AND owner_id = ?' : ''}
    GROUP BY stage
  `).all(ownerId ? [ownerId] : []);

  return { leadsByDay, dealsWonByDay, dealsByStage };
}

function getLeadSources(ownerId) {
  const db = getDb();
  return db.prepare(`
    SELECT source, COUNT(*) as count
    FROM leads
    WHERE source IS NOT NULL AND source != '' ${ownerId ? 'AND owner_id = ?' : ''}
    GROUP BY source
    ORDER BY count DESC
  `).all(ownerId ? [ownerId] : []);
}

function getAIInsights(ownerId) {
  const db = getDb();

  // High-value leads not contacted in 3+ days
  const staleLeads = db.prepare(`
    SELECT l.*, u.name as owner_name
    FROM leads l
    LEFT JOIN users u ON l.owner_id = u.id
    WHERE l.score >= 70
    AND l.status = 'new'
    AND l.created_at < datetime('now', '-3 days')
    ${ownerId ? 'AND l.owner_id = ?' : ''}
    ORDER BY l.score DESC
    LIMIT 5
  `).all(ownerId ? [ownerId] : []);

  // Deals about to close (expected close date within 7 days)
  const closingSoon = db.prepare(`
    SELECT d.*, c.name as contact_name
    FROM deals d
    LEFT JOIN contacts c ON d.contact_id = c.id
    WHERE d.stage IN ('proposal', 'negotiation')
    AND d.expected_close_date IS NOT NULL
    AND d.expected_close_date <= date('now', '+7 days')
    AND d.expected_close_date >= date('now')
    ${ownerId ? 'AND d.owner_id = ?' : ''}
    ORDER BY d.expected_close_date ASC
    LIMIT 5
  `).all(ownerId ? [ownerId] : []);

  // Overdue activities
  const overdueActivities = db.prepare(`
    SELECT a.*, u.name as owner_name
    FROM activities a
    LEFT JOIN users u ON a.owner_id = u.id
    WHERE a.status = 'pending'
    AND a.due_date < date('now')
    ${ownerId ? 'AND a.owner_id = ?' : ''}
    ORDER BY a.due_date ASC
    LIMIT 5
  `).all(ownerId ? [ownerId] : []);

  return {
    staleLeads: staleLeads.map(l => ({
      id: l.id,
      type: 'stale_lead',
      title: 'Lead chưa được liên hệ',
      description: `${l.name} từ ${l.company} chưa được liên hệ trong 3+ ngày`,
      priority: 'high',
      entityType: 'lead',
      entityId: l.id,
      entityName: l.name,
      ownerName: l.owner_name,
    })),
    closingSoon: closingSoon.map(d => ({
      id: d.id,
      type: 'closing_soon',
      title: 'Deal sắp đóng',
      description: `${d.title} (${formatCurrency(d.value)}) dự kiến đóng ngày ${d.expected_close_date}`,
      priority: 'medium',
      entityType: 'deal',
      entityId: d.id,
      entityName: d.title,
      contactName: d.contact_name,
    })),
    overdueActivities: overdueActivities.map(a => ({
      id: a.id,
      type: 'overdue_activity',
      title: 'Hoạt động quá hạn',
      description: `${a.title} - quá hạn từ ${a.due_date}`,
      priority: 'high',
      entityType: 'activity',
      entityId: a.id,
      entityName: a.title,
      ownerName: a.owner_name,
    })),
  };
}

function formatCurrency(value) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value || 0);
}

module.exports = { getCounts, getTrends, getLeadSources, getAIInsights };
```

**3.1.2 — Create server/src/services/dashboard-service.js**

```javascript
const dashboardRepo = require('../repositories/dashboard-repository');

function getStats(ownerId) {
  const counts = dashboardRepo.getCounts(ownerId);
  const trends = dashboardRepo.getTrends(ownerId, 30);

  // Calculate growth percentages
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().split('T')[0];

  const prevLeads = getPreviousPeriodCount('leads', ownerId, thirtyDaysAgoStr);
  const prevRevenue = getPreviousPeriodRevenue(ownerId, thirtyDaysAgoStr);

  const leadsGrowth = prevLeads > 0 ? Math.round(((counts.leads - prevLeads) / prevLeads) * 100) : 0;
  const revenueGrowth = prevRevenue > 0 ? Math.round(((counts.revenue - prevRevenue) / prevRevenue) * 100) : 0;

  // Calculate AI closing rate
  const aiClosingRate = counts.activeDeals > 0
    ? Math.round((counts.revenue / (counts.activeDeals * 1000000)) * 100)
    : 0;

  return {
    counts: {
      leads: counts.leads,
      activeCustomers: counts.activeCustomers,
      revenue: counts.revenue,
      aiClosingRate: Math.min(aiClosingRate, 99),
    },
    growth: {
      leads: leadsGrowth,
      revenue: revenueGrowth,
    },
    trends,
  };
}

function getInsights(ownerId) {
  return dashboardRepo.getAIInsights(ownerId);
}

function getReports(ownerId) {
  const leadSources = dashboardRepo.getLeadSources(ownerId);
  const trends = dashboardRepo.getTrends(ownerId, 90);

  return {
    leadSources,
    revenueTrend: trends.dealsWonByDay,
    dealsByStage: trends.dealsByStage,
  };
}

function getPreviousPeriodCount(table, ownerId, startDate) {
  const db = require('../repositories/db').getDb();
  if (table === 'leads') {
    const result = db.prepare(`
      SELECT COUNT(*) as count FROM leads WHERE created_at < ? ${ownerId ? 'AND owner_id = ?' : ''}
    `).get(startDate, ownerId ? [ownerId] : []);
    return result.count;
  }
  return 0;
}

function getPreviousPeriodRevenue(ownerId, startDate) {
  const db = require('../repositories/db').getDb();
  const result = db.prepare(`
    SELECT COALESCE(SUM(value), 0) as total FROM deals
    WHERE stage = 'won' AND updated_at < ? ${ownerId ? 'AND owner_id = ?' : ''}
  `).get(startDate, ownerId ? [ownerId] : []);
  return result.total;
}

module.exports = { getStats, getInsights, getReports };
```

**3.1.3 — Create server/src/routes/dashboard.js**

```javascript
const { get } = require('../router');
const { sendJson } = require('../main');
const { authMiddleware } = require('../middleware/auth');
const dashboardService = require('../services/dashboard-service');

get('/api/dashboard/stats', (req, res) => {
  authMiddleware(req, res, () => {
    const stats = dashboardService.getStats(req.user.id);
    sendJson(res, 200, stats);
  });
});

get('/api/dashboard/insights', (req, res) => {
  authMiddleware(req, res, () => {
    const insights = dashboardService.getInsights(req.user.id);
    sendJson(res, 200, { data: insights });
  });
});

get('/api/reports', (req, res) => {
  authMiddleware(req, res, () => {
    const reports = dashboardService.getReports(req.user.id);
    sendJson(res, 200, reports);
  });
});
```

---

## Task 3.2 — Global Search API

### Files to Create/Modify

| File | Action |
|------|--------|
| `server/src/repositories/search-repository.js` | NEW |
| `server/src/services/search-service.js` | NEW |
| `server/src/routes/search.js` | NEW |

### Steps

**3.2.1 — Create server/src/repositories/search-repository.js**

```javascript
const { getDb } = require('./db');

function search(query, ownerId, limit = 20) {
  const db = getDb();
  const s = `%${query}%`;
  const ownerClause = ownerId ? 'AND owner_id = ?' : '';

  const leads = db.prepare(`
    SELECT id, 'lead' as type, name as title, company, email, 'leads' as path
    FROM leads
    WHERE (name LIKE ? OR company LIKE ? OR email LIKE ?) ${ownerClause}
    LIMIT ?
  `).all(s, s, s, ownerId ? [...[s, s, s, ownerId], limit] : [s, s, s, limit]);

  const contacts = db.prepare(`
    SELECT id, 'contact' as type, name as title, company, email, 'contacts' as path
    FROM contacts
    WHERE (name LIKE ? OR company LIKE ? OR email LIKE ?) ${ownerClause}
    LIMIT ?
  `).all(s, s, s, ownerId ? [...[s, s, s, ownerId], limit] : [s, s, s, limit]);

  const deals = db.prepare(`
    SELECT id, 'deal' as type, title, value as meta, 'deals' as path
    FROM deals
    WHERE title LIKE ? ${ownerClause}
    LIMIT ?
  `).all(s, ownerId ? [s, ownerId, limit] : [s, limit]);

  return {
    leads: leads.map(l => ({ ...l, path: `/leads/${l.id}` })),
    contacts: contacts.map(c => ({ ...c, path: `/contacts/${c.id}` })),
    deals: deals.map(d => ({ ...d, meta: formatCurrency(d.meta), path: `/deals/${d.id}` })),
  };
}

function formatCurrency(value) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value || 0);
}

module.exports = { search };
```

**3.2.2 — Create server/src/services/search-service.js**

```javascript
const searchRepo = require('../repositories/search-repository');

function globalSearch(query, ownerId) {
  if (!query || query.trim().length < 2) {
    return { leads: [], contacts: [], deals: [] };
  }
  return searchRepo.search(query.trim(), ownerId, 20);
}

module.exports = { globalSearch };
```

**3.2.3 — Create server/src/routes/search.js**

```javascript
const { get } = require('../router');
const { sendJson } = require('../main');
const { authMiddleware } = require('../middleware/auth');
const searchService = require('../services/search-service');

get('/api/search', (req, res) => {
  authMiddleware(req, res, () => {
    const { q } = req.query;
    if (!q) return sendJson(res, 400, { error: 'Query parameter "q" is required' });

    const results = searchService.globalSearch(q, req.user.id);
    sendJson(res, 200, results);
  });
});
```

---

## Task 3.3 — Update main.js to Load New Routes

### Modify server/src/main.js

Add after existing route requires:

```javascript
require('./routes/dashboard');
require('./routes/search');
```

---

## Verification Steps

```bash
# Test dashboard stats
curl http://localhost:3001/api/dashboard/stats -H "Authorization: Bearer YOUR_TOKEN"

# Test AI insights
curl http://localhost:3001/api/dashboard/insights -H "Authorization: Bearer YOUR_TOKEN"

# Test reports
curl http://localhost:3001/api/reports -H "Authorization: Bearer YOUR_TOKEN"

# Test search
curl "http://localhost:3001/api/search?q=ABC" -H "Authorization: Bearer YOUR_TOKEN"
```

---

## File Summary

| File | Action |
|------|--------|
| `server/src/repositories/dashboard-repository.js` | NEW |
| `server/src/repositories/search-repository.js` | NEW |
| `server/src/services/dashboard-service.js` | NEW |
| `server/src/services/search-service.js` | NEW |
| `server/src/routes/dashboard.js` | NEW |
| `server/src/routes/search.js` | NEW |
| `server/src/main.js` | MODIFY — add route requires |