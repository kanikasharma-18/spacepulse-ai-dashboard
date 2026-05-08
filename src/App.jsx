import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Hero from './components/Hero';
import Dashboard from './pages/Dashboard';
import ISSTracker from './map/ISSTracker';
import Charts from './charts/Charts';
import News from './components/News';
import FloatingChatbot from './chatbot/Chatbot';

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        {/* Animated star background */}
        <div className="stars-bg" aria-hidden="true" />

        {/* Global background gradient */}
        <div
          className="fixed inset-0 -z-10 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(92,107,243,0.15) 0%, transparent 70%), radial-gradient(ellipse 60% 40% at 100% 80%, rgba(217,70,239,0.08) 0%, transparent 70%), #090d1a',
          }}
        />

        <Navbar />

        <main className="flex flex-col min-h-screen">
          <Routes>
            <Route path="/"          element={<Hero />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/iss"       element={<ISSTracker />} />
            <Route path="/charts"    element={<Charts />} />
            <Route path="/news"      element={<News />} />
            {/* Chatbot is now a floating widget — redirect /chatbot to dashboard */}
            <Route path="/chatbot"   element={<Navigate to="/dashboard" replace />} />
            {/* Catch-all redirect */}
            <Route path="*"          element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <Footer />

        {/* ── Global floating chatbot (visible on all pages) ── */}
        <FloatingChatbot />

        {/* Toast notifications */}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: 'rgba(15, 22, 41, 0.95)',
              color: '#f8fafc',
              border: '1px solid rgba(255,255,255,0.1)',
              backdropFilter: 'blur(12px)',
              borderRadius: '12px',
              fontSize: '14px',
              padding: '12px 16px',
            },
            success: {
              iconTheme: { primary: '#34d399', secondary: '#090d1a' },
            },
            error: {
              iconTheme: { primary: '#f87171', secondary: '#090d1a' },
            },
          }}
        />
      </BrowserRouter>
    </ThemeProvider>
  );
}
