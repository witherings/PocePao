# Railway Deployment Guide

This guide explains how to deploy this application to Railway.app with proper database connectivity.

## Quick Setup

### 1. Create Railway Project

1. Go to [Railway.app](https://railway.app) and create a new project
2. Add a **PostgreSQL** database service to your project
3. Add a **Web Service** (your Node.js application)

### 2. Configure Environment Variables

In your Railway **Web Service**, add the following environment variables:

#### Required Variables

```bash
# Database Connection (use Railway's private networking)
DATABASE_URL=${{Postgres.DATABASE_PRIVATE_URL}}

# Session Secret (generate a random string)
SESSION_SECRET=your-random-secret-key-here

# Admin Credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-secure-password-here

# Node Environment
NODE_ENV=production

# Railway Environment Flag
RAILWAY_ENVIRONMENT=production
```

#### Alpine Linux Fix (if needed)

If your deployment uses an Alpine-based Docker image and you see `ENOTFOUND postgres.railway.internal` errors, add:

```bash
ENABLE_ALPINE_PRIVATE_NETWORKING=true
```

### 3. Deploy Configuration

The project includes a `railway.json` file that configures:
- Build command: `npm install && npm run build`
- Start command: `npm run railway:up`
- Healthcheck endpoint: `/api/health`

Railway will automatically detect and use this configuration.

### 4. Deployment Process

When you deploy, the following happens automatically:

1. **Build Phase**: Dependencies are installed and frontend is built
2. **Startup Phase**:
   - 3-second delay for private network initialization
   - Database schema is pushed (`npm run db:push`)
   - Database is seeded with initial data (`npm run db:seed`)
   - Admin user is created (`npm run db:create-admin`)
   - Application server starts (`npm run start`)

## Database Connection Features

### Robust Connection Handling

The application includes advanced Railway-specific database connection handling:

- **Connection Retry Logic**: 5 attempts with exponential backoff
- **Private Network Delay**: 3-second initialization wait in production
- **Detailed Error Logging**: Helps diagnose connection issues
- **IPv6 Support**: Works with Railway's IPv6-only private network
- **Connection Pooling**: Optimized pool settings for Railway

### Testing Database Connection

You can test the database connection manually:

```bash
npm run db:test
```

This will:
- Attempt to connect to the database
- Show PostgreSQL version and server time
- Verify Drizzle ORM initialization
- Report any connection errors with details

## Troubleshooting

### Error: `ENOTFOUND postgres.railway.internal`

**Cause**: Private network DNS resolution failed

**Solutions**:
1. Add `ENABLE_ALPINE_PRIVATE_NETWORKING=true` to environment variables
2. Verify both services are in the same Railway project
3. Ensure PostgreSQL service is deployed and running
4. Check that you're using `DATABASE_PRIVATE_URL` not `DATABASE_PUBLIC_URL`

### Error: `Connection timeout`

**Cause**: Database is slow to start or network is congested

**Solutions**:
1. The app retries 5 times automatically - wait for retry attempts
2. Check Railway service logs for database startup status
3. Verify your Railway project isn't experiencing outages

### Database Changes Not Applied

**Cause**: Schema changes need to be pushed

**Solution**:
Run the database push command in Railway:
```bash
npm run db:push
```

Or redeploy the service to run the full `railway:up` script.

## Environment Variable Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | Yes | - | PostgreSQL connection string (use `${{Postgres.DATABASE_PRIVATE_URL}}`) |
| `SESSION_SECRET` | Yes | - | Secret key for session encryption |
| `ADMIN_USERNAME` | No | `admin` | Initial admin username |
| `ADMIN_PASSWORD` | Yes | - | Initial admin password |
| `NODE_ENV` | No | `production` | Node environment |
| `PORT` | No | `5000` | Server port (Railway sets automatically) |
| `RAILWAY_ENVIRONMENT` | No | - | Set to `production` to enable Railway optimizations |
| `ENABLE_ALPINE_PRIVATE_NETWORKING` | No | - | Set to `true` if using Alpine Linux |

## Database Schema Management

### Push Schema Changes

```bash
npm run db:push
```

Applies your Drizzle schema to the database (creates/updates tables).

### Seed Database

```bash
npm run db:seed
```

Populates the database with initial data (categories, menu items, ingredients).

### Create Admin User

```bash
npm run db:create-admin
```

Creates an admin user with credentials from environment variables.

## Production Checklist

Before deploying to production:

- [ ] Set a strong `SESSION_SECRET` (minimum 32 characters)
- [ ] Set a strong `ADMIN_PASSWORD`
- [ ] Verify `DATABASE_URL` uses `DATABASE_PRIVATE_URL` reference
- [ ] Set `NODE_ENV=production`
- [ ] Add `ENABLE_ALPINE_PRIVATE_NETWORKING=true` if using Alpine
- [ ] Test database connection with `npm run db:test`
- [ ] Verify healthcheck endpoint responds at `/api/health`

## Support

If you continue to experience connection issues:

1. Check Railway's [status page](https://status.railway.app/)
2. Review [Railway's private networking documentation](https://docs.railway.com/guides/private-networking)
3. Examine deployment logs in the Railway dashboard
4. Use `npm run db:test` to diagnose connection problems
