import React from 'react';
import { ArrowRight } from 'lucide-react';

const SUGGESTIONS = [
  {
    tone: 'Professional',
    emoji: '👔',
    title: 'Docker & Kubernetes',
    prompt: 'I would like to know about Kubernetes and Docker. Please explain these with examples, where we use them and why we use them.',
  },
  {
    tone: 'Professional',
    emoji: '🚀',
    title: 'System Architecture',
    prompt: 'Prepare a strategic technical breakdown of microservices vs monolith architecture with scalability trade-offs.',
  },
  {
    tone: 'Casual',
    emoji: '☕',
    title: 'Casual Tech Chat',
    prompt: 'Explain how neural networks and machine learning work like you are chatting with a friend over coffee.',
  },
  {
    tone: 'Concise',
    emoji: '⚡',
    title: 'Razor-Sharp Comparison',
    prompt: 'Compare MongoDB vs PostgreSQL: pros, cons, indexing, and primary production use cases.',
  },
];

export default function EmptyState({ onSelectSuggestion, activeTone }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] max-w-2xl mx-auto px-4 py-8 text-center select-none">
      {/* Icon Badge: Navy in Dark Mode, Orange in Light Mode */}
      <div className="w-16 h-16 rounded-2xl bg-orange-600 dark:bg-[#12204c] dark:border dark:border-[#233d87] p-[2px] shadow-lg mb-5 shadow-orange-600/20 dark:shadow-black/50 flex items-center justify-center">
        <div className="w-full h-full bg-[#f8f5ee] dark:bg-[#070d1e] rounded-2xl flex items-center justify-center">
          <span className="font-black text-2xl text-orange-600 dark:text-white">O</span>
        </div>
      </div>

      {/* Title & Subtitle: White Title & Beige Subtitle in Dark Mode */}
      <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-white tracking-tight mb-2">
        How can OSAKA assist you today?
      </h2>
      <p className="text-sm text-stone-500 dark:text-[#f4eee3] max-w-md mb-8 leading-relaxed">
        Ask anything. Select your desired tone (<span className="text-stone-800 dark:text-white font-semibold">Professional</span>, <span className="text-orange-600 dark:text-[#f4eee3] font-semibold">Casual</span>, or <span className="text-stone-700 dark:text-[#f4eee3] font-semibold">Concise</span>) in the header to modify OSAKA's output style instantly.
      </p>

      {/* Starter Suggestions: Navy blue cards with beige text in dark mode */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full text-left">
        {SUGGESTIONS.map((item, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSelectSuggestion(item.prompt, item.tone)}
            className="group p-4 rounded-xl bg-white dark:bg-[#0d1838] border border-[#e3d7c3] dark:border-[#182b62] hover:border-orange-500 dark:hover:border-[#3257be] hover:shadow-md transition-all duration-200 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-stone-900 dark:text-white flex items-center gap-1.5">
                  <span>{item.emoji}</span>
                  <span>{item.title}</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 dark:text-[#cfc3b0] group-hover:text-orange-600 dark:group-hover:text-white transition-colors">
                  {item.tone}
                </span>
              </div>
              <p className="text-xs text-stone-500 dark:text-[#f4eee3] line-clamp-2 leading-relaxed">
                {item.prompt}
              </p>
            </div>

            <div className="flex items-center justify-end mt-3 text-orange-600 dark:text-[#8ba6f3] text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
              <span>Try this</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
