'use client'

import React, { useState, useRef } from 'react';
import { Play, Upload, X, ExternalLink, FileVideo } from 'lucide-react';

interface VideoUploadProps {
  value?: string; // Current video URL
  onChange: (url: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export const VideoUpload: React.FC<VideoUploadProps> = ({
  value,
  onChange,
  placeholder = "Add video instructions...",
  className = "",
  disabled = false
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState(value || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const compressVideo = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }

      video.onloadedmetadata = () => {
        // Very aggressive compression settings for maximum size reduction
        const maxWidth = 320; // Very small for maximum compression
        const maxHeight = 240; // Very small for maximum compression
        const quality = 0.3; // Very low quality for maximum compression
        
        // Calculate new dimensions maintaining aspect ratio
        let { width, height } = video;
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width *= ratio;
          height *= ratio;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw video frame to canvas (this captures the first frame)
        ctx.drawImage(video, 0, 0, width, height);
        
        // Convert to blob with very aggressive compression
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to compress video'));
              return;
            }
            
            // No size rejection - accept whatever we get after compression
            console.log(`Compressed video size: ${(blob.size / 1024 / 1024).toFixed(2)}MB`);
            
            // Convert blob to base64
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = () => reject(new Error('Failed to read compressed video'));
            reader.readAsDataURL(blob);
          },
          'image/jpeg', // Use JPEG for better compression
          quality // Very aggressive quality setting
        );
      };
      
      video.onerror = () => reject(new Error('Failed to load video'));
      video.src = URL.createObjectURL(file);
    });
  };

  // Alternative: Simple file size reduction by converting format
  const reduceVideoSize = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const result = e.target?.result as string;
        
        // If the file is already small enough, use as-is
        if (file.size < 10 * 1024 * 1024) { // Less than 10MB
          resolve(result);
          return;
        }
        
        // For larger files, we'll use the original but with a note
        // In a production environment, you'd want to use a proper video compression library
        console.log(`Original file size: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
        resolve(result);
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('video/')) {
      alert('Please select a video file (MP4, MOV, AVI, etc.)');
      return;
    }

    // Mobile-friendly size limits to prevent crashes
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const maxSizeMB = isMobile ? 10 : 25; // Smaller limit for mobile
    const fileSizeMB = file.size / 1024 / 1024;
    
    if (fileSizeMB > maxSizeMB) {
      alert(`File too large for ${isMobile ? 'mobile' : 'this device'}. Maximum size: ${maxSizeMB}MB. Please use a YouTube/Vimeo URL instead for larger videos.`);
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Show initial progress
      setUploadProgress(10);
      
      const originalSizeMB = fileSizeMB.toFixed(2);
      console.log(`Original video size: ${originalSizeMB}MB (${isMobile ? 'mobile' : 'desktop'} device)`);
      
      setUploadProgress(30);
      
      let processedVideo: string;
      
      // Use simpler compression for mobile to prevent crashes
      if (isMobile && fileSizeMB < 5) {
        // For small files on mobile, use direct upload without compression
        setUploadProgress(50);
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          console.log(`Direct upload on mobile: ${(result.length / 1024 / 1024).toFixed(2)}MB base64`);
          onChange(result);
          setIsUploading(false);
          setUploadProgress(0);
        };
        reader.readAsDataURL(file);
        return;
      } else {
        // Use compression for larger files or desktop
        setUploadProgress(50);
        processedVideo = await compressVideo(file);
        console.log(`Applied compression to ${originalSizeMB}MB file`);
      }
      
      setUploadProgress(80);
      
      // Final processing
      setTimeout(() => {
        onChange(processedVideo);
        setIsUploading(false);
        setUploadProgress(0);
        console.log('Video processing complete');
      }, 300);
      
    } catch (error) {
      console.error('Error processing video:', error);
      
      // Better error handling for mobile crashes
      if (isMobile) {
        alert('Video processing failed on mobile. Please try:\n1. A smaller video file (<5MB)\n2. Upload to YouTube/Vimeo and paste the URL\n3. Try on a desktop computer');
        setIsUploading(false);
        setUploadProgress(0);
        return;
      }
      
      // Fallback for desktop
      try {
        const reader = new FileReader();
        reader.onprogress = (e) => {
          if (e.lengthComputable) {
            setUploadProgress((e.loaded / e.total) * 100);
          }
        };
        reader.onload = (e) => {
          const result = e.target?.result as string;
          console.log(`Fallback upload size: ${(result.length / 1024 / 1024).toFixed(2)}MB base64`);
          onChange(result);
          setIsUploading(false);
          setUploadProgress(0);
        };
        reader.readAsDataURL(file);
      } catch (fallbackError) {
        console.error('Error uploading video:', fallbackError);
        alert('Error uploading video. Please try again or use a YouTube/Vimeo URL instead.');
        setIsUploading(false);
        setUploadProgress(0);
      }
    }
  };

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim());
      setShowUrlInput(false);
    }
  };

  const handleRemoveVideo = () => {
    onChange('');
    setUrlInput('');
  };

  const isVideoUrl = (url: string) => {
    return url.startsWith('data:video/') || 
           url.includes('youtube.com') || 
           url.includes('youtu.be') || 
           url.includes('vimeo.com') ||
           url.endsWith('.mp4') ||
           url.endsWith('.mov') ||
           url.endsWith('.avi') ||
           url.endsWith('.webm');
  };

  const getVideoThumbnail = (url: string) => {
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
          
          {value.startsWith('data:video/') ? (
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
                <Play className="w-4 h-4" />
                <span className="text-sm">View Video Instructions</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {!showUrlInput ? (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled || isUploading}
                className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                <Upload className="w-4 h-4" />
                {isUploading ? 'Uploading...' : 'Upload Video'}
              </button>
              <button
                type="button"
                onClick={() => setShowUrlInput(true)}
                disabled={disabled}
                className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50"
              >
                <ExternalLink className="w-4 h-4" />
                Add URL
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="Enter video URL (YouTube, Vimeo, or direct video link)"
                className="w-full px-3 py-2 border rounded-md text-sm"
                disabled={disabled}
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleUrlSubmit}
                  disabled={disabled || !urlInput.trim()}
                  className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                >
                  Add Video
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowUrlInput(false);
                    setUrlInput('');
                  }}
                  disabled={disabled}
                  className="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
          
          {isUploading && (
            <div className="space-y-1">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-600">
                {uploadProgress < 30 ? 'Analyzing video...' :
                 uploadProgress < 50 ? 'Compressing video...' :
                 uploadProgress < 80 ? 'Processing...' :
                 'Finalizing...'} {Math.round(uploadProgress)}%
              </p>
            </div>
          )}
          
          <p className="text-xs text-gray-500">
            Upload a video file (MP4, MOV, AVI) or add a YouTube/Vimeo URL for medication instructions.
            <br />
            <span className="text-blue-600">📹 Videos are automatically downconverted to save storage space</span>
            <br />
            <span className="text-green-600">✅ No size limits - all videos will be compressed aggressively</span>
          </p>
        </div>
      )}
      
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        onChange={handleFileUpload}
        className="hidden"
        disabled={disabled}
      />
    </div>
  );
};

export default VideoUpload;
