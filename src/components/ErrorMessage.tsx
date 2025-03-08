import React from 'react';
import { motion } from 'framer-motion';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  return (
    <motion.div 
      className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-6 flex flex-col items-center text-center"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-red-600 mb-4">
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
        </svg>
      </div>
      <p className="mb-4">{message}</p>
      {onRetry && (
        <button 
          className="btn bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
          onClick={onRetry}
        >
          Try Again
        </button>
      )}
    </motion.div>
  );
};

export default ErrorMessage; 