import React, { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Sparkles, Loader2, ChevronDown, ChevronUp, BookMarked } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CriteriaCard from './CriteriaCard';
import CriteriaDetail from './CriteriaDetail';
import { cn } from '@/lib/utils';

function scoreMatch(criteria, primaryDx, procedureCode) {
  let score = 0;
  const dxUpper = (primaryDx || '').toUpperCase();
  const procUpper = (procedureCode || '').toUpperCase();
  const combined = (dxUpper + ' ' + procUpper).toLowerCase();

  // ICD-10 prefix match
  (criteria.icd10_codes || []).forEach(code => {
    const prefix = code.split('.')[0].toUpperCase();
    if (dxUpper.includes(prefix) || dxUpper.startsWith(prefix.substring(0, 2))) score += 30;
  });

  // CPT match
  (criteria.cpt_codes || []).forEach(code => {
    if (procUpper.includes(code)) score += 30;
  });

  // Keyword match
  (criteria.keywords || []).forEach(kw => {
    if (combined.includes(kw.toLowerCase())) score += 10;
  });

  // Title / summary fuzzy match
  const words = combined.split(/\W+/).filter(w => w.length > 3);
  const titleLower = (criteria.title + ' ' + (criteria.summary || '')).toLowerCase();
  words.forEach(w => {
    if (titleLower.includes(w)) score += 5;
  });

  return score;
}

export default function CriteriaMatcher({ primaryDx, procedureCode }) {
  const [expanded, setExpanded] = useState(true);
  const [selected, setSelected] = useState(null);

  const { data: allCriteria = [], isLoading } = useQuery({
    queryKey: ['criteria'],
    queryFn: () => base44.entities.ClinicalCriteria.list('-created_date', 100),
  });

  const matches = React.useMemo(() => {
    if (!primaryDx && !procedureCode) return [];
    return allCriteria
      .map(c => ({ ...c, _score: scoreMatch(c, primaryDx, procedureCode) }))
      .filter(c => c._score > 0)
      .sort((a, b) => b._score - a._score)
      .slice(0, 5);
  }, [allCriteria, primaryDx, procedureCode]);

  const hasInput = primaryDx || procedureCode;

  return (
    <>
      <div className="bg-card rounded-2xl border border-primary/30 shadow-sm overflow-hidden">
        {/* Header */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between p-5 hover:bg-muted/20 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <BookMarked className="w-4 h-4 text-primary" />
            </div>
            <div className="text-left">
              <h3 className="font-heading font-semibold text-sm">AI Criteria Matcher</h3>
              <p className="text-xs text-muted-foreground">
                {isLoading
                  ? 'Loading criteria...'
                  : matches.length > 0
                  ? `${matches.length} relevant criteria set${matches.length > 1 ? 's' : ''} found`
                  : hasInput
                  ? 'No matching criteria — enter Dx or procedure'
                  : 'Enter a diagnosis or procedure to match criteria'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {matches.length > 0 && (
              <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                {matches.length}
              </span>
            )}
            {expanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
          </div>
        </button>

        {expanded && (
          <div className="px-5 pb-5 border-t border-border/50 pt-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-8 gap-2 text-muted-foreground text-sm">
                <Loader2 className="w-4 h-4 animate-spin" /> Analyzing criteria...
              </div>
            ) : !hasInput ? (
              <div className="py-8 text-center">
                <Sparkles className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Fill in Primary Dx or Procedure Code above to auto-match clinical criteria.</p>
              </div>
            ) : matches.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-sm text-muted-foreground">No criteria matched for the current diagnosis/procedure. Try the full <a href="/criteria" className="text-primary underline">Criteria Database</a>.</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {matches.map((c, i) => (
                  <CriteriaCard
                    key={c.id}
                    criteria={c}
                    highlight={i === 0}
                    compact
                    onClick={() => setSelected(c)}
                  />
                ))}
                <p className="text-xs text-center text-muted-foreground pt-1">
                  Showing top {matches.length} matches · <a href="/criteria" className="text-primary hover:underline">View full database</a>
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Detail Panel */}
      {selected && (
        <>
          <div className="fixed inset-0 bg-black/30 z-40 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <CriteriaDetail criteria={selected} onClose={() => setSelected(null)} />
        </>
      )}
    </>
  );
}