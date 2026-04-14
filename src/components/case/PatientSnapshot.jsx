import React from 'react';
import { User, Hash, Shield, Calendar } from 'lucide-react';

const InfoRow = ({ icon: Icon, label, value, color }) => (
  <div className="flex items-start gap-3">
    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${color}`}>
      <Icon className="w-4 h-4" />
    </div>
    <div className="min-w-0">
      <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
      <p className="text-sm font-semibold text-foreground truncate">{value || '—'}</p>
    </div>
  </div>
);

export default function PatientSnapshot({ data }) {
  return (
    <div className="bg-card rounded-2xl border border-border p-5 shadow-sm">
      <h3 className="font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
        <div className="w-1.5 h-5 rounded-full bg-primary" />
        Patient Snapshot
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <InfoRow icon={User} label="Patient Name" value={data.patient_name} color="bg-primary/10 text-primary" />
        <InfoRow icon={Hash} label="MRN" value={data.mrn} color="bg-accent/10 text-accent" />
        <InfoRow icon={Shield} label="Insurance" value={data.insurance} color="bg-chart-4/10 text-chart-4" />
        <InfoRow icon={Calendar} label="Admission Date" value={data.admission_date} color="bg-chart-3/10 text-chart-3" />
      </div>
    </div>
  );
}