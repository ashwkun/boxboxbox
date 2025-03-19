import React from 'react';
import DashboardPage from './pages/DashboardPage';
import Footer from './components/Footer';

const App: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <DashboardPage />
      <Footer />
    </div>
  );
};

export default App; 