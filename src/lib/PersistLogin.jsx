import { useState, useEffect } from 'react';
import { useAuth } from './auth';
import { Loader2 } from 'lucide-react';

export const PersistLogin = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const { auth, refresh, setAuth } = useAuth();
  useEffect(() => {
    const verifyRefresh = async () => {
      try {
        setIsLoading(true);
        const { accessToken, user } = await refresh();
        setAuth((prev) => {
          return { ...prev, token: accessToken, user };
        });
      } catch (error) {
        console.log('persisting login');
        setAuth({ user: null, token: null });
      } finally {
        setIsLoading(false);
      }
    };
    !auth?.token ? verifyRefresh() : setIsLoading(false);
  }, []);
  return (
    <>
      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
          <span className="text-6xl animate-bounce">🥥</span>
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading CocoGuard...</p>
        </div>
      ) : (
        children
      )}
    </>
  );
};
