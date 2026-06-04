# Deployment Guide - College Discovery Platform

## 🚀 Deployment Readiness Audit Results

### ✅ Current Status

**Build Status:** ✅ PASSING
- Production build completes successfully
- No TypeScript errors
- All routes compiled correctly
- Build output: 10 routes (4 static, 6 dynamic)

**Database:** ✅ CONFIGURED (needs migration)
- Prisma schema properly configured for PostgreSQL
- Connection pooling support added for Neon
- Schema includes all required models

---

## 🔧 Issues Fixed

### 1. Environment Variables Configuration ✅
- **Created:** `.env.example` with all required variables
- **Status:** Ready for production configuration

### 2. Prisma Configuration for Neon ✅
- **Added:** `directUrl` support for Neon connection pooling
- **Reason:** Neon uses connection pooling which requires separate URLs

### 3. Next.js Production Optimization ✅
- **Added:** Production-ready `next.config.ts` with:
  - Compression enabled
  - Security headers (removed `X-Powered-By`)
  - Image optimization (AVIF/WebP)
  - Standalone output for serverless deployment

### 4. Build Scripts Enhancement ✅
- **Added:** Prisma generation in build process
- **Added:** Database migration script
- **Added:** Postinstall hook for automated Prisma client generation

---

## 📋 Pre-Deployment Checklist

### Environment Setup
- [ ] Set up Neon PostgreSQL database
- [ ] Configure environment variables
- [ ] Test database connection
- [ ] Run migrations

### Code Verification
- [x] Production build successful
- [x] TypeScript compilation clean
- [x] API routes functional
- [ ] Run manual testing on staging
- [ ] Performance testing

### Security
- [x] Environment variables in `.env.example`
- [x] `.env` files in `.gitignore`
- [x] Sensitive data excluded from git
- [x] `X-Powered-By` header removed
- [ ] Add rate limiting (recommended)
- [ ] Add CORS configuration (if needed)

---

## 🗄️ Neon PostgreSQL Setup

