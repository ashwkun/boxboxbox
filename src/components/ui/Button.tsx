import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'accent' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  // Base classes for all buttons
  let classes = 'btn inline-flex items-center justify-center font-medium transition-all rounded-md';
  
  // Size classes
  if (size === 'sm') {
    classes += ' text-sm py-1.5 px-3';
  } else if (size === 'md') {
    classes += ' text-base py-2 px-4';
  } else if (size === 'lg') {
    classes += ' text-lg py-2.5 px-5';
  }
  
  // Variant classes
  if (variant === 'primary') {
    classes += ' bg-primary text-white hover:bg-primary-light focus:ring-2 focus:ring-primary/50';
  } else if (variant === 'secondary') {
    classes += ' bg-secondary text-white hover:bg-secondary-light focus:ring-2 focus:ring-secondary/50';
  } else if (variant === 'accent') {
    classes += ' bg-accent text-white hover:bg-accent-light focus:ring-2 focus:ring-accent/50';
  } else if (variant === 'tertiary') {
    classes += ' bg-transparent text-primary border border-primary hover:bg-primary/10 focus:ring-2 focus:ring-primary/30';
  } else if (variant === 'ghost') {
    classes += ' bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-2 focus:ring-gray-200';
  }
  
  // State classes
  if (isLoading || disabled) {
    classes += ' opacity-60 cursor-not-allowed';
  }
  
  // Width class
  if (fullWidth) {
    classes += ' w-full';
  }
  
  // Add custom classes from props
  if (className) {
    classes += ` ${className}`;
  }
  
  return (
    <button
      className={classes}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Loading...</span>
        </>
      ) : (
        <>
          {leftIcon && <span className="mr-2">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="ml-2">{rightIcon}</span>}
        </>
      )}
    </button>
  );
};

export default Button; 