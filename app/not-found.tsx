'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#121212] text-white flex flex-col items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="font-display text-8xl bg-gradient-to-r from-[#FF4D8F] to-[#FF8D4D] text-transparent bg-clip-text mb-4">
          404
        </h1>
        <p className="font-body text-xl text-white/70 mb-8">
          Oops! This page seems to have wandered off...
        </p>
        <a
          href="/"
          className="inline-block bg-gradient-to-r from-[#FF4D8F] to-[#FF8D4D] px-6 py-3 rounded-xl font-display font-semibold hover:scale-105 transition-transform"
        >
          Go Home
        </a>
      </motion.div>
    </div>
  );
} 