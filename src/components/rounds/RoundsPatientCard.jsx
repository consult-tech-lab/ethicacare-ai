import React, { useState } from 'react';
import { User, Calendar, Shield, Bed, ChevronDown, ChevronUp, GripVertical, StickyNote } from 'lucide-react';
import AmbientCapture from './AmbientCapture';
import AmbientNoteCard from './AmbientNoteCard';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

const STATUS_STYLES = {
  'Inpatient':    'bg-primary/10 text-primary border-primary/20',
  'Observation':  'bg-amber-100 text-amber-700 border-amber-200',
  'Direct Admit': 'bg-purple-100 text-purple-700 border-purple-200',
  'Outpatient':   'bg-green-100 text-green-700 border-green-200',
  'Research':     'bg-slate-200 text-slate-600 border-slate-300',
};

const PRIORITY_BORDER = {
  routine:  'border-border',
  urgent:   'border-amber-400',
  critical: 'border-red-500',
};

export default function RoundsPatientCard({ patient, onUpdate }) {
  const [expanded, setExpanded] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [quickNote, setQuickNote] = useState(patient.quick_note || '');
  const [noteSaved, setNoteSaved] = useState(false);

  const notes = patient.ambient_notes || [];
  const pendingCount = notes.filter(n => n.status === 'pending').length;
  const priority = patient.priority || 'routine';
  const isResearch = patient.admission_status === 'Research';

  const handleNoteCaptured = (note) => {
    const updated = [note, ...notes];
    onUpdate(patient.id, { ambient_notes: updated });
    setExpanded(true);
  };

  const handleApprove = (note) => {
    const updated = notes.map(n => n.id === note.id ? { ...n, status: 'approved' } : n);
    onUpdate(patient.id, { ambient_notes: updated });
  };

  const handleEdit = (updatedNote) => {
    const updated = notes.map(n => n.id === updatedNote.id ? updatedNote : n);
    onUpdate(patient.id, { ambient_notes: updated });
  };

  const handlePromote = (note) => {
    const updated = notes.map(n => n.id === note.id ? { ...n, status: 'promoted' } : n);
    const progressNotes = patient.progress_notes || [];
    onUpdate(patient.id, {
      ambient_notes: updated,
      progress_notes: [...progressNotes, { ...note, promoted_at: new Date().toISOString(), type: 'progress_note' }]
    });
  };

  const saveQuickNote = () => {
    onUpdate(patient.id, { quick_note: quickNote });
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 2000);
  };

  return (
    <div className={cn(
      'bg-card rounded-2xl border-2 shadow-sm transition-all hover:shadow-md',
      PRIORITY_BORDER[priority],
      isResearch && 'ring-1 ring-slate-300'
    )}>
      {/* Drag handle + Research badge row */}
      <div className="flex items-center justify-between px-3 pt-2">
        <GripVertical className="w-4 h-4 text-muted-foreground/30" />
        {isResearch && (
          <span className="text-[9px] font-bold bg-slate-200 text-slate-500 border border-slate-300 px-2 py-0.5 rounded-full uppercase tracking-widest">
            Research
          </span>
        )}
      </div>

      {/* Patient Header */}
      <div className="px-4 pb-4 pt-1 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0', isResearch ? 'bg-slate-100' : 'bg-primary/10')}>
              <User className={cn('w-5 h-5', isResearch ? 'text-slate-500' : 'text-primary')} />
            </div>
            <div className="min-w-0">
              <h3 className="font-heading font-bold text-foreground text-sm truncate">{patient.patient_name}</h3>
              <p className="text-xs text-muted-foreground">MRN: {patient.mrn}{patient.room ? ` · Room ${patient.room}` : ''}</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
            <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full border', STATUS_STYLES[patient.admission_status] || STATUS_STYLES['Inpatient'])}>
              {patient.admission_status}
            </span>
            {pendingCount > 0 && (
              <span className="text-[9px] bg-primary text-primary-foreground font-bold px-1.5 py-0.5 rounded-full animate-pulse">
                {pendingCount} pending
              </span>
            )}
          </div>
        </div>

        {/* Meta Row */}
        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
          {patient.primary_dx && (
            <div className="flex items-center gap-1.5 col-span-2">
              <Bed className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">{patient.primary_dx}</span>
            </div>
          )}
          {patient.insurance && (
            <div className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">{patient.insurance}</span>
            </div>
          )}
          {patient.los_days != null && (
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
              <span>LOS: <strong className={cn(patient.los_days >= 8 ? 'text-red-600' : patient.los_days >= 4 ? 'text-amber-600' : 'text-green-700')}>{patient.los_days}d</strong></span>
            </div>
          )}
        </div>

        {/* Quick Notes */}
        <div>
          <button
            onClick={() => setShowNotes(!showNotes)}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <StickyNote className="w-3.5 h-3.5" />
            {patient.quick_note ? 'Edit quick note' : 'Add quick note'}
          </button>
          {showNotes && (
            <div className="mt-2 space-y-1.5">
              <Textarea
                value={quickNote}
                onChange={e => setQuickNote(e.target.value)}
                placeholder="Quick note for this patient during rounds..."
                className="rounded-xl text-xs resize-none h-16"
              />
              <Button size="sm" onClick={saveQuickNote} className="h-6 text-[10px] rounded-lg px-3 bg-primary hover:bg-primary/90">
                {noteSaved ? '✓ Saved' : 'Save Note'}
              </Button>
            </div>
          )}
          {!showNotes && patient.quick_note && (
            <p className="mt-1.5 text-xs text-muted-foreground italic bg-muted/40 rounded-lg px-2 py-1 border border-border/50 line-clamp-2">
              {patient.quick_note}
            </p>
          )}
        </div>

        {/* Ambient Capture */}
        <AmbientCapture patient={patient} onNoteCaptured={handleNoteCaptured} />
      </div>

      {/* Notes Toggle */}
      {notes.length > 0 && (
        <>
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full flex items-center justify-between px-4 py-2.5 border-t border-border/50 text-xs font-medium text-muted-foreground hover:bg-muted/20 transition-colors"
          >
            <span>{notes.length} AI note{notes.length > 1 ? 's' : ''}{pendingCount > 0 ? ` · ${pendingCount} pending` : ''}</span>
            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
          {expanded && (
            <div className="px-4 pb-4 space-y-2.5">
              {notes.map(note => (
                <AmbientNoteCard
                  key={note.id}
                  note={note}
                  onApprove={handleApprove}
                  onEdit={handleEdit}
                  onPromote={handlePromote}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}