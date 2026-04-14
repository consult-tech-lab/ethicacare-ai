import React from 'react';
import { X, Clock, CheckCircle, AlertCircle, ArrowDownCircle, BookOpen, Calendar, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

const sourceColors = {
  Milliman:  'bg-blue-100 text-blue-700',
  InterQual: 'bg-amber-100 text-amber-700',
  CMS:       'bg-green-100 text-green-700',
  MCG:       'bg-purple-100 text-purple-700',
  Hayes:     'bg-pink-100 text-pink-700',
  AHA:       'bg-red-100 text-red-700',
  ACC:       'bg-orange-100 text-orange-700',
  Other:     'bg-muted text-muted-foreground',
};

const Section = ({ icon: Icon, title, content, color }) => {
  if (!content) return null;
  const lines = content.split('\n').filter(l => l.trim());
  return (
    <div className={cn("rounded-xl p-4 border", color)}>
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-4 h-4" />
        <h4 className="font-heading font-semibold text-sm">{title}</h4>
      </div>
      <ol className="space-y-1.5">
        {lines.map((line, i) => (
          <li key={i} className="text-sm flex gap-2">
            <span className="text-muted-foreground font-mono text-xs mt-0.5 flex-shrink-0">
              {line.match(/^\d+\./) ? '' : `${i + 1}.`}
            </span>
            <span className="leading-relaxed">{line.replace(/^\d+\.\s*/, '')}</span>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default function CriteriaDetail({ criteria, onClose }) {
  if (!criteria) return null;

  const los = criteria.los_range_min !== undefined && criteria.los_range_max !== undefined
    ? `${criteria.los_range_min}–${criteria.los_range_max} days`
    : criteria.typical_los_days ? `~${criteria.typical_los_days} days` : 'N/A';

  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-[600px] z-50 shadow-2xl flex flex-col bg-background border-l border-border">
      {/* Header */}
      <div className="flex items-start justify-between p-5 border-b border-border bg-card">
        <div className="flex-1 min-w-0 pr-4">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className={cn("text-[11px] font-semibold px-2 py-0.5 rounded-full", sourceColors[criteria.source] || sourceColors.Other)}>
              {criteria.source}
            </span>
            <Badge variant="outline" className="text-[11px]">{criteria.category}</Badge>
            {criteria.evidence_level && (
              <Badge variant="outline" className="text-[11px] border-primary/30 text-primary">{criteria.evidence_level}</Badge>
            )}
          </div>
          <h2 className="font-heading font-bold text-base leading-snug">{criteria.title}</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Updated: {criteria.last_updated || 'N/A'}
          </p>
        </div>
        <Button variant="ghost" size="icon" className="rounded-xl flex-shrink-0" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-5 space-y-4">
          {/* LOS Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 text-center">
              <Clock className="w-4 h-4 text-primary mx-auto mb-1" />
              <p className="text-lg font-heading font-bold text-primary">{los}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium">Typical LOS</p>
            </div>
            <div className="bg-muted/60 rounded-xl p-3 text-center">
              <BookOpen className="w-4 h-4 text-muted-foreground mx-auto mb-1" />
              <p className="text-lg font-heading font-bold">{criteria.icd10_codes?.length || 0}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium">ICD-10 Codes</p>
            </div>
            <div className="bg-muted/60 rounded-xl p-3 text-center">
              <Calendar className="w-4 h-4 text-muted-foreground mx-auto mb-1" />
              <p className="text-lg font-heading font-bold">{criteria.cpt_codes?.length || 0}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium">CPT Codes</p>
            </div>
          </div>

          {/* Summary */}
          {criteria.summary && (
            <div className="bg-muted/40 rounded-xl p-4">
              <p className="text-sm leading-relaxed text-foreground">{criteria.summary}</p>
            </div>
          )}

          {/* Clinical Sections */}
          <Section
            icon={CheckCircle}
            title="Admission Criteria"
            content={criteria.admission_criteria}
            color="bg-green-50 border-green-200 text-green-900"
          />
          <Section
            icon={Clock}
            title="Continued Stay Criteria"
            content={criteria.continued_stay_criteria}
            color="bg-amber-50 border-amber-200 text-amber-900"
          />
          <Section
            icon={ArrowDownCircle}
            title="Discharge Criteria"
            content={criteria.discharge_criteria}
            color="bg-blue-50 border-blue-200 text-blue-900"
          />

          {/* Notes */}
          {criteria.notes && (
            <div className="bg-muted/40 border border-border rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4 text-primary" />
                <h4 className="font-heading font-semibold text-sm">Clinical Notes & Caveats</h4>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">{criteria.notes}</p>
            </div>
          )}

          {/* Codes */}
          {(criteria.icd10_codes?.length > 0 || criteria.cpt_codes?.length > 0) && (
            <div className="space-y-3">
              {criteria.icd10_codes?.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">ICD-10 Codes</p>
                  <div className="flex flex-wrap gap-1.5">
                    {criteria.icd10_codes.map(code => (
                      <code key={code} className="text-xs px-2 py-1 rounded-lg bg-muted font-mono">{code}</code>
                    ))}
                  </div>
                </div>
              )}
              {criteria.cpt_codes?.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">CPT Codes</p>
                  <div className="flex flex-wrap gap-1.5">
                    {criteria.cpt_codes.map(code => (
                      <code key={code} className="text-xs px-2 py-1 rounded-lg bg-muted font-mono">{code}</code>
                    ))}
                  </div>
                </div>
              )}
              {criteria.keywords?.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Keywords</p>
                  <div className="flex flex-wrap gap-1.5">
                    {criteria.keywords.map(kw => (
                      <span key={kw} className="text-xs px-2 py-1 rounded-full bg-secondary text-secondary-foreground">{kw}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}