# Cloudinary Setup Guide

## Why Cloudinary?
Cloudinary solves your video size issues by:
- ✅ **No size limits** - Can handle videos up to 500MB+ (vs your current 25MB limit)
- ✅ **Automatic optimization** - Compresses videos automatically for web delivery
- ✅ **Multiple formats** - Generates MP4, WebM, and other formats automatically
- ✅ **CDN delivery** - Fast global video delivery
- ✅ **Mobile friendly** - Works perfectly on all devices
- ✅ **No crashes** - Handles large files without browser memory issues

## Setup Steps

### 1. Create Cloudinary Account
1. Go to [https://cloudinary.com](https://cloudinary.com)
2. Sign up for a free account (includes 25GB storage, 25GB bandwidth/month)
3. Note your **Cloud Name** from the dashboard

### 2. Create Upload Preset
1. In Cloudinary dashboard, go to **Settings** → **Upload**
2. Scroll down to **Upload presets**
3. Click **Add upload preset**
4. Configure:
   - **Preset name**: `house-sitting-videos` (or any name you prefer)
   - **Signing Mode**: `Unsigned` (allows direct uploads from your app)
   - **Folder**: `house-sitting-videos`
   - **Resource Type**: `Video`
   - **Access Mode**: `Public`
5. Click **Save**

### 3. Configure Environment Variables
Add these to your Vercel environment variables:

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name_here
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=house-sitting-videos
```

### 4. Test the Setup
1. Deploy your app with the new environment variables
2. Try uploading a large video (>100MB) in the admin interface
3. The video should upload successfully and play in the sitter view

## Benefits Over Current System

| Current System | Cloudinary System |
|---|---|
| 25MB max file size | 500MB+ max file size |
| Base64 encoding (33% larger) | Direct video URLs |
| Browser crashes on large files | No crashes, chunked uploads |
| Manual compression | Automatic optimization |
| Database storage bloat | External CDN storage |
| Slow loading | Fast global delivery |

## Cost
- **Free tier**: 25GB storage, 25GB bandwidth/month
- **Paid plans**: Start at $89/month for 100GB storage, 100GB bandwidth
- **Your usage**: Likely well within free tier for house sitting videos

## Migration
The system is already set up to use CloudinaryUpload component. Once you configure the environment variables, all video uploads will automatically use Cloudinary instead of the current base64 system.
