import React from 'react';
import { Briefcase, Coffee, Zap } from 'lucide-react';

const TONES = [
  {
    id: 'Professional',
    label: 'Professional',
    icon: Briefcase,
    emoji: '👔',
    badgeClass: 'text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800',
    description: 'Polished, authoritative, and structured responses suitable for business & academic work.',
  },
  {
    id: 'Casual',
    label: 'Casual',
    icon: Coffee,
    emoji: '☕',
    badgeClass: 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800',
    description: 'Friendly, warm, conversational style with everyday phrasing & natural humor.',
  },
  {
    id: 'Concise',
    label: 'Concise',
    icon: Zap,
    emoji: '⚡',
    badgeClass: 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800',
    description: 'Direct, razor-sharp answers with zero fluff or filler in minimal words.',
  },
];

export default function ToneSelector({ activeTone, onToneChange, disabled = false }) {
  return (
    <div className="flex items-center gap-1.5 p-1 bg-slate-100/90 dark:bg-slate-800/80 rounded-xl border border-slate-200/80 dark:border-slate-700/60 shadow-inner">
      <span className="text-xs font-semibold px-2 py-1 text-slate-500 dark:text-slate-400 hidden sm:inline select-none">
        Tone:
      </span>
      {TONES.map((t) => {
        const Icon = t.icon;
        const isSelected = activeTone === t.id;

        return (
          <button
            key={t.id}
            type="button"
            disabled={disabled}
            onClick={() => onToneChange(t.id)}
            title={`${t.label}: ${t.description}`}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500/40 ${
              isSelected
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm font-semibold scale-[1.02]'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white/60 dark:hover:bg-slate-700/50'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <span>{t.emoji}</span>
            <span className="hidden md:inline">{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export { TONES };
