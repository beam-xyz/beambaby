
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, BarChart2, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useBaby } from '@/context/BabyContext';

const Header = () => {
  const location = useLocation();
  const { currentBaby } = useBaby();
  
  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/analytics', icon: BarChart2, label: 'Analytics' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <header className="w-full bg-white/80 backdrop-blur-lg border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-primary text-xl font-bold">BT</span>
          </div>
          <h1 className="text-xl font-semibold text-foreground hidden sm:block">
            BabyTrack
          </h1>
        </div>

        <div className="flex-1 px-4 flex justify-center">
          {currentBaby && (
            <div className="px-4 py-1 rounded-full bg-baby-blue text-primary-foreground font-medium animate-fade-in">
              {currentBaby.name}
            </div>
          )}
        </div>

        <nav className="flex gap-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "px-3 py-2 rounded-md flex items-center gap-1 transition-all duration-200",
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
