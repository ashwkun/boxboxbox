import React from 'react';

type BadgeVariant = 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'info' | 'default';
type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  rounded?: boolean;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  rounded = false,
  className = '',
}) => {
  // Build class names
  let classes = 'inline-flex items-center font-medium';
  
  // Size classes
  if (size === 'sm') {
    classes += ' text-xs px-1.5 py-0.5';
  } else if (size === 'md') {
    classes += ' text-sm px-2 py-1';
  } else if (size === 'lg') {
    classes += ' text-base px-2.5 py-1.5';
  }
  
  // Shape classes
  if (rounded) {
    classes += ' rounded-full';
  } else {
    classes += ' rounded';
  }
  
  // Variant classes
  switch (variant) {
    case 'primary':
      classes += ' bg-primary/10 text-primary';
      break;
    case 'secondary':
      classes += ' bg-secondary/10 text-secondary';
      break;
    case 'accent':
      classes += ' bg-accent/10 text-accent';
      break;
    case 'success':
      classes += ' bg-success/10 text-success';
      break;
    case 'warning':
      classes += ' bg-warning/10 text-warning';
      break;
    case 'error':
      classes += ' bg-error/10 text-error';
      break;
    case 'info':
      classes += ' bg-info/10 text-info';
      break;
    default:
      classes += ' bg-gray-100 text-gray-800';
  }
  
  // Add custom classes
  if (className) {
    classes += ` ${className}`;
  }
  
  return (
    <span className={classes}>
      {children}
    </span>
  );
};

export default Badge; 