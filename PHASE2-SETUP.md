# Phase 2 Setup Guide - Local Development

## 🚀 Quick Start

### 1. Create Supabase Project
1. Go to [https://supabase.com](https://supabase.com)
2. Sign up/Login and create a new project
3. Choose a region close to you
4. Wait for the project to be ready (2-3 minutes)

### 2. Get Your Supabase Credentials
1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (starts with `https://`)
   - **anon public** key (starts with `eyJ`)
   - **service_role** key (starts with `eyJ`)

### 3. Set Up Environment Variables
1. Copy `env.example` to `.env.local`:
   ```bash
   cp env.example .env.local
   ```

2. Edit `.env.local` and replace the placeholder values:
   ```env
   # Site Access
   SITE_ACCESS_PASSWORD=frenchies2024
   ADMIN_PASSWORD=admin_dev_password

   # Supabase (replace with your actual values)
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

   # Optional
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

### 4. Set Up Database Schema
1. In your Supabase dashboard, go to **SQL Editor**
2. Copy the contents of `lib/database-setup.sql`
3. Paste it into the SQL editor and click **Run**
4. This will create all tables and insert the default data

### 5. Start Development Server
```bash
npm run dev
```

Your app will be available at `http://localhost:3000`

## 📋 What's Been Set Up

### ✅ Database Structure
- **Properties table** - Property information and WiFi details
- **Alerts table** - Important warnings and notices
- **Dogs table** - Pet profiles with feeding, medicine, and care instructions
- **Service People table** - Scheduled service visits and payments
- **Appointments table** - Vet visits and other scheduled events
- **House Instructions table** - Home system instructions
- **Access Logs table** - Track who accessed the system when

### ✅ TypeScript Types
- Complete type definitions for all database entities
- Local data structure types for backward compatibility

### ✅ Database Service Layer
- CRUD operations for all entities
- Error handling and logging
- Proper TypeScript typing

### ✅ Default Data
- Your existing property information
- All current alerts and warnings
- Pâté and Barolo's complete profiles
- House instructions for all systems
- Service people and appointments

## 🔄 Next Steps

1. **Test the connection** - Make sure your app loads without errors
2. **Verify data** - Check that all your existing information appears correctly
3. **Test admin mode** - Ensure the admin toggle still works
4. **Implement authentication** - Connect the login system to the database
5. **Add CRUD operations** - Make the admin panel functional

## 🐛 Troubleshooting

### Common Issues

**"Invalid API key" error:**
- Double-check your environment variables in `.env.local`
- Make sure there are no extra spaces or quotes

**"Table doesn't exist" error:**
- Run the SQL setup script in Supabase SQL Editor
- Check that all tables were created successfully

**"Network error" or connection issues:**
- Verify your Supabase project URL is correct
- Check that your project is not paused (free tier pauses after inactivity)

### Getting Help
- Check the Supabase dashboard for any error messages
- Look at the browser console for client-side errors
- Check the terminal where `npm run dev` is running for server errors

## 📝 Notes

- The default property ID is hardcoded as `00000000-0000-0000-0000-000000000001`
- All existing functionality should work exactly the same
- The app will fall back to mock data if database connection fails
- Environment variables are loaded automatically by Next.js

---

**Ready to continue?** Once you've completed the setup above, we can move on to implementing the authentication system and connecting the admin panel to the database!
