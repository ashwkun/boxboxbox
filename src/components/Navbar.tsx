'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { FiHome, FiSearch, FiBookmark, FiHeart, FiUser, FiMenu, FiX } from 'react-icons/fi';
import LottieLogo from './LottieLogo';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-gray-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="w-10 h-10 mr-2">
                <LottieLogo />
              </div>
              <span className="text-xl font-bold">tv.io</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/" className="flex items-center px-3 py-2 rounded-md hover:bg-gray-800 transition">
              <FiHome className="mr-1" /> Home
            </Link>
            <Link href="/search" className="flex items-center px-3 py-2 rounded-md hover:bg-gray-800 transition">
              <FiSearch className="mr-1" /> Search
            </Link>
            {user ? (
              <>
                <Link href="/watchlist" className="flex items-center px-3 py-2 rounded-md hover:bg-gray-800 transition">
                  <FiBookmark className="mr-1" /> Watchlist
                </Link>
                <Link href="/favorites" className="flex items-center px-3 py-2 rounded-md hover:bg-gray-800 transition">
                  <FiHeart className="mr-1" /> Favorites
                </Link>
                <Link href="/profile" className="flex items-center px-3 py-2 rounded-md hover:bg-gray-800 transition">
                  <FiUser className="mr-1" /> Profile
                </Link>
                <button 
                  onClick={() => logout()} 
                  className="px-3 py-2 rounded-md bg-red-600 hover:bg-red-700 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link href="/login" className="px-3 py-2 rounded-md bg-red-600 hover:bg-red-700 transition">
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
            >
              {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="/" className="flex items-center px-3 py-2 rounded-md hover:bg-gray-800 transition">
              <FiHome className="mr-2" /> Home
            </Link>
            <Link href="/search" className="flex items-center px-3 py-2 rounded-md hover:bg-gray-800 transition">
              <FiSearch className="mr-2" /> Search
            </Link>
            {user ? (
              <>
                <Link href="/watchlist" className="flex items-center px-3 py-2 rounded-md hover:bg-gray-800 transition">
                  <FiBookmark className="mr-2" /> Watchlist
                </Link>
                <Link href="/favorites" className="flex items-center px-3 py-2 rounded-md hover:bg-gray-800 transition">
                  <FiHeart className="mr-2" /> Favorites
                </Link>
                <Link href="/profile" className="flex items-center px-3 py-2 rounded-md hover:bg-gray-800 transition">
                  <FiUser className="mr-2" /> Profile
                </Link>
                <button 
                  onClick={() => logout()} 
                  className="w-full text-left flex items-center px-3 py-2 rounded-md bg-red-600 hover:bg-red-700 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link href="/login" className="flex items-center px-3 py-2 rounded-md bg-red-600 hover:bg-red-700 transition">
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
} 