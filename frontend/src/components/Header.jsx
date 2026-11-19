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
    <header className="sticky top-0 z-20 flex items-center justify-between px-3 sm:px-6 py-2.5 glass-panel border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      {/* Left: Sidebar toggle & Title */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          type="button"
          title={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-700/60"
        >
          {isSidebarOpen ? (
            <PanelLeftClose className="w-5 h-5 hidden md:block" />
          ) : (
            <PanelLeft className="w-5 h-5 hidden md:block" />
          )}
          <Menu className="w-5 h-5 md:hidden" />
        </button>

        <div className="flex items-center gap-2 min-w-0">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
          <h1 className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate max-w-[140px] sm:max-w-[220px] md:max-w-xs">
            {currentTitle || 'New Conversation'}
          </h1>
        </div>
      </div>

      {/* Right: Tone Selector & Theme Toggle */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Tone Selector Component */}
        <ToneSelector
          activeTone={activeTone}
          onToneChange={onToneChange}
          disabled={isGenerating}
        />

        {/* Light / Dark Mode Toggle */}
        <ThemeToggle />
      </div>
    </header>
  );
}
