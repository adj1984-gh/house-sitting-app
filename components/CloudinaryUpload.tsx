'use client'

import React, { useEffect, useRef } from 'react';
import { Upload, X, ExternalLink, FileVideo } from 'lucide-react';

interface CloudinaryUploadProps {
  value?: string; // Current video URL
  onChange: (url: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

declare global {
  interface Window {
    cloudinary: any;
  }
}

export const CloudinaryUpload: React.FC<CloudinaryUploadProps> = ({
  value,
  onChange,
  placeholder = "Add video instructions...",
  className = "",
  disabled = false
}) => {
  const widgetRef = useRef<any>(null);
  const cloudinaryRef = useRef<any>(null);

  useEffect(() => {
    // Load Cloudinary widget script
    const script = document.createElement('script');
    script.src = 'https://upload-widget.cloudinary.com/global/all.js';
    script.async = true;
    script.onload = () => {
      if (window.cloudinary) {
        cloudinaryRef.current = window.cloudinary;
      }
    };
    document.head.appendChild(script);

    return () => {
      // Cleanup
      if (widgetRef.current) {
        widgetRef.current.destroy();
      }
    };
  }, []);

  const openUploadWidget = () => {
    if (!cloudinaryRef.current || disabled) return;

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      alert('Cloudinary configuration missing. Please check environment variables.');
      return;
    }

    widgetRef.current = cloudinaryRef.current.createUploadWidget(
      {
        cloudName: cloudName,
        uploadPreset: uploadPreset,
        sources: ['local', 'url', 'camera'],
        resourceType: 'video',
        maxFileSize: 500000000, // 500MB - Cloudinary can handle much larger files
        folder: 'house-sitting-videos',
        cropping: false,
        showAdvancedOptions: false,
        multiple: false,
        defaultSource: 'local',
        // Video optimization settings
        eager: [
          { format: 'mp4', quality: 'auto' },
          { format: 'webm', quality: 'auto' }
        ],
        eager_async: true,
        // Allow large file uploads with progress tracking
        chunk_size: 6000000, // 6MB chunks for better upload reliability
        upload_large: true,
        styles: {
          palette: {
            window: '#FFFFFF',
            sourceBg: '#F4F4F5',
            windowBorder: '#90A0B3',
            tabIcon: '#0078FF',
            inactiveTabIcon: '#69778A',
            menuIcons: '#0078FF',
            link: '#0078FF',
            action: '#0078FF',
            inProgress: '#0078FF',
            complete: '#20B832',
            error: '#EA2727',
            textDark: '#000000',
            textLight: '#FFFFFF'
          }
        }
      },
      (error: any, result: any) => {
        if (!error && result && result.event === 'success') {
          console.log('Video uploaded successfully:', result.info);
          console.log(`Video size: ${(result.info.bytes / 1024 / 1024).toFixed(2)}MB`);
          onChange(result.info.secure_url);
        } else if (error) {
          console.error('Upload error:', error);
          if (error.status === 'error' && error.message) {
            alert(`Upload failed: ${error.message}`);
          } else if (error.status === 'abort') {
            console.log('Upload cancelled by user');
          } else {
            alert('Upload failed. Please try again or contact support if the problem persists.');
          }
        }
      }
    );

    widgetRef.current.open();
  };

  const handleRemoveVideo = () => {
    onChange('');
  };

  const isVideoUrl = (url: string) => {
    return url.includes('cloudinary.com') || 
           url.includes('youtube.com') || 
           url.includes('youtu.be') || 
           url.includes('vimeo.com') ||
           url.endsWith('.mp4') ||
           url.endsWith('.mov') ||
           url.endsWith('.avi') ||
           url.endsWith('.webm');
  };

  const getVideoThumbnail = (url: string) => {
    if (url.includes('cloudinary.com')) {
      // Cloudinary thumbnail
      return url.replace('/upload/', '/upload/w_300,h_auto,c_fill/');
    }
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = url.includes('youtu.be') 
        ? url.split('youtu.be/')[1]?.split('?')[0]
        : url.split('v=')[1]?.split('&')[0];
      return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    }
    return null;
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {value && isVideoUrl(value) ? (
        <div className="relative bg-gray-100 rounded-lg p-3 border">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <FileVideo className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">Video Instructions</span>
            </div>
            <button
              type="button"
              onClick={handleRemoveVideo}
              className="text-red-600 hover:text-red-800"
              disabled={disabled}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          {value.includes('cloudinary.com') ? (
            <div className="relative">
              <video 
                controls 
                className="w-full max-w-xs rounded border"
                poster={getVideoThumbnail(value) || undefined}
              >
                <source src={value} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <a 
                href={value} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
              >
                <ExternalLink className="w-4 h-4" />
                <span className="text-sm">View Video Instructions</span>
              </a>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          <button
            type="button"
            onClick={openUploadWidget}
            disabled={disabled}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 w-full justify-center"
          >
            <Upload className="w-4 h-4" />
            Upload Video Instructions
          </button>
          
          <p className="text-xs text-gray-500 text-center">
            📹 Upload videos directly from your device, camera, or URL
            <br />
            ✅ Supports videos up to 500MB - no more size restrictions!
            <br />
            🚀 Automatic optimization and compression by Cloudinary
            <br />
            📱 Works perfectly on mobile and desktop
          </p>
        </div>
      )}
    </div>
  );
};

export default CloudinaryUpload;
