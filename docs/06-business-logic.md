# 6. Business Logic

## 6.1 Lead Scoring

Lead score từ 0-100, tự động tính dựa trên:

```javascript
// src/services/leadService.js

function calculateScore(lead) {
  let score = 0;

  // Email provided (+10)
  if (lead.email) score += 10;

  // Phone provided (+10)
  if (lead.phone) score += 10;

  // Company provided (+15)
  if (lead.company) score += 15;

  // Source quality
  const sourceScores = {
    'referral': 25,
    'website': 15,
    'linkedin': 20,
    'cold_call': 5,
    'conference': 20,
    'other': 10
  };
  score += sourceScores[lead.source] || 10;

  // Status progression
  const statusScores = {
    'new': 0,
    'contacted': 10,
    'qualified': 30,
    'won': 50,
    'lost': -20
  };
  score += statusScores[lead.status] || 0;

  // Cap at 100
  return Math.min(100, Math.max(0, score));
}

function updateLeadScore(leadId) {
  const db = getDb();
  const lead = db.prepare('SELECT * FROM leads WHERE id = ?').get(leadId);

  if (!lead) return null;

  const newScore = calculateScore(lead);
  db.prepare('UPDATE leads SET score = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
    .run(newScore, leadId);

  return newScore;
}
```

## 6.2 Deal Stage Transitions

```
lead ──> qualified ──> proposal ──> negotiation ──> won
  │         │             │             │
  │         │             │             │
  └─────────┴─────────────┴─────────────┴───> lost
```

### Validation Rules

```javascript
// src/services/dealService.js

const VALID_STAGES = ['lead', 'qualified', 'proposal', 'negotiation', 'won', 'lost'];
const STAGE_ORDER = ['lead', 'qualified', 'proposal', 'negotiation'];

function canTransitionTo(currentStage, newStage) {
  // Can always go to 'lost'
  if (newStage === 'lost') return true;

  // Can't transition from 'won' or 'lost'
  if (currentStage === 'won' || currentStage === 'lost') {
    return false;
  }

  // Can go forward one step or skip one step
  const currentIndex = STAGE_ORDER.indexOf(currentStage);
  const newIndex = STAGE_ORDER.indexOf(newStage);

  return newIndex >= currentIndex && newIndex - currentIndex <= 2;
}

function validateStageTransition(dealId, newStage) {
  if (!VALID_STAGES.includes(newStage)) {
    throw {
      status: 400,
      code: 'INVALID_STAGE',
      message: `Stage must be one of: ${VALID_STAGES.join(', ')}`
    };
  }

  const db = getDb();
  const deal = db.prepare('SELECT stage FROM deals WHERE id = ?').get(dealId);

  if (!canTransitionTo(deal.stage, newStage)) {
    throw {
      status: 400,
      code: 'INVALID_TRANSITION',
      message: `Cannot transition from '${deal.stage}' to '${newStage}'`
    };
  }
}

function updateDealStage(dealId, newStage, userId) {
  validateStageTransition(dealId, newStage);

  const db = getDb();
  const now = new Date().toISOString();

  let updateQuery = 'UPDATE deals SET stage = ?, updated_at = ?';
  const params = [newStage, now];

  // Set actual_close_date if deal is won or lost
  if (newStage === 'won' || newStage === 'lost') {
    updateQuery += ', actual_close_date = ?';
    params.push(now.split('T')[0]);
  }

  updateQuery += ' WHERE id = ?';
  params.push(dealId);

  db.prepare(updateQuery).run(...params);

  // Log activity
  createActivity({
    owner_id: userId,
    deal_id: dealId,
    type: 'note',
    description: `Deal stage changed to ${newStage}`
  });

  return getDealById(dealId);
}
```

## 6.3 Deal Value Calculation

```javascript
// Calculate weighted deal value based on probability
function calculateWeightedValue(deal) {
  return deal.value * (deal.probability / 100);
}

// Get pipeline value
function getPipelineStats(ownerId) {
  const db = getDb();

  const deals = db.prepare(`
    SELECT stage, value, probability
    FROM deals
    WHERE owner_id = ? AND stage NOT IN ('won', 'lost')
  `).all(ownerId);

  let totalValue = 0;
  let weightedValue = 0;

  deals.forEach(deal => {
    totalValue += deal.value;
    weightedValue += calculateWeightedValue(deal);
  });

  return {
    totalDeals: deals.length,
    totalValue,
    weightedValue: Math.round(weightedValue)
  };
}
```

## 6.4 Activity Scheduling

