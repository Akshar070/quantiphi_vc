import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      title={`Switch to ${isDark ? 'Light' : 'Dark'} mode`}
      aria-label={`Switch to ${isDark ? 'Light' : 'Dark'} mode`}
      className="p-2 rounded-xl text-stone-600 hover:text-stone-900 dark:text-slate-300 dark:hover:text-white hover:bg-beige-200/80 dark:hover:bg-navy-800 transition-all duration-200 border border-transparent hover:border-beige-300 dark:hover:border-navy-700 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-orange-500/30 dark:focus:ring-white/30"
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-amber-400 transition-transform duration-300 rotate-0 hover:rotate-45" />
      ) : (
        <Moon className="w-5 h-5 text-orange-600 transition-transform duration-300 rotate-0 hover:-rotate-12" />
      )}
    </button>
  );
}
