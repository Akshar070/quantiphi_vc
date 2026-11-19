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
      className="p-2 rounded-xl text-stone-600 hover:text-stone-900 dark:text-[#f4eee3] dark:hover:text-white hover:bg-[#eee6d8]/80 dark:hover:bg-[#12204c] transition-all duration-200 border border-transparent hover:border-[#e3d7c3] dark:hover:border-[#182b62] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-orange-500/30 dark:focus:ring-[#3257be]/40"
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-amber-300 transition-transform duration-300 rotate-0 hover:rotate-45" />
      ) : (
        <Moon className="w-5 h-5 text-orange-600 transition-transform duration-300 rotate-0 hover:-rotate-12" />
      )}
    </button>
  );
}
