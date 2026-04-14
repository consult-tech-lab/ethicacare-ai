import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Radio, LayoutGrid, List, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import RoundsHeader from '@/components/rounds/RoundsHeader';
import RoundsCardView from '@/components/rounds/RoundsCardView';
import RoundsTableView from '@/components/rounds/RoundsTableView';
import AddPatientModal from '@/components/rounds/AddPatientModal';

export default function Rounds() {
  const [view, setView] = useState('card');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showAdd, setShowAdd] = useState(false);
  const queryClient = useQueryClient();

  const { data: patients = [], isLoading } = useQuery({
    queryKey: ['rounds-patients'],
    queryFn: () => base44.entities.RoundsPatient.list('-created_date', 100),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.RoundsPatient.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['rounds-patients'] }),
  });

  const STATUS_OPTIONS = ['All', 'Inpatient', 'Observation', 'Direct Admit', 'Outpatient'];

  const filtered = patients.filter(p =>
    statusFilter === 'All' || p.admission_status === statusFilter
  );

  const handleUpdatePatient = (id, data) => updateMutation.mutate({ id, data });

  return (
    <div className="space-y-6">
      <RoundsHeader
        view={view}
        setView={setView}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        statusOptions={STATUS_OPTIONS}
        onAddPatient={() => setShowAdd(true)}
        patientCount={filtered.length}
      />

      {view === 'card' ? (
        <RoundsCardView patients={filtered} isLoading={isLoading} onUpdate={handleUpdatePatient} />
      ) : (
        <RoundsTableView patients={filtered} isLoading={isLoading} onUpdate={handleUpdatePatient} />
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