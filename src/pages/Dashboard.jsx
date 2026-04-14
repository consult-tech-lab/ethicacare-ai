import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { 
  Plus, FileText, Clock, CheckCircle, AlertCircle, 
  ArrowRight, TrendingUp, Users, Brain
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
  draft: { label: 'Draft', color: 'bg-muted text-muted-foreground' },
  in_review: { label: 'In Review', color: 'bg-chart-3/10 text-chart-3' },
  approved: { label: 'Approved', color: 'bg-green-100 text-green-700' },
  denied: { label: 'Denied', color: 'bg-destructive/10 text-destructive' },
  pending_info: { label: 'Pending Info', color: 'bg-primary/10 text-primary' },
};

export default function Dashboard() {
  const { data: cases = [], isLoading } = useQuery({
    queryKey: ['cases'],
    queryFn: () => base44.entities.PatientCase.list('-created_date', 50),
  });

  const stats = {
    total: cases.length,
    inReview: cases.filter(c => c.status === 'in_review').length,
    approved: cases.filter(c => c.status === 'approved').length,
    aiGenerated: cases.filter(c => c.ai_recommendation).length,
  };

  const recentCases = cases.slice(0, 6);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Utilization Management Overview</p>
        </div>
        <Link to="/case/new">
          <Button className="gap-2 rounded-xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
            <Plus className="w-4 h-4" />
            New Case Review
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Cases" value={stats.total} icon={FileText} accent="bg-primary/10 text-primary" trend="+12% this month" />
        <StatCard title="In Review" value={stats.inReview} icon={Clock} accent="bg-chart-3/10 text-chart-3" />
        <StatCard title="Approved" value={stats.approved} icon={CheckCircle} accent="bg-green-100 text-green-700" />
        <StatCard title="AI Assisted" value={stats.aiGenerated} icon={Brain} accent="bg-accent/10 text-accent" />
      </div>

      {/* Recent Cases */}
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
    </div>
  );
}