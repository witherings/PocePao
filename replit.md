# PokePao Poke Bowl Café - Replit Project

## Overview
This repository contains a poke bowl restaurant website project with two main components:
1. **1_OLD_SITE_BACKEND** - Legacy PHP-based backend (not currently in use)
2. **2_NEW_SITE_DESIGN** - Modern full-stack React + Express application (active project)

The active application is a modern e-commerce platform for PokePao, a Hawaiian poke bowl restaurant in Hamburg, Germany. It enables customers to browse the menu, manage their cart, make reservations, and learn about the restaurant.

## Project Structure

### Active Application: 2_NEW_SITE_DESIGN
The main application is located in the `2_NEW_SITE_DESIGN` directory. This is a full-stack TypeScript application with:
- **Frontend**: React 18 with Vite, Wouter for routing, Tailwind CSS
- **Backend**: Express.js with RESTful API
- **Database**: PostgreSQL (via Neon) with fallback to in-memory storage
- **ORM**: Drizzle ORM

All development and deployment commands must be run from within the `2_NEW_SITE_DESIGN` directory.

## Development Setup

### Prerequisites
- Node.js 20 (already configured via Replit modules)
- PostgreSQL (optional - app has in-memory fallback)

### Running the Application
The application is configured to run automatically via Replit workflows:
- **Workflow Name**: "Start application"
- **Command**: `cd 2_NEW_SITE_DESIGN && npm run dev`
- **Port**: 5000 (webview enabled)

The server runs on `0.0.0.0:5000` and is configured to allow all hosts for Replit's proxy.

### Manual Commands
From the root directory:
```bash
cd 2_NEW_SITE_DESIGN
npm install          # Install dependencies
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
```

## Deployment

The project is configured for Replit Autoscale deployment:
- **Build**: `cd 2_NEW_SITE_DESIGN && npm run build`
- **Run**: `cd 2_NEW_SITE_DESIGN && npm run start`
- **Deployment Type**: Autoscale (stateless web application)

### Environment Variables
The application automatically uses environment variables provided by Replit:
- `DATABASE_URL` - PostgreSQL connection string (if database is provisioned)
- `PORT` - Server port (defaults to 5000)

## Technical Stack

### Frontend
- React 18 with TypeScript
- Vite for bundling and HMR
- Tailwind CSS with custom design tokens
- shadcn/ui components (Radix UI)
- TanStack Query for server state
- Zustand for client-side cart state
- Wouter for routing

### Backend
- Express.js on Node.js
- TypeScript
- RESTful API design
- In-memory storage (MemStorage) with PostgreSQL support
- Drizzle ORM
- Session management support

### Data Storage
- **Primary**: In-memory storage (current active mode)
- **Optional**: PostgreSQL via Neon serverless
- **Cart Data**: Client-side localStorage via Zustand

## API Endpoints

The application exposes the following REST API endpoints:
- `GET /api/categories` - Get all categories
- `GET /api/menu-items` - Get all menu items
- `GET /api/menu-items/category/:categoryId` - Get items by category
- `GET /api/menu-items/:id` - Get single menu item
- `GET /api/reservations` - Get all reservations
- `POST /api/reservations` - Create new reservation
- `GET /api/gallery` - Get gallery images
- `POST /api/gallery` - Upload gallery image
- `DELETE /api/gallery/:id` - Delete gallery image
- `GET /api/ingredients` - Get all ingredients
- `GET /api/ingredients/type/:type` - Get ingredients by type
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get order by ID
- `POST /api/orders` - Create new order

## Legacy Backend (1_OLD_SITE_BACKEND)
This directory contains an old PHP-based administrative backend that is not currently active or integrated with the new React application. It's preserved for reference but is not used in the current setup.

## Recent Changes
- Initial Replit environment setup completed
- Node.js 20 and PostgreSQL modules configured
- Workflow configured for automatic dev server startup on port 5000
- Deployment configuration set for Autoscale deployment
- Application tested and verified working with in-memory storage
- Vite configured with `allowedHosts: true` for Replit proxy compatibility

## User Preferences
None recorded yet.

## Notes
- The application is fully functional with in-memory storage
- Database is available but app currently uses MemStorage by default
- All static assets and images are served from the Express server
- The Vite dev server is configured in middleware mode with HMR support
