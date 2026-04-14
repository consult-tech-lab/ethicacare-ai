import React from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle2, Info, AlertTriangle, Lightbulb, ChevronRight } from 'lucide-react';

export function SectionHeader({ icon: Icon, color, label, title, description }) {
  return (
    <div className={cn('rounded-2xl p-5 mb-6 border', color || 'bg-primary/5 border-primary/20')}>
      <div className="flex items-center gap-3 mb-2">
        <div className="w-9 h-9 rounded-xl bg-white/60 flex items-center justify-center">
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest opacity-70">{label}</p>
          <h2 className="text-lg font-heading font-bold leading-tight">{title}</h2>
        </div>
      </div>
      <p className="text-sm opacity-80 leading-relaxed">{description}</p>
    </div>
  );
}

export function Steps({ steps }) {
  return (
    <ol className="space-y-3">
      {steps.map((step, i) => (
        <li key={i} className="flex gap-3">
          <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
            {i + 1}
          </div>
          <div className="flex-1 pt-0.5">
            {typeof step === 'string' ? (
              <p className="text-sm text-foreground leading-relaxed">{step}</p>
            ) : (
              <>
                <p className="text-sm font-semibold text-foreground">{step.title}</p>
                {step.desc && <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{step.desc}</p>}
              </>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}

export function Callout({ type = 'info', children }) {
  const configs = {
    info:    { icon: Info,          bg: 'bg-blue-50 border-blue-200 text-blue-800' },
    tip:     { icon: Lightbulb,     bg: 'bg-amber-50 border-amber-200 text-amber-800' },
    warning: { icon: AlertTriangle, bg: 'bg-red-50 border-red-200 text-red-800' },
    success: { icon: CheckCircle2,  bg: 'bg-green-50 border-green-200 text-green-700' },
  };
  const { icon: Icon, bg } = configs[type];
  return (
    <div className={cn('flex gap-3 rounded-xl border p-3.5 text-sm', bg)}>
      <Icon className="w-4 h-4 flex-shrink-0 mt-0.5" />
      <div className="leading-relaxed">{children}</div>
    </div>
  );
}

export function SubSection({ title, children }) {
  return (
    <div className="space-y-3">
      <h4 className="font-heading font-semibold text-sm text-foreground flex items-center gap-2">
        <ChevronRight className="w-3.5 h-3.5 text-primary" />
        {title}
      </h4>
      <div className="pl-5">{children}</div>
    </div>
  );
}

export function FeatureGrid({ features }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {features.map((f, i) => (
        <div key={i} className="bg-muted/30 rounded-xl p-3.5 border border-border">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center">
              <f.icon className="w-3.5 h-3.5 text-primary" />
            </div>
            <p className="text-xs font-semibold text-foreground">{f.title}</p>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
        </div>
      ))}
    </div>
  );
}

export function MockScreen({ children, label }) {
  return (
    <div className="rounded-2xl border-2 border-border bg-muted/20 overflow-hidden shadow-sm">
      {label && (
        <div className="flex items-center gap-2 px-4 py-2 bg-muted/40 border-b border-border">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
          </div>
          <span className="text-[11px] text-muted-foreground font-medium ml-2">{label}</span>
        </div>
      )}
      <div className="p-4">{children}</div>
    </div>
  );
}