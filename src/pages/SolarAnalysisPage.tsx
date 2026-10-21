import { useState } from 'react';
import {
  SunMedium, MapPin, Building2, Zap, Maximize, Compass, TreePine,
  Banknote, Coins, Calculator, Sparkles, Leaf, PiggyBank, Clock,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { PageHeader, SectionCard, DemoBanner } from '@/components/ui';
import { BUILDING_TYPE_OPTIONS } from '@/data/demoData';
import { computeSolarAnalysis, formatEGP, formatKWh } from '@/utils/solar';
import type { SolarAnalysisResult, BuildingType } from '@/types';

export function SolarAnalysisPage() {
  const [form, setForm] = useState({
    location: 'Cairo, Egypt',
    buildingType: 'University' as BuildingType,
    monthlyConsumptionKWh: 60000,
    rooftopAreaSqm: 3000,
    orientation: 15,
    shading: 'Light' as 'None' | 'Light' | 'Moderate' | 'Heavy',
    electricityPricePerKWh: 1.25,
    installCostPerKW: 39000,
  });
  const [result, setResult] = useState<SolarAnalysisResult | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.location.trim()) e.location = 'Location is required';
    if (form.monthlyConsumptionKWh <= 0) e.monthlyConsumptionKWh = 'Must be > 0';
    if (form.rooftopAreaSqm <= 0) e.rooftopAreaSqm = 'Must be > 0';
    if (form.electricityPricePerKWh <= 0) e.electricityPricePerKWh = 'Must be > 0';
    if (form.installCostPerKW <= 0) e.installCostPerKW = 'Must be > 0';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const analyze = () => {
    if (!validate()) return;
    setResult(computeSolarAnalysis(form));
    setShowResults(true);
    setTimeout(() => {
      document.getElementById('solar-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Solar Analysis Calculator"
        subtitle="Estimate solar capacity, production, savings, and payback for any building using transparent client-side calculations."
        actions={
          <button className="btn-primary" onClick={analyze}>
            <Calculator className="h-4 w-4" /> Run Analysis
          </button>
        }
      />

      <DemoBanner>Results are simplified engineering estimates, not a substitute for a professional PV feasibility study.</DemoBanner>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <SectionCard title="Building & site parameters" className="lg:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Building location" icon={MapPin} error={errors.location} className="sm:col-span-2">
              <input className="input" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="City, Egypt" />
            </Field>
            <Field label="Building type" icon={Building2} className="sm:col-span-2">
              <select className="input" value={form.buildingType} onChange={(e) => setForm({ ...form, buildingType: e.target.value as BuildingType })}>
                {BUILDING_TYPE_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </Field>
            <Field label="Monthly consumption (kWh)" icon={Zap} error={errors.monthlyConsumptionKWh}>
              <input type="number" className="input" value={form.monthlyConsumptionKWh} onChange={(e) => setForm({ ...form, monthlyConsumptionKWh: parseFloat(e.target.value) || 0 })} />
            </Field>
            <Field label="Rooftop area (m²)" icon={Maximize} error={errors.rooftopAreaSqm}>
              <input type="number" className="input" value={form.rooftopAreaSqm} onChange={(e) => setForm({ ...form, rooftopAreaSqm: parseFloat(e.target.value) || 0 })} />
            </Field>
            <Field label="Roof orientation (° from south)" icon={Compass}>
              <input type="number" className="input" value={form.orientation} onChange={(e) => setForm({ ...form, orientation: parseFloat(e.target.value) || 0 })} />
            </Field>
            <Field label="Shading level" icon={TreePine}>
              <select className="input" value={form.shading} onChange={(e) => setForm({ ...form, shading: e.target.value as typeof form.shading })}>
                <option>None</option><option>Light</option><option>Moderate</option><option>Heavy</option>
              </select>
            </Field>
            <Field label="Electricity price (EGP/kWh)" icon={Coins} error={errors.electricityPricePerKWh}>
              <input type="number" step="0.01" className="input" value={form.electricityPricePerKWh} onChange={(e) => setForm({ ...form, electricityPricePerKWh: parseFloat(e.target.value) || 0 })} />
            </Field>
            <Field label="Install cost (EGP/kW)" icon={Banknote} error={errors.installCostPerKW}>
              <input type="number" className="input" value={form.installCostPerKW} onChange={(e) => setForm({ ...form, installCostPerKW: parseFloat(e.target.value) || 0 })} />
            </Field>
          </div>
        </SectionCard>

        <div className="lg:col-span-3 space-y-4" id="solar-results">
          {!showResults || !result ? (
            <SectionCard>
              <div className="py-16 text-center">
                <div className="mx-auto h-14 w-14 rounded-2xl bg-forest-100 flex items-center justify-center text-forest-600">
                  <Sparkles className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-base font-bold text-navy-900">Ready to analyze</h3>
                <p className="mt-1 text-sm text-navy-500 max-w-sm mx-auto">Fill in your building parameters and run the analysis to see estimated solar potential, savings, and payback.</p>
              </div>
            </SectionCard>
          ) : (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                <ResultStat icon={SunMedium} label="Suitable capacity" value={`${result.suitableCapacityKW}`} unit="kW" accent="forest" />
                <ResultStat icon={Zap} label="Annual production" value={formatKWh(result.annualProductionKWh)} accent="navy" />
                <ResultStat icon={PiggyBank} label="Bill savings / yr" value={formatEGP(result.annualBillSavingsEGP)} accent="emerald" />
                <ResultStat icon={Leaf} label="CO₂ avoided / yr" value={`${result.co2AvoidedTons}`} unit="tons" accent="forest" />
                <ResultStat icon={Clock} label="Payback period" value={`${result.paybackYears}`} unit="years" accent="amber" />
                <ResultStat icon={Coins} label="Install cost" value={formatEGP(result.suitableCapacityKW * form.installCostPerKW)} accent="navy" />
              </div>

              <SectionCard title="Monthly solar generation" subtitle="Estimated kWh per month (demo model)">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={result.monthly} margin={{ top: 8, right: 8, bottom: 0, left: -10 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e3eaf2" vertical={false} />
                      <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6e8db4' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 12, fill: '#6e8db4' }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #dbf0e6', fontSize: 12 }} formatter={(v) => `${Number(v).toLocaleString()} kWh`} />
                      <Bar dataKey="generation" name="Generation" fill="#2f8e6e" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </SectionCard>

              <SectionCard title="Assumptions & methodology" subtitle="Transparent client-side model">
                <ul className="space-y-2 text-sm text-navy-700">
                  {result.assumptions.map((a, i) => (
                    <li key={i} className="flex gap-2.5">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-forest-500" />
                      <span>{a}</span>
                    </li>
                  ))}
                </ul>
              </SectionCard>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, icon: Icon, error, children, className = '' }: { label: string; icon: typeof MapPin; error?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <label className="label flex items-center gap-1.5"><Icon className="h-3.5 w-3.5 text-navy-400" /> {label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-rose-600">{error}</p>}
    </div>
  );
}

function ResultStat({ icon: Icon, label, value, unit, accent }: { icon: typeof Zap; label: string; value: string; unit?: string; accent: 'forest' | 'emerald' | 'navy' | 'amber' }) {
  const colors = {
    forest: 'bg-forest-100 text-forest-700',
    emerald: 'bg-emerald-100 text-emerald-700',
    navy: 'bg-navy-100 text-navy-700',
    amber: 'bg-amber-100 text-amber-700',
  };
  return (
    <div className="card p-4">
      <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${colors[accent]}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="mt-3 text-xl font-bold text-navy-900">
        {value}
        {unit && <span className="text-sm font-medium text-navy-500 ml-1">{unit}</span>}
      </div>
      <div className="text-xs text-navy-500 mt-0.5">{label}</div>
    </div>
  );
}
