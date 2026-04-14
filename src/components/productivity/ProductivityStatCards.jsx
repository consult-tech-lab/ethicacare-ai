import React, { useMemo } from 'react';
import { CheckCircle2, XCircle, Clock, Calendar } from 'lucide-react';

export default function ProductivityStatCards({ records }) {
  const stats = useMemo(() => {
    const total = records.length;
    const approved = records.filter(r => r.outcome === 'approved').length;
    const denied = records.filter(r => r.outcome === 'denied').length;
    const avgLos = total > 0
      ? (records.reduce((acc, r) => acc + (r.los_days || 0), 0) / total).toFixed(1)
      : '—';
    const avgTat = total > 0
      ? (records.reduce((acc, r) => acc + (r.turnaround_hours || 0), 0) / total).toFixed(1)
      : '—';
    return { total, approved, denied, avgLos, avgTat };
  }, [records]);

  const cards = [
    { label: 'Cases Completed', value: stats.total, icon: CheckCircle2, color: 'bg-accent/10 text-accent' },
    { label: 'Approved', value: stats.approved, icon: CheckCircle2, color: 'bg-green-100 text-green-700' },
    { label: 'Denied', value: stats.denied, icon: XCircle, color: 'bg-red-100 text-red-700' },
    { label: 'Avg LOS (days)', value: stats.avgLos, icon: Calendar, color: 'bg-primary/10 text-primary' },
    { label: 'Avg Turnaround (hrs)', value: stats.avgTat, icon: Clock, color: 'bg-chart-3/10 text-chart-3' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {cards.map(c => (
        <div key={c.label} className="bg-card rounded-2xl border border-border p-4 shadow-sm">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${c.color}`}>
            <c.icon className="w-4 h-4" />
          </div>
          <p className="text-2xl font-heading font-bold text-foreground">{c.value}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{c.label}</p>
        </div>
      ))}
    </div>
  );
}