import React from 'react';

const Header: React.FC = () => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <div className="text-5xl font-display font-bold tracking-tighter">
              <span className="inline-flex items-center">
                B
                <div className="relative mx-1 inline-block">
                  <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center relative">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-black rounded-full"></div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-11 h-11 border-4 border-transparent border-t-red-600 rounded-full"></div>
                    </div>
                  </div>
                </div>
                X
              </span>
            </div>
            <div className="text-5xl font-display font-bold tracking-tighter ml-2">
              <span className="inline-flex items-center">
                B
                <div className="relative mx-1 inline-block">
                  <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center relative">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-black rounded-full"></div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-11 h-11 border-4 border-transparent border-t-white rounded-full"></div>
                    </div>
                  </div>
                </div>
                X
              </span>
            </div>
            <div className="text-5xl font-display font-bold tracking-tighter ml-2">
              <span className="inline-flex items-center">
                B
                <div className="relative mx-1 inline-block">
                  <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center relative">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-black rounded-full"></div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-11 h-11 border-4 border-transparent border-t-yellow-400 rounded-full"></div>
                    </div>
                  </div>
                </div>
                X
              </span>
            </div>
          </div>
        </div>
        <div className="text-right">
          {/* Removing F1 PULSE text since we already have BOX BOX BOX branding */}
        </div>
      </div>
    </div>
  );
};

export default Header; 