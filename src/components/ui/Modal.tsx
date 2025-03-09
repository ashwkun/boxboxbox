import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
  centered?: boolean;
  children: React.ReactNode;
  footer?: React.ReactNode;
  hasVideo?: boolean;
  className?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  size = 'md',
  closeOnOverlayClick = true,
  closeOnEsc = true,
  centered = false,
  children,
  footer,
  hasVideo = false,
  className = '',
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (closeOnEsc && event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = ''; // Restore scrolling when modal is closed
    };
  }, [isOpen, onClose, closeOnEsc]);

  // Handle clicking outside the modal
  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnOverlayClick && event.target === event.currentTarget) {
      onClose();
    }
  };

  // Size classes
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-screen-lg mx-4',
  };
  
  // Content padding classes
  const contentPadding = hasVideo ? 'p-0 overflow-hidden' : 'p-4';

  // If the modal is not open, don't render anything
  if (!isOpen) return null;

  // Create a portal to render the modal at the end of the document body
  return createPortal(
    <div
      className="fixed inset-0 z-50 flex overflow-y-auto bg-black bg-opacity-75 transition-opacity"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
      style={{ alignItems: centered ? 'center' : 'flex-start' }}
    >
      <div
        ref={modalRef}
        className={`relative m-auto ${centered ? '' : 'mt-16'} w-full 
        ${sizeClasses[size]} rounded-lg bg-white shadow-xl ${className}`}
        role="document"
      >
        {/* Header */}
        {title && (
          <div className={`flex items-center justify-between border-b border-gray-200 p-4 ${hasVideo ? 'absolute top-0 left-0 right-0 z-10 bg-gray-900/70 backdrop-blur-sm' : ''}`}>
            <h3 
              className={`text-lg font-semibold ${hasVideo ? 'text-white' : ''}`} 
              id="modal-title"
            >
              {title}
            </h3>
            <button
              type="button"
              className={`rounded-full p-1 ${hasVideo ? 'text-white hover:bg-gray-700' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'} focus:outline-none`}
              onClick={onClose}
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        
        {/* Body */}
        <div
          className={`${!title && !hasVideo ? 'pt-6' : ''} ${contentPadding}`}
        >
          {children}
        </div>
        
        {/* Footer */}
        {footer && (
          <div className={`border-t border-gray-200 p-4 ${hasVideo ? 'bg-gray-900 text-white' : ''}`}>
            {footer}
          </div>
        )}
      </div>
      
      <style>
        {`
          .aspect-w-16 {
            position: relative;
            padding-bottom: 56.25%;
          }
          
          .aspect-w-16 iframe {
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
          }
        `}
      </style>
    </div>,
    document.body
  );
};

export default Modal; 