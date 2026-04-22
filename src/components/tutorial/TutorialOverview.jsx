import React from 'react';
import {
  Shield, ExternalLink, Cpu, BookOpen, CheckCircle, ArrowRight,
  Building2, FlaskConical, Radio, BarChart2, FileText, BookMarked,
  LayoutDashboard, Plus, RotateCcw
} from 'lucide-react';

const Pill = ({ children, color = 'bg-primary/10 text-primary' }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${color}`}>{children}</span>
);

const InfoCard = ({ icon: Icon, title, children, accent = 'bg-primary/10' }) => (
  <div className="bg-card rounded-2xl border border-border p-5 shadow-sm">
    <div className="flex items-center gap-3 mb-3">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${accent}`}>
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <h3 className="font-heading font-semibold text-sm">{title}</h3>
    </div>
    {children}
  </div>
);

export default function TutorialOverview() {
  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl border border-sidebar-border bg-sidebar text-sidebar-foreground p-6 shadow-lg">
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-sidebar-primary/10 pointer-events-none" />
        <div className="relative flex flex-col gap-3">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="w-12 h-12 rounded-2xl bg-sidebar-primary/20 border border-sidebar-primary/30 flex flex-col items-center justify-center">
              <span className="text-sidebar-primary font-heading font-black text-lg leading-none">H</span>
              <span className="text-sidebar-foreground/50 text-[8px] font-bold tracking-widest">URO</span>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-sidebar-primary">Platform Overview</p>
              <h2 className="font-heading font-bold text-xl text-sidebar-foreground">EthicaCare & H.U.R.O.</h2>
            </div>
          </div>
          <p className="text-sm text-sidebar-foreground/70 leading-relaxed max-w-2xl">
            <strong className="text-sidebar-foreground">H.U.R.O.</strong> (Hospital Utilization Review Optimization) is a third-party healthcare
            consulting and training vendor. HURO trains clinical teams in utilization management best practices,
            bridging the gap between legacy rule-based criteria (InterQual, MCG) and modern AI-driven documentation workflows.
          </p>
          <p className="text-sm text-sidebar-foreground/70 leading-relaxed max-w-2xl">
            <strong className="text-sidebar-foreground">EthicaCare 2.0</strong> is HURO's proprietary AI-powered platform — the operational
            application where clinicians and auditors perform day-to-day utilization reviews, ambient AI documentation,
            case management, and performance tracking.
          </p>
          <a
            href="https://sites.google.com/view/hurotraining/home"
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-sidebar-primary hover:underline"
          >
            <ExternalLink className="w-3.5 h-3.5" /> Visit HURO Training Portal
          </a>
        </div>
      </div>

      {/* Relationship diagram */}
      <InfoCard icon={Building2} title="HURO → EthicaCare Relationship" accent="bg-primary/10">
        <div className="flex flex-col sm:flex-row items-stretch gap-3 text-sm">
          <div className="flex-1 bg-muted/40 rounded-xl p-4 border border-border">
            <p className="font-bold text-foreground mb-1">H.U.R.O.</p>
            <p className="text-xs text-muted-foreground leading-relaxed">The parent consulting & training organization. Provides education, methodology, and compliance frameworks for utilization management teams.</p>
            <div className="mt-2 flex flex-wrap gap-1">
              <Pill>Training</Pill>
              <Pill>Consulting</Pill>
              <Pill>Frameworks</Pill>
            </div>
          </div>
          <div className="flex items-center justify-center text-muted-foreground px-2">
            <ArrowRight className="w-5 h-5 rotate-90 sm:rotate-0" />
          </div>
          <div className="flex-1 bg-primary/5 rounded-xl p-4 border border-primary/20">
            <p className="font-bold text-primary mb-1">EthicaCare 2.0</p>
            <p className="text-xs text-muted-foreground leading-relaxed">HURO's proprietary AI platform. Where case reviews happen, AI rounds are conducted, criteria are matched, and productivity is tracked.</p>
            <div className="mt-2 flex flex-wrap gap-1">
              <Pill>AI Reviews</Pill>
              <Pill>Ambient Rounds</Pill>
              <Pill>UM Auditing</Pill>
            </div>
          </div>
        </div>
      </InfoCard>

      {/* Two Workflow Pathways */}
      <InfoCard icon={Cpu} title="Two Workflow Pathways" accent="bg-accent/10">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-4 h-4 text-amber-700" />
              <p className="font-semibold text-amber-800 text-sm">Legacy Team</p>
            </div>
            <p className="text-xs text-amber-700 leading-relaxed">Uses InterQual and MCG rule-based clinical decision criteria. Structured, evidence-based pathways for traditional payer authorization and continued stay reviews. Access via <strong>Criteria</strong> in the sidebar.</p>
          </div>
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Radio className="w-4 h-4 text-primary" />
              <p className="font-semibold text-primary text-sm">Modern / AI Team</p>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">Uses Ambient AI, NLP-based SOAP notes, real-time rounds capture, and generative AI recommendations. Access via <strong>AI Rounds</strong> in the sidebar.</p>
          </div>
        </div>
      </InfoCard>

      {/* Sidebar Navigation */}
      <InfoCard icon={LayoutDashboard} title="Sidebar Navigation — All Modules" accent="bg-accent/10">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {[
            { icon: LayoutDashboard, label: 'Dashboard',     desc: 'Command center — HURO banner, stats cards, recent cases, and workflow shortcuts.' },
            { icon: Plus,            label: 'New Case',      desc: 'Open a blank case review form for utilization or secondary review.' },
            { icon: Radio,           label: 'AI Rounds',     desc: 'Live patient board with Ambient AI capture during rounds.' },
            { icon: RotateCcw,       label: 'Rounds Recall', desc: 'Post-rounds review — edit, copy, and export AI notes and quick notes.' },
            { icon: FileText,        label: 'Case Library',  desc: 'Searchable archive of all patient cases with status filtering.' },
            { icon: BookMarked,      label: 'Criteria',      desc: 'InterQual, MCG, CMS & Milliman clinical criteria database.' },
            { icon: BarChart2,       label: 'Productivity',  desc: 'Completed cases, approval rates, LOS metrics, and team performance.' },
            { icon: FlaskConical,    label: 'Research',      desc: 'AI model testing pool — manage research patients and export findings.' },
            { icon: Shield,          label: 'Settings',      desc: 'BI export, secure messaging, notifications, and HIPAA preferences.' },
            { icon: BookOpen,        label: 'User Guide',    desc: 'This guide — full how-to documentation for every platform module.' },
          ].map(({ icon: Icon, label, desc }) => (
            <div key={label} className="flex items-start gap-2.5 bg-muted/30 rounded-xl p-3 border border-border/50">
              <Icon className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-foreground">{label}</p>
                <p className="text-muted-foreground leading-snug">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </InfoCard>

      {/* Compliance */}
      <InfoCard icon={Shield} title="Compliance & Standards" accent="bg-green-100">
        <ul className="space-y-2 text-xs text-muted-foreground">
          {[
            'HIPAA-compliant data handling — all PHI is encrypted at rest and in transit',
            'EU AI Act aligned — AI recommendations are advisory only; humans make all final decisions',
            'Healthcare Modernization 2035 framework compliance',
            'Nurse-led approval required on all AI-generated outputs before promotion to official record',
            'All voice recordings are auto-deleted after processing',
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-green-600 mt-0.5 flex-shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </InfoCard>
    </div>
  );
}