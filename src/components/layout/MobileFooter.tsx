
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, BarChart2, Star, Settings, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

const MobileFooter: React.FC = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/analytics', icon: BarChart2, label: 'Analytics' },
    { path: '/rating', icon: Star, label: 'Rating' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  // Check if we're on home page to display the plus button
  const isHomePage = location.pathname === '/';

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-background border-t border-border z-50">
      <div className="grid grid-cols-4 h-16">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex flex-col items-center justify-center py-1",
              location.pathname === item.path 
                ? "text-primary" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <item.icon size={20} className="mb-1" />
            <span className="text-xs">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MobileFooter;
