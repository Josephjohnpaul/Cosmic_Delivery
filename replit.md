# Cosmic Delivery - Interplanetary E-commerce Platform

## Overview

Cosmic Delivery is a humorous e-commerce application that simulates selling Earth products to other planets at astronomically high prices. The application features a React frontend with Express backend, showcasing products with detailed cost breakdowns that include ridiculous intergalactic shipping fees, cosmic insurance, and planetary hazards. The system includes regular products, exclusive planet-specific items, AI-powered dynamic pricing, and interactive features like a shopping cart and price comparison tools.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **Routing**: Wouter for client-side routing with pages for Home, Exclusive products, and Price comparison
- **State Management**: TanStack Query for server state management and caching
- **UI Framework**: Shadcn/ui components with Radix UI primitives for consistent design
- **Styling**: Tailwind CSS with custom cosmic theme variables and dark mode support
- **Component Structure**: Modular components including ProductCard, ProductModal, CartModal, and SearchSection

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **API Design**: RESTful endpoints for products, cart management, and AI-powered search
- **Storage**: In-memory storage implementation with interface-based design for easy database integration
- **Development Server**: Integrated Vite development server with HMR support
- **Error Handling**: Centralized error handling middleware with structured error responses

### Data Storage
- **Current Implementation**: In-memory storage using Maps for products and cart items
- **Database Ready**: Drizzle ORM configured for PostgreSQL with schema definitions
- **Schema Design**: Products table with JSONB breakdown field, cart items with session-based tracking
- **Migration System**: Drizzle Kit for database migrations and schema management

### AI Integration
- **Service**: OpenAI GPT-4o integration for dynamic pricing generation
- **Features**: Cosmic price calculation based on item, destination planet, and delivery agency
- **Price Breakdown**: AI generates humorous but believable cost components
- **Special Handling**: Easter egg functionality for impossible destinations like the Sun

### Authentication & Sessions
- **Session Management**: Client-generated session IDs for cart persistence
- **No Authentication**: Current implementation uses anonymous sessions
- **Cart Persistence**: Session-based cart storage without user accounts

## External Dependencies

### Core Framework Dependencies
- **React**: Frontend framework with TypeScript support
- **Express**: Backend web framework
- **Vite**: Build tool and development server
- **Wouter**: Lightweight client-side routing

### Database & ORM
- **Drizzle ORM**: Type-safe database toolkit
- **@neondatabase/serverless**: PostgreSQL serverless driver
- **Drizzle Kit**: Database migration and introspection tool

### UI & Styling
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Unstyled, accessible UI primitives
- **Shadcn/ui**: Pre-built component library
- **Lucide React**: Icon library

### State Management & Data Fetching
- **TanStack Query**: Server state management and caching
- **React Hook Form**: Form handling with validation
- **Zod**: Schema validation library

### AI Services
- **OpenAI**: GPT-4o for dynamic pricing generation
- **Custom pricing logic**: Handles cosmic delivery calculations

### Development Tools
- **TypeScript**: Type safety across the application
- **ESBuild**: Fast JavaScript bundler for production
- **PostCSS**: CSS processing with Autoprefixer
- **Replit Integration**: Development environment support

### Third-party Integrations
- **Unsplash**: Product images via CDN
- **Custom cosmic theming**: Space-themed color palette and animations
- **Responsive design**: Mobile-first approach with breakpoint handling