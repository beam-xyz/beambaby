
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { BabyProvider } from './context/BabyContext';
import Index from './pages/Index';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Rating from './pages/Rating';
import NotFound from './pages/NotFound';
import { Toaster as SonnerToaster } from 'sonner';

function App() {
  return (
    <ThemeProvider>
      <BabyProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/rating" element={<Rating />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
        <SonnerToaster richColors position="top-right" />
      </BabyProvider>
    </ThemeProvider>
  );
}

export default App;
