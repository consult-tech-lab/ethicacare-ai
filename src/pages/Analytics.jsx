import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Brain, Clock, CheckCircle } from 'lucide-react';

const COLORS = ['hsl(24, 70%, 50%)', 'hsl(210, 55%, 52%)', 'hsl(42, 85%, 55%)', 'hsl(0, 72%, 55%)', 'hsl(16, 60%, 38%)'];

export default function Analytics() {
  const { data: cases = [] } = useQuery({
    queryKey: ['cases'],
    queryFn: () => base44.entities.PatientCase.list('-created_date', 200),
  });

  const statusCounts = [
    { name: 'Draft', value: cases.filter(c => c.status === 'draft').length },
    { name: 'In Review', value: cases.filter(c => c.status === 'in_review').length },
    { name: 'Approved', value: cases.filter(c => c.status === 'approved').length },
    { name: 'Denied', value: cases.filter(c => c.status === 'denied').length },
    { name: 'Pending', value: cases.filter(c => c.status === 'pending_info').length },
  ].filter(s => s.value > 0);

  const aiUsage = [
    { name: 'AI Recommendation', count: cases.filter(c => c.ai_recommendation).length },
    { name: 'SOAP Generated', count: cases.filter(c => c.soap_summary).length },
    { name: 'Nurse Approved', count: cases.filter(c => c.nurse_approved).length },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-heading font-bold">Analytics</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Utilization management insights</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
          <h3 className="font-heading font-semibold mb-4">Case Status Distribution</h3>
          {statusCounts.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={statusCounts} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={4} dataKey="value">
                  {statusCounts.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-sm text-muted-foreground">No data yet</div>
          )}
          <div className="flex flex-wrap gap-3 mt-2 justify-center">
            {statusCounts.map((s, i) => (
              <div key={s.name} className="flex items-center gap-1.5 text-xs">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                {s.name} ({s.value})
              </div>
            ))}
          </div>
        </div>

        {/* AI Usage */}
        <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
          <h3 className="font-heading font-semibold mb-4">AI Feature Usage</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={aiUsage}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(32, 20%, 88%)" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" fill="hsl(24, 70%, 50%)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}