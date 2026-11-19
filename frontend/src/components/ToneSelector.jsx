import React from 'react';
import { Briefcase, Coffee, Zap } from 'lucide-react';

const TONES = [
  {
    id: 'Professional',
    label: 'Professional',
    icon: Briefcase,
    emoji: '👔',
    badgeClass: 'text-stone-800 dark:text-white bg-white/90 dark:bg-[#0d1838] border-[#e3d7c3] dark:border-[#182b62] shadow-xs',
    description: 'Polished, authoritative, and structured responses suitable for executive & technical work.',
  },
  {
    id: 'Casual',
    label: 'Casual',
    icon: Coffee,
    emoji: '☕',
    badgeClass: 'text-orange-950 dark:text-[#f4eee3] bg-orange-50 dark:bg-[#0d1838] border-orange-200 dark:border-[#182b62] shadow-xs',
    description: 'Friendly, warm, conversational style with relatable analogies & engaging cadence.',
  },
  {
    id: 'Concise',
    label: 'Concise',
    icon: Zap,
    emoji: '⚡',
    badgeClass: 'text-stone-900 dark:text-[#f4eee3] bg-[#f4efe4] dark:bg-[#0d1838] border-[#e3d7c3] dark:border-[#182b62] shadow-xs',
    description: 'Direct, razor-sharp answers with zero fluff or filler in minimal words.',
  },
];

export default function ToneSelector({ activeTone, onToneChange, disabled = false }) {
  return (
    <div className="flex items-center gap-1.5 p-1 bg-[#eee6d8]/70 dark:bg-[#0a132c] rounded-xl border border-[#e3d7c3] dark:border-[#182b62] shadow-xs">
      <span className="text-xs font-semibold px-2 py-1 text-stone-500 dark:text-[#cfc3b0] hidden sm:inline select-none">
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
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500/30 dark:focus:ring-[#3257be]/50 ${isSelected
                ? 'bg-orange-600 text-white shadow-sm font-semibold scale-[1.02] dark:bg-[#182b62] dark:text-white dark:border dark:border-[#3257be] dark:shadow-md'
                : 'text-stone-700 dark:text-[#f4eee3] hover:text-stone-900 dark:hover:text-white hover:bg-white/70 dark:hover:bg-[#12204c]'
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
