import { useState, useEffect } from 'react';

interface UseMediaDataOptions {
  initialLoading?: boolean;
  dependencies?: any[];
}

/**
 * Custom hook for fetching media data with loading and error handling
 * @param fetchFunction The async function that fetches data
 * @param options Options for the hook
 * @returns Object containing data, loading state, error, and refetch function
 */
const useMediaData = <T>(
  fetchFunction: () => Promise<T>,
  options: UseMediaDataOptions = {}
) => {
  const { initialLoading = true, dependencies = [] } = options;
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(initialLoading);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await fetchFunction();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  const refetch = () => {
    fetchData();
  };

  return { data, loading, error, refetch };
};

export default useMediaData; 