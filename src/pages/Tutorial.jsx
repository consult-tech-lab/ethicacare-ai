import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard, Plus, Radio, FileText, BookMarked,
  BarChart2, Activity, Settings, ChevronRight, BookOpen,
  Menu, X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import TutorialDashboard from '@/components/tutorial/TutorialDashboard';
import TutorialNewCase from '@/components/tutorial/TutorialNewCase';
import TutorialRounds from '@/components/tutorial/TutorialRounds';
import TutorialCaseLibrary from '@/components/tutorial/TutorialCaseLibrary';
import TutorialCriteria from '@/components/tutorial/TutorialCriteria';
import TutorialProductivity from '@/components/tutorial/TutorialProductivity';
import TutorialAnalytics from '@/components/tutorial/TutorialAnalytics';
import TutorialSettings from '@/components/tutorial/TutorialSettings';

const SECTIONS = [
  { id: 'dashboard',    label: 'Dashboard',        icon: LayoutDashboard, component: TutorialDashboard,   color: 'text-primary bg-primary/10' },
  { id: 'new-case',     label: 'New Case Review',  icon: Plus,            component: TutorialNewCase,     color: 'text-green-700 bg-green-100' },
  { id: 'rounds',       label: 'AI Rounds',        icon: Radio,           component: TutorialRounds,      color: 'text-orange-600 bg-orange-100', badge: 'Featured' },
  { id: 'case-library', label: 'Case Library',     icon: FileText,        component: TutorialCaseLibrary, color: 'text-accent bg-accent/10' },
  { id: 'criteria',     label: 'Criteria Database',icon: BookMarked,      component: TutorialCriteria,    color: 'text-purple-600 bg-purple-100' },
  { id: 'productivity', label: 'Productivity',     icon: BarChart2,       component: TutorialProductivity,color: 'text-chart-3 bg-chart-3/10' },
  { id: 'analytics',    label: 'Analytics',        icon: Activity,        component: TutorialAnalytics,   color: 'text-blue-600 bg-blue-100' },
  { id: 'settings',     label: 'Settings & Tools', icon: Settings,        component: TutorialSettings,    color: 'text-slate-600 bg-slate-100', badge: 'Featured' },
];

export default function Tutorial() {
  const [active, setActive] = useState('dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);

  const current = SECTIONS.find(s => s.id === active);
  const ActiveComponent = current?.component;

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-heading font-bold">Platform User Guide</h1>
            <p className="text-xs text-muted-foreground">Complete how-to tutorial for EthicaCare AI · HIS Auditor & Contractor Platform</p>
          </div>
        </div>
        <button
          className="lg:hidden p-2 rounded-xl border border-border text-muted-foreground hover:text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </div>

      <div className="flex gap-6 relative">
        {/* Sidebar Nav */}
        <aside className={cn(
          'flex-shrink-0 w-56 space-y-1',
          'lg:block',
          mobileOpen ? 'block absolute z-10 bg-card border border-border rounded-2xl p-3 shadow-xl left-0 top-0 w-64' : 'hidden lg:block'
        )}>
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-3 py-1 mb-1">Sections</p>
          {SECTIONS.map((s, i) => {
            const Icon = s.icon;
            const isActive = active === s.id;
            return (
              <button
                key={s.id}
                onClick={() => { setActive(s.id); setMobileOpen(false); }}
                className={cn(
                  'w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left text-sm font-medium transition-all',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-foreground/70 hover:text-foreground hover:bg-muted/50'
                )}
              >
                <div className={cn('w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 text-[10px] font-bold',
                  isActive ? 'bg-white/20 text-white' : 'bg-muted text-muted-foreground'
                )}>
                  {i + 1}
                </div>
                <span className="truncate flex-1">{s.label}</span>
                {s.badge && !isActive && (
                  <span className="text-[9px] bg-primary/10 text-primary font-bold px-1.5 rounded">{s.badge}</span>
                )}
              </button>
            );
          })}
        </aside>

        {/* Content Area */}
        <main className="flex-1 min-w-0">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4">
            <BookOpen className="w-3.5 h-3.5" />
            <span>User Guide</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground font-medium">{current?.label}</span>
            {current?.badge && (
              <span className="ml-1 text-[9px] bg-primary/10 text-primary font-bold px-1.5 py-0.5 rounded">{current.badge}</span>
            )}
          </div>

          {ActiveComponent && <ActiveComponent />}

          {/* Prev / Next Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
            {(() => {
              const idx = SECTIONS.findIndex(s => s.id === active);
              const prev = SECTIONS[idx - 1];
              const next = SECTIONS[idx + 1];
              return (
                <>
                  <div>
                    {prev && (
                      <button onClick={() => setActive(prev.id)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                        <ChevronRight className="w-4 h-4 rotate-180" />
                        <span><span className="text-xs text-muted-foreground block">Previous</span>{prev.label}</span>
                      </button>
                    )}
                  </div>
                  <div>
                    {next && (
                      <button onClick={() => setActive(next.id)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors text-right">
                        <span><span className="text-xs text-muted-foreground block">Next</span>{next.label}</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </>
              );
            })()}
          </div>
        </main>
      </div>
    </div>
  );
}