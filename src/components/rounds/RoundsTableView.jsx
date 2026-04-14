import React, { useState } from 'react';
import { Loader2, Sparkles, ChevronDown, ChevronRight, CheckCircle2, FileText, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format, parseISO } from 'date-fns';
import AmbientCapture from './AmbientCapture';
import { cn } from '@/lib/utils';

const STATUS_STYLES = {
  'Inpatient':    'bg-primary/10 text-primary',
  'Observation':  'bg-amber-100 text-amber-700',
  'Direct Admit': 'bg-purple-100 text-purple-700',
  'Outpatient':   'bg-green-100 text-green-700',
};

export default function RoundsTableView({ patients, isLoading, onUpdate }) {
  const [expandedRow, setExpandedRow] = useState(null);

  const handleNoteCaptured = (patient, note) => {
    const updated = [note, ...(patient.ambient_notes || [])];
    onUpdate(patient.id, { ambient_notes: updated });
    setExpandedRow(patient.id);
  };

  const handleApprove = (patient, note) => {
    const updated = (patient.ambient_notes || []).map(n => n.id === note.id ? { ...n, status: 'approved' } : n);
    onUpdate(patient.id, { ambient_notes: updated });
  };

  const handlePromote = (patient, note) => {
    const updatedNotes = (patient.ambient_notes || []).map(n => n.id === note.id ? { ...n, status: 'promoted' } : n);
    const progressNotes = patient.progress_notes || [];
    onUpdate(patient.id, {
      ambient_notes: updatedNotes,
      progress_notes: [...progressNotes, { ...note, promoted_at: new Date().toISOString(), type: 'progress_note' }]
    });
  };

  if (isLoading) {
    return <div className="flex items-center justify-center py-20 text-muted-foreground gap-2"><Loader2 className="w-5 h-5 animate-spin" /> Loading...</div>;
  }

  return (
    <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider w-8"></th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Patient</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Primary Dx</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">LOS</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">AI Notes</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Ambient</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {patients.map(p => {
              const notes = p.ambient_notes || [];
              const pendingCount = notes.filter(n => n.status === 'pending').length;
              const isExpanded = expandedRow === p.id;

              return (
                <React.Fragment key={p.id}>
                  <tr className="hover:bg-muted/10 transition-colors">
                    <td className="px-4 py-3">
                      <button onClick={() => setExpandedRow(isExpanded ? null : p.id)} className="text-muted-foreground hover:text-foreground">
                        {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-foreground text-xs">{p.patient_name}</p>
                      <p className="text-[10px] text-muted-foreground">MRN: {p.mrn}{p.room ? ` · Rm ${p.room}` : ''}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full', STATUS_STYLES[p.admission_status])}>
                        {p.admission_status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground max-w-[180px] truncate">{p.primary_dx || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={cn('font-semibold text-xs', p.los_days >= 8 ? 'text-red-600' : p.los_days >= 4 ? 'text-amber-600' : 'text-green-700')}>
                        {p.los_days != null ? `${p.los_days}d` : '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {notes.length > 0 ? (
                        <div className="flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-primary" />
                          <span className="text-xs">{notes.length}</span>
                          {pendingCount > 0 && (
                            <span className="text-[9px] bg-primary text-primary-foreground font-bold px-1.5 py-0.5 rounded-full">
                              {pendingCount}
                            </span>
                          )}
                        </div>
                      ) : <span className="text-xs text-muted-foreground">—</span>}
                    </td>
                    <td className="px-4 py-3 min-w-[180px]">
                      <AmbientCapture patient={p} onNoteCaptured={(note) => handleNoteCaptured(p, note)} />
                    </td>
                  </tr>

                  {/* Expanded Notes Row */}
                  {isExpanded && notes.length > 0 && (
                    <tr>
                      <td colSpan={7} className="bg-muted/20 px-8 py-4">
                        <div className="space-y-3 max-w-3xl">
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Ambient AI Notes</p>
                          {notes.map(note => (
                            <div key={note.id} className={cn(
                              'rounded-xl border bg-card p-3 space-y-2',
                              note.status === 'promoted' ? 'border-accent/30 opacity-75' : note.status === 'approved' ? 'border-green-300' : 'border-primary/30'
                            )}>
                              <div className="flex items-center justify-between gap-2 flex-wrap">
                                <div className="flex items-center gap-2">
                                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                                  <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Ambient AI Suggested Update</span>
                                  {note.status === 'approved' && <span className="text-[9px] bg-green-100 text-green-700 font-bold px-1.5 rounded">✓ Approved</span>}
                                  {note.status === 'promoted' && <span className="text-[9px] bg-accent/20 text-accent font-bold px-1.5 rounded">↑ Progress Note</span>}
                                </div>
                                <span className="text-[10px] text-muted-foreground">{note.timestamp ? format(parseISO(note.timestamp), 'MMM d, h:mm a') : ''}</span>
                              </div>
                              <p className="text-xs text-foreground">{note.summary}</p>
                              {note.signals?.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                  {note.signals.map((s, i) => (
                                    <span key={i} className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">{s}</span>
                                  ))}
                                </div>
                              )}
                              {!note.status || note.status === 'pending' ? (
                                <p className="text-[10px] text-muted-foreground italic">AI suggests → Human reviews → Human decides → System records</p>
                              ) : null}
                              {note.status !== 'promoted' && (
                                <div className="flex gap-2">
                                  {note.status !== 'approved' && (
                                    <Button size="sm" className="h-6 text-[10px] rounded-lg bg-green-600 hover:bg-green-700 gap-1 px-2" onClick={() => handleApprove(p, note)}>
                                      <CheckCircle2 className="w-3 h-3" /> Approve
                                    </Button>
                                  )}
                                  {note.status === 'approved' && (
                                    <Button size="sm" variant="outline" className="h-6 text-[10px] rounded-lg gap-1 px-2 border-accent text-accent hover:bg-accent/10" onClick={() => handlePromote(p, note)}>
                                      <FileText className="w-3 h-3" /> Promote to Progress Note
                                    </Button>
                                  )}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}