import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  bordered?: boolean;
  elevated?: boolean;
  onClick?: () => void;
}

// Card subcomponents
interface CardImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: 'square' | 'video' | 'portrait' | 'auto';
}

const CardImage: React.FC<CardImageProps> = ({ 
  src, 
  alt, 
  className = '',
  aspectRatio = 'auto' 
}) => {
  let aspectClasses = '';
  
  if (aspectRatio === 'square') {
    aspectClasses = 'aspect-square';
  } else if (aspectRatio === 'video') {
    aspectClasses = 'aspect-video';
  } else if (aspectRatio === 'portrait') {
    aspectClasses = 'aspect-[2/3]';
  }
  
  return (
    <div className={`w-full overflow-hidden ${aspectClasses} ${className}`}>
      <img 
        src={src} 
        alt={alt} 
        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" 
      />
    </div>
  );
};

interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'small' | 'medium' | 'large';
}

const CardBody: React.FC<CardBodyProps> = ({ 
  children, 
  className = '',
  padding = 'medium'
}) => {
  let paddingClasses = '';
  
  if (padding === 'none') {
    paddingClasses = 'p-0';
  } else if (padding === 'small') {
    paddingClasses = 'p-3';
  } else if (padding === 'medium') {
    paddingClasses = 'p-4';
  } else if (padding === 'large') {
    paddingClasses = 'p-6';
  }
  
  return (
    <div className={`${paddingClasses} ${className}`}>
      {children}
    </div>
  );
};

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}

const CardTitle: React.FC<CardTitleProps> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <h3 className={`text-xl font-semibold text-gray-900 mb-2 ${className}`}>
      {children}
    </h3>
  );
};

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
  bordered?: boolean;
}

const CardFooter: React.FC<CardFooterProps> = ({ 
  children, 
  className = '',
  bordered = true
}) => {
  const borderClass = bordered ? 'border-t border-gray-100' : '';
  
  return (
    <div className={`p-4 bg-gray-50 ${borderClass} ${className}`}>
      {children}
    </div>
  );
};

// Define the type for the Card component with its subcomponents
interface CardComponent extends React.FC<CardProps> {
  Image: React.FC<CardImageProps>;
  Body: React.FC<CardBodyProps>;
  Title: React.FC<CardTitleProps>;
  Footer: React.FC<CardFooterProps>;
}

// Create the Card component
const Card: CardComponent = ({
  children,
  className = '',
  hoverable = false,
  bordered = false,
  elevated = true,
  onClick,
}) => {
  // Build class names
  const baseClasses = 'card bg-white rounded-lg overflow-hidden transition-all duration-normal';
  
  let classes = baseClasses;
  
  if (elevated) {
    classes += ' shadow-md';
  }
  
  if (bordered) {
    classes += ' border border-gray-200';
  }
  
  if (hoverable) {
    classes += ' hover:-translate-y-1 hover:shadow-lg';
  }
  
  if (onClick) {
    classes += ' cursor-pointer';
  }
  
  // Add custom classes
  if (className) {
    classes += ` ${className}`;
  }
  
  return (
    <div 
      className={classes}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

// Attach subcomponents to Card
Card.Image = CardImage;
Card.Body = CardBody;
Card.Title = CardTitle;
Card.Footer = CardFooter;

export default Card; 