import React from 'react';
import { Stethoscope, Syringe } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function DiagnosisCodes({ primaryDx, procedureCode }) {
  return (
    <div className="bg-card rounded-2xl border border-border p-5 shadow-sm">
      <h3 className="font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
        <div className="w-1.5 h-5 rounded-full bg-accent" />
        Dx / Procedure Codes
      </h3>
      <div className="space-y-3">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
          <Stethoscope className="w-5 h-5 text-primary flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Primary Dx</p>
            <div className="flex items-center gap-2 mt-0.5">
              <Badge variant="secondary" className="bg-primary/10 text-primary border-0 font-mono text-xs">
                {primaryDx?.split(' ')[0] || '—'}
              </Badge>
              <span className="text-sm font-medium text-foreground truncate">
                {primaryDx?.replace(/^\S+\s*/, '') || ''}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
          <Syringe className="w-5 h-5 text-accent flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Procedure</p>
            <div className="flex items-center gap-2 mt-0.5">
              <Badge variant="secondary" className="bg-accent/10 text-accent border-0 font-mono text-xs">
                {procedureCode?.split(' ')[0] || '—'}
              </Badge>
              <span className="text-sm font-medium text-foreground truncate">
                {procedureCode?.replace(/^\S+\s*/, '') || ''}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}