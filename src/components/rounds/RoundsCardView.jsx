import React from 'react';
import { Loader2 } from 'lucide-react';
import RoundsPatientCard from './RoundsPatientCard';

export default function RoundsCardView({ patients, isLoading, onUpdate }) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground gap-2">
        <Loader2 className="w-5 h-5 animate-spin" /> Loading patients...
      </div>
    );
  }

  if (!patients.length) {
    return (
      <div className="bg-card rounded-2xl border border-dashed border-border p-16 text-center">
        <p className="text-muted-foreground text-sm">No patients on rounds list. Add a patient to get started.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {patients.map(p => (
        <RoundsPatientCard key={p.id} patient={p} onUpdate={onUpdate} />
      ))}
    </div>
  );
}