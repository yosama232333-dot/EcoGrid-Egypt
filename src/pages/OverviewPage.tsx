import { useNavigate } from 'react-router-dom';
import {
  Zap,
  SunMedium,
  PiggyBank,
  Leaf,
  Building2,
  Gauge,
  Plus,
  PlayCircle,
  ArrowRight,
  Activity as ActivityIcon,
  TrendingUp,
  BatteryCharging,
  CalendarDays,
  Bolt,
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';
import { StatCard, PageHeader, SectionCard, DemoBanner } from '@/components/ui';
import { useBuildings } from '@/store/buildings';
import {
  MONTHLY_ENERGY, ENERGY_TREND, RECENT_ACTIVITY,
  MONTHLY_IRRADIANCE_PROFILE, generateWeeklyForecast,
} from '@/data/demoData';
import { tierFromScore, DEMO_BADGE } from '@/data/demoData';
import { formatKWh, formatEGP } from '@/utils/solar';

const KWP_PER_SQM = 0.18;
const SYSTEM_EFFICIENCY = 0.78;
const ANNUAL_PEAK_SUN_HOURS = 2100;

const SUITABILITY_COLORS: Record<string, string> = {
  Excellent: '#1f7258',
  Good: '#10b981',
  Moderate: '#f59e0b',
  Limited: '#f43f5e',
};

// Custom tooltip for the weekly forecast chart
function DayTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-forest-200 bg-white shadow-lg px-4 py-3 text-xs">
      <p className="font-bold text-navy-900 mb-1">{label}</p>
      <p className="text-forest-700 font-semibold">{payload[0].value.toLocaleString()} kWh</p>
      <p className="text-navy-400 mt-0.5">Expected production</p>
    </div>
  );
}

