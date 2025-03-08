import React from 'react';
import { motion } from 'framer-motion';

interface MediaGridProps {
  title?: string;
  children: React.ReactNode;
}

const MediaGrid: React.FC<MediaGridProps> = ({ title, children }) => {
  // Filter out null or undefined children (items without posters)
  const validChildren = React.Children.toArray(children).filter(Boolean);

  if (validChildren.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No items to display</p>
      </div>
    );
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };
  
  return (
    <div className="mb-12">
      {title && (
        <h2 className="text-xl font-semibold text-primary mb-6 pl-4 border-l-4 border-primary">
          {title}
        </h2>
      )}
      <motion.div 
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {validChildren}
      </motion.div>
    </div>
  );
};

export default MediaGrid; 