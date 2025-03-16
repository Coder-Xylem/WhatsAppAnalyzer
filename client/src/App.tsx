import React from 'react';
import { Switch, Route } from 'wouter';
import { queryClient } from './lib/queryClient';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from './hooks/use-auth';
import NotFound from '@/pages/not-found';
import Landing from '@/pages/Landing';
import Dashboard from '@/pages/Dashboard';
import AuthPage from '@/pages/auth-page';
import History from '@/pages/History';
import { ProtectedRoute } from './lib/protected-route';

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <ProtectedRoute path="/dashboard" component={Dashboard} />
      <ProtectedRoute path="/history" component={History} />
      <Route path="/auth" component={AuthPage} />
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