```javascript
// Auto-schedule follow-up activities
function scheduleFollowUp(leadId, ownerId, type = 'call') {
  const db = getDb();

  const lead = db.prepare('SELECT * FROM leads WHERE id = ?').get(leadId);
  if (!lead) return null;

  // Determine due date based on lead status
  let dueDate = new Date();
  switch (lead.status) {
    case 'new':
      dueDate.setDate(dueDate.getDate() + 1); // 1 day for new leads
      break;
    case 'contacted':
      dueDate.setDate(dueDate.getDate() + 3); // 3 days
      break;
    case 'qualified':
      dueDate.setDate(dueDate.getDate() + 7); // 1 week
      break;
    default:
      dueDate.setDate(dueDate.getDate() + 7);
  }

  const activity = db.prepare(`
    INSERT INTO activities (owner_id, lead_id, type, description, due_date)
    VALUES (?, ?, ?, ?, ?)
  `).run(
    ownerId,
    leadId,
    type,
    `Follow up with ${lead.name}`,
    dueDate.toISOString()
  );

  return activity.lastInsertRowid;
}
```

## 6.5 Dashboard Statistics

```javascript
// src/services/dashboardService.js

function getDashboardStats(userId) {
  const db = getDb();

  // Leads stats
  const leadsStats = db.prepare(`
    SELECT
      COUNT(*) as total,
      SUM(CASE WHEN status = 'new' THEN 1 ELSE 0 END) as newCount,
      SUM(CASE WHEN status = 'contacted' THEN 1 ELSE 0 END) as contactedCount,
      SUM(CASE WHEN status = 'qualified' THEN 1 ELSE 0 END) as qualifiedCount,
      SUM(CASE WHEN status = 'won' THEN 1 ELSE 0 END) as wonCount,
      SUM(CASE WHEN status = 'lost' THEN 1 ELSE 0 END) as lostCount,
      AVG(score) as avgScore
    FROM leads
    WHERE owner_id = ?
  `).get(userId);

  // Deals stats
  const dealsStats = db.prepare(`
    SELECT
      COUNT(*) as total,
      SUM(value) as totalValue,
      AVG(probability) as avgProbability,
      SUM(CASE WHEN stage = 'won' THEN value ELSE 0 END) as wonValue,
      SUM(CASE WHEN stage = 'won' THEN 1 ELSE 0 END) as wonCount
    FROM deals
    WHERE owner_id = ?
  `).get(userId);

  // Activities pending
  const activitiesStats = db.prepare(`
    SELECT COUNT(*) as pending
    FROM activities
    WHERE owner_id = ? AND status = 'pending' AND due_date <= datetime('now')
  `).get(userId);

  // Recent activities
  const recentActivities = db.prepare(`
    SELECT a.*, l.name as lead_name
    FROM activities a
    LEFT JOIN leads l ON a.lead_id = l.id
    WHERE a.owner_id = ?
    ORDER BY a.created_at DESC
    LIMIT 5
  `).all(userId);

  return {
    leads: {
      total: leadsStats.total,
      byStatus: {
        new: leadsStats.newCount,
        contacted: leadsStats.contactedCount,
        qualified: leadsStats.qualifiedCount,
        won: leadsStats.wonCount,
        lost: leadsStats.lostCount
      },
      avgScore: Math.round(leadsStats.avgScore || 0)
    },
    deals: {
      total: dealsStats.total,
      totalValue: dealsStats.totalValue || 0,
      avgProbability: Math.round(dealsStats.avgProbability || 0),
      wonValue: dealsStats.wonValue || 0,
      winRate: dealsStats.wonCount > 0
        ? Math.round((dealsStats.wonCount / dealsStats.total) * 100)
        : 0
    },
    activities: {
      overdue: activitiesStats.pending
    },
    recentActivities
  };
}
```

## 6.6 Data Validation Rules

```javascript
// src/services/validationService.js

const VALIDATION_RULES = {
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Invalid email format'
  },
  password: {
    required: true,
    minLength: 8,
    message: 'Password must be at least 8 characters'
  },
  name: {
    required: true,
    minLength: 2,
    maxLength: 100,
    message: 'Name must be between 2 and 100 characters'
  },
  phone: {
    required: false,
    pattern: /^[\d\s\-+()]*$/,
    message: 'Invalid phone format'
  },
  leadScore: {
    min: 0,
    max: 100,
    message: 'Score must be between 0 and 100'
  },
  dealValue: {
    min: 0,
    message: 'Value must be a positive number'
  }
};

function validateField(name, value, rules) {
  const errors = [];

  if (rules.required && (!value && value !== 0)) {
    errors.push({ field: name, message: `${name} is required` });
    return errors;
  }

  if (value && rules.minLength && value.length < rules.minLength) {
    errors.push({ field: name, message: rules.message });
  }

  if (value && rules.maxLength && value.length > rules.maxLength) {
    errors.push({ field: name, message: rules.message });
  }

  if (value && rules.pattern && !rules.pattern.test(value)) {
    errors.push({ field: name, message: rules.message });
  }

  if (value && rules.min !== undefined && value < rules.min) {
    errors.push({ field: name, message: rules.message });
  }

  if (value && rules.max !== undefined && value > rules.max) {
    errors.push({ field: name, message: rules.message });
  }

  return errors;
}

function validate(data, schema) {
  const errors = [];

  for (const [field, rules] of Object.entries(schema)) {
    const fieldErrors = validateField(field, data[field], rules);
    errors.push(...fieldErrors);
  }

  return errors;
}
```
