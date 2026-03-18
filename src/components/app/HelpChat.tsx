'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { MessageSquare, X, Send } from 'lucide-react';
import { quickReplies, botResponses } from '@/lib/data/help-chat';
import type { HelpChatMessage } from '@/types/command-center';
import { ScrollArea } from '@/components/ui/scroll-area';

export const HelpChat = () => {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<HelpChatMessage[]>([
    {
      from: 'bot',
      text: "Hey there! I'm your LaunchBased helper. Ask me anything about your dashboard, your AI team, or how to get started. No question is too simple!",
    },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Map pathname to page key for quick replies
  const getPageKey = () => {
    const pathMap: Record<string, string> = {
      '/dashboard': 'dashboard',
      '/agents': 'agents',
      '/approvals': 'approvals',
      '/integrations': 'integrations',
      '/website': 'website',
      '/documents': 'docs',
      '/analytics': 'analytics',
      '/daily-brief': 'daily',
      '/onboarding': 'onboarding',
      '/settings': 'settings',
      '/landing': 'landing',
      '/order': 'orderForm',
    };
    return pathMap[pathname] || 'dashboard';
  };

  const currentQuickReplies =
    quickReplies[getPageKey()] || quickReplies.dashboard;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs, typing]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    setMsgs((prev) => [...prev, { from: 'user', text: text.trim() }]);
    setInput('');
    setTyping(true);

    setTimeout(() => {
      const response =
        botResponses[text.trim()] ||
        `Great question! In the full version, I'll connect to your AI team to get you a personalized answer. For now, try tapping one of the suggested questions below, or explore your ${getPageKey()} page — I'm always here if you get stuck!`;
      setMsgs((prev) => [...prev, { from: 'bot', text: response }]);
      setTyping(false);
    }, 800 + 600 * 0.5);
  };

  // Closed state - floating bubble
  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-[74px] right-5 z-[997] flex size-14 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/25 transition-transform hover:scale-105 md:bottom-6"
      >
        <MessageSquare className="size-6 text-white" />
        <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full border-2 border-background bg-success text-[9px] font-bold text-white">
          ?
        </span>
      </button>
    );
  }

  // Open state - chat panel
  return (
    <div className="fixed bottom-16 right-0 z-[997] flex h-[80vh] w-full flex-col overflow-hidden rounded-t-2xl border bg-card shadow-2xl md:bottom-5 md:right-5 md:h-[520px] md:w-[380px] md:rounded-2xl">
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between bg-gradient-to-r from-primary to-accent px-4 py-3.5">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-full bg-white/20">
            <MessageSquare className="size-[18px] text-white" />
          </div>
          <div>
            <div className="text-[15px] font-bold text-white">
              LaunchBased Helper
            </div>
            <div className="text-[11px] text-white/80">
              Ask me anything — no question is too simple!
            </div>
          </div>
        </div>
        <button
          onClick={() => setOpen(false)}
          className="text-white/80 hover:text-white"
        >
          <X className="size-5" />
        </button>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="flex flex-col gap-3">
          {msgs.map((m, i) => (
            <div
              key={i}
              className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed ${
                m.from === 'user'
                  ? 'ml-auto rounded-br-sm bg-primary text-white'
                  : 'mr-auto rounded-bl-sm bg-muted text-foreground'
              }`}
            >
              {m.text}
            </div>
          ))}
          {typing && (
            <div className="mr-auto max-w-[85%] rounded-xl rounded-bl-sm bg-muted px-3.5 py-2.5 text-sm text-muted-foreground">
              Typing...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Quick replies */}
      <div className="flex flex-wrap gap-1.5 px-4 pb-1 pt-2">
        {currentQuickReplies.map((q, i) => (
          <button
            key={i}
            onClick={() => sendMessage(q)}
            className="whitespace-nowrap rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-xs text-primary hover:bg-primary/20"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-2 border-t px-3 py-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
          placeholder="Type your question..."
          className="flex-1 rounded-full border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary"
        />
        <button
          onClick={() => sendMessage(input)}
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-white"
        >
          <Send className="size-4" />
        </button>
      </div>
    </div>
  );
};
