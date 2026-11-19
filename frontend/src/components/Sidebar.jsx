import React, { useState } from 'react';
import {
  MessageSquare,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Search,
  Sparkles,
  Database,
  Cpu,
} from 'lucide-react';
import { TONES } from './ToneSelector';

function groupConversationsByDate(conversations) {
  const groups = {
    Today: [],
    Yesterday: [],
    'Previous 7 Days': [],
    Older: [],
  };

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfYesterday = new Date(startOfToday.getTime() - 24 * 60 * 60 * 1000);
  const startOfSevenDaysAgo = new Date(startOfToday.getTime() - 7 * 24 * 60 * 60 * 1000);

  conversations.forEach((conv) => {
    const date = new Date(conv.updatedAt || conv.createdAt || Date.now());
    if (date >= startOfToday) {
      groups.Today.push(conv);
    } else if (date >= startOfYesterday) {
      groups.Yesterday.push(conv);
    } else if (date >= startOfSevenDaysAgo) {
      groups['Previous 7 Days'].push(conv);
    } else {
      groups.Older.push(conv);
    }
  });

  return groups;
}

export default function Sidebar({
  conversations,
  activeId,
  onSelectConversation,
  onNewChat,
  onDeleteConversation,
  onRenameConversation,
  onClearAll,
  isOpen,
  setIsOpen,
  health,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  const filtered = conversations.filter((c) =>
    (c.title || 'Untitled Chat').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const grouped = groupConversationsByDate(filtered);

  const handleStartRename = (conv, e) => {
    e.stopPropagation();
    setEditingId(conv._id);
    setEditTitle(conv.title || 'Untitled Chat');
  };

  const handleSaveRename = (id, e) => {
    e.stopPropagation();
    if (editTitle.trim()) {
      onRenameConversation(id, editTitle.trim());
    }
    setEditingId(null);
  };

  const handleCancelRename = (e) => {
    e.stopPropagation();
    setEditingId(null);
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    if (window.confirm('Delete this conversation thread?')) {
      onDeleteConversation(id);
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-navy-950/60 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 w-72 flex flex-col bg-beige-50 dark:bg-navy-900 border-r border-beige-300/80 dark:border-navy-750 transition-all duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0 md:w-0 md:opacity-0 md:border-r-0 overflow-hidden'
        }`}
      >
        {/* App Branding & New Chat */}
        <div className="p-4 border-b border-beige-300/80 dark:border-navy-750 flex flex-col gap-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              {/* Monogram / Brand Icon */}
              <div className="w-8 h-8 rounded-xl bg-orange-600 dark:bg-white flex items-center justify-center text-white dark:text-navy-950 shadow-sm shadow-orange-600/30 dark:shadow-black/50 font-black text-sm tracking-wider">
                O
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-base tracking-tight text-stone-900 dark:text-white">
                  OSAKA
                </span>
                <span className="text-[10px] font-semibold tracking-widest text-orange-600 dark:text-slate-400 uppercase -mt-0.5">
                  AI Assistant
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-white md:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* New Chat Button */}
          <button
            onClick={() => {
              onNewChat();
              if (window.innerWidth < 768) setIsOpen(false);
            }}
            className="flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white dark:bg-white dark:hover:bg-slate-100 dark:text-navy-950 active:scale-[0.99] text-xs font-bold shadow-md shadow-orange-600/20 dark:shadow-black/40 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>New Conversation</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="px-3 pt-3 pb-1">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 dark:text-slate-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg bg-white dark:bg-navy-850 border border-beige-300 dark:border-navy-700 text-stone-800 dark:text-white placeholder-stone-400 dark:placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-orange-500 dark:focus:ring-white/40"
            />
          </div>
        </div>

        {/* Conversation List (Scrollable) */}
        <div className="flex-1 overflow-y-auto px-2 py-2 space-y-4">
          {conversations.length === 0 ? (
            <div className="text-center py-8 px-4 text-xs text-stone-400 dark:text-slate-500">
              No conversations yet. Start a new chat to see history here!
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-8 px-4 text-xs text-stone-400 dark:text-slate-500">
              No chats found matching "{searchTerm}"
            </div>
          ) : (
            Object.entries(grouped).map(([groupTitle, items]) => {
              if (items.length === 0) return null;
              return (
                <div key={groupTitle} className="space-y-1">
                  <div className="px-2 py-1 text-[11px] font-bold text-stone-400 dark:text-slate-400 uppercase tracking-wider">
                    {groupTitle}
                  </div>

                  {items.map((conv) => {
                    const isActive = conv._id === activeId;
                    const toneConfig = TONES.find((t) => t.id === conv.tone);

                    return (
                      <div
                        key={conv._id}
                        onClick={() => {
                          onSelectConversation(conv._id);
                          if (window.innerWidth < 768) setIsOpen(false);
                        }}
                        className={`group relative flex items-center justify-between px-2.5 py-2 rounded-xl text-xs cursor-pointer transition-all ${
                          isActive
                            ? 'bg-white dark:bg-navy-800 text-stone-900 dark:text-white shadow-xs border border-beige-300 dark:border-navy-600 font-semibold ring-1 ring-orange-500/20 dark:ring-white/20'
                            : 'text-stone-700 dark:text-slate-300 hover:bg-beige-150/90 dark:hover:bg-navy-850 hover:text-stone-900 dark:hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <MessageSquare
                            className={`w-3.5 h-3.5 flex-shrink-0 ${
                              isActive ? 'text-orange-600 dark:text-sky-300' : 'text-stone-400 dark:text-slate-400'
                            }`}
                          />

                          {editingId === conv._id ? (
                            <input
                              type="text"
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSaveRename(conv._id, e);
                                if (e.key === 'Escape') handleCancelRename(e);
                              }}
                              autoFocus
                              onClick={(e) => e.stopPropagation()}
                              className="w-full px-1.5 py-0.5 text-xs rounded bg-beige-100 dark:bg-navy-750 text-stone-900 dark:text-white border border-orange-500 dark:border-white focus:outline-none"
                            />
                          ) : (
                            <span className="truncate flex-1" title={conv.title}>
                              {conv.title || 'Untitled Chat'}
                            </span>
                          )}
                        </div>

                        {/* Tone Emoji & Actions */}
                        <div className="flex items-center gap-1 ml-2">
                          {editingId === conv._id ? (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={(e) => handleSaveRename(conv._id, e)}
                                className="p-1 text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
                                title="Save"
                              >
                                <Check className="w-3 h-3" />
                              </button>
                              <button
                                onClick={handleCancelRename}
                                className="p-1 text-stone-400 hover:text-stone-600 dark:hover:text-slate-200"
                                title="Cancel"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ) : (
                            <>
                              {toneConfig && (
                                <span
                                  className="text-[11px] opacity-75 group-hover:hidden"
                                  title={`Tone: ${toneConfig.label}`}
                                >
                                  {toneConfig.emoji}
                                </span>
                              )}

                              {/* Hover actions (Rename & Delete) */}
                              <div className="hidden group-hover:flex items-center gap-1">
                                <button
                                  onClick={(e) => handleStartRename(conv, e)}
                                  className="p-1 text-stone-400 hover:text-stone-700 dark:hover:text-white rounded"
                                  title="Rename"
                                >
                                  <Edit2 className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={(e) => handleDelete(conv._id, e)}
                                  className="p-1 text-stone-400 hover:text-rose-500 rounded"
                                  title="Delete"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })
          )}
        </div>

        {/* Sidebar Footer: Database & OSAKA Engine Status */}
        <div className="p-3 border-t border-beige-300/80 dark:border-navy-750 bg-beige-100/70 dark:bg-navy-950/80 space-y-2">
          <div className="flex flex-col gap-1.5 text-[11px] text-stone-500 dark:text-slate-400">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Database className="w-3 h-3 text-stone-400 dark:text-slate-400" />
                <span>MongoDB:</span>
              </span>
              <span
                className={`inline-flex items-center gap-1 font-medium ${
                  health?.database?.connected
                    ? 'text-emerald-700 dark:text-emerald-400'
                    : 'text-amber-700 dark:text-amber-400'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    health?.database?.connected ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}
                />
                {health?.database?.connected ? 'Connected' : 'Local Fallback'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Cpu className="w-3 h-3 text-stone-400 dark:text-slate-400" />
                <span>OSAKA Engine:</span>
              </span>
              <span className="inline-flex items-center gap-1 font-medium text-orange-600 dark:text-white">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 dark:bg-sky-400 animate-pulse" />
                {health?.claude?.apiKeyConfigured ? 'Ready (Cloud + Core)' : 'Active (Local Core)'}
              </span>
            </div>
          </div>

          {/* Clear all button */}
          {conversations.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to delete all conversations?')) {
                  onClearAll();
                }
              }}
              className="w-full text-center py-1 text-[11px] text-stone-400 hover:text-rose-600 transition-colors"
            >
              Clear conversation history
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
