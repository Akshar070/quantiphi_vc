import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ChatBubble from './components/ChatBubble';
import TypewriterMessage from './components/TypewriterMessage';
import ChatInput from './components/ChatInput';
import EmptyState from './components/EmptyState';
import { ArrowDown } from 'lucide-react';

const API_BASE = '/api';

export default function App() {
  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [activeTone, setActiveTone] = useState('Professional');
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [streamText, setStreamText] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [health, setHealth] = useState(null);
  const [showScrollBottom, setShowScrollBottom] = useState(false);

  const messagesEndRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const abortControllerRef = useRef(null);

  // Fetch health and conversations on mount
  useEffect(() => {
    fetchHealth();
    fetchConversations();
  }, []);

  const fetchHealth = async () => {
    try {
      const res = await fetch(`${API_BASE}/health`);
      if (res.ok) {
        const data = await res.json();
        setHealth(data);
      }
    } catch (err) {
      console.error('Failed to fetch health status:', err);
    }
  };

  const fetchConversations = async (autoSelectLatest = false) => {
    try {
      const res = await fetch(`${API_BASE}/conversations`);
      if (res.ok) {
        const data = await res.json();
        setConversations(data);
        if (autoSelectLatest && data.length > 0 && !activeId) {
          loadConversation(data[0]._id);
        }
      }
    } catch (err) {
      console.error('Failed to fetch conversations:', err);
    }
  };

  const loadConversation = async (id) => {
    if (isGenerating) return;
    try {
      const res = await fetch(`${API_BASE}/conversations/${id}`);
      if (res.ok) {
        const data = await res.json();
        setActiveId(data._id);
        setCurrentConversation(data);
        if (data.tone) {
          setActiveTone(data.tone);
        }
      }
    } catch (err) {
      console.error('Failed to load conversation:', err);
    }
  };

  const handleNewChat = () => {
    if (isGenerating) return;
    setActiveId(null);
    setCurrentConversation(null);
    setStreamText('');
    setInput('');
  };

  const handleToneChange = async (newTone) => {
    setActiveTone(newTone);
    if (activeId) {
      try {
        await fetch(`${API_BASE}/conversations/${activeId}/tone`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tone: newTone }),
        });
        setCurrentConversation((prev) => (prev ? { ...prev, tone: newTone } : prev));
        setConversations((prev) =>
          prev.map((c) => (c._id === activeId ? { ...c, tone: newTone } : c))
        );
      } catch (err) {
        console.error('Failed to persist tone change:', err);
      }
    }
  };

  const handleRename = async (id, newTitle) => {
    try {
      const res = await fetch(`${API_BASE}/conversations/${id}/title`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle }),
      });
      if (res.ok) {
        setConversations((prev) =>
          prev.map((c) => (c._id === id ? { ...c, title: newTitle } : c))
        );
        if (activeId === id) {
          setCurrentConversation((prev) => (prev ? { ...prev, title: newTitle } : prev));
        }
      }
    } catch (err) {
      console.error('Failed to rename conversation:', err);
    }
  };

  const handleDeleteConversation = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/conversations/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setConversations((prev) => prev.filter((c) => c._id !== id));
        if (activeId === id) {
          handleNewChat();
        }
      }
    } catch (err) {
      console.error('Failed to delete conversation:', err);
    }
  };

  const handleClearAll = async () => {
    try {
      const res = await fetch(`${API_BASE}/conversations`, { method: 'DELETE' });
      if (res.ok) {
        setConversations([]);
        handleNewChat();
      }
    } catch (err) {
      console.error('Failed to clear conversations:', err);
    }
  };

  // Auto-scroll handler
  const scrollToBottom = (behavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    scrollToBottom('smooth');
  }, [currentConversation?.messages, streamText]);

  // Track scroll position to show "scroll to bottom" button
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    const isUp = scrollHeight - scrollTop - clientHeight > 180;
    setShowScrollBottom(isUp);
  };

  // Real-Time Streaming Message Sender
  const handleSendMessage = async (customPrompt = null, customTone = null) => {
    const promptToSend = customPrompt || input;
    if (!promptToSend.trim() || isGenerating) return;

    const toneToSend = customTone || activeTone;
    if (customTone && customTone !== activeTone) {
      setActiveTone(customTone);
    }

    setInput('');
    setIsGenerating(true);
    setStreamText('');

    // Optimistically update conversation view with user message
    const tempUserMsg = {
      id: 'temp_' + Date.now(),
      sender: 'user',
      content: promptToSend.trim(),
      timestamp: new Date().toISOString(),
    };

    setCurrentConversation((prev) => {
      const existing = prev?.messages || [];
      return {
        _id: prev?._id || 'temp_conv',
        title: prev?.title || promptToSend.slice(0, 35),
        tone: toneToSend,
        messages: [...existing, tempUserMsg],
      };
    });

    // Abort controller for Stop button
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const response = await fetch(`${API_BASE}/chat/stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: activeId,
          prompt: promptToSend.trim(),
          tone: toneToSend,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let accumulated = '';
      let targetConvId = activeId;

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const rawJson = line.slice(6).trim();
            if (!rawJson) continue;

            try {
              const data = JSON.parse(rawJson);

              if (data.type === 'start') {
                targetConvId = data.conversationId;
                setActiveId(data.conversationId);
              } else if (data.type === 'chunk') {
                accumulated += data.text;
                setStreamText(accumulated);
              } else if (data.type === 'done') {
                // Finalize conversation with saved messages from MongoDB
                setActiveId(data.conversationId);
                await loadConversation(data.conversationId);
                await fetchConversations();
              } else if (data.type === 'error') {
                console.error('Streaming server error:', data.message);
              }
            } catch (jsonErr) {
              // Ignore partial JSON parse chunks
            }
          }
        }
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        console.log('Stream stopped by user.');
        // Still persist what was received
        if (activeId) {
          loadConversation(activeId);
        }
      } else {
        console.error('Chat stream error:', err);
      }
    } finally {
      setIsGenerating(false);
      setStreamText('');
      abortControllerRef.current = null;
    }
  };

  const handleStopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  const handleSelectSuggestion = (prompt, tone) => {
    handleSendMessage(prompt, tone);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans">
      {/* Sidebar for Conversation History */}
      <Sidebar
        conversations={conversations}
        activeId={activeId}
        onSelectConversation={loadConversation}
        onNewChat={handleNewChat}
        onDeleteConversation={handleDeleteConversation}
        onRenameConversation={handleRename}
        onClearAll={handleClearAll}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        health={health}
      />

      {/* Main Chat Area */}
      <div className="flex flex-col flex-1 h-full min-w-0 relative">
        {/* Header with Title, Tone Selector, and Theme Toggle */}
        <Header
          activeTone={activeTone}
          onToneChange={handleToneChange}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          currentTitle={currentConversation?.title}
          isGenerating={isGenerating}
        />

        {/* Scrollable Conversation Container */}
        <main
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto px-2 sm:px-4 py-4 space-y-2 relative"
        >
          {/* Empty State / Welcome Screen if no messages */}
          {(!currentConversation || currentConversation.messages.length === 0) && !isGenerating ? (
            <EmptyState
              onSelectSuggestion={handleSelectSuggestion}
              activeTone={activeTone}
            />
          ) : (
            <div className="max-w-4xl mx-auto w-full pb-6">
              {/* Render Existing Conversation Messages */}
              {currentConversation?.messages?.map((msg, index) => (
                <ChatBubble key={msg.id || index} message={msg} />
              ))}

              {/* Real-time Typewriter Streaming Message */}
              {isGenerating && (
                <TypewriterMessage
                  streamText={streamText}
                  tone={activeTone}
                  isGenerating={isGenerating}
                />
              )}

              {/* Scroll anchor */}
              <div ref={messagesEndRef} className="h-4" />
            </div>
          )}

          {/* Floating Scroll-to-bottom button */}
          {showScrollBottom && (
            <button
              onClick={() => scrollToBottom('smooth')}
              type="button"
              className="fixed bottom-24 right-8 p-2 rounded-full bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-all z-20 hover:scale-105 active:scale-95"
              title="Scroll to bottom"
            >
              <ArrowDown className="w-4 h-4" />
            </button>
          )}
        </main>

        {/* Chat Input Bar */}
        <ChatInput
          input={input}
          setInput={setInput}
          onSend={() => handleSendMessage()}
          onStop={handleStopGeneration}
          isGenerating={isGenerating}
          activeTone={activeTone}
        />
      </div>
    </div>
  );
}
