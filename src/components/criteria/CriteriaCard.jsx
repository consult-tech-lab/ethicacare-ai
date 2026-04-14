import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Clock, BookOpen, ChevronRight, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

const sourceColors = {
  Milliman:  'bg-blue-100 text-blue-700 border-blue-200',
  InterQual: 'bg-amber-100 text-amber-700 border-amber-200',
  CMS:       'bg-green-100 text-green-700 border-green-200',
  MCG:       'bg-purple-100 text-purple-700 border-purple-200',
  Hayes:     'bg-pink-100 text-pink-700 border-pink-200',
  AHA:       'bg-red-100 text-red-700 border-red-200',
  ACC:       'bg-orange-100 text-orange-700 border-orange-200',
  Other:     'bg-muted text-muted-foreground',
};

const evidenceDot = {
  'Level I':          'bg-green-500',
  'Level II':         'bg-chart-3',
  'Level III':        'bg-muted-foreground',
  'Expert Consensus': 'bg-accent',
  'CMS Mandate':      'bg-primary',
};

export default function CriteriaCard({ criteria, onClick, highlight, compact }) {
  const los = criteria.los_range_min !== undefined && criteria.los_range_max !== undefined
    ? `${criteria.los_range_min}–${criteria.los_range_max}d`
    : criteria.typical_los_days ? `~${criteria.typical_los_days}d` : null;

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left rounded-2xl border transition-all duration-200 group",
        "hover:border-primary/40 hover:shadow-md hover:-translate-y-0.5",
        highlight
          ? "border-primary/50 bg-primary/5 shadow-md"
          : "border-border bg-card shadow-sm",
        compact ? "p-3" : "p-4"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <span className={cn(
              "text-[11px] font-semibold px-2 py-0.5 rounded-full border",
              sourceColors[criteria.source] || sourceColors.Other
            )}>
              {criteria.source}
            </span>
            {highlight && (
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center gap-1">
                <Star className="w-3 h-3" /> AI Match
              </span>
            )}
            <Badge variant="outline" className="text-[11px] font-normal border-border/60">
              {criteria.category}
            </Badge>
          </div>

          <h4 className={cn(
            "font-heading font-semibold text-foreground leading-snug",
            compact ? "text-sm" : "text-sm"
          )}>
            {criteria.title}
          </h4>

          {!compact && criteria.summary && (
            <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed">
              {criteria.summary}
            </p>
          )}

          <div className="flex items-center gap-3 mt-2">
            {criteria.evidence_level && (
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <span className={cn("w-2 h-2 rounded-full flex-shrink-0", evidenceDot[criteria.evidence_level] || 'bg-muted-foreground')} />
                {criteria.evidence_level}
              </div>
            )}
            {los && (
              <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                <Clock className="w-3 h-3" />
                LOS {los}
              </div>
            )}
            {criteria.icd10_codes?.length > 0 && (
              <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                <BookOpen className="w-3 h-3" />
                {criteria.icd10_codes.length} ICD-10
              </div>
            )}
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary transition-colors flex-shrink-0 mt-1" />
      </div>
    </button>
  );
}