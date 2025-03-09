import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface OnboardingLayoutProps {
  children: ReactNode;
  step: number;
  totalSteps: number;
}

export const OnboardingLayout = ({ children, step, totalSteps }: OnboardingLayoutProps) => {
  return (
    <div className="min-h-screen bg-[#121212] text-white">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-[#1E1E1E]">
        <motion.div
          className="h-full bg-gradient-to-r from-[#FF4D8F] to-[#FF8D4D]"
          initial={{ width: "0%" }}
          animate={{ width: `${(step / totalSteps) * 100}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-8">
          <motion.p
            className="font-display text-xl text-[rgba(255,255,255,0.7)]"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Step {step} of {totalSteps}
          </motion.p>
        </div>

        {/* Content Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}; 