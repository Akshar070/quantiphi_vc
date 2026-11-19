import React from 'react';
import { Briefcase, Coffee, Zap } from 'lucide-react';

const TONES = [
  {
    id: 'Professional',
    label: 'Professional',
    icon: Briefcase,
    emoji: '👔',
    badgeClass: 'text-stone-800 dark:text-white bg-white/90 dark:bg-navy-800 border-beige-300 dark:border-navy-600 shadow-xs',
    description: 'Polished, authoritative, and structured responses suitable for executive & technical work.',
  },
  {
    id: 'Casual',
    label: 'Casual',
    icon: Coffee,
    emoji: '☕',
    badgeClass: 'text-orange-900 dark:text-amber-200 bg-orange-50 dark:bg-navy-800 border-orange-200 dark:border-navy-600 shadow-xs',
    description: 'Friendly, warm, conversational style with relatable analogies & engaging cadence.',
  },
  {
    id: 'Concise',
    label: 'Concise',
    icon: Zap,
    emoji: '⚡',
    badgeClass: 'text-stone-900 dark:text-sky-200 bg-beige-150 dark:bg-navy-800 border-beige-300 dark:border-navy-600 shadow-xs',
    description: 'Direct, razor-sharp answers with zero fluff or filler in minimal words.',
  },
];

export default function ToneSelector({ activeTone, onToneChange, disabled = false }) {
  return (
    <div className="flex items-center gap-1.5 p-1 bg-beige-200/70 dark:bg-navy-850/90 rounded-xl border border-beige-300/80 dark:border-navy-700/80 shadow-xs">
      <span className="text-xs font-semibold px-2 py-1 text-stone-500 dark:text-slate-400 hidden sm:inline select-none">
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
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500/30 dark:focus:ring-white/30 ${
              isSelected
                ? 'bg-orange-600 text-white shadow-sm shadow-orange-600/20 font-semibold scale-[1.02] dark:bg-white dark:text-navy-950 dark:shadow-white/10'
                : 'text-stone-700 dark:text-slate-300 hover:text-stone-900 dark:hover:text-white hover:bg-white/70 dark:hover:bg-navy-750'
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
