# PokePao Poke Bowl Café

## Overview
PokePao is a modern e-commerce platform for a Hawaiian poke bowl restaurant in Hamburg. It enables customers to browse the menu, manage their cart, and learn about the restaurant. The application is a full-stack web application with a React frontend and an Express backend, designed to emulate food delivery platforms like Uber Eats and DoorDash, while maintaining a fresh, health-focused aesthetic. The project aims to capture a significant market share in the healthy fast-casual dining sector.

## Recent Changes (October 29, 2025)
- **CartWidget Smart Hiding:**
  - CartWidget now accepts optional `isHidden` prop for conditional visibility control
  - Automatically hides when bowl builder dialog is open to prevent mobile UI interference
  - Automatically hides when cart modal is open to avoid redundant UI elements
  - Implementation uses state tracking in Menu.tsx and prop-based short-circuit rendering
  
- **Header Stability Improvements:**
  - Removed auto-hide behavior on scroll - header now stays persistently visible
  - Eliminated unnecessary re-renders by removing isHeaderVisible state tracking
  - Preserved mobile menu close-on-scroll functionality for better UX
  - Header remains fixed at top (sticky positioning) without jumping

## Previous Changes (October 28, 2025)
- **UX Improvements:**
  - **CartWidget** redesigned for compactness: reduced icon size (w-4 h-4), smaller padding (px-3 py-2), and compact badge (w-5 h-5) for better screen space utilization
  - **Desktop images** aspect ratio changed from 16:9 to 4:3 for improved visual consistency
  - **Mobile images** aspect ratio optimized to 3:2 for better screen fit
  - **CSS scroll-snap** implemented for desktop category navigation (snap-x snap-mandatory with snap-center) for smoother browsing
  - **Mobile menu optimization** - comprehensive compaction to fit all elements (categories, items, navigation) on one screen:
    - Categories converted to horizontal scroll strip (single row) to save vertical space
    - Ultra-compact category buttons (px-3 py-1.5, inline icon+text layout)
    - Heavily reduced card padding (p-2.5)
    - Removed product descriptions from cards
    - Icon-only add buttons for space efficiency
    - Title and button in same row
    - Minimal spacing between all elements (space-y-2, gap-2)
    - Compact pagination controls (h-8 w-8 buttons, tiny dots)

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Frameworks:** React 18 with TypeScript, Vite for bundling, Wouter for routing.
- **UI:** shadcn/ui (Radix UI), Tailwind CSS with custom design tokens (ocean blue, sunset orange), Poppins and Lato fonts.
- **State Management:** TanStack Query for server state, Zustand with persist middleware for client-side cart (localStorage).
- **Design:** Component-based, custom hooks, React Hook Form with Zod for validation, responsive mobile-first design.
- **Mobile Menu:** Professional swipe-based menu view (`MobileMenuView`) with category cards (2x3 grid), pagination (2 items per page), Embla carousel for smooth swipes, dot indicators and arrow buttons. Optimized for mobile devices (iPhone, Android).

### Backend Architecture
- **Server:** Express.js on Node.js with TypeScript for RESTful APIs.
- **API Design:** RESTful endpoints for categories and menu items (`/api/categories`, `/api/menu-items`), JSON format, filtering support.
- **Data Access:** Abstracted `IStorage` interface with dual implementation: PostgreSQL via Drizzle ORM (`DatabaseStorage`) and in-memory (`MemStorage`) for development. Automatic selection based on environment.

### Data Storage
- **Primary:** PostgreSQL via Neon serverless (production)
- **Fallback:** In-memory storage (development)
- **ORM:** Drizzle ORM with PostgreSQL Neon driver.
- **Schema:** `categories`, `menu_items`, `reservations`, `gallery_images` tables. UUID primary keys, foreign keys, bilingual content support.
- **Cart Data:** Client-side in localStorage via Zustand persist.

### Deployment (Vercel)
- **Platform:** Vercel for production deployment.
- **Build:** `npm run build` for frontend, serverless functions for backend (`api/index.ts`).
- **Environment:** Dual environment support (Replit uses WebSockets, Vercel uses HTTP/Fetch for Neon connection), automatic detection.
- **Configuration:** `vercel.json` for routing (API, images, SPA).

## External Dependencies

- **Data Management:**
    - `@tanstack/react-query`: Server state management.
    - `zustand`: Client-side state management.
    - `drizzle-orm`, `@neondatabase/serverless`: PostgreSQL ORM and driver.
- **UI & Styling:**
    - `@radix-ui/*`: Accessible UI primitives.
    - `tailwindcss`: Utility-first CSS.
    - `class-variance-authority`: Type-safe component variants.
    - `embla-carousel-react`: Carousel functionality.
    - `lucide-react`, `react-icons`: Icon libraries.
- **Forms & Validation:**
    - `react-hook-form`: Form management.
    - `zod`: Schema validation.
    - `@hookform/resolvers`: Integration with Zod.
- **Server:**
    - `express-session`, `connect-pg-simple`: Session management for PostgreSQL.
- **Build/Dev Tools:**
    - `tsx`, `esbuild`.
- **Third-Party Integrations:**
    - Food delivery platforms (Lieferando, Wolt, Uber Eats - external links).
    - Social media (WhatsApp, Instagram, TikTok - external links).
    - Google Fonts API.
    - SendGrid: Email notifications for orders and reservations.