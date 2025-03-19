import React from 'react';
import InstallButton from './common/InstallButton';

const Header: React.FC = () => {
  return (
    <div className="mb-4 sm:mb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="text-xl sm:text-3xl md:text-5xl font-display font-bold tracking-tighter">
            <span className="inline-flex items-center">
              B
              <div className="relative mx-0.5 sm:mx-1 inline-block">
                <div className="w-6 h-6 sm:w-8 sm:h-8 md:w-12 md:h-12 bg-black rounded-full flex items-center justify-center relative">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 md:w-8 md:h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 md:w-2 md:h-2 bg-black rounded-full"></div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-5 h-5 sm:w-7 sm:h-7 md:w-11 md:h-11 border-2 sm:border-3 md:border-4 border-transparent border-t-red-600 rounded-full"></div>
                  </div>
                </div>
              </div>
              X
            </span>
          </div>
          <div className="text-xl sm:text-3xl md:text-5xl font-display font-bold tracking-tighter ml-0.5 sm:ml-1 md:ml-2">
            <span className="inline-flex items-center">
              B
              <div className="relative mx-0.5 sm:mx-1 inline-block">
                <div className="w-6 h-6 sm:w-8 sm:h-8 md:w-12 md:h-12 bg-black rounded-full flex items-center justify-center relative">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 md:w-8 md:h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 md:w-2 md:h-2 bg-black rounded-full"></div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-5 h-5 sm:w-7 sm:h-7 md:w-11 md:h-11 border-2 sm:border-3 md:border-4 border-transparent border-t-white rounded-full"></div>
                  </div>
                </div>
              </div>
              X
            </span>
          </div>
          <div className="text-xl sm:text-3xl md:text-5xl font-display font-bold tracking-tighter ml-0.5 sm:ml-1 md:ml-2">
            <span className="inline-flex items-center">
              B
              <div className="relative mx-0.5 sm:mx-1 inline-block">
                <div className="w-6 h-6 sm:w-8 sm:h-8 md:w-12 md:h-12 bg-black rounded-full flex items-center justify-center relative">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 md:w-8 md:h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 md:w-2 md:h-2 bg-black rounded-full"></div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-5 h-5 sm:w-7 sm:h-7 md:w-11 md:h-11 border-2 sm:border-3 md:border-4 border-transparent border-t-yellow-400 rounded-full"></div>
                  </div>
                </div>
              </div>
              X
            </span>
          </div>
        </div>
        <InstallButton />
      </div>
    </div>
  );
};

export default Header; 