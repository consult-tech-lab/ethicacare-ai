import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Radio, LayoutGrid, List, Plus, Filter, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import RoundsPatientCard from '@/components/rounds/RoundsPatientCard';
import RoundsTableView from '@/components/rounds/RoundsTableView';
import AddPatientModal from '@/components/rounds/AddPatientModal';

const STATUS_OPTIONS = ['All', 'Inpatient', 'Observation', 'Direct Admit', 'Outpatient', 'Research'];

export default function Rounds() {
  const [view, setView] = useState('card');
  const [showAdd, setShowAdd] = useState(false);
  const [orderedIds, setOrderedIds] = useState([]);

  // Filter state
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [mrnFilter, setMrnFilter] = useState('');
  const [roomFilter, setRoomFilter] = useState('');
  const [payerFilter, setPayerFilter] = useState('All Payers');
  const [showFilters, setShowFilters] = useState(false);

  const queryClient = useQueryClient();

  const { data: patients = [], isLoading } = useQuery({
    queryKey: ['rounds-patients'],
    queryFn: () => base44.entities.RoundsPatient.list('-created_date', 100),
    onSuccess: (data) => {
      if (orderedIds.length === 0) {
        setOrderedIds(data.map(p => p.id));
      }
    }
  });

  // Build ordered list, adding any new patients at end
  const orderedPatients = React.useMemo(() => {
    const map = Object.fromEntries(patients.map(p => [p.id, p]));
    const known = orderedIds.filter(id => map[id]).map(id => map[id]);
    const newOnes = patients.filter(p => !orderedIds.includes(p.id));
    return [...known, ...newOnes];
  }, [patients, orderedIds]);

  // Re-init order when patients load
  React.useEffect(() => {
    if (patients.length > 0 && orderedIds.length === 0) {
      setOrderedIds(patients.map(p => p.id));
    }
  }, [patients]);

  const uniquePayers = React.useMemo(() => {
    const payers = [...new Set(patients.map(p => p.insurance).filter(Boolean))];
    return ['All Payers', ...payers];
  }, [patients]);

  const filtered = orderedPatients.filter(p => {
    if (statusFilter !== 'All') {
      if (statusFilter === 'Research' && p.admission_status !== 'Research') return false;
      if (statusFilter !== 'Research' && p.admission_status !== statusFilter) return false;
    }
    if (search) {
      const q = search.toLowerCase();
      if (!p.patient_name?.toLowerCase().includes(q)) return false;
    }
    if (mrnFilter && !p.mrn?.toLowerCase().includes(mrnFilter.toLowerCase())) return false;
    if (roomFilter && !p.room?.toLowerCase().includes(roomFilter.toLowerCase())) return false;
    if (payerFilter !== 'All Payers' && p.insurance !== payerFilter) return false;
    return true;
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.RoundsPatient.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['rounds-patients'] }),
  });

  const handleUpdatePatient = (id, data) => updateMutation.mutate({ id, data });

  const handleDragEnd = useCallback((result) => {
    if (!result.destination) return;
    const ids = filtered.map(p => p.id);
    const [moved] = ids.splice(result.source.index, 1);
    ids.splice(result.destination.index, 0, moved);
    // Rebuild full ordered list with new positions for filtered items
    const filteredSet = new Set(ids);
    const nonFiltered = orderedIds.filter(id => !filteredSet.has(id) && !filtered.find(p => p.id === id));
    setOrderedIds([...ids, ...nonFiltered]);
  }, [filtered, orderedIds]);

  const clearFilters = () => {
    setSearch(''); setMrnFilter(''); setRoomFilter('');
    setStatusFilter('All'); setPayerFilter('All Payers');
  };

  const hasActiveFilters = search || mrnFilter || roomFilter || statusFilter !== 'All' || payerFilter !== 'All Payers';

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
            <Radio className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-heading font-bold">Ambient AI Rounds</h1>
            <p className="text-xs text-muted-foreground">Live utilization intelligence during patient rounds</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className={cn('rounded-xl gap-1.5 text-xs', showFilters && 'border-primary text-primary')}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-3.5 h-3.5" />
            Filters
            {hasActiveFilters && <span className="w-2 h-2 bg-primary rounded-full" />}
          </Button>
          {/* View Toggle */}
          <div className="flex items-center bg-muted/50 rounded-xl p-1 border border-border">
            <button onClick={() => setView('card')} className={cn('p-1.5 rounded-lg transition-all', view === 'card' ? 'bg-card shadow text-foreground' : 'text-muted-foreground hover:text-foreground')}>
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button onClick={() => setView('table')} className={cn('p-1.5 rounded-lg transition-all', view === 'table' ? 'bg-card shadow text-foreground' : 'text-muted-foreground hover:text-foreground')}>
              <List className="w-4 h-4" />
            </button>
          </div>
          <Button onClick={() => setShowAdd(true)} className="rounded-xl gap-2 bg-primary hover:bg-primary/90 text-sm">
            <Plus className="w-4 h-4" /> Add Patient
          </Button>
        </div>
      </div>

      {/* Status Pills */}
      <div className="flex flex-wrap gap-2 items-center">
        {STATUS_OPTIONS.map(s => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={cn(
              'px-3 py-1 rounded-full text-xs font-semibold border transition-all',
              statusFilter === s
                ? s === 'Research'
                  ? 'bg-slate-500 text-white border-slate-500 shadow-sm'
                  : 'bg-primary text-primary-foreground border-primary shadow-sm'
                : 'bg-card border-border text-muted-foreground hover:text-foreground'
            )}
          >
            {s}
          </button>
        ))}
        <span className="ml-auto text-xs text-muted-foreground">{filtered.length} patients</span>
      </div>

      {/* Expanded Filters */}
      {showFilters && (
        <div className="bg-card border border-border rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Advanced Filters</p>
            {hasActiveFilters && (
              <button onClick={clearFilters} className="text-xs text-primary flex items-center gap-1 hover:underline">
                <X className="w-3 h-3" /> Clear all
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1">Last Name</p>
              <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name..." className="rounded-xl h-8 text-xs" />
            </div>
            <div>
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1">MRN</p>
              <Input value={mrnFilter} onChange={e => setMrnFilter(e.target.value)} placeholder="MRN..." className="rounded-xl h-8 text-xs" />
            </div>
            <div>
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1">Room Location</p>
              <Input value={roomFilter} onChange={e => setRoomFilter(e.target.value)} placeholder="Room..." className="rounded-xl h-8 text-xs" />
            </div>
            <div>
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1">Payer</p>
              <Select value={payerFilter} onValueChange={setPayerFilter}>
                <SelectTrigger className="rounded-xl h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>{uniquePayers.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <p className="text-[10px] text-muted-foreground italic">Drag cards/rows to reorder after filtering. Changes apply to your current session view.</p>
        </div>
      )}

      {/* Card View with DnD */}
      {view === 'card' ? (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="rounds-cards" direction="horizontal">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
              >
                {isLoading ? (
                  [...Array(6)].map((_, i) => (
                    <div key={i} className="h-48 rounded-2xl bg-muted/40 animate-pulse" />
                  ))
                ) : filtered.length === 0 ? (
                  <div className="col-span-3 flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-border rounded-2xl">
                    <Radio className="w-10 h-10 text-muted-foreground/20 mb-3" />
                    <p className="text-sm font-medium text-muted-foreground">No patients match your filters</p>
                  </div>
                ) : (
                  filtered.map((patient, index) => (
                    <Draggable key={patient.id} draggableId={patient.id} index={index}>
                      {(prov, snapshot) => (
                        <div
                          ref={prov.innerRef}
                          {...prov.draggableProps}
                          {...prov.dragHandleProps}
                          className={cn(snapshot.isDragging && 'opacity-80 rotate-1 scale-105 shadow-2xl')}
                        >
                          <RoundsPatientCard patient={patient} onUpdate={handleUpdatePatient} />
                        </div>
                      )}
                    </Draggable>
                  ))
                )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="rounds-table">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                <RoundsTableView patients={filtered} isLoading={isLoading} onUpdate={handleUpdatePatient} draggable provided={provided} />
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}

      {showAdd && (
        <AddPatientModal
          onClose={() => setShowAdd(false)}
          onSaved={() => {
            queryClient.invalidateQueries({ queryKey: ['rounds-patients'] });
            setShowAdd(false);
          }}
        />
      )}
    </div>
  );
}