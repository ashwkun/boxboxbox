'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiUser, FiMail, FiLogOut } from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';
import Layout from '@/components/Layout';

export default function ProfilePage() {
  const { user, userProfile, logout } = useAuth();
  const router = useRouter();
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user && !userProfile) {
      router.push('/login');
    }
  }, [user, userProfile, router]);
  
  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };
  
  if (!user) {
    return null; // Will redirect to login in useEffect
  }
  
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8 text-white">Your Profile</h1>
        
        <div className="bg-gray-900 rounded-lg shadow-lg p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-800 flex items-center justify-center text-gray-400">
              {user.photoURL ? (
                <img 
                  src={user.photoURL} 
                  alt={user.displayName || 'User'} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <FiUser size={48} />
              )}
            </div>
            
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-4">
                {user.displayName || 'User'}
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center text-gray-300">
                  <FiMail className="mr-2" />
                  <span>{user.email}</span>
                </div>
                
                <div>
                  <p className="text-gray-400 mb-2">
                    Account created: {user.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : 'Unknown'}
                  </p>
                </div>
              </div>
              
              <div className="mt-8">
                <button
                  onClick={handleLogout}
                  className="flex items-center bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
                >
                  <FiLogOut className="mr-2" /> Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
} 