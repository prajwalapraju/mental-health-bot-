# Overview

This is a comprehensive mental health and wellness application built as a full-stack web application. The app provides users with tools for mood tracking, journaling, breathing exercises, daily affirmations, and intelligent hobby suggestions to support their mental wellness journey. It features a modern, responsive design with a focus on user experience and accessibility.

## Recent Changes

**August 20, 2025**: Added intelligent hobby suggestions feature that analyzes user mood patterns and emotional data to recommend personalized wellness activities. The system provides crisis support activities for users in distress, stress-relief activities for high-stress periods, and general wellness activities for maintenance. Each suggestion includes therapeutic benefits, time commitments, and difficulty levels.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

The frontend is built using **React 18** with **TypeScript** and follows a component-based architecture:

- **Routing**: Uses Wouter for lightweight client-side routing with pages for Home, Mood, Journal, and Progress
- **State Management**: React Query (TanStack Query) for server state management and caching
- **UI Framework**: Custom component library built on Radix UI primitives with shadcn/ui styling
- **Styling**: Tailwind CSS with CSS variables for theming and consistent design tokens
- **Mobile-First Design**: Responsive design with dedicated mobile navigation and adaptive layouts
- **Build Tool**: Vite for fast development and optimized production builds

## Backend Architecture

The backend follows a **REST API** pattern using **Express.js** with TypeScript:

- **Web Framework**: Express.js with middleware for request logging and error handling
- **API Design**: RESTful endpoints organized around mental health features (mood, journal, breathing, affirmations)
- **Database Layer**: Drizzle ORM for type-safe database operations with PostgreSQL
- **Session Management**: Express sessions with PostgreSQL session store
- **Development Setup**: Hot module replacement with Vite integration for full-stack development

## Data Storage Solutions

**Database**: PostgreSQL with Neon serverless hosting
- **ORM**: Drizzle ORM for type-safe queries and schema management
- **Schema Design**: Separate tables for users, mood entries, journal entries, breathing sessions, and favorite affirmations
- **Migrations**: Drizzle Kit for database schema migrations and version control
- **Data Validation**: Zod schemas for runtime type validation on both client and server

## Authentication and Authorization

Currently implements a **simplified authentication model**:
- Uses a default user ID for demo purposes
- Session-based architecture ready for full authentication implementation
- Prepared user schema and storage interface for future authentication features

## External Dependencies

### UI and Styling
- **Radix UI**: Comprehensive set of accessible, unstyled UI primitives
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **Lucide React**: Icon library for consistent iconography
- **Chart.js**: Data visualization library for mood tracking charts

### State Management and Data Fetching
- **TanStack React Query**: Server state management with caching, background updates, and optimistic updates
- **React Hook Form**: Form state management with validation

### Database and Backend
- **Drizzle ORM**: Type-safe ORM with excellent TypeScript support
- **Neon Database**: Serverless PostgreSQL hosting
- **Express.js**: Web application framework for Node.js
- **connect-pg-simple**: PostgreSQL session store for Express sessions

### Development Tools
- **Vite**: Build tool and development server
- **TypeScript**: Static type checking for improved developer experience
- **ESBuild**: Fast JavaScript bundler for production builds