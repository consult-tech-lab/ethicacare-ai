import React from 'react';
import { Button } from '@/components/ui/button';
import { LayoutGrid, List, Plus, Radio } from 'lucide-react';
import { cn } from '@/lib/utils';

const STATUS_COLORS = {
  'All': 'bg-muted text-muted-foreground',
  'Inpatient': 'bg-primary/10 text-primary',
  'Observation': 'bg-amber-100 text-amber-700',
  'Direct Admit': 'bg-purple-100 text-purple-700',
  'Outpatient': 'bg-green-100 text-green-700',
};

export default function RoundsHeader({ view, setView, statusFilter, setStatusFilter, statusOptions, onAddPatient, patientCount }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <Radio className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-heading font-bold text-foreground">Ambient AI Rounds</h1>
              <p className="text-xs text-muted-foreground">Live utilization intelligence during patient rounds</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="flex items-center bg-muted/50 rounded-xl p-1 border border-border">
            <button
              onClick={() => setView('card')}
              className={cn('p-1.5 rounded-lg transition-all', view === 'card' ? 'bg-card shadow text-foreground' : 'text-muted-foreground hover:text-foreground')}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setView('table')}
              className={cn('p-1.5 rounded-lg transition-all', view === 'table' ? 'bg-card shadow text-foreground' : 'text-muted-foreground hover:text-foreground')}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
          <Button onClick={onAddPatient} className="rounded-xl gap-2 bg-primary hover:bg-primary/90 text-sm">
            <Plus className="w-4 h-4" /> Add Patient
          </Button>
        </div>
      </div>

      {/* Status Filter Pills */}
      <div className="flex flex-wrap gap-2">
        {statusOptions.map(s => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={cn(
              'px-3 py-1 rounded-full text-xs font-semibold border transition-all',
              statusFilter === s
                ? STATUS_COLORS[s] + ' border-current shadow-sm'
                : 'bg-card border-border text-muted-foreground hover:text-foreground'
            )}
          >
            {s}
          </button>
        ))}
        <span className="ml-auto text-xs text-muted-foreground self-center">{patientCount} patients</span>
      </div>
    </div>
  );
}