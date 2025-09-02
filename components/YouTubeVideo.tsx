'use client'

import React from 'react';
import { X, ExternalLink, FileVideo, Play } from 'lucide-react';

interface YouTubeVideoProps {
  value?: string; // Current YouTube URL
  onChange: (url: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export const YouTubeVideo: React.FC<YouTubeVideoProps> = ({
  value,
  onChange,
  placeholder = "Add YouTube video instructions...",
  className = "",
  disabled = false
}) => {

  const handleRemoveVideo = () => {
    onChange('');
  };

  const isValidYouTubeUrl = (url: string) => {
    return url.includes('youtube.com') || url.includes('youtu.be');
  };

  const isYouTubeShorts = (url: string) => {
    return url.includes('youtube.com/shorts/');
  };

  const getVideoId = (url: string) => {
    console.log('Extracting video ID from URL:', url);
    
    // Handle YouTube Shorts
    if (url.includes('youtube.com/shorts/')) {
      const videoId = url.split('youtube.com/shorts/')[1]?.split('?')[0]?.split('&')[0];
      console.log('YouTube Shorts video ID:', videoId);
      console.log('Full URL parts:', url.split('youtube.com/shorts/'));
      return videoId;
    }
    // Handle regular YouTube videos
    else if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0]?.split('&')[0];
      console.log('youtu.be video ID:', videoId);
      return videoId;
    } else if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1]?.split('&')[0];
      console.log('youtube.com/watch video ID:', videoId);
      return videoId;
    } else if (url.includes('youtube.com/embed/')) {
      const videoId = url.split('embed/')[1]?.split('?')[0];
      console.log('youtube.com/embed video ID:', videoId);
      return videoId;
    }
    
    console.log('No video ID found for URL:', url);
    return null;
  };

  const getVideoThumbnail = (url: string) => {
    const videoId = getVideoId(url);
    if (videoId) {
      const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
      console.log('YouTube thumbnail URL:', thumbnailUrl);
      return thumbnailUrl;
    }
    console.log('No video ID found for URL:', url);
    return null;
  };

  // Debug logging
  console.log('YouTubeVideo component rendered with value:', value);
  console.log('Is valid YouTube URL:', value ? isValidYouTubeUrl(value) : false);
  if (value) {
    console.log('Video ID:', getVideoId(value));
    console.log('Thumbnail URL:', getVideoThumbnail(value));
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {value && isValidYouTubeUrl(value) ? (
        <div className="relative bg-gray-100 rounded-lg p-3 border">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <FileVideo className="w-4 h-4 text-red-600" />
              <span className="text-sm font-medium text-gray-700">
                {isYouTubeShorts(value) ? 'YouTube Short Instructions' : 'YouTube Video Instructions'}
              </span>
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
          
          <div className="space-y-2">
            <div className="relative">
              {isYouTubeShorts(value) ? (
                // For YouTube Shorts, show an embedded iframe
                <div className="relative w-full max-w-xs">
                  <iframe
                    width="315"
                    height="560"
                    src={`https://www.youtube.com/embed/${getVideoId(value)}`}
                    title="YouTube Short"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="rounded border w-full h-64"
                  ></iframe>
                </div>
              ) : getVideoThumbnail(value) ? (
                // For regular YouTube videos, show thumbnail
                <img 
                  src={getVideoThumbnail(value)!} 
                  alt="YouTube video thumbnail"
                  className="w-full max-w-xs rounded border cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => window.open(value, '_blank')}
                  onError={(e) => {
                    // Fallback to a default YouTube thumbnail if the image fails to load
                    const target = e.target as HTMLImageElement;
                    const videoId = getVideoId(value);
                    console.log('Thumbnail failed to load, trying fallback for video ID:', videoId);
                    if (videoId) {
                      // Try multiple fallback formats
                      const fallbackUrls = [
                        `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
                        `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
                        `https://img.youtube.com/vi/${videoId}/default.jpg`
                      ];
                      
                      let currentIndex = 0;
                      const tryNextFallback = () => {
                        if (currentIndex < fallbackUrls.length) {
                          target.src = fallbackUrls[currentIndex];
                          currentIndex++;
                        } else {
                          console.log('All thumbnail fallbacks failed');
                        }
                      };
                      
                      target.onerror = tryNextFallback;
                      tryNextFallback();
                    }
                  }}
                />
              ) : (
                <div 
                  className="w-full max-w-xs h-32 bg-gray-200 rounded border cursor-pointer hover:bg-gray-300 transition-colors flex items-center justify-center"
                  onClick={() => window.open(value, '_blank')}
                >
                  <div className="text-center">
                    <Play className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">YouTube Video</p>
                  </div>
                </div>
              )}
              {!isYouTubeShorts(value) && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-red-600 text-white rounded-full p-2 hover:bg-red-700 transition-colors">
                    <Play className="w-6 h-6" />
                  </div>
                </div>
              )}
            </div>
            <div className="space-y-1">
              <a 
                href={value} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-red-600 hover:text-red-800 text-sm"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Watch on YouTube</span>
              </a>
              <p className="text-xs text-gray-500">
                Click the thumbnail or link above to watch the video
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {/* YouTube URL Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              📺 YouTube Video URL
            </label>
            <input
              type="url"
              placeholder="https://www.youtube.com/watch?v=... or https://www.youtube.com/shorts/..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
              onChange={(e) => {
                const url = e.target.value;
                if (url && isValidYouTubeUrl(url)) {
                  onChange(url);
                }
              }}
              disabled={disabled}
            />
            <p className="text-xs text-green-600">
              ✅ No size limits - upload videos of any size to YouTube!
            </p>
            <details className="text-xs text-gray-600">
              <summary className="cursor-pointer text-red-600 hover:text-red-800">
                📋 How to upload to YouTube
              </summary>
              <div className="mt-2 pl-4 space-y-1">
                <p>1. Go to <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:underline">YouTube.com</a></p>
                <p>2. Click "Create" → "Upload video" or "Create Short"</p>
                <p>3. Upload your video (any size!)</p>
                <p>4. Set privacy to "Unlisted" (only people with link can see)</p>
                <p>5. Copy the video URL and paste it above</p>
                <p className="text-blue-600">💡 Works with both regular videos and YouTube Shorts!</p>
              </div>
            </details>
          </div>
        </div>
      )}
    </div>
  );
};

export default YouTubeVideo;
