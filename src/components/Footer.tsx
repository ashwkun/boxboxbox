'use client';

import Link from 'next/link';
import { FiGithub, FiTwitter, FiInstagram } from 'react-icons/fi';
import { Player } from '@lottiefiles/react-lottie-player';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="flex items-center mb-6 md:mb-0">
            <Link href="/" className="flex items-center">
              <div className="w-8 h-8 mr-2">
                <Player
                  autoplay
                  loop
                  src="/logo.lottie"
                  style={{ width: '100%', height: '100%' }}
                />
              </div>
              <span className="text-xl font-bold text-white">tv.io</span>
            </Link>
          </div>
          
          <div className="flex space-x-6">
            <a href="https://github.com/ashwkun/tvio" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              <FiGithub size={20} />
            </a>
            <a href="#" className="hover:text-white transition-colors">
              <FiTwitter size={20} />
            </a>
            <a href="#" className="hover:text-white transition-colors">
              <FiInstagram size={20} />
            </a>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-white font-semibold mb-3">Navigation</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/search" className="hover:text-white transition-colors">Search</Link></li>
              <li><Link href="/watchlist" className="hover:text-white transition-colors">Watchlist</Link></li>
              <li><Link href="/favorites" className="hover:text-white transition-colors">Favorites</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-3">Categories</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="hover:text-white transition-colors">Popular</Link></li>
              <li><Link href="/" className="hover:text-white transition-colors">Top Rated</Link></li>
              <li><Link href="/" className="hover:text-white transition-colors">Upcoming</Link></li>
              <li><Link href="/" className="hover:text-white transition-colors">Now Playing</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-3">Legal</h3>
            <ul className="space-y-2">
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/cookies" className="hover:text-white transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-3">About</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="text-center pt-8 border-t border-gray-800 text-sm">
          <p>
            This product uses the TMDB API but is not endorsed or certified by TMDB.
            All movie related data comes from the The Movie Database API.
          </p>
          <p className="mt-2">
            &copy; {currentYear} tv.io. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
} 