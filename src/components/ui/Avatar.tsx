import React from 'react';

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type AvatarStatus = 'online' | 'offline' | 'away' | 'busy' | 'none';

interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: AvatarSize;
  status?: AvatarStatus;
  square?: boolean;
  className?: string;
  onClick?: () => void;
}

const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = '',
  name = '',
  size = 'md',
  status = 'none',
  square = false,
  className = '',
  onClick,
}) => {
  // Generate initials from name if no src is provided
  const initials = name
    ? name
        .split(' ')
        .map(part => part[0])
        .join('')
        .toUpperCase()
        .substring(0, 2)
    : '';

  // Size classes
  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-14 h-14 text-lg',
    xl: 'w-20 h-20 text-xl',
  };

  // Status color classes
  const statusColorClasses = {
    online: 'bg-success',
    offline: 'bg-gray-400',
    away: 'bg-warning',
    busy: 'bg-error',
    none: '',
  };

  // Get shape class
  const shapeClass = square ? 'rounded-md' : 'rounded-full';

  return (
    <div className={`relative inline-flex flex-shrink-0 ${onClick ? 'cursor-pointer' : ''}`} onClick={onClick}>
      {src ? (
        <img
          src={src}
          alt={alt || name}
          className={`object-cover ${shapeClass} ${sizeClasses[size]} ${className}`}
        />
      ) : (
        <div
          className={`flex items-center justify-center ${shapeClass} ${
            sizeClasses[size]
          } bg-gray-200 text-gray-600 font-medium ${className}`}
          aria-label={alt || name}
        >
          {initials}
        </div>
      )}
      
      {status !== 'none' && (
        <span
          className={`absolute bottom-0 right-0 rounded-full ${statusColorClasses[status]} border-2 border-white`}
          style={{
            width: size === 'xs' ? '0.5rem' : size === 'sm' ? '0.75rem' : '1rem',
            height: size === 'xs' ? '0.5rem' : size === 'sm' ? '0.75rem' : '1rem',
          }}
        ></span>
      )}
    </div>
  );
};

export default Avatar; 