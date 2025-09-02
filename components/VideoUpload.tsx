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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('video/')) {
      alert('Please select a video file (MP4, MOV, AVI, etc.)');
      return;
    }

    // Validate file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      alert('Video file must be smaller than 50MB');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // For now, we'll use a simple approach - convert to base64 for storage
      // In production, you'd want to upload to Supabase Storage
      const reader = new FileReader();
      reader.onprogress = (e) => {
        if (e.lengthComputable) {
          setUploadProgress((e.loaded / e.total) * 100);
        }
      };
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onChange(result);
        setIsUploading(false);
        setUploadProgress(0);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading video:', error);
      alert('Error uploading video. Please try again.');
      setIsUploading(false);
      setUploadProgress(0);
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
              <p className="text-xs text-gray-600">Uploading... {Math.round(uploadProgress)}%</p>
            </div>
          )}
          
          <p className="text-xs text-gray-500">
            Upload a video file (MP4, MOV, AVI) or add a YouTube/Vimeo URL for medication instructions
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
