import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './components/ThemeProvider';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Repositories } from './pages/Repositories';
import { Reviews } from './pages/Reviews';
import { ReviewDetail } from './pages/ReviewDetail';
import { Settings } from './pages/Settings';
import { Collaboration } from './pages/Collaboration';
import { Gamification } from './pages/Gamification';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Router>
          <div className="min-h-screen bg-background text-foreground">
            <Layout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/repositories" element={<Repositories />} />
                <Route path="/reviews" element={<Reviews />} />
                <Route path="/reviews/:id" element={<ReviewDetail />} />
                <Route path="/collaboration" element={<Collaboration />} />
                <Route path="/gamification" element={<Gamification />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </Layout>
            <Toaster
              position="top-right"
              toastOptions={{
                className: 'bg-card text-card-foreground border border-border',
              }}
            />
          </div>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;