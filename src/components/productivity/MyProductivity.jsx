import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { startOfDay, startOfWeek, startOfMonth, endOfMonth, isWithinInterval, parseISO, format } from 'date-fns';
import ProductivityStatCards from './ProductivityStatCards';
import CaseActivityTable from './CaseActivityTable';

const PERIOD_OPTIONS = [
  { value: 'day', label: 'Today' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
];

const DX_CATEGORIES = ['All Dx', 'Cardiac', 'Pulmonary', 'Renal', 'Neurological', 'Orthopedic', 'Oncology', 'Behavioral Health', 'Surgical', 'GI', 'Infectious Disease', 'Endocrine', 'Other'];
const SERVICES = ['All Services', 'Cardiology', 'Pulmonology', 'Nephrology', 'Neurology', 'Orthopedics', 'Oncology', 'Psychiatry', 'General Surgery', 'Gastroenterology', 'Infectious Disease', 'Internal Medicine', 'Endocrinology'];

export default function MyProductivity({ userEmail }) {
  const [period, setPeriod] = useState('month');
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
    const userRecords = allActivity.filter(r => r.reviewer_email === userEmail);
    return userRecords.filter(r => {
      const d = parseISO(r.completed_date);
      if (period === 'day') return d >= startOfDay(now);
      if (period === 'week') return d >= startOfWeek(now, { weekStartsOn: 1 });
      if (period === 'month') return d >= startOfMonth(now) && d <= endOfMonth(now);
      return true;
    });
  }, [allActivity, userEmail, period]);

  const filtered = useMemo(() => {
    return periodFiltered.filter(r => {
      if (dxFilter !== 'All Dx' && r.dx_category !== dxFilter) return false;
      if (serviceFilter !== 'All Services' && r.medical_service !== serviceFilter) return false;
      if (outcomeFilter !== 'All Outcomes' && r.outcome !== outcomeFilter) return false;
      if (losFilter === '1-3') return r.los_days >= 1 && r.los_days <= 3;
      if (losFilter === '4-7') return r.los_days >= 4 && r.los_days <= 7;
      if (losFilter === '8+') return r.los_days >= 8;
      return true;
    });
  }, [periodFiltered, dxFilter, serviceFilter, outcomeFilter, losFilter]);

  return (
    <div className="space-y-6">
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
        <span className="ml-auto text-xs text-muted-foreground">{filtered.length} cases shown</span>
      </div>

      {/* Stat Cards */}
      <ProductivityStatCards records={filtered} />

      {/* Filters Row */}
      <div className="flex flex-wrap gap-3 bg-card border border-border rounded-2xl p-4">
        <p className="w-full text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Filters</p>
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
          <SelectTrigger className="w-[130px] rounded-xl h-8 text-xs"><SelectValue placeholder="LOS Range" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="All LOS">All LOS</SelectItem>
            <SelectItem value="1-3">1–3 Days</SelectItem>
            <SelectItem value="4-7">4–7 Days</SelectItem>
            <SelectItem value="8+">8+ Days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <CaseActivityTable records={filtered} isLoading={isLoading} />
    </div>
  );
}