import React, { useState } from 'react';
import { Sparkles, CheckCircle2, FileText, ChevronDown, ChevronUp, Clock, Edit2, AlertTriangle, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { format, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';

const PRIORITY_CONFIG = {
  routine: { color: 'text-green-700 bg-green-50 border-green-200', icon: null },
  urgent: { color: 'text-amber-700 bg-amber-50 border-amber-200', icon: AlertTriangle },
  critical: { color: 'text-red-700 bg-red-50 border-red-200', icon: Zap },
};

const SIGNAL_COLORS = [
  'bg-primary/10 text-primary',
  'bg-accent/10 text-accent',
  'bg-chart-3/10 text-chart-3',
  'bg-purple-100 text-purple-700',
];

export default function AmbientNoteCard({ note, onApprove, onEdit, onPromote }) {
  const [expanded, setExpanded] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editedSummary, setEditedSummary] = useState(note.summary);

  const priority = PRIORITY_CONFIG[note.priority] || PRIORITY_CONFIG.routine;
  const PriorityIcon = priority.icon;

  const handleSaveEdit = () => {
    onEdit({ ...note, summary: editedSummary });
    setEditing(false);
  };

  const isApproved = note.status === 'approved';
  const isPromoted = note.status === 'promoted';

  return (
    <div className={cn(
      'rounded-xl border bg-card shadow-sm overflow-hidden transition-all',
      isPromoted ? 'border-accent/30 opacity-75' : isApproved ? 'border-green-300' : 'border-primary/40'
    )}>
      {/* Header */}
      <div
        className="flex items-center gap-2 px-3 py-2.5 cursor-pointer hover:bg-muted/20"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Ambient AI Suggested Update</span>
            {isApproved && <span className="text-[9px] bg-green-100 text-green-700 font-bold px-1.5 rounded">✓ Approved</span>}
            {isPromoted && <span className="text-[9px] bg-accent/20 text-accent font-bold px-1.5 rounded">↑ Progress Note</span>}
            {PriorityIcon && (
              <span className={cn('text-[9px] font-bold px-1.5 rounded border flex items-center gap-0.5', priority.color)}>
                <PriorityIcon className="w-2.5 h-2.5" />{note.priority?.toUpperCase()}
              </span>
            )}
          </div>
          <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
            <Clock className="w-2.5 h-2.5" />
            {note.timestamp ? format(parseISO(note.timestamp), 'MMM d, h:mm a') : '—'}
          </p>
        </div>
        {expanded ? <ChevronUp className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" /> : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />}
      </div>

      {expanded && (
        <div className="px-3 pb-3 border-t border-border/50 pt-2 space-y-2.5">
          {/* Summary */}
          {editing ? (
            <div className="space-y-2">
              <Textarea
                value={editedSummary}
                onChange={e => setEditedSummary(e.target.value)}
                className="text-xs min-h-[80px] rounded-lg resize-none"
              />
              <div className="flex gap-2">
                <Button size="sm" className="h-7 text-xs rounded-lg" onClick={handleSaveEdit}>Save</Button>
                <Button size="sm" variant="ghost" className="h-7 text-xs rounded-lg" onClick={() => setEditing(false)}>Cancel</Button>
              </div>
            </div>
          ) : (
            <p className="text-xs text-foreground leading-relaxed">{note.summary}</p>
          )}

          {/* Signals */}
          {note.signals?.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {note.signals.map((s, i) => (
                <span key={i} className={cn('text-[10px] font-medium px-2 py-0.5 rounded-full', SIGNAL_COLORS[i % SIGNAL_COLORS.length])}>
                  {s}
                </span>
              ))}
            </div>
          )}

          {/* Recommended Action */}
          {note.recommended_action && (
            <div className="bg-muted/50 rounded-lg px-2.5 py-2">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">Recommended Action</p>
              <p className="text-xs text-foreground">{note.recommended_action}</p>
            </div>
          )}

          {/* Human-in-the-loop notice */}
          {!isApproved && !isPromoted && (
            <p className="text-[10px] text-muted-foreground italic">
              AI suggests → Human reviews → Human decides → System records
            </p>
          )}

          {/* Actions */}
          {!isPromoted && (
            <div className="flex gap-1.5 flex-wrap pt-0.5">
              {!isApproved ? (
                <Button size="sm" className="h-7 text-xs rounded-lg bg-green-600 hover:bg-green-700 gap-1" onClick={() => onApprove(note)}>
                  <CheckCircle2 className="w-3 h-3" /> Approve
                </Button>
              ) : null}
              <Button size="sm" variant="outline" className="h-7 text-xs rounded-lg gap-1" onClick={() => setEditing(true)}>
                <Edit2 className="w-3 h-3" /> Edit
              </Button>
              {isApproved && (
                <Button size="sm" variant="outline" className="h-7 text-xs rounded-lg gap-1 border-accent text-accent hover:bg-accent/10" onClick={() => onPromote(note)}>
                  <FileText className="w-3 h-3" /> Promote to Progress Note
                </Button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}