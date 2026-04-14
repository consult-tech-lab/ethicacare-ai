import React, { useState } from 'react';
import { MessageSquare, Bug, Zap, HelpCircle, Send, Loader2, CheckCircle2, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { base44 } from '@/api/base44Client';
import { cn } from '@/lib/utils';

const CATEGORIES = [
  { value: 'bug', label: 'Bug / Error', icon: Bug, color: 'text-red-600 bg-red-50' },
  { value: 'technical', label: 'Technical Issue', icon: Zap, color: 'text-amber-600 bg-amber-50' },
  { value: 'feature', label: 'Feature Request', icon: Star, color: 'text-primary bg-primary/10' },
  { value: 'question', label: 'Question / Help', icon: HelpCircle, color: 'text-accent bg-accent/10' },
  { value: 'other', label: 'Other', icon: MessageSquare, color: 'text-muted-foreground bg-muted' },
];

const SEVERITY = ['Low', 'Medium', 'High', 'Critical'];

export default function FeedbackTool({ currentUser }) {
  const [form, setForm] = useState({
    category: '',
    severity: 'Medium',
    title: '',
    description: '',
    steps: '',
    page: '',
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    if (!form.category || !form.title || !form.description) return;
    setSending(true);

    const body = `
[FEEDBACK / BUG REPORT — EthicaCare AI Platform]
Submitted by: ${currentUser?.full_name || 'User'} (${currentUser?.email || ''})
Role: ${currentUser?.role || 'N/A'}
Date: ${new Date().toLocaleString()}

Category: ${form.category.toUpperCase()}
Severity: ${form.severity}
Page / Feature: ${form.page || 'N/A'}
Title: ${form.title}

Description:
${form.description}

${form.steps ? `Steps to Reproduce:\n${form.steps}` : ''}
---
Sent via EthicaCare AI internal feedback system.
    `.trim();

    await base44.integrations.Core.SendEmail({
      to: 'support@his-platform.com',
      subject: `[${form.category.toUpperCase()} | ${form.severity}] ${form.title}`,
      body,
    });

    setSending(false);
    setSent(true);
    setForm({ category: '', severity: 'Medium', title: '', description: '', steps: '', page: '' });
    setTimeout(() => setSent(false), 5000);
  };

  const selectedCat = CATEGORIES.find(c => c.value === form.category);

  return (
    <div className="space-y-4">
      {sent && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm text-green-700 font-medium">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          Feedback submitted. Our team will review it shortly — thank you!
        </div>
      )}

      {/* Category Pills */}
      <div className="space-y-1.5">
        <Label className="text-xs uppercase tracking-wider text-muted-foreground">Category *</Label>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(cat => {
            const Icon = cat.icon;
            const selected = form.category === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => update('category', cat.value)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all',
                  selected
                    ? cat.color + ' border-current shadow-sm'
                    : 'bg-card border-border text-muted-foreground hover:text-foreground'
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Severity</Label>
          <Select value={form.severity} onValueChange={v => update('severity', v)}>
            <SelectTrigger className="rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SEVERITY.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Page / Feature Affected</Label>
          <Input value={form.page} onChange={e => update('page', e.target.value)} placeholder="e.g. Case Review, Rounds, Analytics" className="rounded-xl" />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs uppercase tracking-wider text-muted-foreground">Title *</Label>
        <Input value={form.title} onChange={e => update('title', e.target.value)} placeholder="Brief summary of the issue or request" className="rounded-xl" />
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs uppercase tracking-wider text-muted-foreground">Description *</Label>
        <Textarea
          value={form.description}
          onChange={e => update('description', e.target.value)}
          placeholder="Describe the issue, what you expected, and what actually happened..."
          className="min-h-[100px] resize-none rounded-xl"
        />
      </div>

      {(form.category === 'bug' || form.category === 'technical') && (
        <div className="space-y-1.5">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Steps to Reproduce (optional)</Label>
          <Textarea
            value={form.steps}
            onChange={e => update('steps', e.target.value)}
            placeholder="1. Go to...&#10;2. Click on...&#10;3. Error appears..."
            className="min-h-[80px] resize-none rounded-xl text-sm"
          />
        </div>
      )}

      <div className="flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={!form.category || !form.title || !form.description || sending}
          className="rounded-xl gap-2 bg-primary hover:bg-primary/90"
        >
          {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          {sending ? 'Submitting...' : 'Submit Feedback'}
        </Button>
      </div>
    </div>
  );
}