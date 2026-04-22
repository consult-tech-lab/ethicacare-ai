import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { RotateCcw, Filter, X, Copy, ChevronDown, ChevronUp, Sparkles, StickyNote, CheckCircle, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const STATUS_STYLES = {
  'Inpatient':    'bg-primary/10 text-primary',
  'Observation':  'bg-amber-100 text-amber-700',
  'Direct Admit': 'bg-purple-100 text-purple-700',
  'Outpatient':   'bg-green-100 text-green-700',
  'Research':     'bg-slate-200 text-slate-600',
};

export default function RoundsRecall() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [mrnFilter, setMrnFilter] = useState('');
  const [roomFilter, setRoomFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [payerFilter, setPayerFilter] = useState('All Payers');
  const [showFilters, setShowFilters] = useState(false);
  const [expanded, setExpanded] = useState({});

  const { data: patients = [], isLoading } = useQuery({
    queryKey: ['rounds-patients'],
    queryFn: () => base44.entities.RoundsPatient.list('-created_date', 100),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.RoundsPatient.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['rounds-patients'] }),
  });

  const uniquePayers = useMemo(() => {
    const p = [...new Set(patients.map(p => p.insurance).filter(Boolean))];
    return ['All Payers', ...p];
  }, [patients]);

  const filtered = useMemo(() => patients.filter(p => {
    if (statusFilter !== 'All' && p.admission_status !== statusFilter) return false;
    if (search && !p.patient_name?.toLowerCase().includes(search.toLowerCase())) return false;
    if (mrnFilter && !p.mrn?.toLowerCase().includes(mrnFilter.toLowerCase())) return false;
    if (roomFilter && !p.room?.toLowerCase().includes(roomFilter.toLowerCase())) return false;
    if (payerFilter !== 'All Payers' && p.insurance !== payerFilter) return false;
    // Only show patients that have notes or quick notes
    return (p.ambient_notes?.length > 0) || p.quick_note;
  }), [patients, search, mrnFilter, roomFilter, statusFilter, payerFilter]);

  const toggle = (id) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

  const copyText = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const handleNoteEdit = (patient, newNote) => {
    updateMutation.mutate({ id: patient.id, data: { quick_note: newNote } });
  };

  const hasFilters = search || mrnFilter || roomFilter || statusFilter !== 'All' || payerFilter !== 'All Payers';

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
            <RotateCcw className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-heading font-bold">AI Rounds Recall</h1>
            <p className="text-xs text-muted-foreground">Review, edit, and copy all notes and ambient AI captures from rounds</p>
          </div>
        </div>
        <Button
          variant="outline" size="sm"
          className={cn('rounded-xl gap-1.5 text-xs', showFilters && 'border-primary text-primary')}
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="w-3.5 h-3.5" /> Filters
          {hasFilters && <span className="w-2 h-2 bg-primary rounded-full" />}
        </Button>
      </div>

      {/* Status Pills */}
      <div className="flex flex-wrap gap-2">
        {['All', 'Inpatient', 'Observation', 'Direct Admit', 'Outpatient', 'Research'].map(s => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={cn('px-3 py-1 rounded-full text-xs font-semibold border transition-all',
              statusFilter === s ? 'bg-primary text-primary-foreground border-primary shadow-sm' : 'bg-card border-border text-muted-foreground hover:text-foreground'
            )}
          >{s}</button>
        ))}
      </div>

      {/* Expanded Filters */}
      {showFilters && (
        <div className="bg-card border border-border rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Filters</p>
            {hasFilters && <button onClick={() => { setSearch(''); setMrnFilter(''); setRoomFilter(''); setStatusFilter('All'); setPayerFilter('All Payers'); }} className="text-xs text-primary flex items-center gap-1"><X className="w-3 h-3" /> Clear</button>}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div><p className="text-[10px] uppercase text-muted-foreground mb-1">Last Name</p><Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Name..." className="rounded-xl h-8 text-xs" /></div>
            <div><p className="text-[10px] uppercase text-muted-foreground mb-1">MRN</p><Input value={mrnFilter} onChange={e => setMrnFilter(e.target.value)} placeholder="MRN..." className="rounded-xl h-8 text-xs" /></div>
            <div><p className="text-[10px] uppercase text-muted-foreground mb-1">Room</p><Input value={roomFilter} onChange={e => setRoomFilter(e.target.value)} placeholder="Room..." className="rounded-xl h-8 text-xs" /></div>
            <div><p className="text-[10px] uppercase text-muted-foreground mb-1">Payer</p>
              <Select value={payerFilter} onValueChange={setPayerFilter}>
                <SelectTrigger className="rounded-xl h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>{uniquePayers.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}

      <p className="text-xs text-muted-foreground">{filtered.length} patient{filtered.length !== 1 ? 's' : ''} with notes</p>

      {isLoading ? (
        <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-20 rounded-2xl bg-muted/40 animate-pulse" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-border rounded-2xl">
          <RotateCcw className="w-10 h-10 text-muted-foreground/20 mb-3" />
          <p className="text-sm font-medium text-muted-foreground">No recalled notes found</p>
          <p className="text-xs text-muted-foreground mt-1">Complete AI rounds with notes first, then return here to review.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(patient => {
            const isOpen = expanded[patient.id];
            const ambientNotes = patient.ambient_notes || [];
            return (
              <div key={patient.id} className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                {/* Patient row */}
                <button
                  onClick={() => toggle(patient.id)}
                  className="w-full flex items-center justify-between p-4 hover:bg-muted/20 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-primary">{(patient.patient_name || '?')[0]}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-foreground">{patient.patient_name}</p>
                      <p className="text-xs text-muted-foreground">MRN: {patient.mrn}{patient.room ? ` · Room ${patient.room}` : ''} · {patient.insurance || 'No payer'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full', STATUS_STYLES[patient.admission_status])}>
                      {patient.admission_status}
                    </span>
                    <span className="text-xs text-muted-foreground">{ambientNotes.length} AI · {patient.quick_note ? '1 note' : '0 notes'}</span>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="border-t border-border p-4 space-y-4">
                    {/* Quick Note */}
                    <EditableRecallNote
                      label="Quick Note"
                      icon={StickyNote}
                      value={patient.quick_note || ''}
                      onSave={(v) => handleNoteEdit(patient, v)}
                      onCopy={copyText}
                    />

                    {/* Ambient AI Notes */}
                    {ambientNotes.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Sparkles className="w-3.5 h-3.5 text-primary" />
                          <p className="text-xs font-semibold text-foreground">Ambient AI Captures ({ambientNotes.length})</p>
                        </div>
                        <div className="space-y-2">
                          {ambientNotes.map((note, idx) => (
                            <div key={idx} className="bg-muted/30 rounded-xl p-3 border border-border/50 space-y-2">
                              <div className="flex items-center justify-between gap-2 flex-wrap">
                                <div className="flex items-center gap-1.5">
                                  <Sparkles className="w-3 h-3 text-primary" />
                                  <span className="text-[10px] font-bold text-primary uppercase tracking-wider">AI Capture</span>
                                  {note.status === 'approved' && <span className="text-[9px] bg-green-100 text-green-700 font-bold px-1.5 rounded">✓ Approved</span>}
                                  {note.status === 'promoted' && <span className="text-[9px] bg-accent/20 text-accent font-bold px-1.5 rounded">↑ Progress Note</span>}
                                </div>
                                <button onClick={() => copyText(note.summary || '')} className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-primary transition-colors">
                                  <Copy className="w-3 h-3" /> Copy
                                </button>
                              </div>
                              <p className="text-xs text-foreground leading-relaxed">{note.summary}</p>
                              {note.signals?.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                  {note.signals.map((s, i) => (
                                    <span key={i} className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full">{s}</span>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Copy-to-clipboard tip */}
                    <p className="text-[10px] text-muted-foreground italic border-t border-border/50 pt-2">
                      💡 Copy any text above and paste it into <strong>New Case</strong> or <strong>Case Library</strong> clinical notes field.
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function EditableRecallNote({ label, icon: Icon, value, onSave, onCopy }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  const handleSave = () => {
    onSave(draft);
    setEditing(false);
    toast.success('Note updated');
  };

  if (!value && !editing) return (
    <div className="flex items-center gap-2">
      <Icon className="w-3.5 h-3.5 text-muted-foreground" />
      <span className="text-xs text-muted-foreground italic">No {label.toLowerCase()} yet</span>
      <button onClick={() => setEditing(true)} className="text-xs text-primary hover:underline">Add</button>
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5">
          <Icon className="w-3.5 h-3.5 text-muted-foreground" />
          <p className="text-xs font-semibold text-foreground">{label}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => onCopy(value)} className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-primary transition-colors">
            <Copy className="w-3 h-3" /> Copy
          </button>
          <button onClick={() => { setDraft(value); setEditing(!editing); }} className="text-[10px] text-primary hover:underline">
            {editing ? 'Cancel' : 'Edit'}
          </button>
        </div>
      </div>
      {editing ? (
        <div className="space-y-1.5">
          <Textarea value={draft} onChange={e => setDraft(e.target.value)} className="rounded-xl text-xs resize-none h-20" />
          <Button size="sm" onClick={handleSave} className="h-6 text-[10px] rounded-lg px-3">Save</Button>
        </div>
      ) : (
        <p className="text-xs text-foreground bg-muted/30 rounded-xl px-3 py-2 border border-border/50 leading-relaxed whitespace-pre-wrap">{value}</p>
      )}
    </div>
  );
}