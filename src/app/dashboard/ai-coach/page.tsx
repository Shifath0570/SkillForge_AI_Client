'use client';

import React, { useEffect, useState, useRef } from 'react';
import GlassCard from '../../../components/GlassCard';
import Skeleton from '../../../components/Skeleton';
import { api } from '../../../utils/api';
import toast from 'react-hot-toast';
import { Bot, Send, Trash2, Cpu, Sparkles, MessageSquare, Loader2 } from 'lucide-react';

interface ChatMessage {
  sender: 'user' | 'ai';
  message: string;
  timestamp: string;
}

export default function AICareerCoachChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const presetQuestions = [
    'How can I improve my resume?',
    'What skills should I learn next?',
    'Prepare me for a React Developer interview.',
    'Generate Node.js backend coding questions.'
  ];

  // Fetch chat thread on page load
  useEffect(() => {
    const fetchChat = async () => {
      try {
        const res = await api.ai.getChatHistory();
        if (res.success) {
          setMessages(res.messages || []);
        }
      } catch (err) {
        console.error('Error fetching chat history:', err);
      } finally {
        setLoadingHistory(false);
      }
    };
    fetchChat();
  }, []);

  // Scroll to bottom on updates
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, sending]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || sending) return;
    const userMessageText = textToSend.trim();
    setInput('');
    setSending(true);

    // Optimistically update message array
    const optimisticUserMsg: ChatMessage = {
      sender: 'user',
      message: userMessageText,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, optimisticUserMsg]);

    try {
      const res = await api.ai.chat(userMessageText);
      if (res.success && res.reply) {
        const coachMsg: ChatMessage = {
          sender: 'ai',
          message: res.reply,
          timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, coachMsg]);
      }
    } catch (err: any) {
      toast.error(err.message || 'AI coach connection lost');
      // remove optimistic message if failed to make it robust
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setSending(false);
    }
  };

  const handleClearChat = async () => {
    if (!confirm('Are you sure you want to clear your conversation history?')) return;
    try {
      const res = await api.ai.clearChat();
      if (res.success) {
        setMessages([]);
        toast.success('Chat history cleared');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to clear history');
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      
      {/* Header toolbar */}
      <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-1.5">
            <Bot className="h-6 w-6 text-teal-400 animate-pulse" />
            <span>AI Career Coach Chat</span>
          </h1>
          <p className="text-sm text-slate-400">
            Persistent career counselor. Asks mockup interview prep and resume editing notes.
          </p>
        </div>
        
        {messages.length > 0 && (
          <button
            onClick={handleClearChat}
            className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 bg-red-500/10 px-3 py-2 rounded-xl border border-red-500/20 transition-all cursor-pointer"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Clear Chat</span>
          </button>
        )}
      </div>

      {/* Main chat window container */}
      <GlassCard className="flex-grow flex flex-col justify-between overflow-hidden border border-white/5 bg-slate-950/20 p-4">
        
        {/* Messages Stream */}
        <div className="flex-grow overflow-y-auto space-y-4 pr-2 mb-4 scrollbar-thin">
          
          {loadingHistory ? (
            <div className="space-y-4">
              <Skeleton variant="text" className="w-1/3 h-10" />
              <Skeleton variant="text" className="w-1/2 h-8 ml-auto" />
              <Skeleton variant="text" className="w-2/3 h-12" />
            </div>
          ) : messages.length === 0 ? (
            /* Empty welcome state */
            <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-4 py-8">
              <Cpu className="h-10 w-10 text-teal-400 animate-bounce" />
              <h3 className="text-base font-bold text-white">Your Agentic Career Coach</h3>
              <p className="text-xs text-slate-500">
                I remember your uploaded resume tags, gaps, and job recommendations automatically. Type a message or choose a prompt to begin.
              </p>

              {/* Preset suggestion list */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full pt-4">
                {presetQuestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(q)}
                    className="p-3 text-left rounded-xl bg-white/5 border border-white/10 hover:border-blue-500/40 text-xs text-slate-300 hover:text-white transition-all text-ellipsis overflow-hidden truncate"
                  >
                    {q}
                  </button>
                ))}
              </div>

            </div>
          ) : (
            <>
              {messages.map((msg, idx) => {
                const isAi = msg.sender === 'ai';
                return (
                  <div
                    key={idx}
                    className={`flex ${isAi ? 'justify-start' : 'justify-end'}`}
                  >
                    <div
                      className={`max-w-[75%] rounded-2xl p-3 text-xs sm:text-sm leading-relaxed border ${
                        isAi
                          ? 'bg-slate-900 border-white/10 text-slate-300'
                          : 'bg-blue-600 border-blue-500 text-white'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 mb-1 text-[10px] text-slate-500">
                        <span>{isAi ? 'SkillForge Coach' : 'You'}</span>
                        <span>•</span>
                        <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="whitespace-pre-line">{msg.message}</p>
                    </div>
                  </div>
                );
              })}

              {/* Typing Animation Loader */}
              {sending && (
                <div className="flex justify-start">
                  <div className="max-w-[75%] rounded-2xl p-3 bg-slate-900 border border-white/10 text-slate-300 flex items-center space-x-1.5">
                    <Loader2 className="h-3.5 w-3.5 text-teal-400 animate-spin" />
                    <span className="text-xs text-slate-500 animate-pulse">Thinking...</span>
                  </div>
                </div>
              )}

              {/* anchor node */}
              <div ref={scrollRef} />
            </>
          )}

        </div>

        {/* Input Bar */}
        <div className="flex gap-2 pt-2 border-t border-white/5">
          <input
            type="text"
            placeholder="Ask anything about interviews, salary negotiations, or coding skills..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(input)}
            className="flex-grow px-4 py-3 rounded-xl border border-white/10 bg-slate-900 text-xs sm:text-sm text-white focus:outline-none focus:border-blue-500 placeholder-slate-500"
            disabled={sending}
          />
          <button
            onClick={() => handleSendMessage(input)}
            disabled={!input.trim() || sending}
            className="rounded-xl bg-blue-600 px-4 text-white hover:bg-blue-700 disabled:opacity-50 transition-all cursor-pointer flex items-center justify-center"
          >
            <Send className="h-4.5 w-4.5" />
          </button>
        </div>

      </GlassCard>

    </div>
  );
}
