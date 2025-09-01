# 🏠 House & Pet Sitting Management System

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
- **Error handling** with graceful fallback to mock data
- **Access logging** to track all login attempts
- **TypeScript compilation** fixed for production builds
- **Next.js configuration** updated for version 14 compatibility

### 🚧 Not Yet Implemented
- Admin CRUD operations (UI connected to database)
- Image uploads for pets
- Multiple property support
- Email notifications

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

### User Experience
- Mobile-first responsive design
- Tabbed navigation for easy section access
- Color-coded alerts (red=danger, orange=payment needed, blue=info)
- Print-friendly layout
- Offline-capable (after initial load)

## 🛠 Tech Stack

### Current Implementation
- **Frontend**: React 18 with Hooks
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: React useState (local state)

### Planned Implementation
- **Framework**: Next.js 14 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
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
- [x] Initialize Next.js 14 project with TypeScript
- [x] Port React components to Next.js structure
- [x] Set up Tailwind CSS
- [x] Configure environment variables
- [x] Deploy to Vercel
- [x] Set up custom domain (housesit.9441altodrive.com)

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

### Phase 4: CRUD Operations (Week 3)
- [x] Connect admin panel to database (backend ready)
- [x] Implement dog profile CRUD (backend ready)
- [x] Implement house instructions CRUD (backend ready)
- [x] Implement service people management (backend ready)
- [x] Add appointment scheduling (backend ready)
- [ ] Connect admin UI to database operations

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

### Vercel Configuration
Create these in Vercel Dashboard → Settings → Environment Variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Site Access
SITE_ACCESS_PASSWORD=your_secure_password_here
ADMIN_PASSWORD=separate_admin_password

# Optional
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

### Local Development (.env.local)
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SITE_ACCESS_PASSWORD=development_password
ADMIN_PASSWORD=admin_dev_password
```

**Note**: Vercel automatically injects environment variables at build time. Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser, others remain server-side only.

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

## 🔮 Future Enhancements

### High Priority
- [ ] **Multiple Properties**: Support multiple homes/properties
- [ ] **Visit Date Ranges**: Set active dates for instructions
- [ ] **Photo Uploads**: Add photos for pets, house areas
- [ ] **Sitter Feedback**: Allow sitters to leave notes
- [ ] **Emergency Mode**: Quick-access emergency info page

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
*Version: 2.0.0 (Database Integration Complete)*

## 🌐 Live Application

**Production URL:** https://housesit.9441altodrive.com/
**Vercel URL:** https://house-sitting-app-kappa.vercel.app/

**Current Password:** `frenchies2024` (configurable via environment variables)

## 🗄️ Database Integration Status

### ✅ Fully Operational
- **Supabase PostgreSQL** database connected and running
- **Real-time data** synchronization between app and database
- **Authentication logging** tracks all access attempts
- **Data persistence** for all pet profiles, house instructions, and appointments
- **Environment variables** properly configured for production
- **Error handling** with graceful fallback to mock data if needed
- **Production build** successfully compiles and deploys
- **TypeScript errors** resolved for all database operations

### 📊 Database Schema
- **7 tables** with proper relationships and constraints
- **UUID primary keys** for all entities
- **JSONB fields** for flexible data storage (feeding schedules, instructions)
- **Timestamps** for audit trails and data tracking
- **Foreign key relationships** maintaining data integrity

### 🔧 Technical Implementation
- **TypeScript types** for all database entities
- **CRUD operations** for all data management
- **Row Level Security** policies configured
- **Client-side and server-side** database access
- **Production-ready** error handling and logging

## 📋 Next Steps for Phase 3

1. **Connect admin UI** to database operations for full CRUD functionality
2. **Generate QR codes** for easy sitter access
3. **Add image upload** functionality for pet photos
4. **Implement email notifications** for appointments
5. **Create printable PDF export** for offline reference

The application now has full database connectivity and data persistence. Pet sitters can access all necessary information with real-time data from the Supabase database. The next phase will focus on connecting the admin interface to the database for full editing capabilities.