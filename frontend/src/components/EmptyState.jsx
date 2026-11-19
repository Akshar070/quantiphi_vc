import React from 'react';
import { Sparkles, ArrowRight, Briefcase, Coffee, Zap } from 'lucide-react';

const SUGGESTIONS = [
  {
    tone: 'Professional',
    emoji: '👔',
    title: 'Executive Briefing',
    prompt: 'Prepare a strategic executive briefing on the benefits and architectural considerations of adopting microservices in fintech.',
  },
  {
    tone: 'Casual',
    emoji: '☕',
    title: 'Casual Explanation',
    prompt: 'Explain how neural networks learn like you are chatting with a curious friend at a coffee shop.',
  },
  {
    tone: 'Concise',
    emoji: '⚡',
    title: 'Razor-Sharp Comparison',
    prompt: 'Compare MongoDB vs PostgreSQL: pros, cons, and primary use cases.',
  },
  {
    tone: 'Professional',
    emoji: '🚀',
    title: 'Algorithm Design',
    prompt: 'Provide a production-ready TypeScript implementation of an LRU cache with O(1) time complexity.',
  },
];

export default function EmptyState({ onSelectSuggestion, activeTone }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] max-w-2xl mx-auto px-4 py-8 text-center select-none">
      {/* Icon Badge */}
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-[2px] shadow-lg mb-4 shadow-indigo-500/20">
        <div className="w-full h-full bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center">
          <Sparkles className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
        </div>
      </div>

      {/* Title & Subtitle */}
      <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white mb-2">
        How can I assist you today?
      </h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mb-8">
        Ask anything. Select your desired tone (<span className="text-blue-600 dark:text-blue-400 font-medium">Professional</span>, <span className="text-amber-600 dark:text-amber-400 font-medium">Casual</span>, or <span className="text-emerald-600 dark:text-emerald-400 font-medium">Concise</span>) in the header to modify my response style instantly.
      </p>

      {/* Starter Suggestions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full text-left">
        {SUGGESTIONS.map((item, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSelectSuggestion(item.prompt, item.tone)}
            className="group p-4 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 hover:border-brand-500 dark:hover:border-brand-500 hover:shadow-md transition-all duration-200 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <span>{item.emoji}</span>
                  <span>{item.title}</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 group-hover:text-brand-500 transition-colors">
                  {item.tone}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                {item.prompt}
              </p>
            </div>

            <div className="flex items-center justify-end mt-3 text-brand-600 dark:text-brand-400 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
              <span>Try this</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
