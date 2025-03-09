'use client';

import React from 'react';
import { motion } from 'framer-motion';

const BrandKitPage = () => {
  return (
    <div className="min-h-screen bg-background-dark text-white p-4 md:p-8 lg:p-12">
      {/* Header */}
      <header className="max-w-7xl mx-auto mb-16">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-5xl md:text-6xl lg:text-7xl font-bold gradient-text"
        >
          tv<motion.span
            animate={{ 
              scale: [1, 1.2, 0.9, 1.1, 1],
              y: [0, -8, 0, -4, 0]
            }}
            transition={{ 
              duration: 1,
              repeat: Infinity,
              repeatDelay: 9,
              ease: "easeOut"
            }}
            className="inline-block text-primary-start"
          >.</motion.span>io
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="font-body text-lg md:text-xl mt-4 text-white/70"
        >
          Emotional • Playful • Dynamic • Personal • Immersive
        </motion.p>
      </header>

      {/* Color Palette */}
      <section className="max-w-7xl mx-auto mb-16">
        <motion.h2 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="font-display text-2xl md:text-3xl font-semibold mb-8"
        >
          Color Palette
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Primary Colors */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h3 className="font-display text-xl">Primary Gradient</h3>
            <div className="h-24 rounded-xl bg-gradient-to-r from-primary-start to-primary-end shadow-lg"></div>
          </motion.div>

          {/* Emotional Colors */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <h3 className="font-display text-xl">Emotional Colors</h3>
            <div className="grid grid-cols-5 gap-2">
              <div className="h-12 rounded-lg bg-emotion-love shadow-lg" title="GREAT!"></div>
              <div className="h-12 rounded-lg bg-emotion-like shadow-lg" title="GOOD"></div>
              <div className="h-12 rounded-lg bg-emotion-meh shadow-lg" title="MEH"></div>
              <div className="h-12 rounded-lg bg-emotion-nope shadow-lg" title="NOOO"></div>
              <div className="h-12 rounded-lg bg-emotion-thinking shadow-lg" title="THINKING"></div>
            </div>
          </motion.div>

          {/* UI Colors */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <h3 className="font-display text-xl">UI Colors</h3>
            <div className="grid grid-cols-3 gap-2">
              <div className="h-12 rounded-lg bg-background-card shadow-lg" title="Card Background"></div>
              <div className="h-12 rounded-lg bg-white/70 shadow-lg" title="Secondary Text"></div>
              <div className="h-12 rounded-lg shadow-lg" style={{ background: 'rgba(255,77,143,0.2)' }} title="Accent Glow"></div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Typography */}
      <section className="max-w-7xl mx-auto mb-16">
        <motion.h2 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="font-display text-2xl md:text-3xl font-semibold mb-8"
        >
          Typography
        </motion.h2>
        
        <div className="space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="font-display text-xl mb-6">Display Font: Clash Display</h3>
            <div className="space-y-6 bg-background-card rounded-2xl p-6">
              <p className="font-display text-6xl md:text-7xl font-bold gradient-text">Hero Text</p>
              <p className="font-display text-4xl md:text-5xl font-semibold">Heading 1</p>
              <p className="font-display text-2xl md:text-3xl">Heading 2</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="font-display text-xl mb-6">Body Font: Space Grotesk</h3>
            <div className="space-y-6 bg-background-card rounded-2xl p-6">
              <p className="font-body text-xl">Large Body Text</p>
              <p className="font-body text-base">Regular Body Text</p>
              <p className="font-body text-sm">Small Body Text</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Components */}
      <section className="max-w-7xl mx-auto mb-16">
        <motion.h2 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="font-display text-2xl md:text-3xl font-semibold mb-8"
        >
          Components
        </motion.h2>

        {/* Buttons */}
        <div className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="font-display text-xl mb-6">Buttons</h3>
            <div className="flex flex-wrap gap-4 bg-background-card rounded-2xl p-6">
              <button className="bg-gradient-to-r from-primary-start to-primary-end px-6 py-3 rounded-xl font-display font-semibold hover:scale-105 transition-transform shadow-lg">
                Primary Button
              </button>
              <button className="border-2 border-white/20 px-6 py-3 rounded-xl font-display font-semibold hover:bg-white/10 transition-colors">
                Secondary Button
              </button>
              <button className="h-16 w-16 rounded-full bg-emotion-love font-display text-2xl hover:scale-110 transition-transform shadow-lg">
                🤩
              </button>
            </div>
          </motion.div>
        </div>

        {/* Cards */}
        <div className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="font-display text-xl mb-6">Cards</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Content Card */}
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="bg-background-card rounded-2xl p-6 hover:shadow-lg hover:shadow-primary-start/20 transition-all"
              >
                <div className="aspect-[2/3] rounded-xl bg-gradient-to-b from-primary-start/20 to-transparent mb-4"></div>
                <h4 className="font-display text-xl mb-2">Movie Title</h4>
                <p className="text-white/70">Movie description goes here...</p>
              </motion.div>

              {/* Rating Card */}
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-r from-primary-start to-primary-end rounded-2xl p-6 shadow-lg"
              >
                <h4 className="font-display text-xl mb-4">Rate this title</h4>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    className="h-12 w-12 rounded-full bg-white/20 hover:bg-white/30 transition-colors shadow-inner flex items-center justify-center text-2xl"
                  >
                    🤩
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    className="h-12 w-12 rounded-full bg-white/20 hover:bg-white/30 transition-colors shadow-inner flex items-center justify-center text-2xl"
                  >
                    😊
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    className="h-12 w-12 rounded-full bg-white/20 hover:bg-white/30 transition-colors shadow-inner flex items-center justify-center text-2xl"
                  >
                    😐
                  </motion.button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    className="h-12 w-12 rounded-full bg-white/20 hover:bg-white/30 transition-colors shadow-inner flex items-center justify-center text-2xl"
                  >
                    🙅‍♂️
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    className="h-12 w-12 rounded-full bg-white/20 hover:bg-white/30 transition-colors shadow-inner flex items-center justify-center text-2xl"
                  >
                    🤔
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    className="h-12 w-12 rounded-full bg-white/20 hover:bg-white/30 transition-colors shadow-inner flex items-center justify-center text-2xl"
                  >
                    ❌
                  </motion.button>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  className="mt-2 h-12 w-full rounded-xl bg-white/20 hover:bg-white/30 transition-colors shadow-inner flex items-center justify-center text-xl"
                >
                  💫 Would Watch Again
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Loading States */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="font-display text-xl mb-6">Loading States</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-background-card rounded-2xl p-6 space-y-4">
              <div className="h-4 w-2/3 rounded-full animate-pulse-glow bg-gradient-to-r from-background-card via-white/10 to-background-card"></div>
              <div className="h-4 w-1/2 rounded-full animate-pulse-glow bg-gradient-to-r from-background-card via-white/10 to-background-card"></div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Animations */}
      <section className="max-w-7xl mx-auto mb-16">
        <motion.h2 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="font-display text-2xl md:text-3xl font-semibold mb-8"
        >
          Animations
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Hover Effects */}
          <motion.div 
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-background-card rounded-2xl p-6 cursor-pointer"
          >
            <h3 className="font-display text-xl">Hover Scale & Lift</h3>
          </motion.div>

          {/* Pulse Effect */}
          <div className="bg-background-card rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-primary-start/20 animate-pulse"></div>
            <h3 className="font-display text-xl relative z-10">Pulse Effect</h3>
          </div>

          {/* Neural Network Node */}
          <div className="bg-background-card rounded-2xl p-6 flex items-center justify-center">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="h-8 w-8 rounded-full bg-primary-start relative"
            >
              <div className="absolute inset-0 rounded-full bg-primary-start/20 animate-ping"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Accessibility */}
      <section className="max-w-7xl mx-auto mb-16">
        <motion.h2 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="font-display text-2xl md:text-3xl font-semibold mb-8"
        >
          Accessibility
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-background-card rounded-2xl p-6">
            <button className="px-6 py-3 rounded-xl bg-primary-start font-display focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-start focus-visible:ring-offset-2 focus-visible:ring-offset-background-card">
              Focus State Example
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BrandKitPage; 