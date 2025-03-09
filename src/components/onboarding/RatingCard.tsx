import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';

interface RatingCardProps {
  movie: {
    id: string;
    title: string;
    year: string;
    poster: string;
    runtime?: string;
    overview?: string;
  };
  isActive: boolean;
  position: 'left' | 'center' | 'right';
  onRate?: (rating: string) => void;
}

const cardVariants = {
  left: {
    scale: 0.8,
    x: '-30%',
    y: 0,
    rotateY: '15deg',
    opacity: 0.5,
    filter: 'blur(2px)',
  },
  center: {
    scale: 1,
    x: 0,
    y: 0,
    rotateY: '0deg',
    opacity: 1,
    filter: 'blur(0px)',
  },
  right: {
    scale: 0.8,
    x: '30%',
    y: 0,
    rotateY: '-15deg',
    opacity: 0.5,
    filter: 'blur(2px)',
  },
  exit: {
    scale: 0.8,
    opacity: 0,
    transition: { duration: 0.3 }
  }
};

const ratingButtons = [
  { emoji: '🤩', text: 'GREAT!', color: 'bg-[#FF4D8F]', gradient: 'from-[#FF4D8F] to-[#FF8D4D]' },
  { emoji: '😊', text: 'GOOD', color: 'bg-[#FF8D4D]', gradient: 'from-[#FF8D4D] to-[#FFD84D]' },
  { emoji: '😐', text: 'MEH', color: 'bg-[#FFD84D]', gradient: 'from-[#FFD84D] to-[#4D4D4D]' },
  { emoji: '🙅‍♂️', text: 'NOOO', color: 'bg-[#4D4D4D]', gradient: 'from-[#4D4D4D] to-[#2A2A2A]' },
  { emoji: '🤔', text: 'THINKING', color: 'bg-[#4DCCFF]', gradient: 'from-[#4DCCFF] to-[#4D8DFF]' },
];

export const RatingCard = ({ movie, isActive, position, onRate }: RatingCardProps) => {
  const controls = useAnimation();
  const [showDetails, setShowDetails] = useState(false);
  const [dragDirection, setDragDirection] = useState<string | null>(null);

  const handleDragEnd = (event: any, info: any) => {
    const threshold = 100;
    const xDrag = info.offset.x;
    const yDrag = info.offset.y;

    if (Math.abs(xDrag) > threshold || Math.abs(yDrag) > threshold) {
      let rating = '';
      if (yDrag < -threshold) rating = 'GREAT!';
      else if (xDrag > threshold) rating = 'GOOD';
      else if (xDrag < -threshold) rating = 'MEH';
      else if (yDrag > threshold) rating = 'NOOO';
      
      if (rating) {
        controls.start({
          x: xDrag * 2,
          y: yDrag * 2,
          opacity: 0,
          transition: { duration: 0.3 }
        }).then(() => {
          onRate?.(rating);
        });
      }
    } else {
      controls.start({ x: 0, y: 0 });
    }
    setDragDirection(null);
  };

  const handleDrag = (event: any, info: any) => {
    const { x, y } = info.offset;
    if (Math.abs(x) > Math.abs(y)) {
      setDragDirection(x > 0 ? 'right' : 'left');
    } else {
      setDragDirection(y > 0 ? 'down' : 'up');
    }
  };

  const getRatingFromDirection = (direction: string | null) => {
    switch (direction) {
      case 'up': return 'GREAT!';
      case 'right': return 'GOOD';
      case 'left': return 'MEH';
      case 'down': return 'NOOO';
      default: return null;
    }
  };

  const currentRating = getRatingFromDirection(dragDirection);

  return (
    <motion.div
      className="absolute top-0 left-0 right-0 w-full max-w-md mx-auto cursor-grab active:cursor-grabbing"
      variants={cardVariants}
      initial={position}
      animate={isActive ? controls : position}
      exit="exit"
      drag={isActive}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      onDragEnd={handleDragEnd}
      onDrag={handleDrag}
      whileHover={isActive ? { scale: 1.02 } : undefined}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 30,
      }}
    >
      <div className="relative aspect-[2/3] rounded-2xl overflow-hidden bg-[#1E1E1E] shadow-xl">
        {/* Poster Image */}
        <Image
          src={movie.poster}
          alt={movie.title}
          fill
          className="object-cover"
          priority
          onClick={() => isActive && setShowDetails(!showDetails)}
        />

        {/* Rating Indicator Overlay */}
        {dragDirection && isActive && (
          <motion.div
            className={`absolute inset-0 bg-gradient-to-b ${ratingButtons.find(b => b.text === currentRating)?.gradient || ''}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
          >
            <div className="flex items-center justify-center h-full">
              <motion.span
                className="text-6xl"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              >
                {ratingButtons.find(b => b.text === currentRating)?.emoji}
              </motion.span>
            </div>
          </motion.div>
        )}

        {/* Content Overlay */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent"
          animate={{ y: showDetails ? 0 : '100%' }}
        >
          <motion.h3
            className="font-display text-2xl mb-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {movie.title}
          </motion.h3>
          <motion.p
            className="text-[rgba(255,255,255,0.7)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {movie.year} {movie.runtime && `• ${movie.runtime}`}
          </motion.p>
          {showDetails && movie.overview && (
            <motion.p
              className="mt-4 text-sm text-[rgba(255,255,255,0.9)]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {movie.overview}
            </motion.p>
          )}
        </motion.div>

        {/* Rating Buttons */}
        {isActive && !showDetails && (
          <motion.div
            className="absolute top-1/2 -right-20 space-y-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            {ratingButtons.map((button) => (
              <motion.button
                key={button.text}
                className={`rating-button w-16 h-16 rounded-full ${button.color} 
                          flex items-center justify-center text-2xl shadow-lg`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onRate?.(button.text)}
              >
                {button.emoji}
              </motion.button>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}; 