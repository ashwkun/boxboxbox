import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
}

interface VideoSectionProps {
  videos: Video[];
}

const VideoSection: React.FC<VideoSectionProps> = ({ videos }) => {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  
  // Only get videos from YouTube
  const youtubeVideos = videos?.filter(video => video.site.toLowerCase() === 'youtube') || [];
  
  // Get trailers and teasers first
  const sortedVideos = [...youtubeVideos].sort((a, b) => {
    const aIsTrailer = a.type.toLowerCase().includes('trailer');
    const bIsTrailer = b.type.toLowerCase().includes('trailer');
    const aIsTeaser = a.type.toLowerCase().includes('teaser');
    const bIsTeaser = b.type.toLowerCase().includes('teaser');
    
    if (aIsTrailer && !bIsTrailer) return -1;
    if (!aIsTrailer && bIsTrailer) return 1;
    if (aIsTeaser && !bIsTeaser) return -1;
    if (!aIsTeaser && bIsTeaser) return 1;
    
    return 0;
  });
  
  // Display up to 4 videos
  const displayVideos = sortedVideos.slice(0, 4);
  
  // Set the first video as active by default if there are videos
  React.useEffect(() => {
    if (displayVideos.length > 0 && !activeVideo) {
      setActiveVideo(displayVideos[0].key);
    }
  }, [displayVideos, activeVideo]);
  
  if (displayVideos.length === 0) {
    return null;
  }
  
  return (
    <div className="my-8">
      <h2 className="text-xl font-semibold mb-4">Videos</h2>
      
      <div className="space-y-4">
        {/* Main Video Player */}
        <div className="relative pt-[56.25%] bg-black rounded-lg overflow-hidden shadow-lg">
          <AnimatePresence mode="wait">
            {activeVideo && (
              <motion.iframe
                key={activeVideo}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute top-0 left-0 w-full h-full"
                src={`https://www.youtube.com/embed/${activeVideo}?autoplay=0&rel=0`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></motion.iframe>
            )}
          </AnimatePresence>
        </div>
        
        {/* Video Thumbnails */}
        {displayVideos.length > 1 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {displayVideos.map((video) => (
              <motion.button
                key={video.key}
                className={`relative overflow-hidden rounded-md ${
                  activeVideo === video.key 
                    ? 'ring-2 ring-primary' 
                    : 'hover:ring-2 hover:ring-gray-300'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveVideo(video.key)}
              >
                <img
                  src={`https://img.youtube.com/vi/${video.key}/mqdefault.jpg`}
                  alt={video.name}
                  className="w-full aspect-video object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <div className="text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-1">
                  <p className="text-xs truncate">{video.name}</p>
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoSection; 