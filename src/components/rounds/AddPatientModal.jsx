import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Loader2 } from 'lucide-react';

export default function AddPatientModal({ onClose, onSaved }) {
  const [form, setForm] = useState({
    patient_name: '',
    mrn: '',
    room: '',
    admission_status: 'Inpatient',
    primary_dx: '',
    insurance: '',
    attending_md: '',
    admission_date: '',
    los_days: '',
    priority: 'routine',
  });
  const [saving, setSaving] = useState(false);

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (!form.patient_name || !form.mrn) return;
    setSaving(true);
    await base44.entities.RoundsPatient.create({
      ...form,
      los_days: form.los_days ? Number(form.los_days) : undefined,
      ambient_notes: [],
      progress_notes: [],
      is_active: true,
    });
    setSaving(false);
    onSaved();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-lg pointer-events-auto">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <h2 className="font-heading font-bold text-foreground">Add Patient to Rounds</h2>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted transition-colors"><X className="w-4 h-4" /></button>
          </div>
          <div className="p-6 grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-1.5">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Patient Name *</Label>
              <Input value={form.patient_name} onChange={e => update('patient_name', e.target.value)} placeholder="Jane Doe" className="rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">MRN *</Label>
              <Input value={form.mrn} onChange={e => update('mrn', e.target.value)} placeholder="MRN-00123" className="rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Room</Label>
              <Input value={form.room} onChange={e => update('room', e.target.value)} placeholder="4B-12" className="rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Admission Status</Label>
              <Select value={form.admission_status} onValueChange={v => update('admission_status', v)}>
                <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Inpatient">Inpatient</SelectItem>
                  <SelectItem value="Observation">Observation</SelectItem>
                  <SelectItem value="Direct Admit">Direct Admit</SelectItem>
                  <SelectItem value="Outpatient">Outpatient</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Priority</Label>
              <Select value={form.priority} onValueChange={v => update('priority', v)}>
                <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="routine">Routine</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Primary Dx</Label>
              <Input value={form.primary_dx} onChange={e => update('primary_dx', e.target.value)} placeholder="I50.9 – Heart Failure" className="rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Insurance</Label>
              <Input value={form.insurance} onChange={e => update('insurance', e.target.value)} placeholder="Medicare" className="rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">LOS (days)</Label>
              <Input type="number" value={form.los_days} onChange={e => update('los_days', e.target.value)} placeholder="3" className="rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Attending MD</Label>
              <Input value={form.attending_md} onChange={e => update('attending_md', e.target.value)} placeholder="Dr. Smith" className="rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Admission Date</Label>
              <Input type="date" value={form.admission_date} onChange={e => update('admission_date', e.target.value)} className="rounded-xl" />
            </div>
          </div>
          <div className="px-6 py-4 border-t border-border flex justify-end gap-3">
            <Button variant="outline" className="rounded-xl" onClick={onClose}>Cancel</Button>
            <Button
              className="rounded-xl bg-primary hover:bg-primary/90"
              disabled={!form.patient_name || !form.mrn || saving}
              onClick={handleSave}
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Add to Rounds
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}