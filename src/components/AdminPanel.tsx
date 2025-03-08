import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { migrateExistingUsers, isUserAdmin } from '../services/firebase';

const AdminPanel: React.FC = () => {
  const { currentUser } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Check if current user is admin
  React.useEffect(() => {
    const checkAdmin = async () => {
      if (!currentUser) {
        setIsAdmin(false);
        return;
      }
      const adminStatus = await isUserAdmin(currentUser.uid);
      setIsAdmin(adminStatus);
    };
    checkAdmin();
  }, [currentUser]);

  const handleMigration = async () => {
    if (!isAdmin) return;

    try {
      setLoading(true);
      setMessage('Migration in progress...');
      await migrateExistingUsers();
      setMessage('Migration completed successfully!');
    } catch (error) {
      console.error('Migration error:', error);
      setMessage('Error during migration. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser || !isAdmin) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Admin Panel</h2>
      <div className="space-y-4">
        <div>
          <button
            onClick={handleMigration}
            disabled={loading}
            className="btn btn-primary"
          >
            {loading ? 'Running Migration...' : 'Run User Migration'}
          </button>
        </div>
        {message && (
          <div className={`p-4 rounded-lg ${
            message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
          }`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel; 