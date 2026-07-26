'use client';

import React, { useState } from 'react';
import { Sparkles, Send } from 'lucide-react';
import { erpApi } from '@/lib/api';
import { PageHeader } from '@/components/ui/DataTable';

export default function AiModule() {
  const [prompt, setPrompt] = useState("Show today's production");
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string; data?: any }[]>([]);
  const [loading, setLoading] = useState(false);

  const ask = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setMessages((m) => [...m, { role: 'user', text: prompt }]);
    try {
      const res: any = await erpApi.aiAsk(prompt);
      setMessages((m) => [...m, { role: 'ai', text: res.answer, data: res.data }]);
    } catch {
      setMessages((m) => [...m, { role: 'ai', text: 'AI service unavailable. Start the backend on port 4000.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-up">
      <PageHeader
        eyebrow="AI Assistant"
        title="Operations Copilot"
        description="Ask about production, invoices, low stock, top buyers, attendance, and shipments."
      />

      <div className="panel p-5 space-y-4 min-h-[420px] flex flex-col">
        <div className="flex-1 space-y-3 overflow-y-auto max-h-[480px]">
          {messages.length === 0 && (
            <div className="text-sm text-stone-500 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-600" />
              Try: “Pending invoices”, “Low stock”, “Top buyers”
            </div>
          )}
          {messages.map((m, i) => (
            <div
              key={i}
              className={`rounded-lg px-4 py-3 text-sm max-w-[85%] ${
                m.role === 'user'
                  ? 'ml-auto bg-brand-600 text-white'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200'
              }`}
            >
              {m.text}
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            className="input-field"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && ask()}
            placeholder="Ask the ERP assistant…"
          />
          <button className="btn-primary" onClick={ask} disabled={loading}>
            <Send className="w-4 h-4" />
            {loading ? '…' : 'Ask'}
          </button>
        </div>
      </div>
    </div>
  );
}
