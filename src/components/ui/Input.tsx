import React, { forwardRef } from 'react';

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
  multiline?: boolean;
  rows?: number;
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
  multiline = false,
  rows = 4,
  disabled = false,
  required = false,
  id,
  ...restProps
}, ref) => {
  // Generate random ID if not provided
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  
  // Determine size classes
  const sizeClasses = {
    sm: 'py-1 px-3 text-sm',
    md: 'py-2 px-4 text-base',
    lg: 'py-3 px-4 text-lg',
  };
  
  // Determine variant classes
  const variantClasses = {
    outlined: 'bg-white border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary',
    filled: 'bg-gray-100 border border-transparent focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary',
  };
  
  // Base input classes
  const baseInputClasses = `
    block
    w-full
    rounded-md
    ${sizeClasses[inputSize]}
    ${variantClasses[variant]}
    ${disabled ? 'opacity-60 cursor-not-allowed bg-gray-100' : 'hover:border-gray-400'}
    ${error ? 'border-error focus:border-error focus:ring-error' : ''}
    ${fullWidth ? 'w-full' : ''}
    transition-colors duration-200
    focus:outline-none
  `;
  
  // Adjust padding for icons
  const inputPaddingClasses = `
    ${leftIcon ? 'pl-10' : ''}
    ${rightIcon ? 'pr-10' : ''}
  `;
  
  // Common props for input and textarea
  const commonProps = {
    id: inputId,
    className: `${baseInputClasses} ${inputPaddingClasses} ${className}`,
    disabled,
    required,
    "aria-invalid": error ? "true" : "false" as "true" | "false",
    "aria-describedby": error || helperText ? `${inputId}-description` : undefined,
  };
  
  return (
    <div className={`${fullWidth ? 'w-full' : ''}`}>
      {label && (
        <label 
          htmlFor={inputId}
          className={`block mb-1.5 text-sm font-medium ${
            disabled ? 'text-gray-500' : 'text-gray-700'
          }`}
        >
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-0 pl-3 flex items-center justify-center text-gray-500">
            {leftIcon}
          </div>
        )}
        
        {multiline ? (
          <textarea
            id={inputId}
            className={`${baseInputClasses} ${inputPaddingClasses} ${className}`}
            disabled={disabled}
            required={required}
            rows={rows}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={error || helperText ? `${inputId}-description` : undefined}
            {...(restProps as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
          />
        ) : (
          <input
            ref={ref}
            {...commonProps}
            {...restProps}
          />
        )}
        
        {rightIcon && (
          <div className="absolute right-0 pr-3 flex items-center justify-center text-gray-500">
            {rightIcon}
          </div>
        )}
      </div>
      
      {(helperText || error) && (
        <p className={`mt-1.5 text-sm ${error ? 'text-error' : 'text-gray-500'}`} id={`${inputId}-description`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input; 