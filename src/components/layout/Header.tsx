
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, BarChart2, Settings, Sparkles, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useBaby } from '@/context/BabyContext';

const Header = () => {
  const location = useLocation();
  const { currentBaby } = useBaby();
  
  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/analytics', icon: BarChart2, label: 'Analytics' },
    { path: '/rating', icon: Star, label: 'Rating' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <header className="w-full bg-white/80 backdrop-blur-lg border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Sparkles className="text-primary w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <h1 className="text-lg sm:text-xl font-semibold text-foreground hidden sm:block">
            Beam BabyTracker
          </h1>
        </div>

        <div className="flex-1 max-w-[120px] sm:max-w-none px-2 sm:px-4 flex justify-center">
          {currentBaby && (
            <div className="px-3 py-1 rounded-full bg-baby-blue text-xs sm:text-sm text-primary-foreground font-medium animate-fade-in truncate">
              {currentBaby.name}
            </div>
          )}
        </div>

        <nav className="flex gap-0 sm:gap-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "px-2 sm:px-3 py-2 rounded-md flex items-center gap-1 transition-all duration-200",
                location.pathname === item.path 
                  ? "bg-primary text-white" 
                  : "text-muted-foreground hover:bg-secondary"
              )}
            >
              <item.icon size={16} />
              <span className="hidden sm:inline">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;
