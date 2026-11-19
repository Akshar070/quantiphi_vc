import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Sparkles, Loader2 } from 'lucide-react';
import { TONES } from './ToneSelector';

export default function TypewriterMessage({ streamText, tone = 'Professional', isGenerating = true }) {
  const toneConfig = TONES.find((t) => t.id === tone);

  return (
    <div className="flex w-full gap-3.5 my-4 px-2 sm:px-4 flex-row items-start">
      {/* AI Avatar */}
      <div className="flex-shrink-0 mt-1">
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 p-[1.5px] shadow-sm animate-pulse-subtle">
          <div className="w-full h-full bg-white dark:bg-slate-900 rounded-full flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-brand-500 dark:text-brand-400" />
          </div>
        </div>
      </div>

      {/* Message Body */}
      <div className="flex flex-col max-w-[85%] sm:max-w-[78%] md:max-w-[70%] items-start">
        {/* Header info */}
        <div className="flex items-center gap-2 mb-1.5 text-xs text-slate-400 dark:text-slate-500">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Claude Assistant</span>

          {toneConfig && (
            <span
              className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium border ${toneConfig.badgeClass}`}
            >
              <span>{toneConfig.emoji}</span>
              <span>{toneConfig.label}</span>
            </span>
          )}

          <span className="inline-flex items-center gap-1 text-[11px] text-brand-600 dark:text-brand-400 font-medium">
            <Loader2 className="w-3 h-3 animate-spin" />
            Generating...
          </span>
        </div>

        {/* Bubble Surface */}
        <div className="relative px-4 py-3.5 rounded-2xl rounded-tl-none text-sm leading-relaxed bg-white dark:bg-slate-800/90 text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700/60 shadow-sm min-w-[120px]">
          {streamText ? (
            <div className="prose prose-slate dark:prose-invert max-w-none text-sm break-words leading-relaxed space-y-2">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ node, inline, className, children, ...props }) {
                    return (
                      <code
                        className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700/80 text-brand-600 dark:text-brand-300 font-mono text-xs"
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {streamText}
              </ReactMarkdown>
              {isGenerating && (
                <span className="inline-block w-2 h-4 ml-1 bg-brand-500 animate-blink align-middle rounded-sm" />
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 py-1 text-slate-400 dark:text-slate-500 text-xs">
              <span className="flex space-x-1">
                <span className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce"></span>
              </span>
              <span>Thinking with {tone} tone...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
