
import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const themes = [
  { id: 'blue', name: 'Blue', color: 'bg-blue-500' },
  { id: 'purple', name: 'Purple', color: 'bg-purple-500' },
  { id: 'teal', name: 'Teal', color: 'bg-teal-500' },
  { id: 'rose', name: 'Rose', color: 'bg-rose-500' }
];

const ThemeSelector: React.FC = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {themes.map((themeOption) => (
        <button
          key={themeOption.id}
          onClick={() => setTheme(themeOption.id as any)}
          className={cn(
            "relative flex flex-col items-center gap-1 p-3 rounded-lg border transition-all",
            theme === themeOption.id 
              ? "border-primary ring-2 ring-primary/20" 
              : "border-border hover:border-primary/50"
          )}
        >
          <div className={cn(
            "w-12 h-12 rounded-full", 
            themeOption.color
          )} />
          <span className="text-sm font-medium">{themeOption.name}</span>
          {theme === themeOption.id && (
            <div className="absolute top-2 right-2 w-5 h-5 bg-primary text-white rounded-full flex items-center justify-center">
              <Check size={12} />
            </div>
          )}
        </button>
      ))}
    </div>
  );
};

export default ThemeSelector;
