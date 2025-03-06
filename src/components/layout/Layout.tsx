
import React, { ReactNode } from 'react';
import Header from './Header';
import { toast } from 'sonner';
import { useLocation } from 'react-router-dom';
import DailyLogDashboard from '../log/DailyLogDashboard';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const showDailyLog = location.pathname === '/';
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6">
        {showDailyLog && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-1">
              {children}
            </div>
            <div className="lg:col-span-2">
              <DailyLogDashboard />
            </div>
          </div>
        )}
        
        {!showDailyLog && children}
      </main>
      <footer className="border-t border-border py-4 text-center text-sm text-muted-foreground">
        <div className="container mx-auto px-4">
          <p>&copy; {new Date().getFullYear()} BabyTrack. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
