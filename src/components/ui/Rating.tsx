import React, { useState } from 'react';

interface RatingProps {
  value?: number;
  max?: number;
  precision?: 0.5 | 1;
  size?: 'sm' | 'md' | 'lg';
  readonly?: boolean;
  showValue?: boolean;
  onChange?: (value: number) => void;
  className?: string;
}

const Rating: React.FC<RatingProps> = ({
  value = 0,
  max = 5,
  precision = 1,
  size = 'md',
  readonly = false,
  showValue = false,
  onChange,
  className = '',
}) => {
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  const [tempValue, setTempValue] = useState(value);

  // Generate an array of values based on the max and precision
  const valueArray = Array.from({ length: max / precision }, (_, i) => (i + 1) * precision);

  // Size classes
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  // Format the display value
  const formattedValue = tempValue.toFixed(precision === 0.5 ? 1 : 0);

  // Handle mouse enter on a star
  const handleMouseEnter = (val: number) => {
    if (readonly) return;
    setHoverValue(val);
  };

  // Handle mouse leave
  const handleMouseLeave = () => {
    if (readonly) return;
    setHoverValue(null);
  };

  // Handle click on a star
  const handleClick = (val: number) => {
    if (readonly) return;
    setTempValue(val);
    onChange?.(val);
  };

  // Check if a star should be active (filled)
  const isActive = (val: number) => {
    if (hoverValue !== null) {
      return val <= hoverValue;
    }
    return val <= tempValue;
  };

  // Check if a star should be half-filled
  const isHalf = (val: number) => {
    if (precision === 1) return false;
    if (hoverValue !== null) {
      return false; // No half-stars during hover
    }
    const previous = val - precision;
    return previous < tempValue && tempValue < val;
  };

  return (
    <div className={`flex items-center ${className}`}>
      <div className="flex" onMouseLeave={handleMouseLeave}>
        {valueArray.map((val) => (
          <div
            key={val}
            className={`${sizeClasses[size]} ${
              readonly ? 'cursor-default' : 'cursor-pointer'
            } text-gray-300`}
            onMouseEnter={() => handleMouseEnter(val)}
            onClick={() => handleClick(val)}
          >
            {isHalf(val) ? (
              <span className="relative inline-block">
                {/* Empty star as background */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="relative"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                {/* Half-filled overlay */}
                <span className="absolute inset-0 overflow-hidden w-1/2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="text-warning"
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                </span>
              </span>
            ) : isActive(val) ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="text-warning"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            )}
          </div>
        ))}
      </div>
      
      {showValue && (
        <span className="ml-2 font-medium text-sm">
          {formattedValue} / {max}
        </span>
      )}
    </div>
  );
};

export default Rating; 