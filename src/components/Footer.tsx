import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="mt-auto w-full bg-black/30 backdrop-blur-sm border-t border-white/10 py-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white text-lg font-bold font-display mb-4">boxboxbox</h3>
            <p className="text-white/70 text-sm">
              A Formula 1 data visualization platform providing real-time insights, race schedules, 
              standings, and historical data for Formula 1 fans.
            </p>
            <p className="text-white/70 text-sm mt-4">
              © 2024 boxboxbox. All rights reserved.
            </p>
          </div>
          
          <div>
            <h3 className="text-white text-lg font-bold font-display mb-4">APIs & Resources</h3>
            <ul className="text-white/70 text-sm space-y-2">
              <li>
                <a 
                  href="https://api.jolpi.ca/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  Jolpi.ca Ergast API Mirror
                </a>
                {" - Core F1 data including race results, schedules, and standings"}
              </li>
              <li>
                <a 
                  href="https://open-meteo.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  Open-Meteo API
                </a>
                {" - Race weekend weather forecasts and historical weather data"}
              </li>
              <li>
                <a 
                  href="https://media.formula1.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  Formula1.com Media API
                </a>
                {" - Team logos, circuit layouts, and driver images"}
              </li>
              <li>
                <a 
                  href="https://github.com/basmilius/weather-icons"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  Basmilius Weather Icons
                </a>
                {" - Weather visualization icons"}
              </li>
              <li>
                <a 
                  href="https://flagcdn.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  Flag CDN
                </a>
                {" - Country flag imagery for race locations"}
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white text-lg font-bold font-display mb-4">Disclaimer</h3>
            <p className="text-white/70 text-sm">
              boxboxbox is an unofficial, non-commercial project and is not affiliated with, endorsed by, 
              or connected to Formula 1, FIA, or any Formula 1 teams.
            </p>
            <p className="text-white/70 text-sm mt-2">
              Formula 1, F1, and related marks are trademarks of Formula One Licensing BV.
            </p>
            <p className="text-white/70 text-sm mt-4">
              <a 
                href="https://github.com/ashwkun/boxboxbox"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                View on GitHub
              </a>
            </p>
          </div>
        </div>
        
        <div className="mt-8 pt-4 border-t border-white/10 text-center text-white/50 text-xs">
          <p>
            This project is licensed under the MIT License. Data is provided by third-party APIs and may not be 
            accurate or up-to-date. All Formula 1 data is sourced from public APIs and used for informational purposes only.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 