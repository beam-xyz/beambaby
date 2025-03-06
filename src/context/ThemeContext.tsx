
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

type ThemeType = 'blue' | 'purple' | 'teal' | 'rose';

interface ThemeContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeType>('blue');

  // Load theme from localStorage on initial render
  useEffect(() => {
    const storedTheme = localStorage.getItem('babytrack-theme');
    if (storedTheme && ['blue', 'purple', 'teal', 'rose'].includes(storedTheme)) {
      setTheme(storedTheme as ThemeType);
      document.documentElement.setAttribute('data-theme', storedTheme);
    }
  }, []);

  // Save theme to localStorage and apply it to document when it changes
  useEffect(() => {
    localStorage.setItem('babytrack-theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
