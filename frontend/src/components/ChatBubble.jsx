import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { User, Copy, Check, Clock } from 'lucide-react';
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
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-600 to-amber-600 dark:from-[#12204c] dark:to-[#0a132c] dark:border dark:border-[#233d87] flex items-center justify-center text-white shadow-sm ring-2 ring-orange-500/20 dark:ring-[#3257be]/30">
            <User className="w-4 h-4" />
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-orange-600 dark:bg-[#12204c] dark:border dark:border-[#233d87] p-[1.5px] shadow-sm flex items-center justify-center">
            <span className="font-black text-xs text-white">O</span>
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
          className={`flex items-center gap-2 mb-1.5 text-xs text-stone-400 dark:text-[#cfc3b0] ${
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

        {/* Bubble Surface: Navy in dark mode, Beige text */}
        <div
          className={`relative px-4 py-3.5 rounded-2xl text-sm leading-relaxed transition-all shadow-sm ${
            isUser
              ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-tr-none shadow-orange-600/15 dark:bg-[#12204c] dark:border dark:border-[#233d87] dark:shadow-black/50'
              : 'bg-white text-stone-900 border border-[#e3d7c3] shadow-sm shadow-beige-300/20 rounded-tl-none dark:bg-[#0d1838] dark:text-[#f4eee3] dark:border dark:border-[#182b62] dark:shadow-black/40'
          }`}
        >
          {isUser ? (
            <div className="whitespace-pre-wrap break-words">{message.content}</div>
          ) : (
            <div className="prose max-w-none text-sm break-words leading-relaxed space-y-2 dark:text-[#f4eee3]">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '');
                    const codeText = String(children).replace(/\n$/, '');

                    if (!inline && match) {
                      return (
                        <div className="relative my-3 rounded-xl overflow-hidden border border-[#e3d7c3] dark:border-[#182b62] bg-stone-950 dark:bg-[#040817] text-stone-100 text-xs shadow-md">
                          <div className="flex items-center justify-between px-3.5 py-1.5 bg-stone-900 dark:bg-[#0a132c] border-b border-stone-800 dark:border-[#182b62] text-[11px] text-stone-400 dark:text-[#cfc3b0] font-mono">
                            <span className="font-semibold text-orange-400 dark:text-[#8ba6f3]">{match[1]}</span>
                            <button
                              onClick={() => navigator.clipboard.writeText(codeText)}
                              className="hover:text-white transition-colors flex items-center gap-1 focus:outline-none"
                              title="Copy code"
                            >
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy</span>
                            </button>
                          </div>
                          <pre className="p-3.5 overflow-x-auto text-xs leading-5 dark:text-white">
                            <code>{children}</code>
                          </pre>
                        </div>
                      );
                    }
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
                  ul({ children }) {
                    return <ul className="list-disc pl-5 mb-2 space-y-1 dark:text-[#f4eee3]">{children}</ul>;
                  },
                  ol({ children }) {
                    return <ol className="list-decimal pl-5 mb-2 space-y-1 dark:text-[#f4eee3]">{children}</ol>;
                  },
                  strong({ children }) {
                    return <strong className="font-bold text-stone-900 dark:text-white">{children}</strong>;
                  },
                  h1({ children }) {
                    return <h1 className="text-lg font-extrabold text-stone-900 dark:text-white my-3">{children}</h1>;
                  },
                  h2({ children }) {
                    return <h2 className="text-base font-bold text-stone-900 dark:text-white my-2.5">{children}</h2>;
                  },
                  h3({ children }) {
                    return <h3 className="text-sm font-bold text-stone-900 dark:text-white my-2">{children}</h3>;
                  },
                  h4({ children }) {
                    return <h4 className="text-xs font-bold text-stone-900 dark:text-white my-1.5">{children}</h4>;
                  },
                  blockquote({ children }) {
                    return (
                      <blockquote className="border-l-4 border-orange-500 dark:border-[#cfc3b0] pl-3.5 py-1.5 my-2.5 bg-orange-50/60 dark:bg-[#0a132c] rounded-r text-stone-800 dark:text-[#f4eee3] text-xs leading-relaxed">
                        {children}
                      </blockquote>
                    );
                  },
                  table({ children }) {
                    return (
                      <div className="overflow-x-auto my-3 rounded-lg border border-[#e3d7c3] dark:border-[#182b62]">
                        <table className="min-w-full divide-y divide-[#e3d7c3] dark:divide-[#182b62] text-xs">
                          {children}
                        </table>
                      </div>
                    );
                  },
                  th({ children }) {
                    return (
                      <th className="px-3.5 py-2.5 bg-[#f4efe4] dark:bg-[#0a132c] text-left font-bold text-stone-900 dark:text-white">
                        {children}
                      </th>
                    );
                  },
                  td({ children }) {
                    return (
                      <td className="px-3.5 py-2 border-t border-[#eee6d8] dark:border-[#12204c] text-stone-800 dark:text-[#f4eee3]">
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
                : 'hover:bg-[#f4efe4] dark:hover:bg-[#12204c] text-stone-400 hover:text-stone-700 dark:text-[#cfc3b0] dark:hover:text-white'
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
