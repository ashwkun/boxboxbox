import React, { forwardRef, useState } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  className?: string;
  variant?: 'outlined' | 'filled';
  inputSize?: 'sm' | 'md' | 'lg';
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  helperText,
  error,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className = '',
  variant = 'outlined',
  inputSize = 'md',
  type = 'text',
  disabled = false,
  required = false,
  ...props
}, ref) => {
  const [focused, setFocused] = useState(false);
  
  // Determine input container classes
  let containerClasses = 'relative flex flex-col';
  if (fullWidth) {
    containerClasses += ' w-full';
  }
  if (className) {
    containerClasses += ` ${className}`;
  }
  
  // Determine input wrapper classes
  let wrapperClasses = 'relative flex items-center';
  
  // Determine input classes
  let inputClasses = 'w-full transition-all duration-normal focus:outline-none focus:ring-0';
  
  if (disabled) {
    inputClasses += ' cursor-not-allowed opacity-60';
  }
  
  // Size classes
  if (inputSize === 'sm') {
    inputClasses += ' text-sm py-1.5 px-3';
  } else if (inputSize === 'md') {
    inputClasses += ' text-base py-2 px-4';
  } else if (inputSize === 'lg') {
    inputClasses += ' text-lg py-2.5 px-5';
  }
  
  // Variant classes
  if (variant === 'outlined') {
    wrapperClasses += ' bg-white border rounded-md';
    
    if (error) {
      wrapperClasses += ' border-error';
      if (focused) {
        wrapperClasses += ' ring-2 ring-error/30';
      }
    } else if (focused) {
      wrapperClasses += ' border-primary ring-2 ring-primary/30';
    } else {
      wrapperClasses += ' border-gray-300 hover:border-gray-400';
    }
  } else if (variant === 'filled') {
    wrapperClasses += ' bg-gray-100 border border-transparent rounded-md';
    
    if (error) {
      wrapperClasses += ' bg-error/10';
      if (focused) {
        wrapperClasses += ' ring-2 ring-error/30';
      }
    } else if (focused) {
      wrapperClasses += ' bg-white border-primary ring-2 ring-primary/30';
    } else {
      wrapperClasses += ' hover:bg-gray-200';
    }
  }
  
  // Adjust padding based on icons
  if (leftIcon) {
    inputClasses += ' pl-10';
  }
  
  if (rightIcon) {
    inputClasses += ' pr-10';
  }
  
  return (
    <div className={containerClasses}>
      {label && (
        <label className="mb-1.5 text-sm font-medium text-gray-700">
          {label}
          {required && <span className="ml-1 text-error">*</span>}
        </label>
      )}
      
      <div className={wrapperClasses}>
        {leftIcon && (
          <div className="absolute left-0 pl-3 flex items-center justify-center text-gray-500">
            {leftIcon}
          </div>
        )}
        
        <input
          ref={ref}
          className={inputClasses}
          type={type}
          disabled={disabled}
          required={required}
          onFocus={(e) => {
            setFocused(true);
            props.onFocus && props.onFocus(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            props.onBlur && props.onBlur(e);
          }}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute right-0 pr-3 flex items-center justify-center text-gray-500">
            {rightIcon}
          </div>
        )}
      </div>
      
      {(helperText || error) && (
        <p className={`mt-1.5 text-sm ${error ? 'text-error' : 'text-gray-500'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input; 