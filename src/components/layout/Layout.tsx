
import React, { ReactNode } from 'react';
import Header from './Header';
import { toast } from 'sonner';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6">
        {children}
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
