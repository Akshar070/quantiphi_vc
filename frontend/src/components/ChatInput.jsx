import React, { useRef, useEffect } from 'react';
import { Send, Square, Sparkles } from 'lucide-react';
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
      <div className="relative flex flex-col rounded-2xl bg-white dark:bg-slate-800/95 border border-slate-200/90 dark:border-slate-700/80 shadow-lg shadow-slate-200/50 dark:shadow-slate-950/40 focus-within:ring-2 focus-within:ring-brand-500/50 focus-within:border-brand-500 transition-all">
        {/* Input Text Area */}
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Message Claude Assistant (${activeTone} mode)...`}
          rows={1}
          className="w-full pt-3.5 pb-2 px-4 bg-transparent text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm resize-none focus:outline-none min-h-[48px] max-h-[180px]"
        />

        {/* Action Toolbar */}
        <div className="flex items-center justify-between px-3 pb-2.5 pt-1 border-t border-slate-100 dark:border-slate-700/40">
          {/* Tone indicator */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
            {toneConfig && (
              <span className="flex items-center gap-1 font-medium text-slate-600 dark:text-slate-300">
                <span>{toneConfig.emoji}</span>
                <span className="text-[11px]">{toneConfig.label} Mode</span>
              </span>
            )}
            <span className="hidden sm:inline text-slate-300 dark:text-slate-600">•</span>
            <span className="hidden sm:inline text-[11px]">
              Press <kbd className="px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-700 font-mono text-[10px]">Enter ↵</kbd> to send
            </span>
          </div>

          {/* Action Button: Stop or Send */}
          <div className="flex items-center gap-2">
            {isGenerating ? (
              <button
                type="button"
                onClick={onStop}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-rose-500/40"
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
                className={`p-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500/40 ${
                  input.trim()
                    ? 'bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-600/30 active:scale-95'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                }`}
                title="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="text-center mt-2 text-[11px] text-slate-400 dark:text-slate-500">
        AI Chat Assistant with real-time Claude API streaming and MongoDB persistence.
      </div>
    </div>
  );
}
