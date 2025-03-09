import { motion } from 'framer-motion';
import Image from 'next/image';

interface RatingCardProps {
  movie: {
    id: string;
    title: string;
    year: string;
    poster: string;
    runtime?: string;
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
  },
  center: {
    scale: 1,
    x: 0,
    y: 0,
    rotateY: '0deg',
    opacity: 1,
  },
  right: {
    scale: 0.8,
    x: '30%',
    y: 0,
    rotateY: '-15deg',
    opacity: 0.5,
  },
};

const ratingButtons = [
  { emoji: '🤩', text: 'GREAT!', color: 'bg-[#FF4D8F]' },
  { emoji: '😊', text: 'GOOD', color: 'bg-[#FF8D4D]' },
  { emoji: '😐', text: 'MEH', color: 'bg-[#FFD84D]' },
  { emoji: '🙅‍♂️', text: 'NOOO', color: 'bg-[#4D4D4D]' },
  { emoji: '🤔', text: 'THINKING', color: 'bg-[#4DCCFF]' },
];

export const RatingCard = ({ movie, isActive, position, onRate }: RatingCardProps) => {
  return (
    <motion.div
      className="absolute top-0 left-0 right-0 w-full max-w-md mx-auto"
      variants={cardVariants}
      initial={position}
      animate={position}
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
        />

        {/* Content Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent">
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
        </div>

        {/* Rating Buttons */}
        {isActive && (
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