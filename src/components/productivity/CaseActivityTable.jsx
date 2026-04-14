import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';

const outcomeConfig = {
  approved: { label: 'Approved', class: 'bg-green-100 text-green-700 border-green-200' },
  denied: { label: 'Denied', class: 'bg-red-100 text-red-700 border-red-200' },
  pending_info: { label: 'Pending', class: 'bg-amber-100 text-amber-700 border-amber-200' },
};

export default function CaseActivityTable({ records, isLoading }) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16 text-muted-foreground gap-2">
        <Loader2 className="w-4 h-4 animate-spin" /> Loading activity...
      </div>
    );
  }

  if (!records.length) {
    return (
      <div className="bg-card rounded-2xl border border-border p-12 text-center text-muted-foreground text-sm">
        No completed cases found for the selected period and filters.
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Date</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Patient</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Primary Dx</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Service</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">LOS</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Criteria</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">TAT (hrs)</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Outcome</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {records.map((r, i) => {
              const outcome = outcomeConfig[r.outcome] || outcomeConfig.pending_info;
              return (
                <tr key={r.id || i} className="hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                    {r.completed_date ? format(parseISO(r.completed_date), 'MMM d, yyyy') : '—'}
                  </td>
                  <td className="px-4 py-3 font-medium text-foreground">{r.patient_name || '—'}</td>
                  <td className="px-4 py-3 text-muted-foreground max-w-[180px] truncate">{r.primary_dx || '—'}</td>
                  <td className="px-4 py-3 text-muted-foreground">{r.medical_service || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`font-semibold ${r.los_days >= 8 ? 'text-red-600' : r.los_days >= 4 ? 'text-amber-600' : 'text-green-700'}`}>
                      {r.los_days != null ? `${r.los_days}d` : '—'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className="text-xs">{r.criteria_used || '—'}</Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{r.turnaround_hours ?? '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold border ${outcome.class}`}>
                      {outcome.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}