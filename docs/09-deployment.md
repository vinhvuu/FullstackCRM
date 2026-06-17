# 9. Deployment

## 9.1 Project Structure for Deployment

```
crm_project/
├── server/                 # Backend Node.js
│   ├── src/
│   ├── data/               # SQLite database
│   ├── logs/              # Log files
│   ├── package.json
│   └── .env
├── client/                 # Frontend Next.js
│   ├── app/
│   ├── components/
│   ├── package.json
│   └── .env.local
├── docs/                   # Documentation
├── docker-compose.yml      # Docker setup
└── README.md
```

## 9.2 Environment Variables

### Server (.env)

```env
# Server
PORT=3000
NODE_ENV=production

# JWT
JWT_SECRET=your-super-secret-key-change-this-in-production

# CORS
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Database
DB_PATH=./data/crm.db
```

### Client (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## 9.3 Production Docker Setup

### Dockerfile (Backend)

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY server/package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source
COPY server/ .

# Create data directory
RUN mkdir -p data logs

# Expose port
EXPOSE 3000

# Start command
CMD ["node", "src/main.js"]
```

### Dockerfile (Frontend)

```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

COPY client/package*.json ./
RUN npm ci

COPY client/ .
RUN npm run build

FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

CMD ["npm", "start"]
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  backend:
    build:
      context: .
      dockerfile: Dockerfile.backend
    ports:
      - "3000:3000"
    volumes:
      - ./server/data:/app/data
      - ./server/logs:/app/logs
    environment:
      - NODE_ENV=production
      - PORT=3000
      - JWT_SECRET=${JWT_SECRET}
      - ALLOWED_ORIGINS=${ALLOWED_ORIGINS}
    restart: unless-stopped
    networks:
      - crm-network

  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    ports:
      - "3001:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:3000/api
    depends_on:
      - backend
    restart: unless-stopped
    networks:
      - crm-network

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/ssl:/etc/nginx/ssl:ro
    depends_on:
      - backend
      - frontend
    restart: unless-stopped
    networks:
      - crm-network

networks:
  crm-network:
    driver: bridge
```

### nginx.conf

```nginx
events {
  worker_connections 1024;
}

http {
  # Upstream servers
  upstream backend {
    server backend:3000;
  }

  upstream frontend {
    server frontend:3000;
  }

  # Rate limiting zones
  limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;

  server {
    listen 80;
    server_name crm.yourdomain.com;

    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
  }

  server {
    listen 443 ssl http2;
    server_name crm.yourdomain.com;

    # SSL configuration
    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;
    ssl_prefer_server_ciphers off;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # API routes
    location /api/ {
      limit_req zone=api burst=20 nodelay;

      proxy_pass http://backend;
      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection 'upgrade';
      proxy_set_header Host $host;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header X-Forwarded-Proto $scheme;
      proxy_cache_bypass $http_upgrade;
    }

    # Frontend
    location / {
      proxy_pass http://frontend;
      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection 'upgrade';
      proxy_set_header Host $host;
      proxy_cache_bypass $http_upgrade;
    }

    # Health check endpoint
    location /health {
      proxy_pass http://backend;
      access_log off;
    }
  }
}
```

## 9.4 Manual Deployment

### Server Setup

```bash
# SSH to server
ssh user@your-server

# Create app directory
mkdir -p /var/www/crm
cd /var/www/crm

# Clone repo
git clone https://github.com/yourrepo/crm.git .

# Install backend dependencies
cd server
npm ci --only=production

# Setup environment
cp .env.example .env
nano .env  # Edit with production values

# Initialize database
node src/repositories/db.js

# Start with systemd
sudo cp crm.service /etc/systemd/system/
sudo systemctl enable crm
sudo systemctl start crm
```

### crm.service (systemd)

```ini
[Unit]
Description=VanhCorp CRM Backend
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/crm/server
ExecStart=/usr/bin/node src/main.js
Restart=on-failure
RestartSec=10
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

### Frontend Build

```bash
cd client

# Build for production
npm run build

# The output is in .next/
# Serve with nginx or Vercel
```

## 9.5 Database Backup

```bash
# Backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR=/var/backups/crm
mkdir -p $BACKUP_DIR

# Copy database file
cp /var/www/crm/server/data/crm.db $BACKUP_DIR/crm_$DATE.db

# Compress
gzip $BACKUP_DIR/crm_$DATE.db

# Keep only last 30 days
find $BACKUP_DIR -name "crm_*.db.gz" -mtime +30 -delete

# Upload to S3 (optional)
# aws s3 cp $BACKUP_DIR/crm_$DATE.db.gz s3://your-bucket/crm-backups/
```

## 9.6 Monitoring

### Health Check Endpoint

```javascript
// src/routes/health.js

function healthCheck(req, res) {
  const db = require('../repositories/db').getDb();

  try {
    // Check database
    db.prepare('SELECT 1').get();

    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: 'connected'
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      error: error.message
    });
  }
}

module.exports = healthCheck;
```

### PM2 for Process Management

```bash
# Install PM2
npm install -g pm2

# Start app
cd server
pm2 start src/main.js --name crm-backend

# Save process list
pm2 save

# Setup startup script
pm2 startup

# Monitor
pm2 monit

# Logs
pm2 logs crm-backend

# Restart on file changes
pm2 start src/main.js --name crm-backend --watch
```

## 9.7 Security Hardening

### Server Firewall (UFW)

```bash
# Enable UFW
sudo ufw enable

# Allow SSH
sudo ufw allow 22/tcp

# Allow HTTP/HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Allow app port (internal)
sudo ufw allow 3000/tcp

# Default deny incoming
sudo ufw default deny incoming
```

### Fail2ban

```bash
# Install
sudo apt install fail2ban

# Configure
sudo nano /etc/fail2ban/jail.local
```

```ini
[sshd]
enabled = true
port = 22
maxretry = 3
bantime = 3600

[http-get-dos]
enabled = true
port = http,https
filter = http-get-dos
logpath = /var/log/nginx/access.log
maxretry = 100
findtime = 60
bantime = 600
```

## 9.8 CI/CD with GitHub Actions

```yaml
# .github/workflows/deploy.yml

name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: |
          npm ci
          cd server && npm ci --only=production

      - name: Run tests
        run: npm test

      - name: Build frontend
        run: |
          cd client
          npm ci
          npm run build

      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SERVER_SSH_KEY }}
          script: |
            cd /var/www/crm
            git pull
            cd server && npm ci --only=production
            pm2 restart crm-backend
            cd ../client && npm run build
```

## 9.9 Checklist trước khi deploy

- [ ] Đặt `JWT_SECRET` mạnh và duy nhất
- [ ] Cấu hình `ALLOWED_ORIGINS` đúng domain
- [ ] Bật HTTPS
- [ ] Setup backup database
- [ ] Cấu hình rate limiting
- [ ] Test trên staging trước
- [ ] Logs được ghi ra file
- [ ] Monitoring setup
- [ ] Firewall configured
- [ ] Dependencies được update
