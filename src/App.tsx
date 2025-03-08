import React, { useEffect } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { migrateExistingUsers } from './services/firebase';
import AppRoutes from './routes/AppRoutes';
import './styles/main.scss';

const App: React.FC = () => {
  useEffect(() => {
    const runMigration = async () => {
      try {
        await migrateExistingUsers();
      } catch (error) {
        console.error('Error running migration:', error);
      }
    };
    
    runMigration();
  }, []);

  return (
    <AuthProvider>
      <div className="app-container">
        <AppRoutes />
      </div>
    </AuthProvider>
  );
};

export default App; 