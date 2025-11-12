# PokePao Poke Bowl Café

## Overview

PokePao is a modern food e-commerce website for a Hamburg-based Hawaiian poke bowl restaurant. The application enables customers to browse the menu, add items to their cart, and learn about the restaurant. Built as a full-stack web application with a React frontend and Express backend, it follows a food delivery platform design approach inspired by Uber Eats and DoorDash, combined with fresh, health-focused restaurant aesthetics.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- **React 18** with TypeScript for type-safe component development
- **Vite** as the build tool and development server for fast HMR (Hot Module Replacement)
- **Wouter** for lightweight client-side routing instead of React Router

**UI Component System**
- **shadcn/ui** component library built on Radix UI primitives
- **Tailwind CSS** for utility-first styling with custom design tokens
- Custom design system with ocean blue (#33A9D9) and sunset orange (#F26522) brand colors
- Poppins font for headings, Lato for body text

**State Management**
- **TanStack Query (React Query)** for server state management and data fetching
- **Zustand** with persist middleware for client-side cart state management
- Cart data persisted to localStorage for session continuity

**Key Design Patterns**
- Component-based architecture with reusable UI components
- Custom hooks for mobile detection and toast notifications
- Form validation using React Hook Form with Zod resolvers
- Responsive design with mobile-first approach

### Backend Architecture

**Server Framework**
- **Express.js** on Node.js for RESTful API endpoints
- **TypeScript** for type safety across the stack
- Custom middleware for request logging and error handling

**API Design**
- RESTful endpoints for categories and menu items
- Resource-based URL structure (`/api/categories`, `/api/menu-items`)
- Support for filtering menu items by category
- JSON request/response format

**Data Access Layer**
- Abstracted storage interface (`IStorage`) for data operations
- **Dual storage implementation:**
  - `DatabaseStorage` - PostgreSQL via Drizzle ORM (when DATABASE_URL is set)
  - `MemStorage` - In-memory fallback (for development without database)
- Automatic selection based on environment configuration
- Graceful fallback ensures app works in all environments

### Data Storage

**Current Implementation (Updated: October 2025)**
- **Primary:** PostgreSQL database via Neon serverless (production-ready)
- **Fallback:** In-memory storage (development/testing without DATABASE_URL)
- Database schema includes: categories, menu items, reservations, gallery images
- Automatic database seeding on first run (when using PostgreSQL)
- Cart data stored client-side in browser localStorage via Zustand persist

**Database Schema (Active)**
- **Drizzle ORM** with PostgreSQL Neon serverless driver
- Tables: `categories`, `menu_items`, `reservations`, `gallery_images`
- UUID primary keys with auto-generation via `gen_random_uuid()`
- Foreign key relationships between menu items and categories
- Support for bilingual content (English/German) with separate fields
- Database connection: `server/db.ts`
- Storage layer: `server/storage.ts`

**Schema Design Rationale**
- Normalized data structure to avoid duplication
- Boolean flags stored as integers (0/1) for availability and popularity
- Decimal type for precise price storage
- Separate language fields rather than JSON for better queryability
- Conditional initialization supports both local development and production

### External Dependencies

**Core Libraries**
- `@tanstack/react-query` - Server state management and caching
- `zustand` - Lightweight state management for cart
- `drizzle-orm` - Type-safe SQL ORM (configured for future use)
- `@neondatabase/serverless` - PostgreSQL driver for serverless environments

**UI Component Libraries**
- `@radix-ui/*` - Accessible, unstyled UI primitives (dialogs, dropdowns, tooltips, etc.)
- `tailwindcss` - Utility-first CSS framework
- `class-variance-authority` - Type-safe component variants
- `embla-carousel-react` - Carousel/slider functionality

**Form Handling**
- `react-hook-form` - Performant form management
- `zod` - Schema validation
- `@hookform/resolvers` - Integration between react-hook-form and Zod

**Development Tools**
- `tsx` - TypeScript execution for development
- `esbuild` - Fast JavaScript bundler for production builds
- `@replit/*` plugins - Development environment enhancements (error overlay, cartographer, dev banner)

**Icons & Fonts**
- `lucide-react` - Icon library
- `react-icons` - Additional icon sets (FontAwesome for social media)
- Google Fonts (Poppins, Lato) loaded via CDN

**Session Management**
- `express-session` with `connect-pg-simple` - Configured for PostgreSQL session storage
- Session data prepared for database persistence

**Third-Party Integrations**
- Food delivery platforms: Lieferando, Wolt, Uber Eats (external links)
- Social media: WhatsApp, Instagram, TikTok (external links)
- Google Fonts API for typography

## Deployment

### Vercel Deployment (Fully Configured: October 21, 2025)

**Production Build Setup:**
- Build command: `npm run build` (builds frontend only)
- Output: Frontend → `dist/public` (served by Vercel CDN)
- Backend: Serverless functions in `api/index.ts`
- Configuration: `vercel.json` with proper routing

**Dual Environment Support:**
- **Replit:** Uses WebSocket for Neon connection, full Express server
- **Vercel:** Uses HTTP/Fetch for Neon connection, serverless functions
- Automatic environment detection via `process.env.VERCEL`

**Database Configuration:**
- `server/db.ts` automatically selects connection method based on environment
- Vercel: HTTP-based Neon driver with `fetchConnectionCache`
- Replit: WebSocket-based connection with `ws` module
- Works seamlessly in both environments without code changes

**Requirements for Production:**
1. PostgreSQL database (Neon recommended for serverless)
2. Environment variables in Vercel: `DATABASE_URL`, `NODE_ENV=production`
3. Database schema applied via `npm run db:push`
4. Database seeded with initial data (if needed)

**Deployment Files:**
- `vercel.json` - Routing configuration (API, images, SPA)
- `api/index.ts` - Serverless function handler
- `VERCEL_DEPLOYMENT.md` - Step-by-step deployment guide

**Key Features:**
✅ API routes (`/api/*`) handled by serverless functions
✅ Static images (`/images/*`) served by serverless with fallback
✅ SPA routing with proper fallback to `index.html`
✅ No code changes needed between Replit and Vercel
✅ Database connection automatically adapts to environment

See `VERCEL_DEPLOYMENT.md` for complete deployment instructions.

## Recent Changes

### October 21, 2025 (Latest - Production Optimization Complete)
- ✅ **Repository Cleanup Complete**: Removed ALL 141 unused files from attached_assets and public/images, freeing ~65-75MB of storage
- ✅ **Order Schema Fixed**: Updated Order schema with proper pickupTime/tableNumber validation using Zod .refine() for serviceType-specific requirements
- ✅ **SendGrid Email Notifications**: Implemented complete notification system using @sendgrid/mail for order and reservation alerts
- ✅ **Asset Management Optimized**: Deleted attached_assets folder entirely - all images now served from public/images exclusively
- ✅ **Code References Updated**: Fixed About.tsx and Menu.tsx to use /images/* paths instead of @assets imports
- ✅ **Deployment Ready**: Verified by architect - application ready for production deployment on Vercel
- ✅ **Documentation Created**: Added NOTIFICATIONS_SETUP.md and DEPLOYMENT_READY.md with comprehensive setup guides
- ✅ **Design Recommendations**: Created DESIGN_RECOMMENDATIONS.md with UI/UX improvement suggestions

### October 21, 2025 (Earlier - Vercel Deployment Fix)
- ✅ **Fixed Vercel deployment configuration**: Corrected `server/db.ts` to use HTTP/Fetch for Neon on Vercel instead of WebSocket
- ✅ **Created serverless function handler**: Added `api/index.ts` to handle all API and image requests on Vercel
- ✅ **Fixed routing configuration**: Updated `vercel.json` to use routes instead of rewrites, preserving full path information
- ✅ **Simplified build script**: Changed `npm run build` to only build frontend (Vercel handles serverless functions automatically)
- ✅ **Dual environment support**: Code now automatically detects Vercel vs Replit and uses appropriate connection method
- ✅ **Tested on Replit**: Verified all API endpoints work correctly (categories, menu items, ingredients, gallery)
- ✅ **Updated documentation**: Created comprehensive `VERCEL_DEPLOYMENT.md` with step-by-step instructions

### October 20, 2025 (Production Polish)
- ✅ **Repository Cleanup**: Removed ~48 unused files (5 HTML, 3 TXT, 1 MD, 28 screenshots, duplicate images) saving significant storage space
- ✅ **Premium Badge Design**: Redesigned "Beliebt" badge with premium gradient (yellow→orange→red) and animations (shimmer + pulse-glow)
- ✅ **Enhanced Hover Effects**: Added smooth hover transitions to menu cards (scale, shadow, border) and CTA buttons
- ✅ **Performance Optimization**: Implemented lazy loading (`loading="lazy"`) for all images across Menu, BowlBuilder, MenuItemDialog, About, and Gallery components
- ✅ **Accessibility Fixes**: Added DialogDescription components to all dialogs (BowlBuilderDialog, MenuItemDialog) for WCAG compliance
- ✅ **Badge Consistency**: Updated MenuItemDialog to use the new premium gradient badge design matching Menu page

### October 20, 2025 (Earlier - Core Features)
- ✅ Fixed all marinade image paths in Bowl Builder from stock images to proper wunschbowl images
- ✅ Added authentic marinade images (Capri, Gozo, Lanai, Maui) to replace placeholder stock images
- ✅ Implemented auto-scroll to top functionality in Bowl Builder when navigating between steps
- ✅ Added additional "Bowl fertigstellen" button at bottom of toppings step for better UX
- ✅ Implemented full Wunsch Bowl edit functionality: users can now edit custom bowls from cart with preserved selections
- ✅ Updated cart store with updateItem method for in-place item editing
- ✅ Refactored checkout form to request pickup time (10:00-22:00 in 15-min intervals) for takeaway instead of table number
- ✅ Improved checkout form with separate state variables (pickupTime and tableNumber) based on serviceType
- ✅ Fixed static image serving bug in server/index.ts (changed from attached_assets to public/images)
- ✅ Removed all AnimatedSection components from Menu.tsx and Home.tsx for instant page loads
- ✅ Verified all menu images (custom-bowl.jpg and protein images) are served correctly as image/jpeg

### October 16, 2025
- ✅ Migrated from in-memory storage to PostgreSQL database
- ✅ Implemented Drizzle ORM with Neon PostgreSQL driver
- ✅ Added automatic database seeding functionality
- ✅ Configured Vercel deployment setup
- ✅ Maintained backward compatibility with fallback to MemStorage
- ✅ Server adapted for serverless deployment on Vercel