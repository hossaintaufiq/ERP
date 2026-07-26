'use client';

import React, { useState } from 'react';
import { Sparkles, Send } from 'lucide-react';
import { erpApi } from '@/lib/api';
import { PageHeader } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

export default function AiModule() {
  const [prompt, setPrompt] = useState("Show today's production");
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string; data?: any }[]>([]);
  const [loading, setLoading] = useState(false);

  const ask = async () => {
    if (!prompt.trim() || loading) return;
    const q = prompt.trim();
    setLoading(true);
    setMessages((m) => [...m, { role: 'user', text: q }]);
    setPrompt('');
    try {
      const res: any = await erpApi.aiAsk(q);
      setMessages((m) => [...m, { role: 'ai', text: res.answer || 'No response', data: res.data }]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: 'ai', text: 'AI service unavailable. Start the backend on port 4000.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-up">
      <PageHeader
        eyebrow="AI Assistant"
        title="Operations Copilot"
        description="Ask about production, invoices, low stock, top buyers, attendance, and shipments."
      />

      <Card className="shadow-none min-h-[420px] flex flex-col">
        <CardContent className="p-4 sm:p-5 flex-1 flex flex-col gap-4">
          <div className="flex-1 space-y-3 overflow-y-auto max-h-[480px]">
            {messages.length === 0 && (
              <div className="text-sm text-muted-foreground flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                Try: “Pending invoices”, “Low stock”, “Top buyers”
              </div>
            )}
            {messages.map((m, i) => (
              <div
                key={i}
                className={`rounded-lg px-4 py-3 text-sm max-w-[90%] sm:max-w-[85%] ${
                  m.role === 'user'
                    ? 'ml-auto bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground'
                }`}
              >
                {m.text}
              </div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && ask()}
              placeholder="Ask the ERP assistant…"
              className="flex-1"
            />
            <Button onClick={ask} disabled={loading} className="sm:w-auto w-full">
              <Send className="w-4 h-4" />
              {loading ? '…' : 'Ask'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
