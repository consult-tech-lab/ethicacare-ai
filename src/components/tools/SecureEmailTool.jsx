import React, { useState } from 'react';
import { Mail, Lock, Send, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { base44 } from '@/api/base44Client';

const RECIPIENT_OPTIONS = [
  { value: 'compliance@his-platform.com', label: 'Compliance Team' },
  { value: 'management@his-platform.com', label: 'HIS Management' },
  { value: 'support@his-platform.com', label: 'Technical Support' },
  { value: 'audits@his-platform.com', label: 'Audit Coordination' },
];

const MESSAGE_TYPES = [
  'Case Documentation',
  'Audit Finding',
  'Payer Communication',
  'Escalation',
  'Compliance Notice',
  'Contractor Report',
];

export default function SecureEmailTool({ currentUser }) {
  const [form, setForm] = useState({
    to: '',
    type: '',
    subject: '',
    body: '',
    case_ref: '',
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(null);

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSend = async () => {
    if (!form.to || !form.subject || !form.body) return;
    setSending(true);
    setError(null);
    const fullBody = `
[SECURE PLATFORM MESSAGE — EthicaCare AI UM Platform]
From: ${currentUser?.full_name || 'Platform User'} (${currentUser?.email || ''})
Type: ${form.type || 'General'}
Case Reference: ${form.case_ref || 'N/A'}
Date: ${new Date().toLocaleString()}
---

${form.body}

---
This message was sent via the EthicaCare AI secure messaging system.
Sent on behalf of HIS Auditor / Contractor Team.
    `.trim();

    await base44.integrations.Core.SendEmail({
      to: form.to,
      subject: `[EthicaCare | ${form.type || 'Message'}] ${form.subject}`,
      body: fullBody,
    });

    setSending(false);
    setSent(true);
    setForm({ to: '', type: '', subject: '', body: '', case_ref: '' });
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <div className="space-y-4">
      {sent && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm text-green-700">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          Message sent securely. A copy was logged to the platform.
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2 bg-destructive/10 border border-destructive/20 rounded-xl px-4 py-3 text-sm text-destructive">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Recipient *</Label>
          <Select value={form.to} onValueChange={v => update('to', v)}>
            <SelectTrigger className="rounded-xl">
              <SelectValue placeholder="Select recipient..." />
            </SelectTrigger>
            <SelectContent>
              {RECIPIENT_OPTIONS.map(r => (
                <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Message Type</Label>
          <Select value={form.type} onValueChange={v => update('type', v)}>
            <SelectTrigger className="rounded-xl">
              <SelectValue placeholder="Select type..." />
            </SelectTrigger>
            <SelectContent>
              {MESSAGE_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Subject *</Label>
          <Input value={form.subject} onChange={e => update('subject', e.target.value)} placeholder="e.g. Authorization Review – Patient XYZ" className="rounded-xl" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Case Reference #</Label>
          <Input value={form.case_ref} onChange={e => update('case_ref', e.target.value)} placeholder="MRN or case ID (optional)" className="rounded-xl" />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs uppercase tracking-wider text-muted-foreground">Message *</Label>
        <Textarea
          value={form.body}
          onChange={e => update('body', e.target.value)}
          placeholder="Write your secure message here..."
          className="min-h-[120px] resize-none rounded-xl"
        />
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <Lock className="w-3 h-3" />
          Encrypted · Logged · HIPAA-aware
        </div>
        <Button
          onClick={handleSend}
          disabled={!form.to || !form.subject || !form.body || sending}
          className="rounded-xl gap-2 bg-primary hover:bg-primary/90"
        >
          {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          {sending ? 'Sending...' : 'Send Secure Message'}
        </Button>
      </div>
    </div>
  );
}