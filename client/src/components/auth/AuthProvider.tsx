import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@auth0/auth0-spa-js';
import { initializeAuth0Client, handleAuthCallback, getUser, loginWithRedirect, logout } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | undefined;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  getAccessToken: () => Promise<string>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | undefined>(undefined);
  const { toast } = useToast();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        // Initialize Auth0
        await initializeAuth0Client();
        
        // Handle the callback if it's a redirect
        await handleAuthCallback();
        
        // Get the user
        const currentUser = await getUser();
        setUser(currentUser);
        setIsAuthenticated(!!currentUser);
      } catch (error) {
        console.error('Error initializing Auth0:', error);
        toast({
          title: 'Authentication Error',
          description: 'Failed to initialize authentication. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [toast]);

  const handleLogin = async () => {
    try {
      await loginWithRedirect();
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: 'Login Error',
        description: 'Failed to log in. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setUser(undefined);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: 'Logout Error',
        description: 'Failed to log out. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const getAccessToken = async () => {
    try {
      const client = await initializeAuth0Client();
      return await client.getTokenSilently();
    } catch (error) {
      console.error('Error getting access token:', error);
      toast({
        title: 'Authentication Error',
        description: 'Failed to get access token. Please try logging in again.',
        variant: 'destructive',
      });
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        user,
        login: handleLogin,
        logout: handleLogout,
        getAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
