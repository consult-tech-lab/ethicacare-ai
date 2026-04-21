import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import {
  Plus, FileText, Clock, CheckCircle, AlertCircle,
  ArrowRight, Brain, ExternalLink, Shield, Cpu, BookOpen,
  Radio, ChevronRight, Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon: Icon, accent, trend }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-card rounded-2xl border border-border p-5 shadow-sm hover:shadow-md transition-shadow"
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
        <p className="text-3xl font-heading font-bold mt-1">{value}</p>
        {trend && <p className="text-xs text-green-600 font-medium mt-1">{trend}</p>}
      </div>
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${accent}`}>
        <Icon className="w-5 h-5" />
      </div>
    </div>
  </motion.div>
);

const statusConfig = {
  draft:        { label: 'Draft',        color: 'bg-muted text-muted-foreground' },
  in_review:    { label: 'In Review',    color: 'bg-chart-3/10 text-chart-3' },
  approved:     { label: 'Approved',     color: 'bg-green-100 text-green-700' },
  denied:       { label: 'Denied',       color: 'bg-destructive/10 text-destructive' },
  pending_info: { label: 'Pending Info', color: 'bg-primary/10 text-primary' },
};

export default function Dashboard() {
  const { data: cases = [], isLoading } = useQuery({
    queryKey: ['cases'],
    queryFn: () => base44.entities.PatientCase.list('-created_date', 50),
  });

  const stats = {
    total:        cases.length,
    inReview:     cases.filter(c => c.status === 'in_review').length,
    approved:     cases.filter(c => c.status === 'approved').length,
    aiGenerated:  cases.filter(c => c.ai_recommendation).length,
  };

  const recentCases = cases.slice(0, 6);

  return (
    <div className="space-y-7">

      {/* ── HURO Platform Banner ───────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl border border-sidebar-border bg-sidebar text-sidebar-foreground shadow-lg"
      >
        {/* Decorative circles */}
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-sidebar-primary/10 pointer-events-none" />
        <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-sidebar-primary/5 pointer-events-none" />

        <div className="relative p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6">
            {/* HURO Logo mark */}
            <div className="flex-shrink-0">
              <div className="w-14 h-14 rounded-2xl bg-sidebar-primary/20 border border-sidebar-primary/30 flex flex-col items-center justify-center">
                <span className="text-sidebar-primary font-heading font-black text-lg leading-none">H</span>
                <span className="text-sidebar-foreground/50 text-[8px] font-bold tracking-widest leading-none">URO</span>
              </div>
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-sidebar-primary bg-sidebar-primary/10 px-2 py-0.5 rounded-full border border-sidebar-primary/20">
                  LMS Platform
                </span>
                <span className="text-[10px] text-sidebar-foreground/40">·</span>
                <span className="text-[10px] text-sidebar-foreground/50 font-medium">Hospital Utilization Review Optimization</span>
              </div>
              <h2 className="font-heading font-bold text-lg text-sidebar-foreground leading-tight">
                H.U.R.O. Training & Consulting Portal
              </h2>
              <p className="text-xs text-sidebar-foreground/60 mt-1 leading-relaxed max-w-2xl">
                HURO is a third-party healthcare consulting vendor operating a proprietary evaluation platform. 
                You are currently logged into <strong className="text-sidebar-foreground/80">EthicaCare 2.0</strong> — 
                HURO's AI-powered auditing application for utilization management, clinical criteria review, and ambient AI documentation.
              </p>

              {/* Team badges */}
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                <div className="flex items-center gap-1.5 bg-sidebar-accent rounded-lg px-2.5 py-1.5 border border-sidebar-border">
                  <BookOpen className="w-3 h-3 text-sidebar-primary" />
                  <span className="text-[11px] font-semibold text-sidebar-foreground/70">Legacy Team</span>
                  <span className="text-[10px] text-sidebar-foreground/40">— InterQual / MCG</span>
                </div>
                <div className="flex items-center gap-1.5 bg-sidebar-accent rounded-lg px-2.5 py-1.5 border border-sidebar-border">
                  <Cpu className="w-3 h-3 text-sidebar-primary" />
                  <span className="text-[11px] font-semibold text-sidebar-foreground/70">Modern Team</span>
                  <span className="text-[10px] text-sidebar-foreground/40">— AI / NLP / Ambient</span>
                </div>
                <div className="flex items-center gap-1.5 bg-sidebar-primary/10 rounded-lg px-2.5 py-1.5 border border-sidebar-primary/20">
                  <Shield className="w-3 h-3 text-sidebar-primary" />
                  <span className="text-[11px] font-semibold text-sidebar-primary">HIPAA Compliant</span>
                </div>
              </div>
            </div>

            {/* HURO link */}
            <div className="flex-shrink-0 self-start">
              <a
                href="https://sites.google.com/view/hurotraining/home"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-[11px] font-semibold text-sidebar-primary hover:text-sidebar-primary/80 transition-colors bg-sidebar-primary/10 hover:bg-sidebar-primary/20 px-3 py-1.5 rounded-lg border border-sidebar-primary/20"
              >
                <ExternalLink className="w-3 h-3" />
                HURO Training Portal
              </a>
            </div>
          </div>
        </div>

        {/* Bottom breadcrumb bar */}
        <div className="border-t border-sidebar-border px-5 sm:px-6 py-2.5 flex items-center gap-1.5 text-[11px] text-sidebar-foreground/40">
          <span className="font-semibold text-sidebar-primary">H.U.R.O.</span>
          <ChevronRight className="w-3 h-3" />
          <span>EthicaCare 2.0</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-sidebar-foreground/60 font-medium">UM Auditing Platform</span>
        </div>
      </motion.div>

      {/* ── EthicaCare Header ─────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">EthicaCare Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Utilization Management · AI Auditing Overview</p>
        </div>
        <Link to="/case/new">
          <Button className="gap-2 rounded-xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
            <Plus className="w-4 h-4" />
            New Case Review
          </Button>
        </Link>
      </div>

      {/* ── Quick Access: HURO Workflow Paths ─────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="flex items-center gap-3 bg-card rounded-2xl border border-border p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-5 h-5 text-amber-700" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-foreground">Legacy Workflow Path</p>
            <p className="text-[11px] text-muted-foreground leading-relaxed">InterQual / MCG rule-based criteria, structured clinical decision pathways</p>
          </div>
          <Link to="/criteria">
            <button className="text-[10px] font-semibold text-primary flex items-center gap-1 hover:underline flex-shrink-0">
              Open <ArrowRight className="w-3 h-3" />
            </button>
          </Link>
        </div>
        <div className="flex items-center gap-3 bg-card rounded-2xl border border-border p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Radio className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-foreground">AI / Modern Workflow Path</p>
            <p className="text-[11px] text-muted-foreground leading-relaxed">Generative AI, ambient rounds documentation, NLP-powered SOAP notes</p>
          </div>
          <Link to="/rounds">
            <button className="text-[10px] font-semibold text-primary flex items-center gap-1 hover:underline flex-shrink-0">
              Open <ArrowRight className="w-3 h-3" />
            </button>
          </Link>
        </div>
      </div>

      {/* ── Stats ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Cases"  value={stats.total}       icon={FileText}     accent="bg-primary/10 text-primary"       trend="+12% this month" />
        <StatCard title="In Review"    value={stats.inReview}    icon={Clock}        accent="bg-chart-3/10 text-chart-3" />
        <StatCard title="Approved"     value={stats.approved}    icon={CheckCircle}  accent="bg-green-100 text-green-700" />
        <StatCard title="AI Assisted"  value={stats.aiGenerated} icon={Brain}        accent="bg-accent/10 text-accent" />
      </div>

      {/* ── Recent Cases ──────────────────────────────────────────── */}
      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="font-heading font-semibold">Recent Cases</h2>
          <Link to="/cases" className="text-sm text-primary font-medium flex items-center gap-1 hover:underline">
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        {isLoading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : recentCases.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No cases yet. Create your first case review.</p>
            <Link to="/case/new">
              <Button variant="outline" size="sm" className="mt-3 rounded-xl gap-2">
                <Plus className="w-3 h-3" /> New Case
              </Button>
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {recentCases.map((c) => (
              <Link
                key={c.id}
                to={`/case/${c.id}`}
                className="flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{c.patient_name || 'Unknown Patient'}</p>
                  <p className="text-xs text-muted-foreground">MRN: {c.mrn} · {c.primary_dx || 'No Dx'}</p>
                </div>
                <Badge className={`${statusConfig[c.status]?.color || statusConfig.draft.color} border-0 text-[11px]`}>
                  {statusConfig[c.status]?.label || 'Draft'}
                </Badge>
                <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* ── Footer Brand Note ─────────────────────────────────────── */}
      <p className="text-center text-[11px] text-muted-foreground pb-2">
        <strong>EthicaCare 2.0</strong> is a proprietary application of{' '}
        <a href="https://sites.google.com/view/hurotraining/home" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">
          H.U.R.O. (Hospital Utilization Review Optimization)
        </a>
        {' '}· HIPAA · EU AI Act · Healthcare Modernization 2035
      </p>
    </div>
  );
}