import React, { useEffect } from 'react';
import { Switch, Route, useLocation } from 'wouter';
import { queryClient } from './lib/queryClient';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/components/auth/AuthProvider';
import NotFound from '@/pages/not-found';
import Landing from '@/pages/Landing';
import Dashboard from '@/pages/Dashboard';
import { handleAuthCallback } from '@/lib/auth';

function Router() {
  const [location, setLocation] = useLocation();

  useEffect(() => {
    // Handle Auth0 callback if needed
    const handleAuth = async () => {
      if (location.includes('code=') && location.includes('state=')) {
        await handleAuthCallback();
        setLocation('/dashboard');
      }
    };

    handleAuth();
  }, [location, setLocation]);

  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/dashboard" component={Dashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
