import React, { useRef, useEffect } from 'react';
import { Send, Square } from 'lucide-react';
import { TONES } from './ToneSelector';

export default function ChatInput({
  input,
  setInput,
  onSend,
  onStop,
  isGenerating,
  activeTone,
}) {
  const textareaRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  }, [input]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isGenerating && input.trim()) {
        onSend();
      }
    }
  };

  const toneConfig = TONES.find((t) => t.id === activeTone);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 pb-4 pt-1">
      <div className="relative flex flex-col rounded-2xl bg-white border border-beige-300 shadow-lg shadow-beige-300/30 dark:bg-navy-800 dark:border-navy-700 dark:shadow-black/40 focus-within:ring-2 focus-within:ring-orange-500/40 focus-within:border-orange-500 dark:focus-within:ring-white/30 dark:focus-within:border-white transition-all">
        {/* Input Text Area */}
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Message OSAKA (${activeTone} mode)...`}
          rows={1}
          className="w-full pt-3.5 pb-2 px-4 bg-transparent text-stone-800 dark:text-white placeholder-stone-400 dark:placeholder-slate-400 text-sm resize-none focus:outline-none min-h-[48px] max-h-[180px]"
        />

        {/* Action Toolbar */}
        <div className="flex items-center justify-between px-3.5 pb-2.5 pt-1 border-t border-beige-200/80 dark:border-navy-750">
          {/* Tone indicator */}
          <div className="flex items-center gap-1.5 text-xs text-stone-400 dark:text-slate-400">
            {toneConfig && (
              <span className="flex items-center gap-1 font-semibold text-stone-700 dark:text-slate-200">
                <span>{toneConfig.emoji}</span>
                <span className="text-[11px]">{toneConfig.label} Mode</span>
              </span>
            )}
            <span className="hidden sm:inline text-stone-300 dark:text-navy-600">•</span>
            <span className="hidden sm:inline text-[11px]">
              Press <kbd className="px-1.5 py-0.5 rounded bg-beige-150 dark:bg-navy-900 border border-beige-300 dark:border-navy-700 font-mono text-[10px] text-stone-700 dark:text-slate-300">Enter ↵</kbd> to send
            </span>
          </div>

          {/* Action Button: Stop or Send */}
          <div className="flex items-center gap-2">
            {isGenerating ? (
              <button
                type="button"
                onClick={onStop}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-rose-500/40"
                title="Stop generation"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>Stop</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onSend}
                disabled={!input.trim()}
                className={`p-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500/40 dark:focus:ring-white/40 ${
                  input.trim()
                    ? 'bg-orange-600 hover:bg-orange-700 text-white shadow-md shadow-orange-600/30 active:scale-95 dark:bg-white dark:hover:bg-slate-100 dark:text-navy-950 dark:shadow-white/20'
                    : 'bg-beige-150 text-stone-400 dark:bg-navy-750 dark:text-slate-500 cursor-not-allowed'
                }`}
                title="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="text-center mt-2 text-[11px] text-stone-400 dark:text-slate-400">
        OSAKA AI Assistant • Intelligent streaming with tone modifiers & persistent memory.
      </div>
    </div>
  );
}
