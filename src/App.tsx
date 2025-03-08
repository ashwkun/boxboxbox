import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import AppRoutes from './routes/AppRoutes';
import './styles/main.scss';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <div className="app-container">
        <AppRoutes />
      </div>
    </AuthProvider>
  );
};

export default App; 