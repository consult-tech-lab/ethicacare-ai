import React, { useState } from 'react';
import { Download, FileSpreadsheet, FileText, Loader2, CheckCircle2, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { cn } from '@/lib/utils';

const EXPORT_OPTIONS = [
  {
    id: 'cases',
    label: 'Patient Cases',
    description: 'All case reviews, statuses, AI recommendations',
    icon: FileText,
    color: 'text-primary bg-primary/10',
    entity: 'PatientCase',
  },
  {
    id: 'activity',
    label: 'Case Activity / Productivity',
    description: 'Reviewer productivity, LOS, TAT, outcomes',
    icon: Database,
    color: 'text-accent bg-accent/10',
    entity: 'CaseActivity',
  },
  {
    id: 'rounds',
    label: 'Rounds & AI Notes',
    description: 'Patient rounds, ambient AI capture history',
    icon: FileSpreadsheet,
    color: 'text-chart-3 bg-chart-3/10',
    entity: 'RoundsPatient',
  },
  {
    id: 'criteria',
    label: 'Clinical Criteria Database',
    description: 'All criteria sets, ICD-10/CPT codes, evidence levels',
    icon: FileSpreadsheet,
    color: 'text-purple-600 bg-purple-50',
    entity: 'ClinicalCriteria',
  },
];

function flattenRecord(record) {
  const flat = {};
  for (const [k, v] of Object.entries(record)) {
    if (Array.isArray(v)) {
      flat[k] = v.map(i => (typeof i === 'object' ? JSON.stringify(i) : i)).join(' | ');
    } else if (typeof v === 'object' && v !== null) {
      flat[k] = JSON.stringify(v);
    } else {
      flat[k] = v ?? '';
    }
  }
  return flat;
}

function toCSV(records) {
  if (!records.length) return '';
  const flat = records.map(flattenRecord);
  const headers = Object.keys(flat[0]);
  const rows = flat.map(r => headers.map(h => {
    const val = String(r[h] ?? '').replace(/"/g, '""');
    return `"${val}"`;
  }).join(','));
  return [headers.join(','), ...rows].join('\n');
}

export default function BIExportTool() {
  const [exporting, setExporting] = useState(null);
  const [done, setDone] = useState(null);

  const handleExport = async (option) => {
    setExporting(option.id);
    setDone(null);
    const records = await base44.entities[option.entity].list('-created_date', 10000);
    const csv = toCSV(records);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${option.id}_export_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setExporting(null);
    setDone(option.id);
    setTimeout(() => setDone(null), 3000);
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {EXPORT_OPTIONS.map(opt => {
          const Icon = opt.icon;
          const isExporting = exporting === opt.id;
          const isDone = done === opt.id;
          return (
            <div key={opt.id} className="flex items-center justify-between gap-3 bg-muted/30 rounded-xl px-4 py-3 border border-border">
              <div className="flex items-center gap-3 min-w-0">
                <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0', opt.color)}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{opt.label}</p>
                  <p className="text-[11px] text-muted-foreground truncate">{opt.description}</p>
                </div>
              </div>
              <Button
                size="sm"
                variant={isDone ? 'outline' : 'default'}
                className={cn('rounded-xl h-8 px-3 text-xs flex-shrink-0 gap-1.5',
                  isDone ? 'border-green-400 text-green-700 bg-green-50' : 'bg-primary hover:bg-primary/90'
                )}
                disabled={isExporting}
                onClick={() => handleExport(opt)}
              >
                {isExporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> :
                  isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> :
                  <Download className="w-3.5 h-3.5" />}
                {isExporting ? 'Exporting...' : isDone ? 'Downloaded' : 'Export CSV'}
              </Button>
            </div>
          );
        })}
      </div>
      <p className="text-[11px] text-muted-foreground">
        CSV exports are compatible with Excel, Power BI, Tableau, and all major BI tools.
      </p>
    </div>
  );
}