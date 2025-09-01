# 🚀 Deployment Guide

## Step-by-Step Vercel Deployment

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment Variables
Create a `.env.local` file in your project root:
```bash
cp env.example .env.local
```

Edit `.env.local` with your values:
```env
SITE_ACCESS_PASSWORD=your_secure_password_here
ADMIN_PASSWORD=separate_admin_password
```

### 3. Test Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to test.

### 4. Deploy to Vercel

#### Option A: Vercel CLI
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Set environment variables
vercel env add SITE_ACCESS_PASSWORD production
vercel env add ADMIN_PASSWORD production
```

#### Option B: Vercel Dashboard
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Add environment variables in Settings → Environment Variables:
   - `SITE_ACCESS_PASSWORD`: your secure password
   - `ADMIN_PASSWORD`: your admin password
4. Deploy

### 5. Custom Domain (Optional)
1. Add domain in Vercel dashboard
2. Update DNS records with your domain provider
3. HTTPS is automatic in Vercel

### 6. Generate QR Code
Once deployed, generate a QR code with:
```
https://yourdomain.com?access=YOUR_PASSWORD
```

## Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `SITE_ACCESS_PASSWORD` | Password for sitter access | Yes |
| `ADMIN_PASSWORD` | Password for admin mode | Yes |
| `NEXT_PUBLIC_SITE_URL` | Your deployed URL | Optional |

## Troubleshooting

### Build Errors
- Ensure all dependencies are installed: `npm install`
- Check TypeScript errors: `npm run lint`

### Environment Variables Not Working
- Variables must be prefixed with `NEXT_PUBLIC_` to be available in browser
- Redeploy after adding new environment variables

### QR Code Not Working
- Ensure URL format: `https://yourdomain.com?access=PASSWORD`
- Test the URL manually first
