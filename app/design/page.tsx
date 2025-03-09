'use client';

import React from 'react';
import { motion } from 'framer-motion';

const BrandKitPage = () => {
  return (
    <div className="min-h-screen bg-[#121212] text-white p-8">
      {/* Header */}
      <header className="mb-16">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-6xl bg-gradient-to-r from-[#FF4D8F] to-[#FF8D4D] text-transparent bg-clip-text"
        >
          TV.IO Brand Kit
        </motion.h1>
        <p className="font-body text-xl mt-4 text-[rgba(255,255,255,0.7)]">
          Emotional • Playful • Dynamic • Personal • Immersive
        </p>
      </header>

      {/* Color Palette */}
      <section className="mb-16">
        <h2 className="font-display text-3xl mb-8">Color Palette</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Primary Colors */}
          <div className="space-y-4">
            <h3 className="font-display text-xl">Primary Gradient</h3>
            <div className="h-24 rounded-xl bg-gradient-to-r from-[#FF4D8F] to-[#FF8D4D]"></div>
          </div>

          {/* Emotional Colors */}
          <div className="space-y-4">
            <h3 className="font-display text-xl">Emotional Colors</h3>
            <div className="grid grid-cols-5 gap-2">
              <div className="h-12 rounded-lg bg-[#FF4D8F]" title="GREAT!"></div>
              <div className="h-12 rounded-lg bg-[#FF8D4D]" title="GOOD"></div>
              <div className="h-12 rounded-lg bg-[#FFD84D]" title="MEH"></div>
              <div className="h-12 rounded-lg bg-[#4D4D4D]" title="NOOO"></div>
              <div className="h-12 rounded-lg bg-[#4DCCFF]" title="THINKING"></div>
            </div>
          </div>

          {/* UI Colors */}
          <div className="space-y-4">
            <h3 className="font-display text-xl">UI Colors</h3>
            <div className="grid grid-cols-3 gap-2">
              <div className="h-12 rounded-lg bg-[#1E1E1E]" title="Card Background"></div>
              <div className="h-12 rounded-lg bg-white/70" title="Secondary Text"></div>
              <div className="h-12 rounded-lg bg-[rgba(255,77,143,0.2)]" title="Accent Glow"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Typography */}
      <section className="mb-16">
        <h2 className="font-display text-3xl mb-8">Typography</h2>
        
        <div className="space-y-8">
          <div>
            <h3 className="font-display text-xl mb-4">Display Font: Clash Display</h3>
            <div className="space-y-4">
              <p className="font-display text-6xl">Hero Text</p>
              <p className="font-display text-4xl">Heading 1</p>
              <p className="font-display text-3xl">Heading 2</p>
            </div>
          </div>

          <div>
            <h3 className="font-display text-xl mb-4">Body Font: Space Grotesk</h3>
            <div className="space-y-4">
              <p className="font-body text-xl">Large Body Text</p>
              <p className="font-body text-base">Regular Body Text</p>
              <p className="font-body text-sm">Small Body Text</p>
            </div>
          </div>
        </div>
      </section>

      {/* Components */}
      <section className="mb-16">
        <h2 className="font-display text-3xl mb-8">Components</h2>

        {/* Buttons */}
        <div className="mb-12">
          <h3 className="font-display text-xl mb-6">Buttons</h3>
          <div className="flex flex-wrap gap-4">
            <button className="bg-gradient-to-r from-[#FF4D8F] to-[#FF8D4D] px-6 py-3 rounded-xl font-display font-semibold hover:scale-105 transition-transform">
              Primary Button
            </button>
            <button className="border-2 border-white/20 px-6 py-3 rounded-xl font-display font-semibold hover:bg-white/10 transition-colors">
              Secondary Button
            </button>
            <button className="h-16 w-16 rounded-full bg-[#FF4D8F] font-display text-2xl hover:scale-110 transition-transform">
              🤩
            </button>
          </div>
        </div>

        {/* Cards */}
        <div className="mb-12">
          <h3 className="font-display text-xl mb-6">Cards</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Content Card */}
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-[#1E1E1E] rounded-2xl p-6 hover:shadow-lg hover:shadow-[#FF4D8F]/20 transition-shadow"
            >
              <div className="aspect-[2/3] rounded-xl bg-gradient-to-b from-[#FF4D8F]/20 to-transparent mb-4"></div>
              <h4 className="font-display text-xl mb-2">Movie Title</h4>
              <p className="text-white/70">Movie description goes here...</p>
            </motion.div>

            {/* Rating Card */}
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-r from-[#FF4D8F] to-[#FF8D4D] rounded-2xl p-6"
            >
              <h4 className="font-display text-xl mb-4">Rate this title</h4>
              <div className="grid grid-cols-3 gap-2">
                <button className="h-12 w-12 rounded-full bg-white/20 hover:bg-white/30 transition-colors">🤩</button>
                <button className="h-12 w-12 rounded-full bg-white/20 hover:bg-white/30 transition-colors">😊</button>
                <button className="h-12 w-12 rounded-full bg-white/20 hover:bg-white/30 transition-colors">😐</button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Loading States */}
        <div>
          <h3 className="font-display text-xl mb-6">Loading States</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#1E1E1E] rounded-2xl p-6 space-y-4">
              <div className="h-4 w-2/3 rounded-full bg-gradient-to-r from-[#1E1E1E] via-[#2A2A2A] to-[#1E1E1E] animate-pulse"></div>
              <div className="h-4 w-1/2 rounded-full bg-gradient-to-r from-[#1E1E1E] via-[#2A2A2A] to-[#1E1E1E] animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Animations */}
      <section className="mb-16">
        <h2 className="font-display text-3xl mb-8">Animations</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Hover Effects */}
          <motion.div 
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-[#1E1E1E] rounded-2xl p-6"
          >
            <h3 className="font-display text-xl">Hover Scale & Lift</h3>
          </motion.div>

          {/* Pulse Effect */}
          <div className="bg-[#1E1E1E] rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-[#FF4D8F]/20 animate-pulse"></div>
            <h3 className="font-display text-xl relative z-10">Pulse Effect</h3>
          </div>

          {/* Neural Network Node */}
          <div className="bg-[#1E1E1E] rounded-2xl p-6 flex items-center justify-center">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="h-8 w-8 rounded-full bg-[#FF4D8F] relative"
            >
              <div className="absolute inset-0 rounded-full bg-[#FF4D8F]/20 animate-ping"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Accessibility */}
      <section className="mb-16">
        <h2 className="font-display text-3xl mb-8">Accessibility</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#1E1E1E] rounded-2xl p-6">
            <button className="px-6 py-3 rounded-xl bg-[#FF4D8F] font-display focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4D8F] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1E1E1E]">
              Focus State Example
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BrandKitPage; 