import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Search, Plus, SlidersHorizontal, Database, X, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import CriteriaCard from '@/components/criteria/CriteriaCard';
import CriteriaDetail from '@/components/criteria/CriteriaDetail';

const SOURCES = ['All Sources', 'Milliman', 'InterQual', 'CMS', 'MCG', 'Hayes', 'AHA', 'ACS', 'ACC', 'Other'];
const CATEGORIES = [
  'All Categories', 'Inpatient Admission', 'Surgical Procedure', 'Diagnostic Imaging',
  'Behavioral Health', 'Skilled Nursing', 'Home Health', 'Outpatient Service',
  'DME', 'Pharmacy', 'Rehabilitation',
];

function AddCriteriaModal({ open, onClose }) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    title: '', source: 'Other', category: 'Inpatient Admission',
    summary: '', admission_criteria: '', continued_stay_criteria: '', discharge_criteria: '',
    typical_los_days: '', evidence_level: 'Level II', notes: '',
    icd10_codes: '', cpt_codes: '', keywords: '',
  });

  const mutation = useMutation({
    mutationFn: (data) => base44.entities.ClinicalCriteria.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['criteria'] });
      toast.success('Criteria set added');
      onClose();
    },
  });

  const handleSubmit = () => {
    mutation.mutate({
      ...form,
      typical_los_days: form.typical_los_days ? Number(form.typical_los_days) : undefined,
      icd10_codes: form.icd10_codes.split(',').map(s => s.trim()).filter(Boolean),
      cpt_codes: form.cpt_codes.split(',').map(s => s.trim()).filter(Boolean),
      keywords: form.keywords.split(',').map(s => s.trim()).filter(Boolean),
      is_active: true,
    });
  };

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading">Add Clinical Criteria Set</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Title *</Label>
              <Input value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. Acute CHF – Inpatient Admission" className="rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Source</Label>
              <Select value={form.source} onValueChange={v => set('source', v)}>
                <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {SOURCES.filter(s => s !== 'All Sources').map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Category</Label>
              <Select value={form.category} onValueChange={v => set('category', v)}>
                <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.filter(c => c !== 'All Categories').map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Evidence Level</Label>
              <Select value={form.evidence_level} onValueChange={v => set('evidence_level', v)}>
                <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {['Level I', 'Level II', 'Level III', 'Expert Consensus', 'CMS Mandate'].map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Typical LOS (days)</Label>
              <Input type="number" value={form.typical_los_days} onChange={e => set('typical_los_days', e.target.value)} placeholder="e.g. 3" className="rounded-xl" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Summary</Label>
            <Textarea value={form.summary} onChange={e => set('summary', e.target.value)} rows={2} className="rounded-xl resize-none" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Admission Criteria</Label>
            <Textarea value={form.admission_criteria} onChange={e => set('admission_criteria', e.target.value)} rows={4} placeholder="1. Criteria one&#10;2. Criteria two" className="rounded-xl resize-none text-sm" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Continued Stay Criteria</Label>
            <Textarea value={form.continued_stay_criteria} onChange={e => set('continued_stay_criteria', e.target.value)} rows={3} className="rounded-xl resize-none text-sm" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Discharge Criteria</Label>
            <Textarea value={form.discharge_criteria} onChange={e => set('discharge_criteria', e.target.value)} rows={3} className="rounded-xl resize-none text-sm" />
          </div>
          <div className="grid grid-cols-1 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">ICD-10 Codes (comma-separated)</Label>
              <Input value={form.icd10_codes} onChange={e => set('icd10_codes', e.target.value)} placeholder="I50.9, I50.20, I50.21" className="rounded-xl font-mono text-sm" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">CPT Codes (comma-separated)</Label>
              <Input value={form.cpt_codes} onChange={e => set('cpt_codes', e.target.value)} placeholder="27447, 27446" className="rounded-xl font-mono text-sm" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Keywords (comma-separated)</Label>
              <Input value={form.keywords} onChange={e => set('keywords', e.target.value)} placeholder="heart failure, CHF, BNP, edema" className="rounded-xl text-sm" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Clinical Notes</Label>
            <Textarea value={form.notes} onChange={e => set('notes', e.target.value)} rows={2} className="rounded-xl resize-none text-sm" />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={onClose} className="rounded-xl">Cancel</Button>
            <Button
              onClick={handleSubmit}
              disabled={!form.title || mutation.isPending}
              className="rounded-xl bg-primary hover:bg-primary/90 gap-2"
            >
              {mutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              Add Criteria Set
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function CriteriaDatabase() {
  const [search, setSearch] = useState('');
  const [sourceFilter, setSourceFilter] = useState('All Sources');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [selected, setSelected] = useState(null);
  const [showAdd, setShowAdd] = useState(false);

  const { data: allCriteria = [], isLoading } = useQuery({
    queryKey: ['criteria'],
    queryFn: () => base44.entities.ClinicalCriteria.list('-created_date', 200),
  });

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return allCriteria.filter(c => {
      const matchSource = sourceFilter === 'All Sources' || c.source === sourceFilter;
      const matchCat = categoryFilter === 'All Categories' || c.category === categoryFilter;
      if (!matchSource || !matchCat) return false;
      if (!q) return true;
      return (
        c.title?.toLowerCase().includes(q) ||
        c.summary?.toLowerCase().includes(q) ||
        c.icd10_codes?.some(code => code.toLowerCase().includes(q)) ||
        c.cpt_codes?.some(code => code.toLowerCase().includes(q)) ||
        c.keywords?.some(kw => kw.toLowerCase().includes(q)) ||
        c.admission_criteria?.toLowerCase().includes(q)
      );
    });
  }, [allCriteria, search, sourceFilter, categoryFilter]);

  const sourceCounts = useMemo(() => {
    return SOURCES.slice(1).reduce((acc, s) => {
      acc[s] = allCriteria.filter(c => c.source === s).length;
      return acc;
    }, {});
  }, [allCriteria]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold">Clinical Criteria Database</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {allCriteria.length} criteria sets · Milliman, InterQual, CMS, MCG &amp; more
          </p>
        </div>
        <Button onClick={() => setShowAdd(true)} className="gap-2 rounded-xl bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4" /> Add Criteria Set
        </Button>
      </div>

      {/* Source pills */}
      <div className="flex items-center gap-2 flex-wrap">
        {SOURCES.map(s => (
          <button
            key={s}
            onClick={() => setSourceFilter(s)}
            className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all border ${
              sourceFilter === s
                ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                : 'bg-card text-muted-foreground border-border hover:border-primary/30 hover:text-foreground'
            }`}
          >
            {s}{s !== 'All Sources' && sourceCounts[s] ? ` (${sourceCounts[s]})` : ''}
          </button>
        ))}
      </div>

      {/* Search + Category filter */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[220px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by title, ICD-10, CPT, keyword..."
            className="pl-10 rounded-xl"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
            </button>
          )}
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[200px] rounded-xl">
            <SlidersHorizontal className="w-3 h-3 mr-2 text-muted-foreground" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
        {(search || sourceFilter !== 'All Sources' || categoryFilter !== 'All Categories') && (
          <Button
            variant="ghost"
            size="sm"
            className="rounded-xl gap-1 text-muted-foreground"
            onClick={() => { setSearch(''); setSourceFilter('All Sources'); setCategoryFilter('All Categories'); }}
          >
            <X className="w-3 h-3" /> Clear
          </Button>
        )}
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {isLoading ? 'Loading...' : `${filtered.length} result${filtered.length !== 1 ? 's' : ''}`}
          {search && <> for "<span className="font-medium text-foreground">{search}</span>"</>}
        </p>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-32 rounded-2xl bg-muted/40 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Database className="w-14 h-14 text-muted-foreground/20 mb-4" />
          <p className="font-heading font-semibold text-muted-foreground">No criteria found</p>
          <p className="text-sm text-muted-foreground mt-1">Try a different search term or clear filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map(c => (
            <CriteriaCard key={c.id} criteria={c} onClick={() => setSelected(c)} />
          ))}
        </div>
      )}

      {/* Detail side panel */}
      {selected && (
        <>
          <div className="fixed inset-0 bg-black/30 z-40 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <CriteriaDetail criteria={selected} onClose={() => setSelected(null)} />
        </>
      )}

      {/* Add modal */}
      <AddCriteriaModal open={showAdd} onClose={() => setShowAdd(false)} />
    </div>
  );
}