export function OverviewPage() {
  const navigate = useNavigate();
  const { buildings } = useBuildings();

  // ── Aggregate metrics ──────────────────────────────────────────────────────
  const totalConsumption = buildings.reduce((s, b) => s + b.monthlyConsumptionKWh, 0);
  const totalSavings = buildings.reduce((s, b) => s + b.estimatedAnnualSavingsEGP, 0);
  const totalRooftop = buildings.reduce((s, b) => s + b.rooftopAreaSqm, 0);

  // Total installed panel capacity (kWp) across all buildings
  const totalPanelCapacityKW = Math.round(totalRooftop * 0.85 * KWP_PER_SQM * 10) / 10;

  // Annual and daily production estimates
  const estimatedSolarGeneration = Math.round(
    totalPanelCapacityKW * ANNUAL_PEAK_SUN_HOURS * SYSTEM_EFFICIENCY
  );
  const co2Avoided = Math.round((estimatedSolarGeneration * 0.48) / 1000);

  // Today's expected production based on current month irradiance factor
  const todayMonthIdx = new Date().getMonth(); // 0-based
  const todayIrradiance = MONTHLY_IRRADIANCE_PROFILE[todayMonthIdx];
  const todayProductionKWh = Math.round((estimatedSolarGeneration / 365) * todayIrradiance);

  // 7-day weekly forecast
  const weeklyForecast = generateWeeklyForecast(estimatedSolarGeneration);

  const distribution = (['Excellent', 'Good', 'Moderate', 'Limited'] as const).map((tier) => ({
    name: tier,
    value: buildings.filter((b) => tierFromScore(b.solarSuitabilityScore) === tier).length,
  }));

  const ranked = [...buildings]
    .sort((a, b) => b.solarSuitabilityScore - a.solarSuitabilityScore)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sustainability Overview"
        subtitle="Real-time snapshot of energy consumption, solar potential, and carbon impact across your portfolio."
        actions={
          <>
            <button className="btn-secondary" onClick={() => navigate('/buildings')}>
              <Plus className="h-4 w-4" /> Add Building
            </button>
            <button className="btn-primary" onClick={() => navigate('/solar-analysis')}>
              <PlayCircle className="h-4 w-4" /> Start Analysis
            </button>
          </>
        }
      />

      <DemoBanner />

      {/* ── Main KPI cards ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        <StatCard
          label="Total monthly electricity consumption"
          value={formatKWh(totalConsumption)}
          icon={Zap}
          accent="navy"
          trend={{ value: '4.2%', direction: 'up', positive: false }}
          hint="Across all analyzed buildings"
        />
        <StatCard
          label="Estimated annual solar generation"
          value={formatKWh(estimatedSolarGeneration)}
          icon={SunMedium}
          accent="forest"
          trend={{ value: '12.6%', direction: 'up' }}
          hint="Based on rooftop potential"
        />
        <StatCard
          label="Potential annual cost savings"
          value={formatEGP(totalSavings)}
          icon={PiggyBank}
          accent="emerald"
          trend={{ value: '8.1%', direction: 'up' }}
          hint="At current electricity tariffs"
        />
        <StatCard
          label="Estimated CO₂ emissions avoided"
          value={`${co2Avoided.toLocaleString()}`}
          unit="tons/yr"
          icon={Leaf}
          accent="forest"
          trend={{ value: '9.4%', direction: 'up' }}
          hint="0.48 kg CO₂ / kWh grid factor"
        />
        <StatCard
          label="Buildings analyzed"
          value={`${buildings.length}`}
          icon={Building2}
          accent="navy"
          hint={`${buildings.filter((b) => tierFromScore(b.solarSuitabilityScore) === 'Excellent').length} excellent suitability`}
        />
        <StatCard
          label="Average solar suitability"
          value={`${Math.round(buildings.reduce((s, b) => s + b.solarSuitabilityScore, 0) / buildings.length)}`}
          unit="/100"
          icon={Gauge}
          accent="emerald"
          trend={{ value: '3 pts', direction: 'up' }}
          hint="Portfolio weighted score"
        />
      </div>

      {/* ── NEW: Solar Live Metrics row ────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Panel Capacity Card */}
        <div className="card card-hover p-5 relative overflow-hidden">
          {/* decorative glow */}
          <div className="absolute -top-6 -right-6 h-24 w-24 rounded-full bg-amber-400/10 blur-2xl pointer-events-none" />
          <div className="flex items-start justify-between gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-amber-700 ring-1 ring-amber-200">
              <BatteryCharging className="h-5 w-5" />
            </div>
            <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold bg-amber-100 text-amber-700">
              Live
            </span>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold text-navy-900 tracking-tight">
              {totalPanelCapacityKW.toLocaleString()}
              <span className="text-base font-medium text-navy-500 ml-1">kWp</span>
            </div>
            <div className="text-sm text-navy-500 mt-1">Total installed panel capacity</div>
            <div className="mt-3 h-2 w-full rounded-full bg-amber-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-600 transition-all duration-700"
                style={{ width: '100%' }}
              />
            </div>
            <div className="text-xs text-navy-400 mt-2">
              {Math.round(totalRooftop * 0.85).toLocaleString()} m² usable rooftop · {KWP_PER_SQM * 1000} W/m²
            </div>
          </div>
        </div>

        {/* Today's Production Card */}
        <div className="card card-hover p-5 relative overflow-hidden">
          <div className="absolute -top-6 -right-6 h-24 w-24 rounded-full bg-forest-400/10 blur-2xl pointer-events-none" />
          <div className="flex items-start justify-between gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-forest-100 text-forest-700 ring-1 ring-forest-200">
              <SunMedium className="h-5 w-5" />
            </div>
            <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold bg-forest-100 text-forest-700">
              Today
            </span>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold text-navy-900 tracking-tight">
              {todayProductionKWh.toLocaleString()}
              <span className="text-base font-medium text-navy-500 ml-1">kWh</span>
            </div>
            <div className="text-sm text-navy-500 mt-1">Expected solar production today</div>
            {/* progress vs annual daily average */}
            <div className="mt-3 h-2 w-full rounded-full bg-forest-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-forest-400 to-forest-600 transition-all duration-700"
                style={{ width: `${Math.round(todayIrradiance * 88)}%` }}
              />
            </div>
            <div className="text-xs text-navy-400 mt-2">
              {new Date().toLocaleDateString('en-EG', { weekday: 'long', day: 'numeric', month: 'long' })}
              {' · '}irradiance ×{todayIrradiance.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Daily Avg Card */}
        <div className="card card-hover p-5 relative overflow-hidden">
          <div className="absolute -top-6 -right-6 h-24 w-24 rounded-full bg-navy-400/10 blur-2xl pointer-events-none" />
          <div className="flex items-start justify-between gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-100 text-navy-700 ring-1 ring-navy-200">
              <Bolt className="h-5 w-5" />
            </div>
            <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold bg-navy-100 text-navy-700">
              Avg/day
            </span>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold text-navy-900 tracking-tight">
              {Math.round(estimatedSolarGeneration / 365).toLocaleString()}
              <span className="text-base font-medium text-navy-500 ml-1">kWh</span>
            </div>
            <div className="text-sm text-navy-500 mt-1">Annual daily average production</div>
            <div className="mt-3 h-2 w-full rounded-full bg-navy-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-navy-400 to-navy-600 transition-all duration-700"
                style={{ width: '72%' }}
              />
            </div>
            <div className="text-xs text-navy-400 mt-2">
              Based on {ANNUAL_PEAK_SUN_HOURS.toLocaleString()} peak-sun hours/yr · Egypt average
            </div>
          </div>
        </div>
      </div>

      {/* ── NEW: 7-Day Solar Forecast Chart ───────────────────────────────── */}
      <SectionCard
        title="7-Day Solar Production Forecast"
        subtitle={`Expected daily output (kWh) · week of ${weeklyForecast[0].date} – ${weeklyForecast[6].date}`}
        actions={<CalendarDays className="h-4 w-4 text-navy-400" />}
      >
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyForecast} margin={{ top: 8, right: 8, bottom: 0, left: -10 }}>
              <defs>
                <linearGradient id="barToday" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2f8e6e" stopOpacity={1} />
                  <stop offset="100%" stopColor="#1f7258" stopOpacity={0.85} />
                </linearGradient>
                <linearGradient id="barFuture" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#9fb5cf" stopOpacity={0.85} />
                  <stop offset="100%" stopColor="#6e8db4" stopOpacity={0.6} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e3eaf2" vertical={false} />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 12, fill: '#6e8db4' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(val, idx) =>
                  weeklyForecast[idx]?.isToday ? `${val} ★` : val
                }
              />
              <YAxis
                tick={{ fontSize: 12, fill: '#6e8db4' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`}
              />
              <Tooltip content={<DayTooltip />} />
              <Bar dataKey="expectedKWh" name="Expected kWh" radius={[6, 6, 0, 0]}>
                {weeklyForecast.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.isToday ? 'url(#barToday)' : 'url(#barFuture)'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        {/* Legend */}
        <div className="mt-3 flex items-center gap-5 text-xs text-navy-500">
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-sm bg-forest-600 inline-block" />
            Today's production
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-sm bg-navy-300 inline-block" />
            Forecast (upcoming days)
          </span>
          <span className="ml-auto text-navy-400">
            ★ = today · values are deterministic estimates based on monthly irradiance
          </span>
        </div>
      </SectionCard>

      {/* ── Monthly consumption vs solar chart + Pie ──────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <SectionCard
          title="Monthly consumption vs. solar production"
          subtitle="Demo data · kWh per month"
          className="lg:col-span-2"
        >
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MONTHLY_ENERGY} margin={{ top: 8, right: 8, bottom: 0, left: -10 }}>
                <defs>
                  <linearGradient id="gCons" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#324964" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#324964" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gSolar" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2f8e6e" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#2f8e6e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e3eaf2" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6e8db4' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#6e8db4' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: '1px solid #dbf0e6', fontSize: 12 }}
                  formatter={(v) => `${Number(v).toLocaleString()} kWh`}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Area type="monotone" dataKey="consumption" name="Consumption" stroke="#324964" strokeWidth={2} fill="url(#gCons)" />
                <Area type="monotone" dataKey="solarProduction" name="Solar Production" stroke="#2f8e6e" strokeWidth={2} fill="url(#gSolar)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard title="Solar suitability distribution" subtitle="Buildings by tier">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distribution}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={3}
                  strokeWidth={2}
                >
                  {distribution.map((entry) => (
                    <Cell key={entry.name} fill={SUITABILITY_COLORS[entry.name]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #dbf0e6', fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      </div>

      {/* ── Energy trend + Ranking ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <SectionCard
          title="Energy consumption trend"
          subtitle="Consumption, solar coverage & grid draw · demo data"
          className="lg:col-span-2"
        >
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ENERGY_TREND} margin={{ top: 8, right: 8, bottom: 0, left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e3eaf2" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6e8db4' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#6e8db4' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #dbf0e6', fontSize: 12 }} formatter={(v) => `${Number(v).toLocaleString()} kWh`} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="solar" name="Solar" stackId="a" fill="#2f8e6e" radius={[0, 0, 0, 0]} />
                <Bar dataKey="grid" name="Grid" stackId="a" fill="#9fb5cf" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard title="Building performance ranking" subtitle="Top 5 by suitability">
          <ul className="space-y-3">
            {ranked.map((b, i) => {
              const tier = tierFromScore(b.solarSuitabilityScore);
              return (
                <li key={b.id} className="flex items-center gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-navy-100 text-xs font-bold text-navy-700">
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold text-navy-900 truncate">{b.name}</div>
                    <div className="text-xs text-navy-500">{b.type} · {b.city}</div>
                  </div>
                  <span className={`badge ${DEMO_BADGE[tier].classes}`}>{b.solarSuitabilityScore}</span>
                </li>
              );
            })}
          </ul>
        </SectionCard>
      </div>

      {/* ── Recent activity + Quick actions ───────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <SectionCard
          title="Recent analysis activity"
          subtitle="Latest events across your portfolio"
          className="lg:col-span-2"
          actions={<TrendingUp className="h-4 w-4 text-navy-400" />}
        >
          <ul className="divide-y divide-navy-100">
            {RECENT_ACTIVITY.map((a) => (
              <li key={a.id} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-forest-100 text-forest-700">
                  <ActivityIcon className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold text-navy-900">{a.title}</div>
                  <div className="text-xs text-navy-500 truncate">{a.detail}</div>
                </div>
                <span className="text-xs text-navy-400 shrink-0">{a.timestamp}</span>
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard title="Quick actions">
          <div className="space-y-3">
            <QuickAction
              icon={Plus}
              title="Add a building"
              detail="Register a new building for analysis"
              onClick={() => navigate('/buildings')}
            />
            <QuickAction
              icon={PlayCircle}
              title="Run solar analysis"
              detail="Estimate production & payback"
              onClick={() => navigate('/solar-analysis')}
            />
            <QuickAction
              icon={Leaf}
              title="Ask the AI agent"
              detail="Get a prioritized sustainability plan"
              onClick={() => navigate('/agent')}
            />
            <QuickAction
              icon={ArrowRight}
              title="Export a report"
              detail="Generate a printable summary"
              onClick={() => navigate('/reports')}
            />
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

function QuickAction({ icon: Icon, title, detail, onClick }: { icon: typeof Plus; title: string; detail: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group flex w-full items-center gap-3 rounded-xl border border-navy-100 p-3 text-left hover:border-forest-300 hover:bg-forest-50/40 transition-all"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-forest-100 text-forest-700 group-hover:bg-forest-600 group-hover:text-white transition-colors">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-semibold text-navy-900">{title}</div>
        <div className="text-xs text-navy-500">{detail}</div>
      </div>
      <ArrowRight className="h-4 w-4 text-navy-300 group-hover:text-forest-600 group-hover:translate-x-0.5 transition-all" />
    </button>
  );
}
