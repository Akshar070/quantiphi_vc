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
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-sm ring-2 ring-indigo-500/20">
            <User className="w-4 h-4" />
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 p-[1.5px] shadow-sm">
            <div className="w-full h-full bg-white dark:bg-slate-900 rounded-full flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-brand-500 dark:text-brand-400" />
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
          className={`flex items-center gap-2 mb-1.5 text-xs text-slate-400 dark:text-slate-500 ${
            isUser ? 'flex-row-reverse' : 'flex-row'
          }`}
        >
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            {isUser ? 'You' : 'Claude Assistant'}
          </span>

          {!isUser && toneConfig && (
            <span
              className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium border ${toneConfig.badgeClass}`}
              title={`Generated with ${toneConfig.label} tone modifier`}
            >
              <span>{toneConfig.emoji}</span>
              <span>{toneConfig.label}</span>
            </span>
          )}

          <span className="flex items-center gap-1 text-[11px]">
            <Clock className="w-3 h-3 opacity-60" />
            {formatTime(message.timestamp)}
          </span>
        </div>

        {/* Bubble Surface */}
        <div
          className={`relative px-4 py-3.5 rounded-2xl text-sm leading-relaxed transition-all shadow-sm ${
            isUser
              ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-tr-none shadow-indigo-500/10'
              : 'bg-white dark:bg-slate-800/90 text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700/60 rounded-tl-none shadow-slate-200/50 dark:shadow-none'
          }`}
        >
          {isUser ? (
            <div className="whitespace-pre-wrap break-words">{message.content}</div>
          ) : (
            <div className="prose prose-slate dark:prose-invert max-w-none text-sm break-words leading-relaxed space-y-2">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '');
                    const codeText = String(children).replace(/\n$/, '');

                    if (!inline && match) {
                      return (
                        <div className="relative my-3 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700/80 bg-slate-900 text-slate-100 text-xs">
                          <div className="flex items-center justify-between px-3 py-1.5 bg-slate-950/80 border-b border-slate-800 text-[11px] text-slate-400 font-mono">
                            <span>{match[1]}</span>
                            <button
                              onClick={() => navigator.clipboard.writeText(codeText)}
                              className="hover:text-white transition-colors flex items-center gap-1 focus:outline-none"
                              title="Copy code"
                            >
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy</span>
                            </button>
                          </div>
                          <pre className="p-3 overflow-x-auto text-xs leading-5">
                            <code>{children}</code>
                          </pre>
                        </div>
                      );
                    }
                    return (
                      <code
                        className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700/80 text-brand-600 dark:text-brand-300 font-mono text-xs"
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
                      <blockquote className="border-l-4 border-brand-500 pl-3 italic text-slate-600 dark:text-slate-400 my-2">
                        {children}
                      </blockquote>
                    );
                  },
                  table({ children }) {
                    return (
                      <div className="overflow-x-auto my-2">
                        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700 text-xs border border-slate-200 dark:border-slate-700">
                          {children}
                        </table>
                      </div>
                    );
                  },
                  th({ children }) {
                    return (
                      <th className="px-3 py-2 bg-slate-100 dark:bg-slate-800 text-left font-semibold">
                        {children}
                      </th>
                    );
                  },
                  td({ children }) {
                    return (
                      <td className="px-3 py-2 border-t border-slate-200 dark:border-slate-700">
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
                : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
            }`}
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
