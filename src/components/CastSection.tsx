import React from 'react';
import { motion } from 'framer-motion';
import { getImageUrl } from '../services/tmdb';

interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

interface CastSectionProps {
  cast: CastMember[];
}

const CastSection: React.FC<CastSectionProps> = ({ cast }) => {
  // Only show up to 10 cast members
  const displayCast = cast?.slice(0, 10) || [];
  
  return (
    <div className="my-8">
      <h2 className="text-xl font-semibold mb-4">Cast</h2>
      
      {displayCast.length > 0 ? (
        <div className="overflow-x-auto pb-2">
          <div className="flex space-x-4">
            {displayCast.map((person) => (
              <motion.div
                key={person.id}
                className="flex-shrink-0 w-32"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  {person.profile_path ? (
                    <img
                      src={getImageUrl(person.profile_path, 'w185') || ''}
                      alt={person.name}
                      className="w-full h-40 object-cover object-center"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-40 bg-gray-300 flex items-center justify-center">
                      <span className="text-gray-400 text-2xl">?</span>
                    </div>
                  )}
                  <div className="p-2">
                    <p className="font-medium text-sm truncate">{person.name}</p>
                    <p className="text-xs text-gray-500 truncate">{person.character}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-gray-500 italic">No cast information available.</p>
      )}
    </div>
  );
};

export default CastSection; 