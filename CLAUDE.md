# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a URL shortening service built with Next.js that supports both SQLite (development) and MongoDB (production) databases. The application generates short URLs using nanoid and tracks click statistics.

## Common Development Commands

### Development
- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

### Database Management
- `npm run prisma:dev` - Generate Prisma client and push schema to SQLite (development)
- `npm run prisma:deploy` - Generate Prisma client and push schema to MongoDB (production)

### Docker Commands
- `docker-compose up -d` - Start MongoDB container for production testing
- Build production image: `docker build -t shortlink:latest .`

## Architecture

### Database Strategy
The project uses dual database schemas:
- **Development**: SQLite with `prisma/schema.prisma`
- **Production**: MongoDB with `prisma/schema.prod.prisma`

During Docker build, the production schema replaces the development one. The database provider is controlled by the `DATABASE_PROVIDER` environment variable.

### Core Components

**Database Model**: `ShortLink`
- `id`: Primary key (cuid)
- `url`: Original long URL
- `shortId`: Generated short identifier (5 characters, nanoid)
- `clicks`: Click counter (auto-incremented)
- `createdAt`: Timestamp

**API Routes**:
- `POST /api/shorten` - Creates shortened URL with duplicate handling
- `GET /[shortId]` - Redirects to original URL and increments click counter

**Database Connection**: `lib/prisma.ts` - Singleton Prisma client with global instance caching for development

### Environment Configuration

**Development (.env)**:
```env
DATABASE_PROVIDER="sqlite"
DATABASE_URL="file:./dev.db"
```

**Production (.env.production)**:
```env
DATABASE_PROVIDER="mongodb"
DATABASE_URL="mongodb://username:password@host:27017/dbname"
```

## Development Notes

### URL Shortening Logic
- Uses nanoid(5) for generating 5-character short IDs
- Implements retry logic (max 3 attempts) for handling duplicate shortId collisions
- Host header is used to construct the full short URL

### Error Handling
- URL validation using JavaScript URL constructor
- Prisma error handling for duplicate key violations (P2002)
- Proper HTTP status codes and Korean error messages

### Frontend Features
- Client-side form with loading states
- Clipboard copy functionality with visual feedback
- Responsive design with Tailwind CSS gradient styling

### Docker Deployment
- Multi-stage build optimizes image size
- Standalone output mode for containerization
- Non-root user execution for security
- Production schema swap during build process