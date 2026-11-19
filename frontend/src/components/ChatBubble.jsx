import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { User, Sparkles, Copy, Check, Clock } from 'lucide-react';
import { TONES } from './ToneSelector';

function formatTime(timestamp) {
  if (!timestamp) return '';
  try {
    const d = new Date(timestamp);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch (e) {
    return '';
  }
}

export default function ChatBubble({ message }) {
  const isUser = message.sender === 'user';
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toneConfig = TONES.find((t) => t.id === message.tone);

  return (
    <div
      className={`group flex w-full gap-3.5 my-4 px-2 sm:px-4 ${
        isUser ? 'flex-row-reverse' : 'flex-row'
      }`}
    >
      {/* Avatar */}
      <div className="flex-shrink-0 mt-1">
        {isUser ? (
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-600 to-amber-600 dark:from-navy-750 dark:to-navy-950 flex items-center justify-center text-white shadow-sm ring-2 ring-orange-500/20 dark:ring-white/20">
            <User className="w-4 h-4" />
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-orange-600 dark:bg-white p-[1.5px] shadow-sm">
            <div className="w-full h-full bg-white dark:bg-navy-900 rounded-full flex items-center justify-center">
              <span className="font-black text-xs text-orange-600 dark:text-white">O</span>
            </div>
          </div>
        )}
      </div>

      {/* Message Body */}
      <div
        className={`flex flex-col max-w-[85%] sm:max-w-[78%] md:max-w-[70%] ${
          isUser ? 'items-end' : 'items-start'
        }`}
      >
        {/* Header info (Sender name + tone badge + time) */}
        <div
          className={`flex items-center gap-2 mb-1.5 text-xs text-stone-400 dark:text-slate-400 ${
            isUser ? 'flex-row-reverse' : 'flex-row'
          }`}
        >
          <span className="font-bold text-stone-800 dark:text-white tracking-tight">
            {isUser ? 'You' : 'OSAKA'}
          </span>

          {!isUser && toneConfig && (
            <span
              className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold border ${toneConfig.badgeClass}`}
              title={`Generated with ${toneConfig.label} tone modifier`}
            >
              <span>{toneConfig.emoji}</span>
              <span>{toneConfig.label}</span>
            </span>
          )}

          <span className="flex items-center gap-1 text-[11px] opacity-75">
            <Clock className="w-3 h-3 opacity-60" />
            {formatTime(message.timestamp)}
          </span>
        </div>

        {/* Bubble Surface */}
        <div
          className={`relative px-4 py-3.5 rounded-2xl text-sm leading-relaxed transition-all shadow-sm ${
            isUser
              ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-tr-none shadow-orange-600/15 dark:bg-gradient-to-r dark:from-navy-750 dark:to-navy-950 dark:border dark:border-white/20 dark:shadow-black/50'
              : 'bg-white text-stone-900 border border-beige-300/90 shadow-sm shadow-beige-300/20 rounded-tl-none dark:bg-navy-800 dark:text-white dark:border-navy-700 dark:shadow-black/40'
          }`}
        >
          {isUser ? (
            <div className="whitespace-pre-wrap break-words">{message.content}</div>
          ) : (
            <div className="prose prose-stone dark:prose-invert max-w-none text-sm break-words leading-relaxed space-y-2">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '');
                    const codeText = String(children).replace(/\n$/, '');

                    if (!inline && match) {
                      return (
                        <div className="relative my-3 rounded-xl overflow-hidden border border-beige-300 dark:border-navy-700 bg-stone-950 dark:bg-navy-950 text-stone-100 text-xs shadow-md">
                          <div className="flex items-center justify-between px-3.5 py-1.5 bg-stone-900 dark:bg-black/80 border-b border-stone-800 dark:border-navy-750 text-[11px] text-stone-400 dark:text-slate-400 font-mono">
                            <span className="font-semibold text-orange-400 dark:text-sky-300">{match[1]}</span>
                            <button
                              onClick={() => navigator.clipboard.writeText(codeText)}
                              className="hover:text-white transition-colors flex items-center gap-1 focus:outline-none"
                              title="Copy code"
                            >
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy</span>
                            </button>
                          </div>
                          <pre className="p-3.5 overflow-x-auto text-xs leading-5">
                            <code>{children}</code>
                          </pre>
                        </div>
                      );
                    }
                    return (
                      <code
                        className="px-1.5 py-0.5 rounded bg-beige-150 dark:bg-navy-950 text-orange-700 dark:text-sky-300 font-mono text-xs border border-beige-300 dark:border-navy-700"
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  },
                  p({ children }) {
                    return <p className="mb-2 last:mb-0">{children}</p>;
                  },
                  ul({ children }) {
                    return <ul className="list-disc pl-5 mb-2 space-y-1">{children}</ul>;
                  },
                  ol({ children }) {
                    return <ol className="list-decimal pl-5 mb-2 space-y-1">{children}</ol>;
                  },
                  blockquote({ children }) {
                    return (
                      <blockquote className="border-l-4 border-orange-500 dark:border-white pl-3.5 py-1 my-2 bg-orange-50/60 dark:bg-navy-850/80 rounded-r text-stone-800 dark:text-slate-200 text-xs leading-relaxed">
                        {children}
                      </blockquote>
                    );
                  },
                  table({ children }) {
                    return (
                      <div className="overflow-x-auto my-3 rounded-lg border border-beige-300 dark:border-navy-700">
                        <table className="min-w-full divide-y divide-beige-300 dark:divide-navy-700 text-xs">
                          {children}
                        </table>
                      </div>
                    );
                  },
                  th({ children }) {
                    return (
                      <th className="px-3.5 py-2.5 bg-beige-150 dark:bg-navy-900 text-left font-bold text-stone-900 dark:text-white">
                        {children}
                      </th>
                    );
                  },
                  td({ children }) {
                    return (
                      <td className="px-3.5 py-2 border-t border-beige-200 dark:border-navy-750 text-stone-800 dark:text-slate-200">
                        {children}
                      </td>
                    );
                  },
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          )}

          {/* Quick copy bubble action */}
          <button
            onClick={handleCopy}
            title="Copy message text"
            className={`absolute top-2 right-2 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-150 focus:opacity-100 ${
              isUser
                ? 'hover:bg-white/20 text-white/80 hover:text-white'
                : 'hover:bg-beige-150 dark:hover:bg-navy-750 text-stone-400 hover:text-stone-700 dark:hover:text-white'
            }`}
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-500" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
