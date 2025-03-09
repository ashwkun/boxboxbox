import React, { useState, useEffect } from 'react';

// Define emotion types
export type MoodType = 
  | 'LOVED_IT' 
  | 'ENJOYED_IT' 
  | 'MEH' 
  | 'DISAPPOINTED' 
  | 'REGRET';

// Details for each mood
export const MOOD_DETAILS = {
  LOVED_IT: {
    emoji: '😍',
    label: 'Loved it!',
    description: 'Absolutely amazing',
    value: 5.0,
    color: 'from-pink-500 to-red-500',
    glow: 'shadow-[0_0_15px_rgba(244,114,182,0.7)]'
  },
  ENJOYED_IT: {
    emoji: '😊',
    label: 'Enjoyed it',
    description: 'Really good',
    value: 4.0,
    color: 'from-green-400 to-blue-500',
    glow: 'shadow-[0_0_15px_rgba(96,165,250,0.7)]'
  },
  MEH: {
    emoji: '😐',
    label: 'Meh',
    description: 'It was okay',
    value: 3.0,
    color: 'from-yellow-400 to-orange-400',
    glow: 'shadow-[0_0_15px_rgba(251,191,36,0.7)]'
  },
  DISAPPOINTED: {
    emoji: '😕',
    label: 'Disappointed',
    description: 'Not what I expected',
    value: 2.0,
    color: 'from-blue-400 to-indigo-500',
    glow: 'shadow-[0_0_15px_rgba(99,102,241,0.7)]'
  },
  REGRET: {
    emoji: '😫',
    label: 'Regret',
    description: 'Waste of time',
    value: 1.0,
    color: 'from-purple-500 to-indigo-600',
    glow: 'shadow-[0_0_15px_rgba(139,92,246,0.7)]'
  }
} as const;

// Helper to get numerical value from mood
export const getMoodValue = (mood: MoodType): number => {
  return MOOD_DETAILS[mood].value;
};

// Helper to get mood from numerical value
export const getMoodFromValue = (value: number): MoodType => {
  let minDiff = Number.MAX_VALUE;
  let closestMood: MoodType = 'MEH';

  (Object.entries(MOOD_DETAILS) as [MoodType, typeof MOOD_DETAILS[MoodType]][]).forEach(([mood, details]) => {
    const diff = Math.abs(details.value - value);
    if (diff < minDiff) {
      minDiff = diff;
      closestMood = mood;
    }
  });

  return closestMood;
};

interface MoodRatingProps {
  value?: MoodType | number;
  onChange?: (mood: MoodType, wouldRewatch?: boolean) => void;
  showLabels?: boolean;
  showDescription?: boolean;
  size?: 'sm' | 'md' | 'lg';
  withRewatch?: boolean;
  disabled?: boolean;
  className?: string;
  animated?: boolean;
}

