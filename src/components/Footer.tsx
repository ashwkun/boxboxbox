import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="mt-auto py-8 border-t border-white/10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Credits Section */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Data Sources</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                  </svg>
                </div>
                <div>
                  <a 
                    href="https://api.jolpi.ca/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-primary transition-colors font-medium"
                  >
                    Jolpi.ca Ergast API Mirror
                  </a>
                  <p className="text-sm text-white/60 mt-1">Core F1 data including race results, schedules, and standings</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                  </svg>
                </div>
                <div>
                  <a 
                    href="https://open-meteo.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-primary transition-colors font-medium"
                  >
                    Open-Meteo API
                  </a>
                  <p className="text-sm text-white/60 mt-1">Race weekend weather forecasts and historical weather data</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <a 
                    href="https://media.formula1.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-primary transition-colors font-medium"
                  >
                    Formula1.com Media API
                  </a>
                  <p className="text-sm text-white/60 mt-1">Team logos, circuit layouts, and driver images</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Additional Credits Section */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Additional Credits</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <div>
                  <a 
                    href="https://www.arcgis.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-primary transition-colors font-medium"
                  >
                    ArcGIS World Imagery
                  </a>
                  <p className="text-sm text-white/60 mt-1">Satellite imagery for circuit location maps</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                  </svg>
                </div>
                <div>
                  <a 
                    href="https://github.com/basmilius/weather-icons"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-primary transition-colors font-medium"
                  >
                    Basmilius Weather Icons
                  </a>
                  <p className="text-sm text-white/60 mt-1">Beautiful weather visualization icons</p>
                </div>
              </li>
            </ul>

            {/* GitHub Link */}
            <div className="mt-8">
              <a
                href="https://github.com/yourusername/tvio"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 transition-colors rounded-lg text-white/80 hover:text-white"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.463 2 11.97c0 4.404 2.865 8.14 6.839 9.458.5.092.682-.216.682-.48 0-.236-.008-.864-.013-1.695-2.782.602-3.369-1.337-3.369-1.337-.454-1.151-1.11-1.458-1.11-1.458-.908-.618.069-.606.069-.606 1.003.07 1.531 1.027 1.531 1.027.892 1.524 2.341 1.084 2.91.828.092-.643.35-1.083.636-1.332-2.22-.251-4.555-1.107-4.555-4.927 0-1.088.39-1.979 1.029-2.675-.103-.252-.446-1.266.098-2.638 0 0 .84-.268 2.75 1.022A9.607 9.607 0 0112 6.82c.85.004 1.705.114 2.504.336 1.909-1.29 2.747-1.022 2.747-1.022.546 1.372.203 2.386.1 2.638.64.696 1.028 1.587 1.028 2.675 0 3.83-2.339 4.673-4.566 4.92.359.307.678.915.678 1.846 0 1.332-.012 2.407-.012 2.734 0 .267.18.577.688.48 3.97-1.32 6.833-5.054 6.833-9.458C22 6.463 17.522 2 12 2z" />
                </svg>
                View on GitHub
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-4 border-t border-white/10 text-center">
          <p className="text-sm text-white/40">
            © {new Date().getFullYear()} box box box. Not affiliated with Formula 1 or FIA.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 