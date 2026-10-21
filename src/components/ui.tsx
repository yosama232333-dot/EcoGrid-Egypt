import type { LucideIcon } from 'lucide-react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import type { ReactNode } from 'react';

interface StatCardProps {
  label: string;
  value: string;
  unit?: string;
  icon: LucideIcon;
  trend?: { value: string; direction: 'up' | 'down'; positive?: boolean };
  accent?: 'forest' | 'emerald' | 'navy' | 'amber' | 'rose';
  hint?: string;
}

const ACCENT: Record<NonNullable<StatCardProps['accent']>, { bg: string; text: string; ring: string }> = {
  forest: { bg: 'bg-forest-100', text: 'text-forest-700', ring: 'ring-forest-200' },
  emerald: { bg: 'bg-emerald-100', text: 'text-emerald-700', ring: 'ring-emerald-200' },
  navy: { bg: 'bg-navy-100', text: 'text-navy-700', ring: 'ring-navy-200' },
  amber: { bg: 'bg-amber-100', text: 'text-amber-700', ring: 'ring-amber-200' },
  rose: { bg: 'bg-rose-100', text: 'text-rose-700', ring: 'ring-rose-200' },
};

export function StatCard({ label, value, unit, icon: Icon, trend, accent = 'forest', hint }: StatCardProps) {
  const a = ACCENT[accent];
  const positive = trend?.positive ?? trend?.direction === 'up';
  return (
    <div className="card card-hover p-5">
      <div className="flex items-start justify-between gap-3">
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${a.bg} ${a.text} ring-1 ${a.ring}`}>
          <Icon className="h-5 w-5" />
        </div>
        {trend && (
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
              positive ? 'bg-forest-100 text-forest-700' : 'bg-rose-100 text-rose-700'
            }`}
          >
            {trend.direction === 'up' ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {trend.value}
          </span>
        )}
      </div>
      <div className="mt-4">
        <div className="text-2xl font-bold text-navy-900 tracking-tight">
          {value}
          {unit && <span className="text-base font-medium text-navy-500 ml-1">{unit}</span>}
        </div>
        <div className="text-sm text-navy-500 mt-1">{label}</div>
        {hint && <div className="text-xs text-navy-400 mt-2">{hint}</div>}
      </div>
    </div>
  );
}

export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-900 tracking-tight">{title}</h1>
        {subtitle && <p className="text-sm text-navy-500 mt-1 max-w-2xl">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

export function SectionCard({ title, subtitle, actions, children, className = '' }: { title?: string; subtitle?: string; actions?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <div className={`card ${className}`}>
      {(title || actions) && (
        <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-navy-100">
          <div>
            {title && <h3 className="font-bold text-navy-900">{title}</h3>}
            {subtitle && <p className="text-xs text-navy-500 mt-0.5">{subtitle}</p>}
          </div>
          {actions}
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  );
}

export function DemoBanner({ children }: { children?: ReactNode }) {
  return (
    <div className="flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800">
      <span className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-amber-400 text-white font-bold text-[10px]">!</span>
      <div>
        <span className="font-semibold">Demonstration data.</span>{' '}
        {children ?? 'All values shown are illustrative demo data, not verified real-world measurements.'}
      </div>
    </div>
  );
}