### Step 1: Create Neon Project
1. Go to [neon.tech](https://neon.tech)
2. Create a new project
3. Select your preferred region
4. Note the connection strings provided

### Step 2: Get Connection Strings
Neon provides two connection strings:

**Pooled Connection (for application):**
```
postgresql://username:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require
```

**Direct Connection (for migrations):**
```
postgresql://username:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require&direct=true
```

### Step 3: Configure Environment Variables
Create `.env` file (DO NOT commit to git):

```bash
DATABASE_URL="postgresql://username:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require"
DIRECT_URL="postgresql://username:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require&direct=true"
NODE_ENV="production"
NEXT_PUBLIC_APP_URL="https://your-domain.com"
```

---

## 🚢 Deployment Options

### Option 1: Vercel (Recommended)

#### Why Vercel?
- Native Next.js support
- Zero-config deployment
- Automatic HTTPS
- Edge network CDN
- Free tier available

#### Deployment Steps:

1. **Install Vercel CLI:**
```bash
npm install -g vercel
```

2. **Login to Vercel:**
```bash
vercel login
```

3. **Configure Environment Variables:**
```bash
vercel env add DATABASE_URL
vercel env add DIRECT_URL
vercel env add NODE_ENV
```

4. **Deploy:**
```bash
# Preview deployment
vercel

# Production deployment
vercel --prod
```

5. **Run Database Migrations:**
```bash
# After first deployment, run migrations
npm run db:migrate

# Seed the database (first time only)
npm run db:seed
```

#### Vercel Dashboard Setup:
1. Go to your project in Vercel dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add all variables from `.env.example`
4. Redeploy to apply changes

---

### Option 2: Netlify

1. **Install Netlify CLI:**
```bash
npm install -g netlify-cli
```

2. **Login:**
```bash
netlify login
```

3. **Create `netlify.toml`:**
```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "20"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

4. **Deploy:**
```bash
netlify deploy --prod
```

---

### Option 3: Docker (Self-Hosted)

1. **Create `Dockerfile`:**
```dockerfile
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Rebuild source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED 1
RUN npx prisma generate
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

2. **Create `docker-compose.yml`:**
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - DIRECT_URL=${DIRECT_URL}
      - NODE_ENV=production
    restart: unless-stopped
```

3. **Build and run:**
```bash
docker-compose up -d
```

---

## 🔄 Database Migration Process

### Initial Setup (First Deployment):

```bash
# 1. Generate Prisma Client
npm run postinstall

# 2. Push schema to database (for first time setup)
npm run db:push

# 3. Seed the database with college data
npm run db:seed
```

### For Subsequent Deployments:

```bash
# Run migrations only
npm run db:migrate
```

---

## 🧪 Pre-Deployment Testing

### Local Production Build Test:
```bash
# 1. Set environment to production
$env:NODE_ENV="production"  # Windows PowerShell
# OR
set NODE_ENV=production     # Windows CMD

# 2. Build
npm run build

# 3. Start production server
npm start

# 4. Test at http://localhost:3000
```

### Database Connection Test:
Create a test script `test-db.js`:
```javascript
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const count = await prisma.college.count();
  console.log(`✅ Database connected! Colleges: ${count}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

Run: `node test-db.js`

---

## ⚡ Performance Optimization

### 1. Database Indexing
Already configured in schema:
- ✅ Cutoff search index on `examName`, `category`, `closingRank`
- ✅ Unique constraints on slugs and user-college combinations

### 2. Next.js Optimizations Applied:
- ✅ Standalone output mode (smaller deployment)
- ✅ Image optimization (AVIF/WebP)
- ✅ Gzip compression
- ✅ Static generation where possible

### 3. Recommended: Add Caching
Consider adding Redis or Vercel KV for:
- Search results caching
- College detail caching
- Predictor results caching

---

## 🔒 Security Recommendations

### Immediate Actions:
1. **Environment Variables:** Never commit `.env` files
2. **HTTPS Only:** Ensure all deployments use HTTPS
3. **Database Credentials:** Rotate after deployment

### Future Enhancements:
1. **Rate Limiting:** Add API rate limiting
   ```bash
   npm install @upstash/ratelimit @upstash/redis
   ```

2. **CORS Configuration:** If building mobile app later
   ```typescript
   // In API routes
   headers: {
     'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN,
   }
   ```

3. **Input Sanitization:** Already using Zod validation ✅

4. **SQL Injection Protection:** Prisma provides this ✅

---

## 📊 Monitoring & Logging

### Recommended Services:

1. **Error Tracking:**
   - Sentry (https://sentry.io)
   - Rollbar

2. **Analytics:**
   - Vercel Analytics (built-in)
   - Google Analytics
   - PostHog

3. **Performance Monitoring:**
   - Vercel Speed Insights
   - New Relic
   - Datadog

### Add Sentry (Example):
```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

---

## 🎯 Deployment Steps Summary

### Quick Start (Vercel - Recommended):

```bash
# 1. Setup Neon database
# Visit neon.tech and create project

# 2. Configure environment
cp .env.example .env
# Edit .env with your Neon credentials

# 3. Test build locally
npm run build
npm start

# 4. Deploy to Vercel
vercel --prod

# 5. Set environment variables in Vercel dashboard

# 6. Run migrations
npm run db:migrate
npm run db:seed

# 7. Visit your production URL
```

---

## ✅ Post-Deployment Verification

1. **Health Checks:**
   - [ ] Homepage loads: `https://your-domain.com`
   - [ ] API responds: `https://your-domain.com/api/colleges`
   - [ ] Search works: `https://your-domain.com/api/colleges/search?q=IIT`
   - [ ] Predictor works: `https://your-domain.com/api/predictor?examName=JEE&category=GEN&rank=5000`
   - [ ] College details: `https://your-domain.com/colleges/[slug]`

2. **Database Verification:**
   - [ ] Colleges are seeded
   - [ ] Queries return data
   - [ ] No connection errors in logs

3. **Performance Checks:**
   - [ ] Page load time < 3s
   - [ ] API response time < 500ms
   - [ ] Lighthouse score > 90

---

## 🐛 Troubleshooting

### Issue: "Cannot connect to database"
**Solution:**
- Verify `DATABASE_URL` is correct
- Check Neon project is active
- Ensure IP allowlist includes deployment platform
- Verify SSL mode is `require`

### Issue: "Module not found: Can't resolve '@prisma/client'"
**Solution:**
```bash
npm run postinstall
```

### Issue: Build fails with Prisma error
**Solution:**
```bash
npx prisma generate
npm run build
```

### Issue: 500 error on API routes
**Solution:**
- Check server logs
- Verify environment variables are set
- Test database connection
- Check Prisma Client is generated

---

## 📞 Support Resources

- **Next.js Docs:** https://nextjs.org/docs
- **Vercel Docs:** https://vercel.com/docs
- **Neon Docs:** https://neon.tech/docs
- **Prisma Docs:** https://www.prisma.io/docs

---

## 🎉 Deployment Complete!

Your college discovery platform is now ready for production deployment. Follow the steps above based on your chosen platform.

**Recommended Next Steps:**
1. Set up monitoring and error tracking
2. Configure custom domain
3. Set up CI/CD pipeline
4. Plan for scaling based on traffic
5. Implement authentication (future phase)

Good luck with your deployment! 🚀
