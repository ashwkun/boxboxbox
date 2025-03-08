import React from 'react';

interface MediaGridProps {
  title?: string;
  children: React.ReactNode;
}

const MediaGrid: React.FC<MediaGridProps> = ({ title, children }) => {
  return (
    <div className="media-grid-container">
      {title && <h2 className="media-grid-title">{title}</h2>}
      <div className="media-grid">
        {children}
      </div>
    </div>
  );
};

export default MediaGrid; 