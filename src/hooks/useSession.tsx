import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { openf1 } from '../services/api';
import { Session } from '../services/api/openf1';

interface SessionContextType {
  currentSession: Session | null;
  currentSessionKey: string | number;
  setCurrentSessionKey: (key: string | number) => void;
  isLoading: boolean;
  error: Error | null;
  recentSessions: Session[];
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

interface SessionProviderProps {
  children: ReactNode;
}

export const SessionProvider: React.FC<SessionProviderProps> = ({ children }) => {
  const [currentSessionKey, setCurrentSessionKey] = useState<string | number>('latest');
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [recentSessions, setRecentSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch recent sessions on mount
  useEffect(() => {
    const fetchRecentSessions = async () => {
      try {
        // Get current year
        const currentYear = new Date().getFullYear();
        const sessions = await openf1.fetchSessions({ year: currentYear });
        
        // Sort by date (most recent first)
        const sortedSessions = sessions.sort((a, b) => 
          new Date(b.date_start).getTime() - new Date(a.date_start).getTime()
        );
        
        setRecentSessions(sortedSessions);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch recent sessions'));
      }
    };

    fetchRecentSessions();
  }, []);

  // Fetch current session whenever sessionKey changes
  useEffect(() => {
    const fetchCurrentSession = async () => {
      setIsLoading(true);
      try {
        if (currentSessionKey === 'latest') {
          // If 'latest', get the most recent session
          if (recentSessions.length > 0) {
            setCurrentSession(recentSessions[0]);
          } else {
            // Fallback - fetch directly
            const sessions = await openf1.fetchSessions({ _limit: 1 });
            setCurrentSession(sessions[0] || null);
          }
        } else {
          // Fetch specific session by key
          const sessions = await openf1.fetchSessions({ session_key: currentSessionKey });
          setCurrentSession(sessions[0] || null);
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch current session'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrentSession();
  }, [currentSessionKey, recentSessions]);

  return (
    <SessionContext.Provider
      value={{
        currentSession,
        currentSessionKey,
        setCurrentSessionKey,
        isLoading,
        error,
        recentSessions
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = (): SessionContextType => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};

export default useSession; 