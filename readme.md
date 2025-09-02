# 🏠 House & Pet Sitting Management System

A comprehensive web application for managing house and pet sitting instructions, built with Next.js, TypeScript, Supabase, and deployed on Vercel.

## 📋 Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Database Schema](#database-schema)
- [Deployment Guide](#deployment-guide)
- [Development Setup](#development-setup)
- [QR Code Setup](#qr-code-setup)

## ✨ Features

### Security & Access
- **Password-protected access** with QR code auto-login support
- **Admin mode** for editing with full database integration
- **Session persistence** - authentication and admin mode persist across page refreshes
- **Stay-gated access control** - sitters only see content during active stays
- **Admin override** - admins have full access regardless of stay status

### Information Management
- **Pet profiles** with feeding schedules, medicine, personality traits, and video instructions
- **House instructions** for all systems and appliances with scheduling capabilities
- **Emergency contacts** prominently displayed with clickable phone/email links
- **Safety alerts** with accessibility symbols (🚨 danger, ⚠️ warning, ℹ️ info)
- **Appointment tracking** with detailed instructions
- **Daily tasks management** with full CRUD operations (timed and untimed)
- **Master schedule system** consolidating all schedulable items with time-based grouping
- **Multi-day schedule viewing** with date selector in Overview section
- **Stay management** with sitter context and date ranges
- **Video upload system** for medicine and care instructions (YouTube integration)
- **Welcome PDF generation** with QR code auto-login for sitters

### User Experience
- **Mobile-first responsive design** with optimized navigation
- **Tabbed navigation** for easy section access (Overview, Pet Care, House Instructions)
- **Color-coded alerts** with accessibility symbols for colorblind users
- **Print-friendly layout** with proper QR code rendering
- **Time-based schedule grouping** for simultaneous events
- **Smart medicine scheduling** with automatic end date calculation
- **Vet visits scheduling** with automatic vet information integration
- **Service reminders** with day-before notifications

## 🛠 Tech Stack

- **Framework**: Next.js 15.5.2 (App Router)
- **Frontend**: React 19.1.1 with TypeScript
- **Styling**: Tailwind CSS 4.1.12
- **Icons**: Lucide React 0.542.0
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Password-based with localStorage session persistence
- **State Management**: React useState (local state)
- **API Routes**: Next.js API routes for server-side database operations
- **Hosting**: Vercel
- **File Storage**: Base64 encoding for photos, YouTube for videos
- **Environment Management**: Vercel Environment Variables
- **QR Code Generation**: qrcode library for welcome document generation

## 📁 Project Structure

```
house-sitting-app/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── api/
│       ├── stays/
│       │   └── route.ts          # Server-side stay CRUD operations
│       └── generate-welcome-pdf/
│           └── route.ts          # PDF generation with QR codes
├── components/
│   ├── HouseSittingApp.tsx       # Main application component
│   └── VideoUpload.tsx           # Video upload and compression component
├── lib/
│   ├── supabase.ts               # Supabase client configuration
│   ├── database.ts               # Database operations
│   ├── types.ts                  # TypeScript type definitions
│   └── database-setup.sql        # Database schema and setup
├── public/
├── migration-*.sql               # Database migration scripts
└── .env.local
```

## 🔐 Environment Variables

Environment variables are configured in Vercel Dashboard → Settings → Environment Variables:

```env
# Supabase (Production)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Site Access (Production)
NEXT_PUBLIC_SITE_ACCESS_PASSWORD=your_site_password
NEXT_PUBLIC_ADMIN_PASSWORD=your_admin_password

# Optional
NEXT_PUBLIC_SITE_URL=https://housesit.9441altodrive.com
```

**Note**: Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser, others remain server-side only.

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
  walk_schedule JSONB,
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
Don't use, this is being hosted on Vercel and Supabase

### Development with Cursor
1. Open project in Cursor
2. Use `.cursorrules` file for AI assistance context
3. Reference this README for project structure
4. Use TypeScript for better AI code completion

## 🔮 Future Enhancements

- **Multiple Properties**: Support multiple homes/properties
- **Email Notifications**: Remind about upcoming appointments
- **Sitter Feedback**: Allow sitters to leave notes
- **Weather Integration**: Show local weather
- **Time Zone Support**: Handle different time zones
- **Multilingual Support**: Spanish/other languages

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

## 🌐 Live Application

**Production URL:** https://housesit.9441altodrive.com/

## 🔧 Recent Updates

### Recent Updates (December 2024)

#### Image Support System
- **Universal image upload** - Added image support to house instructions and medicine sections
- **Image preview modal** - Click image icons to view full-size images with close functionality
- **Visual indicators** - Image icons appear on cards when images are present
- **Base64 storage** - Images stored as base64 data URLs for easy management
- **Automatic cleanup** - Images are automatically removed when entries are deleted
- **Files Modified**: `components/HouseSittingApp.tsx`, `lib/types.ts`, `migration-add-image-support.sql`

#### Delivery Management System
- **New delivery category** - Added "Deliveries & Packages" category to house instructions
- **Delivery-specific fields** - Company, delivery window, and tracking number support
- **Smart tracking links** - Clickable tracking numbers that open Google search for easy tracking
- **Delivery scheduling** - Daily check reminders and delivery window notifications
- **Files Modified**: `components/HouseSittingApp.tsx`, `lib/types.ts`, `migration-add-delivery-support.sql`

#### Enhanced Scheduling Display
- **Next occurrence dates** - Scheduled services now show the specific next occurrence date and time
- **Smart date indicators** - "TODAY" and "TOMORROW" labels for immediate upcoming events
- **Improved planning visibility** - Sitters can easily see what's happening when/next from summary views
- **Files Modified**: `lib/utils.ts`, `components/HouseSittingApp.tsx`

#### Medicine Schedule Reorganization
- **Time-based medicine grouping** - Medicine schedules now display grouped by time instead of by individual medicine
- **Improved daily workflow** - Sitters can see all medications needed at each time slot in one view
- **Chronological ordering** - Medicine times are sorted chronologically for better daily planning
- **Files Modified**: `components/HouseSittingApp.tsx`

#### Timezone Handling Fix
- **Fixed stay date display issues** - All date comparisons now use PST/PDT timezone consistently
- **Updated active stay detection** - Current stay status now properly accounts for Pacific timezone
- **Enhanced date calculations** - Medicine scheduling and all date-based features now use PST/PDT
- **Files Modified**: `lib/utils.ts`, `lib/database.ts`, `components/HouseSittingApp.tsx`

*Last Updated: December 2024*