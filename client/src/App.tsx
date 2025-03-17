import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { Route, Router } from 'wouter';
import Landing from '@/pages/Landing';
import Dashboard from '@/pages/Dashboard';
import History from '@/pages/History';
import Help from '@/pages/Help';
import NotFound from '@/pages/NotFound';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Route path="/" component={() => <Landing />} />
        <Route path="/dashboard" component={() => <Dashboard />} />
        <Route path="/history" component={() => <History />} />
        <Route path="/help" component={() => <Help />} />
        {/* <Route component={() => <NotFound />} /> */}
      </Router>
      <Toaster />
    </QueryClientProvider>
  );
}
