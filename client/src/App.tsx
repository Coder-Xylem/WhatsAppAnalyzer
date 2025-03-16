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

// Auth0 Callback component to handle the redirect
function CallbackComponent() {
  const [, setLocation] = useLocation();
  
  useEffect(() => {
    const processAuth = async () => {
      await handleAuthCallback();
      setLocation('/dashboard');
    };
    
    processAuth();
  }, [setLocation]);
  
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-16 h-16 border-t-4 border-primary border-solid rounded-full animate-spin"></div>
      <p className="ml-4 text-lg font-medium">Completing authentication...</p>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/callback" component={CallbackComponent} />
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
