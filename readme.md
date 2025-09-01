I ha# 🏠 House & Pet Sitting Management System

A comprehensive web application for managing house and pet sitting instructions, built with React, Next.js, Supabase, and deployed on Vercel.

## 📋 Table of Contents
- [Current State](#current-state)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Implementation Plan](#implementation-plan)
- [Environment Variables](#environment-variables)
- [Database Schema](#database-schema)
- [Deployment Guide](#deployment-guide)
- [Development Setup](#development-setup)
- [Future Enhancements](#future-enhancements)
- [QR Code Setup](#qr-code-setup)

## 🎯 Current State

### ✅ Completed (Live Production App)
- **Password-protected access** with QR code auto-login support
- **5 main sections**: Overview, Pet Care, House Instructions, Service People, Schedule
- **Admin mode** for editing (UI only, not connected to backend)
- **Responsive design** for mobile/tablet/desktop
- **Visual hierarchy** with color-coded alerts and important information
- **Daily task reference** (non-interactive checklist)
- **Live deployment** at https://housesit.9441altodrive.com/
- **Environment variables** configured for production
- **Custom domain** set up and working

### ✅ Phase 2: Database Integration (COMPLETED)
- **Supabase database** fully connected and operational
- **Real authentication system** with database logging
- **Data persistence** for all pet and house information
- **Database schema** with all required tables and relationships
- **TypeScript types** for all database entities
- **CRUD operations** for all data management
- **Environment variable configuration** for both local and production
- **Error handling** with database-only implementation
- **Access logging** to track all login attempts
- **TypeScript compilation** fixed for production builds
- **Next.js configuration** updated for version 14 compatibility

### ✅ Phase 3: Admin Interface (COMPLETED)
- **Full CRUD operations** for all data types (dogs, alerts, service people, appointments, daily tasks, stays)
- **Enhanced pet profile editing** with user-friendly interfaces:
  - **Photo upload** with preview functionality
  - **Feeding schedule builder** with time picker and amount fields
  - **Medicine management** with add/remove/edit capabilities for each medication
  - **Special instructions** with categorized add/remove interface
  - **Birthdate field** with automatic age calculation
  - **No more JSON input** - all complex data handled through intuitive UI
- **Master schedule system** with comprehensive task management:
  - **Daily tasks management** with full CRUD operations (timed and untimed)
  - **Schedule item deletion** for manageable items (tasks, appointments)
  - **Real-time schedule updates** across all views
  - **Smart deletion logic** that identifies deletable vs. managed items
  - **Unified schedule structure** with proper separation of timed vs untimed tasks
- **Stay management system** with sitter context:
  - **Active stay tracking** with sitter names and date ranges
  - **Admin-only stay management** (create, edit, delete)
  - **Sitter view context** showing current stay or "No active stay"
  - **Date range validation** for stay periods
- **Stay-gated access control**:
  - **Portal lockdown** when no active stay is scheduled for current date
  - **Limited sitter view** showing only "No Active Stay" message and emergency contacts
  - **Full functionality** only available during active stay periods
  - **Admin override** allows full access regardless of stay status
  - **Automatic date-based stay validation** using database queries
- **Editable contact management**:
  - **Database-driven contacts** with full CRUD operations
  - **Clickable phone numbers** with proper tel: links for mobile calling
  - **Clickable email addresses** with mailto: links
  - **Categorized contacts** (owners, regular vet, emergency vet, other)
  - **Admin interface** for adding, editing, and deleting contacts
  - **Display order control** for custom contact organization
- **Restructured page organization**:
  - **Overview page** shows "Today's Schedule" and "Current Stay"
  - **Schedule page** shows full "Master Schedule" and task management
  - **Removed confusing duplicate** schedule sections
- **Admin mode toggle** with comprehensive editing interface
- **Modal forms** for adding and editing items with organized sections
- **Real-time data updates** with optimistic UI updates
- **Type-safe operations** with proper error handling
- **Responsive admin interface** that works on all devices
- **Admin password protection** with secure authentication modal
- **Database-only implementation** - all mock data removed
- **Live deployment tested** and fully functional on production site

### 🚧 Not Yet Implemented
- Multiple property support
- Email notifications
- Photo storage integration (currently using base64 preview)
- Contact information management (currently hardcoded)

## ✨ Features

### Security
- Password protection with environment variable configuration
- QR code auto-login via URL parameters
- Quick lock/unlock functionality
- Admin mode toggle

### Information Management
- **Pet profiles** with feeding schedules, medicine, personality traits
- **House instructions** for all systems and appliances
- **Service people tracking** with payment reminders
- **Emergency contacts** prominently displayed
- **Safety alerts** (coyotes, septic system, etc.)
- **Appointment tracking** with detailed instructions
- **Daily tasks management** with full CRUD operations (timed and untimed)
- **Master schedule system** consolidating all schedulable items
- **Stay management** with sitter context and date ranges
- **Unified schedule structure** with proper page organization

### User Experience
- Mobile-first responsive design
- Tabbed navigation for easy section access
- Color-coded alerts (red=danger, orange=payment needed, blue=info)
- Print-friendly layout
- Offline-capable (after initial load)

## 🛠 Tech Stack

### Current Implementation
- **Framework**: Next.js 15.5.2 (App Router)
- **Frontend**: React 19.1.1 with Hooks
- **Styling**: Tailwind CSS 4.1.12
- **Icons**: Lucide React 0.542.0
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **State Management**: React useState (local state)
- **Hosting**: Vercel
- **File Storage**: Supabase Storage (for pet photos)
- **Environment Management**: Vercel Environment Variables

## 📁 Project Structure

```
house-sitting-app/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── api/
│       └── auth/
├── components/
│   ├── Navigation.tsx
│   ├── LoginScreen.tsx
│   ├── AdminPanel.tsx
│   └── sections/
│       ├── OverviewSection.tsx
│       ├── DogsSection.tsx
│       ├── HouseSection.tsx
│       ├── ServicesSection.tsx
│       └── ScheduleSection.tsx
├── lib/
│   ├── supabase.ts
│   └── types.ts
├── public/
│   └── images/
└── .env.local
```

## 🚀 Implementation Plan

### Phase 1: Next.js Setup ✅ (Week 1) - COMPLETED
- [x] Create React prototype with all UI components
- [x] Initialize Next.js 15.5.2 project with TypeScript
- [x] Port React components to Next.js structure
- [x] Set up Tailwind CSS 4.1.12 with PostCSS plugin
- [x] Configure environment variables
- [x] Deploy to Vercel
- [x] Set up custom domain (housesit.9441altodrive.com)
- [x] Updated to latest versions (React 19.1.1, Next.js 15.5.2, Tailwind 4.1.12)

### Phase 2: Database Setup ✅ (Week 2) - COMPLETED
- [x] Create Supabase project
- [x] Design and implement database schema
- [x] Set up Row Level Security (RLS) policies
- [x] Create database types with TypeScript
- [x] Implement Supabase client configuration

### Phase 3: Authentication ✅ (Week 2) - COMPLETED
- [x] Implement password-based access control
- [x] Add session management
- [x] Create admin authentication separate from visitor access
- [x] Implement QR code parameter handling

### Phase 4: CRUD Operations ✅ (Week 3) - COMPLETED
- [x] Connect admin panel to database (backend ready)
- [x] Implement comprehensive dog profile CRUD with all fields
- [x] Implement house instructions CRUD (backend ready)
- [x] Implement service people management (backend ready)
- [x] Add appointment scheduling (backend ready)
- [x] Connect admin UI to database operations
- [x] Enhanced pet editing with organized sections and JSON field support
- [x] Daily tasks management with full CRUD operations (timed and untimed)
- [x] Master schedule system with item deletion capabilities
- [x] Stay management system with sitter context and date ranges
- [x] Restructured page organization (Overview vs Schedule pages)

### Phase 5: Deployment ✅ (Week 3) - COMPLETED
- [x] Deploy to Vercel
- [x] Configure production environment variables
- [x] Set up custom domain
- [x] Test QR code functionality
- [ ] Create QR code generator utility

### Phase 6: Enhancements (Week 4+)
- [ ] Add image upload for pet photos
- [ ] Implement email notifications for appointments
- [x] Add access logging (completed)
- [ ] Create printable PDF export
- [ ] Add notes/feedback system for sitters

## 🔐 Environment Variables

### ✅ Vercel Production Configuration (ACTIVE)
Environment variables are configured in Vercel Dashboard → Settings → Environment Variables:

```env
# Supabase (Production)
NEXT_PUBLIC_SUPABASE_URL=configured_in_vercel
NEXT_PUBLIC_SUPABASE_ANON_KEY=configured_in_vercel
SUPABASE_SERVICE_ROLE_KEY=configured_in_vercel

# Site Access (Production)
NEXT_PUBLIC_SITE_ACCESS_PASSWORD=your_site_password
NEXT_PUBLIC_ADMIN_PASSWORD=your_admin_password

# Optional
NEXT_PUBLIC_SITE_URL=https://housesit.9441altodrive.com
```

**Status**: ✅ **All environment variables are configured and working in production**
- **Site access password**: Configured via environment variables (for sitter access)
- **Admin password**: Configured via environment variables (for admin mode access)
- **Database**: Fully connected to Supabase production instance
- **Live testing**: Admin interface tested and functional on production site

**Note**: Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser, others remain server-side only. All production environment variables are properly configured in Vercel.

## 💾 Database Schema

### Tables Structure

```sql
-- Properties table
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  wifi_ssid TEXT,
  wifi_password TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Alerts table
CREATE TABLE alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('danger', 'warning', 'info')),
  category TEXT NOT NULL CHECK (category IN ('pets', 'house', 'general')),
  text TEXT NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Dogs table
CREATE TABLE dogs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  age TEXT,
  photo_url TEXT,
  personality TEXT,
  feeding_schedule JSONB,
  feeding_location TEXT,
  feeding_notes TEXT,
  medicine_schedule JSONB,
  medicine_notes TEXT,
  potty_trained TEXT,
  potty_notes TEXT,
  walk_frequency TEXT,
  walk_notes TEXT,
  sleeping_location TEXT,
  sleeping_notes TEXT,
  special_instructions JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Service People table
CREATE TABLE service_people (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  service_day TEXT,
  service_time TEXT,
  payment_amount TEXT,
  payment_status TEXT,
  notes TEXT,
  needs_access BOOLEAN DEFAULT false,
  phone TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Appointments table
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  time TIME,
  type TEXT NOT NULL,
  for_dog_id UUID REFERENCES dogs(id) ON DELETE SET NULL,
  location TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- House Instructions table
CREATE TABLE house_instructions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  subcategory TEXT,
  instructions JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Daily Tasks table
CREATE TABLE daily_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  time TEXT,
  category TEXT CHECK (category IN ('pets', 'house', 'general')),
  notes TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Stays table (for managing active stays with sitters)
CREATE TABLE stays (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  sitter_name TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  notes TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Contacts table (for emergency contacts and other contact information)
CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  category TEXT NOT NULL CHECK (category IN ('owners', 'regular_vet', 'emergency_vet', 'other')),
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  address TEXT,
  notes TEXT,
  display_order INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Access Logs table (for tracking who accessed when)
CREATE TABLE access_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  accessed_at TIMESTAMP DEFAULT NOW(),
  access_type TEXT CHECK (access_type IN ('password', 'qr_code')),
  ip_address TEXT
);
```

## 🚀 Deployment Guide

### 1. Supabase Setup
```bash
# Install Supabase CLI
npm install -g supabase

# Initialize Supabase in your project
supabase init

# Link to your Supabase project
supabase link --project-ref your-project-ref

# Push database schema
supabase db push
```

### 2. Vercel Deployment
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy to Vercel
vercel

# Set environment variables
vercel env add SITE_ACCESS_PASSWORD production
vercel env add NEXT_PUBLIC_SUPABASE_URL production
# ... add all other env vars
```

### 3. Custom Domain
1. Add domain in Vercel dashboard
2. Update DNS records with your domain provider
3. Enable HTTPS (automatic in Vercel)

## 💻 Development Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- Vercel account (for deployment)

### Local Development
```bash
# Clone repository
git clone your-repo-url
cd house-sitting-app

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your values

# Run development server
npm run dev

# Open http://localhost:3000
```

### Development with Cursor
1. Open project in Cursor
2. Use `.cursorrules` file for AI assistance context
3. Reference this README for project structure
4. Use TypeScript for better AI code completion

## 🏠 Stay Management System

### Current Implementation
- **Stay Tracking**: Active stays with sitter names and date ranges
- **Admin Management**: Full CRUD operations for stays (admin-only)
- **Sitter Context**: Shows current stay or "No active stay" message
- **Date Range Validation**: Proper start/end date handling
- **Database Integration**: Stays table with proper relationships

### Stay Workflow
1. **Admin creates stay** with sitter name and date range
2. **Sitter sees stay context** on Overview page during active period
3. **Admin can edit/delete** stays as needed
4. **Outside active stay** → Shows "No active stay" message
5. **Inside active stay** → Shows stay details normally

### Database Schema
```sql
-- Stays table
CREATE TABLE stays (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  sitter_name TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  notes TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## 🔮 Future Enhancements

### High Priority
- [ ] **Multiple Properties**: Support multiple homes/properties
- [ ] **Visit Date Ranges**: Set active dates for instructions
- [ ] **Photo Uploads**: Add photos for pets, house areas
- [ ] **Sitter Feedback**: Allow sitters to leave notes
- [ ] **Emergency Mode**: Quick-access emergency info page
- [ ] **Contact Management**: Database-driven contact information

### Medium Priority
- [ ] **Email Notifications**: Remind about upcoming appointments
- [ ] **PDF Export**: Generate printable instruction sheets
- [ ] **Weather Integration**: Show local weather
- [ ] **Time Zone Support**: Handle different time zones
- [ ] **Multilingual Support**: Spanish/other languages

### Nice to Have
- [ ] **Video Instructions**: Embed video guides
- [ ] **Sitter Check-ins**: Daily confirmation system
- [ ] **Integration with Smart Home**: Alexa/Google Home
- [ ] **Vet Portal Access**: Share relevant info with vet
- [ ] **Historical Logs**: Track past visits and sitters

## 📱 QR Code Setup

### Generate QR Code
1. Deploy your site to production
2. Use URL format: `https://yourdomain.com?access=YOUR_PASSWORD`
3. Generate QR using online tool or programmatically:

```javascript
// Example using qrcode package
import QRCode from 'qrcode';

const generateQR = async () => {
  const url = `https://housesitting.yourdomain.com?access=${process.env.SITE_ACCESS_PASSWORD}`;
  const qrCode = await QRCode.toDataURL(url);
  // Save or display qrCode
};
```

### QR Code Best Practices
- Generate new QR codes for each sitter/stay
- Print and laminate for durability
- Place in easily accessible location
- Include backup written password
- Test scanning before sitter arrives

## 📧 Contact & Support

- **Project Owner**: Adam & Lauren
- **Property**: 9441 Alto Drive, La Mesa, CA 91941
- **Emergency Contact**: 816-676-8363 / 913-375-8699

## 📄 License

Private project - not for public distribution

---

## 🎯 Quick Start Checklist

- [x] Clone repository
- [x] Configure environment variables
- [x] Deploy to Vercel
- [x] Set up custom domain
- [x] Test with mock sitter
- [x] Go live!
- [x] Set up Supabase project (Phase 2)
- [ ] Generate QR code
- [x] Connect database for real data persistence

---

*Last Updated: December 2024*
*Version: 2.4.0 (Editable Contacts & Stay-Gated Access Complete)*

## 🌐 Live Application

**Production URL:** https://housesit.9441altodrive.com/
**Vercel URL:** https://house-sitting-app-kappa.vercel.app/

**Current Password:** Configured via environment variables

## 🗄️ Database Integration Status

### ✅ Fully Operational (Live Production)
- **Supabase PostgreSQL** database connected and running
- **Real-time data** synchronization between app and database
- **Authentication logging** tracks all access attempts
- **Data persistence** for all pet profiles, house instructions, and appointments
- **Environment variables** properly configured in Vercel production
- **Error handling** with database-only implementation
- **Production build** successfully compiles and deploys
- **TypeScript errors** resolved for all database operations
- **Admin interface** fully tested and working on live site
- **CRUD operations** verified functional in production environment

### 📊 Database Schema
- **10 tables** with proper relationships and constraints
- **UUID primary keys** for all entities
- **JSONB fields** for flexible data storage (feeding schedules, instructions)
- **Timestamps** for audit trails and data tracking
- **Foreign key relationships** maintaining data integrity
- **Daily tasks management** with full CRUD operations (timed and untimed)
- **Stay management** with sitter context and date ranges

### 🔧 Technical Implementation
- **TypeScript types** for all database entities
- **CRUD operations** for all data management
- **Row Level Security** policies configured
- **Client-side and server-side** database access
- **Production-ready** error handling and logging

## 📋 Next Steps for Phase 4

1. ✅ **Connect admin UI** to database operations for full CRUD functionality - **COMPLETED**
2. **Generate QR codes** for easy sitter access
3. **Add image upload** functionality for pet photos
4. **Implement email notifications** for appointments
5. **Create printable PDF export** for offline reference

The application now has full database connectivity, data persistence, and a fully functional admin interface. All mock data has been removed, and the system relies entirely on the Supabase database for dynamic content. Pet sitters can access all necessary information with real-time data from the database, and administrators can manage all data through the secure admin interface. The system includes a comprehensive master schedule system with daily tasks management, stay management with sitter context, and proper page organization. The system is production-ready and fully operational with a clean, database-only architecture.