const MoodRating: React.FC<MoodRatingProps> = ({
  value,
  onChange,
  showLabels = false,
  showDescription = false,
  size = 'md',
  withRewatch = false,
  disabled = false,
  className = '',
  animated = true,
}) => {
  // Convert numeric value to mood if needed
  const initialMood = typeof value === 'number' 
    ? getMoodFromValue(value) 
    : value || null;

  const [selectedMood, setSelectedMood] = useState<MoodType | null>(initialMood);
  const [hoveredMood, setHoveredMood] = useState<MoodType | null>(null);
  const [wouldRewatch, setWouldRewatch] = useState(false);
  
  // Update state if props change
  useEffect(() => {
    if (value) {
      const newMood = typeof value === 'number' ? getMoodFromValue(value) : value;
      setSelectedMood(newMood);
    }
  }, [value]);
  
  // Size classes for the emotion buttons
  const sizeClasses = {
    sm: 'text-lg p-1.5',
    md: 'text-2xl p-2',
    lg: 'text-4xl p-3',
  };

  // Handle mood selection
  const handleMoodSelect = (mood: MoodType) => {
    if (disabled) return;
    
    setSelectedMood(mood);
    onChange?.(mood, wouldRewatch);
  };

  // Toggle rewatch button
  const handleRewatchToggle = () => {
    if (disabled) return;
    
    const newValue = !wouldRewatch;
    setWouldRewatch(newValue);
    
    if (selectedMood) {
      onChange?.(selectedMood, newValue);
    }
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* Mood buttons */}
      <div className="flex items-center gap-1 md:gap-2">
        {(Object.entries(MOOD_DETAILS) as [MoodType, typeof MOOD_DETAILS[MoodType]][]).map(([mood, details]) => {
          const isSelected = selectedMood === mood;
          const isHovered = hoveredMood === mood;

          return (
            <div key={mood} className="flex flex-col items-center">
              <button
                type="button"
                className={`
                  relative rounded-full
                  transition-all duration-200
                  ${sizeClasses[size]}
                  ${isSelected 
                    ? `bg-gradient-to-r ${details.color} transform scale-110 ${details.glow} text-white` 
                    : 'hover:bg-gray-100'}
                  ${animated && 'hover:scale-110 active:scale-95'}
                  ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}
                onClick={() => handleMoodSelect(mood)}
                onMouseEnter={() => setHoveredMood(mood)}
                onMouseLeave={() => setHoveredMood(null)}
                disabled={disabled}
                aria-label={details.label}
                style={{
                  transition: 'all 0.2s ease-in-out',
                }}
              >
                <span 
                  role="img" 
                  aria-hidden="true"
                  className={`${animated ? 'transform transition-transform duration-300' : ''} ${isSelected ? 'animate-pulse' : ''}`}
                  style={isSelected && animated ? { 
                    animation: 'floating 2s ease-in-out infinite',
                  } : {}}
                >
                  {details.emoji}
                </span>

                {/* Tooltip */}
                {isHovered && !showLabels && (
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded whitespace-nowrap z-10">
                    {details.label}
                  </div>
                )}
              </button>

              {/* Labels (optional) */}
              {showLabels && (
                <span className={`mt-1 text-xs font-medium whitespace-nowrap 
                  ${isSelected ? 'text-primary font-semibold' : 'text-gray-600'}`}
                >
                  {details.label}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Description (optional) */}
      {showDescription && selectedMood && (
        <div className="mt-2 text-sm font-medium text-gray-600 text-center animate-fadeIn">
          {MOOD_DETAILS[selectedMood].description}
        </div>
      )}

      {/* Would Rewatch Toggle (optional) */}
      {withRewatch && selectedMood && (
        <button
          onClick={handleRewatchToggle}
          disabled={disabled}
          className={`
            mt-4 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
            transition-all duration-300
            ${wouldRewatch 
              ? 'bg-gradient-to-r from-secondary to-primary text-white shadow-lg transform scale-105' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:shadow-md'}
            ${animated ? 'hover:scale-105 active:scale-95' : ''}
          `}
        >
          <span 
            role="img" 
            aria-hidden="true" 
            className={`text-lg ${wouldRewatch && animated ? 'animate-spin' : ''}`}
            style={wouldRewatch && animated ? { 
              animationDuration: '3s',
              animationTimingFunction: 'linear',
              animationIterationCount: 'infinite'
            } : {}}
          >
            {wouldRewatch ? '🔄' : '⭕'}
          </span>
          <span>{wouldRewatch ? 'Would watch again!' : 'Would you watch this again?'}</span>
        </button>
      )}
      
      <style>
        {`
          @keyframes floating {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-5px); }
            100% { transform: translateY(0px); }
          }
          
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          .animate-pulse {
            animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }
          
          .animate-fadeIn {
            animation: fadeIn 0.5s ease-in-out;
          }
          
          @keyframes pulse {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.7;
            }
          }
        `}
      </style>
    </div>
  );
};

export default MoodRating; 