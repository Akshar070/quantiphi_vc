import React from 'react';
import { Menu, PanelLeftClose, PanelLeft, Sparkles } from 'lucide-react';
import ToneSelector from './ToneSelector';
import ThemeToggle from './ThemeToggle';

export default function Header({
  activeTone,
  onToneChange,
  isSidebarOpen,
  setIsSidebarOpen,
  currentTitle,
  isGenerating,
}) {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between px-3 sm:px-6 py-2.5 glass-panel border-b border-beige-300/80 dark:border-navy-750 transition-colors">
      {/* Left: Sidebar toggle & Title */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          type="button"
          title={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          className="p-2 rounded-xl text-stone-600 hover:text-stone-900 dark:text-slate-300 dark:hover:text-white hover:bg-beige-200/80 dark:hover:bg-navy-800 transition-all border border-transparent hover:border-beige-300 dark:hover:border-navy-700"
        >
          {isSidebarOpen ? (
            <PanelLeftClose className="w-5 h-5 hidden md:block" />
          ) : (
            <PanelLeft className="w-5 h-5 hidden md:block" />
          )}
          <Menu className="w-5 h-5 md:hidden" />
        </button>

        <div className="flex items-center gap-2 min-w-0">
          <div className="w-2 h-2 rounded-full bg-orange-500 dark:bg-sky-400 animate-pulse flex-shrink-0" />
          <h1 className="text-sm font-semibold text-stone-800 dark:text-white truncate max-w-[140px] sm:max-w-[220px] md:max-w-xs">
            {currentTitle || 'New Conversation'}
          </h1>
        </div>
      </div>

      {/* Right: Tone Selector & Theme Toggle */}
      <div className="flex items-center gap-2 sm:gap-3">
        <ToneSelector
          activeTone={activeTone}
          onToneChange={onToneChange}
          disabled={isGenerating}
        />
        <ThemeToggle />
      </div>
    </header>
  );
}
