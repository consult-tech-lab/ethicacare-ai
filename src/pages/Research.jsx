import React, { useState, useMemo, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  FlaskConical, LayoutGrid, List, Filter, X, Upload, Copy,
  Download, Mail, GripVertical, Sparkles, Brain, FileText, Shield
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const FAKE_RESEARCH_PATIENTS = [
  {
    patient_name: 'Marcus J. Williams',
    mrn: 'RES-00101',
    room: '7B-12',
    admission_status: 'Research',
    primary_dx: 'I25.10 – Atherosclerotic Heart Disease (CABG candidate)',
    insurance: 'Medicare',
    attending_md: 'Dr. Chen, Cardiology',
    los_days: 5,
    priority: 'urgent',
    is_active: true,
    discharge_barriers: 'Post-op monitoring, cardiac rehab placement pending',
    ambient_notes: [],
    progress_notes: [],
  },
  {
    patient_name: 'Denise A. Carter',
    mrn: 'RES-00102',
    room: '3A-05',
    admission_status: 'Research',
    primary_dx: 'Z59.0 – Housing Instability / Homelessness; K57.32 – Diverticulitis with perforation (surgical)',
    insurance: 'Medicaid',
    attending_md: 'Dr. Patel, General Surgery',
    los_days: 9,
    priority: 'critical',
    is_active: true,
    discharge_barriers: 'No stable housing, awaiting social work placement. Post-surgical wound care requires supervised setting. Active infection risk.',
    ambient_notes: [],
    progress_notes: [],
  },
  {
    patient_name: 'Robert H. Nguyen',
    mrn: 'RES-00103',
    room: '5C-08',
    admission_status: 'Research',
    primary_dx: 'N18.4 – Chronic Kidney Disease Stage 4; E11.65 – Type 2 Diabetes with hyperglycemia',
    insurance: 'Horizon BCBS',
    attending_md: 'Dr. Okafor, Nephrology',
    los_days: 3,
    priority: 'routine',
    is_active: true,
    discharge_barriers: 'Dialysis access planning, endocrine management optimization',
    ambient_notes: [],
    progress_notes: [],
  },
  {
    patient_name: 'Sandra L. Torres',
    mrn: 'RES-00104',
    room: '2D-11',
    admission_status: 'Research',
    primary_dx: 'M80.00 – Osteoporosis with pathological fracture; Z74.09 – Reduced mobility, requires SNF placement',
    insurance: 'UnitedHealth',
    attending_md: 'Dr. Kim, Orthopedics',
    los_days: 7,
    priority: 'urgent',
    is_active: true,
    discharge_barriers: 'SNF bed availability, family unable to provide in-home care, fall risk high',
    ambient_notes: [],
    progress_notes: [],
  },
];

export default function Research() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('card');
  const [showFilters, setShowFilters] = useState(false);
  const [search, setSearch] = useState('');
  const [mrnFilter, setMrnFilter] = useState('');
  const [roomFilter, setRoomFilter] = useState('');
  const [payerFilter, setPayerFilter] = useState('All Payers');
  const [orderedIds, setOrderedIds] = useState([]);
  const [activeCase, setActiveCase] = useState(null);
  const [manualText, setManualText] = useState('');
  const [aiSummary, setAiSummary] = useState('');
  const [testOutput, setTestOutput] = useState('');
  const [generating, setGenerating] = useState(false);
  const [exportResults, setExportResults] = useState([]);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const queryClient = useQueryClient();
  const { data: allPatients = [], isLoading } = useQuery({
    queryKey: ['rounds-patients'],
    queryFn: () => base44.entities.RoundsPatient.list('-created_date', 200),
  });

  const researchPatients = useMemo(() =>
    allPatients.filter(p => p.admission_status === 'Research'),
  [allPatients]);

  const ordered = useMemo(() => {
    const map = Object.fromEntries(researchPatients.map(p => [p.id, p]));
    const known = orderedIds.filter(id => map[id]).map(id => map[id]);
    const newOnes = researchPatients.filter(p => !orderedIds.includes(p.id));
    return [...known, ...newOnes];
  }, [researchPatients, orderedIds]);

  useEffect(() => {
    if (researchPatients.length > 0 && orderedIds.length === 0) {
      setOrderedIds(researchPatients.map(p => p.id));
    }
  }, [researchPatients]);

  const uniquePayers = useMemo(() => {
    const p = [...new Set(researchPatients.map(p => p.insurance).filter(Boolean))];
    return ['All Payers', ...p];
  }, [researchPatients]);

  const filtered = ordered.filter(p => {
    if (search && !p.patient_name?.toLowerCase().includes(search.toLowerCase())) return false;
    if (mrnFilter && !p.mrn?.toLowerCase().includes(mrnFilter.toLowerCase())) return false;
    if (roomFilter && !p.room?.toLowerCase().includes(roomFilter.toLowerCase())) return false;
    if (payerFilter !== 'All Payers' && p.insurance !== payerFilter) return false;
    return true;
  });

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const ids = filtered.map(p => p.id);
    const [moved] = ids.splice(result.source.index, 1);
    ids.splice(result.destination.index, 0, moved);
    setOrderedIds(ids);
  };

  const handleGenerateAI = async () => {
    if (!manualText && !activeCase) return;
    setGenerating(true);
    const prompt = `You are a clinical AI summarization engine. Based on the following patient notes, generate a structured AI clinical summary for research purposes. Include: Assessment, Key Clinical Signals, UM Implications, and AI Model Test Observations.\n\nPatient: ${activeCase?.patient_name || 'Unknown'}\nDx: ${activeCase?.primary_dx || ''}\nManual Notes:\n${manualText}`;
    const result = await base44.integrations.Core.InvokeLLM({ prompt });
    setAiSummary(result);
    setTestOutput(result);
    setGenerating(false);
    toast.success('AI summary generated');
  };

  const handleExportEmail = async () => {
    if (!activeCase) return;
    const body = `RESEARCH EXPORT — ${activeCase.patient_name} (${activeCase.mrn})\n\nDiagnosis: ${activeCase.primary_dx}\n\nManual Notes:\n${manualText}\n\nAI Summary:\n${aiSummary}\n\nTest Output:\n${testOutput}`;
    await base44.integrations.Core.SendEmail({
      to: user?.email || 'admin@ethicacare.com',
      subject: `EthicaCare Research Export – ${activeCase.patient_name}`,
      body,
    });
    toast.success('Exported via secure email');
  };

  const handleExportBI = () => {
    const csv = `Patient,MRN,Diagnosis,Manual Notes,AI Summary,Test Output\n"${activeCase?.patient_name}","${activeCase?.mrn}","${activeCase?.primary_dx}","${manualText}","${aiSummary}","${testOutput}"`;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `research_${activeCase?.mrn}_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Exported to CSV for BI tools');
  };

  const copyText = (text) => { navigator.clipboard.writeText(text); toast.success('Copied'); };

  // Admin gate
  if (user && user.role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center">
          <Shield className="w-8 h-8 text-slate-400" />
        </div>
        <h2 className="font-heading font-bold text-xl text-foreground">Access Restricted</h2>
        <p className="text-sm text-muted-foreground max-w-sm">The Research module is only accessible to EthicaCare Auditors and Admins. Contact your administrator for access.</p>
      </div>
    );
  }

  const hasFilters = search || mrnFilter || roomFilter || payerFilter !== 'All Payers';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center">
            <FlaskConical className="w-4 h-4 text-slate-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-heading font-bold">Research</h1>
              <span className="text-[10px] font-bold bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full border border-slate-300">ADMIN ONLY</span>
            </div>
            <p className="text-xs text-muted-foreground">AI Model Testing Pool — Pre-assigned & manually entered research patients</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className={cn('rounded-xl gap-1.5 text-xs', showFilters && 'border-primary text-primary')} onClick={() => setShowFilters(!showFilters)}>
            <Filter className="w-3.5 h-3.5" /> Filters {hasFilters && <span className="w-2 h-2 bg-primary rounded-full" />}
          </Button>
          <div className="flex items-center bg-muted/50 rounded-xl p-1 border border-border">
            <button onClick={() => setView('card')} className={cn('p-1.5 rounded-lg transition-all', view === 'card' ? 'bg-card shadow text-foreground' : 'text-muted-foreground')}><LayoutGrid className="w-4 h-4" /></button>
            <button onClick={() => setView('list')} className={cn('p-1.5 rounded-lg transition-all', view === 'list' ? 'bg-card shadow text-foreground' : 'text-muted-foreground')}><List className="w-4 h-4" /></button>
          </div>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-card border border-border rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Filters</p>
            {hasFilters && <button onClick={() => { setSearch(''); setMrnFilter(''); setRoomFilter(''); setPayerFilter('All Payers'); }} className="text-xs text-primary flex items-center gap-1"><X className="w-3 h-3" /> Clear</button>}
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

      {/* Patient Pool - top half */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Research Patient Pool ({filtered.length})</p>
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
            {[...Array(4)].map((_, i) => <div key={i} className="h-32 rounded-2xl bg-muted/40 animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-slate-200 rounded-2xl">
            <FlaskConical className="w-10 h-10 text-slate-300 mb-3" />
            <p className="text-sm text-muted-foreground">No research patients found.</p>
            <p className="text-xs text-muted-foreground mt-1">Add patients with "Research" status in AI Rounds.</p>
          </div>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="research-pool" direction={view === 'card' ? 'horizontal' : 'vertical'}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={view === 'card' ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3' : 'space-y-2'}
                >
                  {filtered.map((p, idx) => (
                    <Draggable key={p.id} draggableId={p.id} index={idx}>
                      {(prov, snap) => (
                        <div
                          ref={prov.innerRef}
                          {...prov.draggableProps}
                          {...prov.dragHandleProps}
                          onClick={() => { setActiveCase(p); setManualText(''); setAiSummary(''); setTestOutput(''); }}
                          className={cn(
                            'cursor-pointer border-2 rounded-2xl p-3 transition-all',
                            snap.isDragging && 'opacity-80 rotate-1 scale-105 shadow-xl',
                            activeCase?.id === p.id ? 'border-primary bg-primary/5' : 'border-slate-200 bg-card hover:border-slate-300 hover:shadow-sm'
                          )}
                        >
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div>
                              <p className="font-semibold text-sm text-foreground">{p.patient_name}</p>
                              <p className="text-[10px] text-muted-foreground">MRN: {p.mrn}{p.room ? ` · Rm ${p.room}` : ''}</p>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                              <span className="text-[9px] font-bold bg-slate-200 text-slate-500 border border-slate-300 px-1.5 py-0.5 rounded-full">RESEARCH</span>
                              <GripVertical className="w-3.5 h-3.5 text-muted-foreground/30" />
                            </div>
                          </div>
                          <p className="text-[10px] text-muted-foreground truncate">{p.primary_dx}</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">{p.insurance} · LOS: {p.los_days ?? '—'}d</p>
                          {p.discharge_barriers && (
                            <p className="text-[10px] text-amber-600 mt-1 line-clamp-2 italic">{p.discharge_barriers}</p>
                          )}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </div>

      {/* Work Panel - bottom half */}
      {activeCase ? (
        <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-border bg-muted/20">
            <div>
              <p className="font-heading font-bold text-sm text-foreground">{activeCase.patient_name}</p>
              <p className="text-xs text-muted-foreground">{activeCase.primary_dx}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" className="rounded-xl gap-1.5 text-xs h-7" onClick={handleExportEmail}>
                <Mail className="w-3.5 h-3.5" /> Secure Email
              </Button>
              <Button size="sm" variant="outline" className="rounded-xl gap-1.5 text-xs h-7" onClick={handleExportBI}>
                <Download className="w-3.5 h-3.5" /> Export BI CSV
              </Button>
              <button onClick={() => setActiveCase(null)} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
            </div>
          </div>
          <div className="p-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Upload + Manual */}
            <div className="space-y-3">
              <p className="text-xs font-semibold text-foreground uppercase tracking-wider">Manual Notes</p>
              <label className="flex items-center gap-2 px-3 py-2 rounded-xl border-2 border-dashed border-border text-xs text-muted-foreground cursor-pointer hover:border-primary/40 transition-colors">
                <Upload className="w-4 h-4" />
                Upload Clinical PDF
                <input type="file" accept=".pdf,.txt,.docx" className="hidden" onChange={async (e) => {
                  if (e.target.files?.[0]) {
                    const { file_url } = await base44.integrations.Core.UploadFile({ file: e.target.files[0] });
                    setManualText(prev => prev + `\n[Uploaded: ${e.target.files[0].name} — ${file_url}]`);
                    toast.success('File uploaded');
                  }
                }} />
              </label>
              <Textarea
                value={manualText}
                onChange={e => setManualText(e.target.value)}
                placeholder="Paste clinical text or enter manual notes here..."
                className="rounded-xl text-xs resize-none h-36"
              />
            </div>

            {/* AI Summary */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-foreground uppercase tracking-wider">AI Summarization</p>
                <Button size="sm" onClick={handleGenerateAI} disabled={generating} className="h-6 text-[10px] rounded-lg px-3 gap-1 bg-primary hover:bg-primary/90">
                  <Brain className="w-3 h-3" /> {generating ? 'Generating...' : 'Generate'}
                </Button>
              </div>
              <Textarea
                value={aiSummary}
                onChange={e => setAiSummary(e.target.value)}
                placeholder="AI-generated clinical summary will appear here..."
                className="rounded-xl text-xs resize-none h-36"
              />
              <button onClick={() => copyText(aiSummary)} className="flex items-center gap-1 text-[10px] text-primary hover:underline">
                <Copy className="w-3 h-3" /> Copy AI Summary
              </button>
            </div>

            {/* Test Output */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-foreground uppercase tracking-wider">Test Output</p>
                <button onClick={() => copyText(testOutput)} className="flex items-center gap-1 text-[10px] text-primary hover:underline">
                  <Copy className="w-3 h-3" /> Copy
                </button>
              </div>
              <Textarea
                value={testOutput}
                onChange={e => setTestOutput(e.target.value)}
                placeholder="Paste or review AI model test results here. This field can be exported."
                className="rounded-xl text-xs resize-none h-36"
              />
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" className="h-6 text-[10px] rounded-lg px-3 gap-1" onClick={handleExportEmail}>
                  <Mail className="w-3 h-3" /> Export to Email
                </Button>
                <Button size="sm" variant="outline" className="h-6 text-[10px] rounded-lg px-3 gap-1" onClick={handleExportBI}>
                  <Download className="w-3 h-3" /> Export to BI
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-muted/30 border-2 border-dashed border-border rounded-2xl p-8 text-center">
          <FlaskConical className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Select a patient from the pool above to begin research analysis</p>
        </div>
      )}
    </div>
  );
}