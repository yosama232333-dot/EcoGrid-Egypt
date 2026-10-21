import { useMemo, useState } from 'react';
import {
  FileBarChart, Printer, Building2, Calendar, Leaf, Zap, SunMedium, PiggyBank,
  TrendingUp, Gauge, ChevronDown, Maximize,
} from 'lucide-react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { PageHeader, DemoBanner } from '@/components/ui';
import { useBuildings } from '@/store/buildings';
import { MONTHLY_ENERGY } from '@/data/demoData';
import { tierFromScore, DEMO_BADGE } from '@/data/demoData';
import { formatEGP, formatKWh } from '@/utils/solar';

export function ReportsPage() {
  const { buildings } = useBuildings();
  const [selectedId, setSelectedId] = useState(buildings[0]?.id ?? '');

  const building = buildings.find((b) => b.id === selectedId) ?? buildings[0];
  const tier = building ? tierFromScore(building.solarSuitabilityScore) : 'Good';

  const reportData = useMemo(() => {
    const annualConsumption = building ? building.monthlyConsumptionKWh * 12 : 0;
    const annualSolar = Math.round((building?.rooftopAreaSqm ?? 0) * 0.85 * 0.18 * 2100 * 0.78);
    const selfSufficiency = annualConsumption > 0 ? Math.min(100, Math.round((annualSolar / annualConsumption) * 100)) : 0;
    return { annualConsumption, annualSolar, selfSufficiency };
  }, [building]);

  const handlePrint = () => window.print();

  return (
    <div className="space-y-6">
      <div className="no-print">
        <PageHeader
          title="Sustainability Reports"
          subtitle="Generate polished, presentation-ready reports per building. Print to PDF from the browser print dialog."
          actions={
            <>
              <div className="relative">
                <select className="input pr-9 appearance-none" value={selectedId} onChange={(e) => setSelectedId(e.target.value)}>
                  {buildings.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-navy-400 pointer-events-none" />
              </div>
              <button className="btn-primary" onClick={handlePrint}><Printer className="h-4 w-4" /> Print / Export PDF</button>
            </>
          }
        />
        <DemoBanner>Report figures are derived from demo data and the client-side solar model. For academic use only.</DemoBanner>
      </div>

      <div className="card print-area p-8 space-y-8">
        {/* Report header */}
        <div className="flex items-start justify-between gap-6 pb-6 border-b-2 border-forest-600">
          <div>
            <div className="flex items-center gap-2 text-forest-700 font-bold text-sm">
              <Leaf className="h-4 w-4" /> EcoGrid Egypt · Sustainability Intelligence Report
            </div>
            <h2 className="mt-3 text-3xl font-bold text-navy-900 tracking-tight">{building?.name}</h2>
            <p className="text-sm text-navy-500 mt-1">{building?.type} · {building?.city}, {building?.governorate}</p>
          </div>
          <div className="text-right text-xs text-navy-500 shrink-0">
            <div className="flex items-center gap-1.5 justify-end"><Calendar className="h-3.5 w-3.5" /> {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
            <div className="mt-1">Report ID: EG-{building?.id.toUpperCase()}</div>
            <div className="mt-1 text-forest-600 font-semibold">DEMO · Illustrative</div>
          </div>
        </div>

        {/* Executive summary */}
        <section>
          <h3 className="text-lg font-bold text-navy-900 mb-3">Executive summary</h3>
          <p className="text-sm text-navy-700 leading-relaxed">
            This report evaluates the solar energy potential, expected cost savings, and carbon reduction impact for
            <span className="font-semibold"> {building?.name}</span>. Based on the client-side sustainability model
            using Egypt's average irradiance and the building's rooftop area, orientation, and shading profile, the
            site is rated <span className={`badge ${DEMO_BADGE[tier].classes}`}>{tier}</span> for solar suitability.
            Estimated annual solar production could cover approximately
            <span className="font-semibold text-forest-700"> {reportData.selfSufficiency}%</span> of the building's
            annual electricity consumption.
          </p>
        </section>

        {/* Key metrics */}
        <section>
          <h3 className="text-lg font-bold text-navy-900 mb-3">Key performance indicators</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <ReportStat icon={Zap} label="Annual consumption" value={formatKWh(reportData.annualConsumption)} />
            <ReportStat icon={SunMedium} label="Est. annual solar" value={formatKWh(reportData.annualSolar)} accent="forest" />
            <ReportStat icon={PiggyBank} label="Est. annual savings" value={formatEGP(building?.estimatedAnnualSavingsEGP ?? 0)} accent="emerald" />
            <ReportStat icon={Leaf} label="CO₂ avoided" value={`${Math.round((reportData.annualSolar * 0.48) / 1000)} t/yr`} accent="forest" />
            <ReportStat icon={Gauge} label="Suitability score" value={`${building?.solarSuitabilityScore}/100`} accent="navy" />
            <ReportStat icon={Maximize} label="Rooftop area" value={`${building?.rooftopAreaSqm.toLocaleString()} m²`} />
            <ReportStat icon={TrendingUp} label="Self-sufficiency" value={`${reportData.selfSufficiency}%`} accent="emerald" />
            <ReportStat icon={Building2} label="Building type" value={building?.type ?? ''} />
          </div>
        </section>

        {/* Charts */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-bold text-navy-900 mb-3">Monthly consumption vs. solar production</h4>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={MONTHLY_ENERGY} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e3eaf2" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6e8db4' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#6e8db4' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #dbf0e6', fontSize: 12 }} formatter={(v) => `${Number(v).toLocaleString()} kWh`} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="consumption" name="Consumption" fill="#324964" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="solarProduction" name="Solar" fill="#2f8e6e" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-bold text-navy-900 mb-3">Energy trend (12 months)</h4>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={MONTHLY_ENERGY} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e3eaf2" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6e8db4' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#6e8db4' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #dbf0e6', fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Line type="monotone" dataKey="consumption" name="Consumption" stroke="#324964" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="solarProduction" name="Solar" stroke="#2f8e6e" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* Recommendations */}
        <section>
          <h3 className="text-lg font-bold text-navy-900 mb-3">Recommendations</h3>
          <ol className="space-y-3">
            <Recommendation n={1} title="Prioritize rooftop solar installation" detail={`${building?.name} has a suitability score of ${building?.solarSuitabilityScore}/100. Estimated payback is achievable within 5–7 years at current tariffs.`} />
            <Recommendation n={2} title="Implement LED retrofit & HVAC scheduling" detail="Lighting and cooling optimization can reduce baseline consumption by 8–12% before solar is deployed." />
            <Recommendation n={3} title="Add sub-metering for continuous monitoring" detail="Granular energy monitoring enables ongoing efficiency gains and validates solar performance over time." />
            <Recommendation n={4} title="Apply for Egypt's net-metering program" detail="Exporting surplus solar to the grid improves project economics and reduces effective payback period." />
          </ol>
        </section>

        {/* Footer */}
        <div className="pt-6 border-t border-navy-100 text-xs text-navy-400 flex items-center justify-between">
          <span className="flex items-center gap-1.5"><FileBarChart className="h-3.5 w-3.5" /> EcoGrid Egypt · Sustainability Intelligence Platform</span>
          <span>Generated {new Date().toLocaleString('en-GB')} · DEMO data</span>
        </div>
      </div>
    </div>
  );
}

function ReportStat({ icon: Icon, label, value, accent = 'navy' }: { icon: typeof Zap; label: string; value: string; accent?: 'navy' | 'forest' | 'emerald' }) {
  const colors = {
    navy: 'border-navy-200',
    forest: 'border-forest-200 bg-forest-50/40',
    emerald: 'border-emerald-200 bg-emerald-50/40',
  };
  return (
    <div className={`rounded-xl border p-3 ${colors[accent]}`}>
      <div className="flex items-center gap-1.5 text-[11px] text-navy-500"><Icon className="h-3.5 w-3.5" /> {label}</div>
      <div className="text-base font-bold text-navy-900 mt-1">{value}</div>
    </div>
  );
}

function Recommendation({ n, title, detail }: { n: number; title: string; detail: string }) {
  return (
    <li className="flex gap-3">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-forest-600 text-white text-xs font-bold">{n}</span>
      <div>
        <div className="text-sm font-semibold text-navy-900">{title}</div>
        <p className="text-xs text-navy-600 mt-0.5">{detail}</p>
      </div>
    </li>
  );
}
