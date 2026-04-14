import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Shield, Users, Loader2 } from 'lucide-react';
import { startOfDay, startOfWeek, startOfMonth, endOfMonth, parseISO, format } from 'date-fns';

const DX_CATEGORIES = ['All Dx', 'Cardiac', 'Pulmonary', 'Renal', 'Neurological', 'Orthopedic', 'Oncology', 'Behavioral Health', 'Surgical', 'GI', 'Infectious Disease', 'Endocrine', 'Other'];
const SERVICES = ['All Services', 'Cardiology', 'Pulmonology', 'Nephrology', 'Neurology', 'Orthopedics', 'Oncology', 'Psychiatry', 'General Surgery', 'Gastroenterology', 'Infectious Disease', 'Internal Medicine', 'Endocrinology'];
const PERIOD_OPTIONS = [
  { value: 'day', label: 'Today' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
];

const outcomeConfig = {
  approved: { label: 'Approved', class: 'bg-green-100 text-green-700 border-green-200' },
  denied: { label: 'Denied', class: 'bg-red-100 text-red-700 border-red-200' },
  pending_info: { label: 'Pending', class: 'bg-amber-100 text-amber-700 border-amber-200' },
};

export default function AdminProductivity() {
  const [period, setPeriod] = useState('month');
  const [selectedUser, setSelectedUser] = useState('All Users');
  const [dxFilter, setDxFilter] = useState('All Dx');
  const [serviceFilter, setServiceFilter] = useState('All Services');
  const [outcomeFilter, setOutcomeFilter] = useState('All Outcomes');
  const [losFilter, setLosFilter] = useState('All LOS');

  const { data: allActivity = [], isLoading } = useQuery({
    queryKey: ['case-activity'],
    queryFn: () => base44.entities.CaseActivity.list('-completed_date', 500),
  });

  const now = new Date();

  const periodFiltered = useMemo(() => {
    return allActivity.filter(r => {
      const d = parseISO(r.completed_date);
      if (period === 'day') return d >= startOfDay(now);
      if (period === 'week') return d >= startOfWeek(now, { weekStartsOn: 1 });
      if (period === 'month') return d >= startOfMonth(now) && d <= endOfMonth(now);
      return true;
    });
  }, [allActivity, period]);

  const userList = useMemo(() => {
    const names = [...new Set(periodFiltered.map(r => r.reviewer_name || r.reviewer_email).filter(Boolean))];
    return ['All Users', ...names.sort()];
  }, [periodFiltered]);

  const filtered = useMemo(() => {
    return periodFiltered.filter(r => {
      if (selectedUser !== 'All Users' && r.reviewer_name !== selectedUser && r.reviewer_email !== selectedUser) return false;
      if (dxFilter !== 'All Dx' && r.dx_category !== dxFilter) return false;
      if (serviceFilter !== 'All Services' && r.medical_service !== serviceFilter) return false;
      if (outcomeFilter !== 'All Outcomes' && r.outcome !== outcomeFilter) return false;
      if (losFilter === '1-3') return r.los_days >= 1 && r.los_days <= 3;
      if (losFilter === '4-7') return r.los_days >= 4 && r.los_days <= 7;
      if (losFilter === '8+') return r.los_days >= 8;
      return true;
    });
  }, [periodFiltered, selectedUser, dxFilter, serviceFilter, outcomeFilter, losFilter]);

  const userSummaries = useMemo(() => {
    const map = {};
    periodFiltered.forEach(r => {
      const key = r.reviewer_name || r.reviewer_email;
      if (!map[key]) map[key] = { name: key, total: 0, approved: 0, denied: 0, losSum: 0, tatSum: 0 };
      map[key].total++;
      if (r.outcome === 'approved') map[key].approved++;
      if (r.outcome === 'denied') map[key].denied++;
      map[key].losSum += r.los_days || 0;
      map[key].tatSum += r.turnaround_hours || 0;
    });
    return Object.values(map).sort((a, b) => b.total - a.total);
  }, [periodFiltered]);

  return (
    <div className="space-y-6">
      {/* Admin Banner */}
      <div className="flex items-center gap-3 bg-primary/5 border border-primary/20 rounded-2xl px-5 py-3">
        <Shield className="w-5 h-5 text-primary flex-shrink-0" />
        <div>
          <p className="text-sm font-semibold text-primary">Admin View — Team Performance</p>
          <p className="text-xs text-muted-foreground">Only visible to administrators. Shows activity across all reviewers.</p>
        </div>
      </div>

      {/* Period Selector */}
      <div className="flex flex-wrap items-center gap-2">
        {PERIOD_OPTIONS.map(p => (
          <button
            key={p.value}
            onClick={() => setPeriod(p.value)}
            className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-all border ${
              period === p.value
                ? 'bg-primary text-primary-foreground border-primary shadow'
                : 'bg-card border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Per-User Summary Cards */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Users className="w-4 h-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold text-foreground">Reviewer Leaderboard</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {userSummaries.map((u, i) => (
            <div
              key={u.name}
              onClick={() => setSelectedUser(selectedUser === u.name ? 'All Users' : u.name)}
              className={`bg-card rounded-2xl border p-4 cursor-pointer transition-all hover:shadow-md ${
                selectedUser === u.name ? 'border-primary ring-1 ring-primary/30' : 'border-border'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-accent/10 text-accent text-sm font-bold flex items-center justify-center">
                    {(u.name || '?')[0].toUpperCase()}
                  </div>
                  <p className="font-semibold text-sm text-foreground truncate max-w-[120px]">{u.name}</p>
                </div>
                {i === 0 && <span className="text-[10px] bg-chart-3/20 text-chart-3 font-bold px-2 py-0.5 rounded-full">Top</span>}
              </div>
              <div className="grid grid-cols-3 gap-2 text-center mt-3">
                <div>
                  <p className="text-lg font-bold text-foreground">{u.total}</p>
                  <p className="text-[10px] text-muted-foreground">Cases</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-green-700">{u.approved}</p>
                  <p className="text-[10px] text-muted-foreground">Approved</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-foreground">{u.total > 0 ? (u.losSum / u.total).toFixed(1) : '—'}</p>
                  <p className="text-[10px] text-muted-foreground">Avg LOS</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 bg-card border border-border rounded-2xl p-4">
        <p className="w-full text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Filters</p>
        <Select value={selectedUser} onValueChange={setSelectedUser}>
          <SelectTrigger className="w-[160px] rounded-xl h-8 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>{userList.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}</SelectContent>
        </Select>
        <Select value={dxFilter} onValueChange={setDxFilter}>
          <SelectTrigger className="w-[160px] rounded-xl h-8 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>{DX_CATEGORIES.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
        </Select>
        <Select value={serviceFilter} onValueChange={setServiceFilter}>
          <SelectTrigger className="w-[160px] rounded-xl h-8 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>{SERVICES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
        </Select>
        <Select value={outcomeFilter} onValueChange={setOutcomeFilter}>
          <SelectTrigger className="w-[140px] rounded-xl h-8 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="All Outcomes">All Outcomes</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="denied">Denied</SelectItem>
            <SelectItem value="pending_info">Pending Info</SelectItem>
          </SelectContent>
        </Select>
        <Select value={losFilter} onValueChange={setLosFilter}>
          <SelectTrigger className="w-[130px] rounded-xl h-8 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="All LOS">All LOS</SelectItem>
            <SelectItem value="1-3">1–3 Days</SelectItem>
            <SelectItem value="4-7">4–7 Days</SelectItem>
            <SelectItem value="8+">8+ Days</SelectItem>
          </SelectContent>
        </Select>
        <span className="ml-auto text-xs text-muted-foreground self-center">{filtered.length} records</span>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16 text-muted-foreground gap-2 text-sm">
          <Loader2 className="w-4 h-4 animate-spin" /> Loading...
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-card rounded-2xl border border-border p-12 text-center text-muted-foreground text-sm">No records found.</div>
      ) : (
        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Reviewer</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Date</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Patient</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Primary Dx</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Service</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">LOS</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">TAT (hrs)</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Outcome</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filtered.map((r, i) => {
                  const outcome = outcomeConfig[r.outcome] || outcomeConfig.pending_info;
                  return (
                    <tr key={r.id || i} className="hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-accent/10 text-accent text-xs font-bold flex items-center justify-center flex-shrink-0">
                            {(r.reviewer_name || r.reviewer_email || '?')[0].toUpperCase()}
                          </div>
                          <span className="font-medium text-foreground text-xs">{r.reviewer_name || r.reviewer_email}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground whitespace-nowrap text-xs">
                        {r.completed_date ? format(parseISO(r.completed_date), 'MMM d') : '—'}
                      </td>
                      <td className="px-4 py-3 font-medium text-foreground text-xs">{r.patient_name || '—'}</td>
                      <td className="px-4 py-3 text-muted-foreground text-xs max-w-[160px] truncate">{r.primary_dx || '—'}</td>
                      <td className="px-4 py-3 text-muted-foreground text-xs">{r.medical_service || '—'}</td>
                      <td className="px-4 py-3">
                        <span className={`font-semibold text-xs ${r.los_days >= 8 ? 'text-red-600' : r.los_days >= 4 ? 'text-amber-600' : 'text-green-700'}`}>
                          {r.los_days != null ? `${r.los_days}d` : '—'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground text-xs">{r.turnaround_hours ?? '—'}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold border ${outcome.class}`}>
                          {outcome.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}