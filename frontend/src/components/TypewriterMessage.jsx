import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Loader2 } from 'lucide-react';
import { TONES } from './ToneSelector';

export default function TypewriterMessage({ streamText, tone = 'Professional', isGenerating = true }) {
  const toneConfig = TONES.find((t) => t.id === tone);

  return (
    <div className="flex w-full gap-3.5 my-4 px-2 sm:px-4 flex-row items-start">
      {/* AI Avatar */}
      <div className="flex-shrink-0 mt-1">
        <div className="w-8 h-8 rounded-full bg-orange-600 dark:bg-[#12204c] dark:border dark:border-[#233d87] p-[1.5px] shadow-sm animate-pulse-subtle flex items-center justify-center">
          <span className="font-black text-xs text-white">O</span>
        </div>
      </div>

      {/* Message Body */}
      <div className="flex flex-col max-w-[85%] sm:max-w-[78%] md:max-w-[70%] items-start">
        {/* Header info */}
        <div className="flex items-center gap-2 mb-1.5 text-xs text-stone-400 dark:text-[#cfc3b0]">
          <span className="font-bold text-stone-800 dark:text-white tracking-tight">OSAKA</span>

          {toneConfig && (
            <span
              className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold border ${toneConfig.badgeClass}`}
            >
              <span>{toneConfig.emoji}</span>
              <span>{toneConfig.label}</span>
            </span>
          )}

          <span className="inline-flex items-center gap-1 text-[11px] text-orange-600 dark:text-[#8ba6f3] font-semibold">
            <Loader2 className="w-3 h-3 animate-spin" />
            Generating...
          </span>
        </div>

        {/* Bubble Surface: Navy in dark mode, Beige text */}
        <div className="relative px-4 py-3.5 rounded-2xl rounded-tl-none text-sm leading-relaxed bg-white text-stone-900 border border-[#e3d7c3] shadow-sm shadow-beige-300/20 dark:bg-[#0d1838] dark:text-[#f4eee3] dark:border dark:border-[#182b62] min-w-[120px]">
          {streamText ? (
            <div className="prose max-w-none text-sm break-words leading-relaxed space-y-2 dark:text-[#f4eee3]">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ node, inline, className, children, ...props }) {
                    return (
                      <code
                        className="px-1.5 py-0.5 rounded bg-[#f4efe4] dark:bg-[#070d1e] text-orange-700 dark:text-[#f4eee3] font-mono text-xs border border-[#e3d7c3] dark:border-[#182b62]"
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  },
                  p({ children }) {
                    return <p className="mb-2 last:mb-0 dark:text-[#f4eee3]">{children}</p>;
                  },
                  strong({ children }) {
                    return <strong className="font-bold text-stone-900 dark:text-white">{children}</strong>;
                  },
                  blockquote({ children }) {
                    return (
                      <blockquote className="border-l-4 border-orange-500 dark:border-[#cfc3b0] pl-3.5 py-1.5 my-2.5 bg-orange-50/60 dark:bg-[#0a132c] rounded-r text-stone-800 dark:text-[#f4eee3] text-xs leading-relaxed">
                        {children}
                      </blockquote>
                    );
                  },
                }}
              >
                {streamText}
              </ReactMarkdown>
              {isGenerating && (
                <span className="inline-block w-2 h-4 ml-1 bg-orange-500 dark:bg-white animate-blink align-middle rounded-xs" />
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 py-1 text-stone-400 dark:text-[#cfc3b0] text-xs font-medium">
              <span className="flex space-x-1">
                <span className="w-1.5 h-1.5 bg-orange-500 dark:bg-[#8ba6f3] rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-1.5 h-1.5 bg-orange-500 dark:bg-[#8ba6f3] rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-1.5 h-1.5 bg-orange-500 dark:bg-[#8ba6f3] rounded-full animate-bounce"></span>
              </span>
              <span>OSAKA is composing with {tone} tone...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
