import { useState } from 'react';
import { User, SlidersHorizontal, Ruler, Palette, Info, Check } from 'lucide-react';
import { PageHeader, SectionCard, DemoBanner } from '@/components/ui';
import { DEMO_USER } from '@/data/demoData';

export function SettingsPage() {
  const [units, setUnits] = useState<'metric' | 'imperial'>('metric');
  const [currency, setCurrency] = useState<'EGP' | 'USD'>('EGP');
  const [density, setDensity] = useState<'comfortable' | 'compact'>('comfortable');
  const [animations, setAnimations] = useState(true);
  const [theme, setTheme] = useState<'forest' | 'navy'>('forest');
  const [saved, setSaved] = useState(false);

  const save = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" subtitle="Manage your demo profile and interface preferences. Changes apply to the current session only." />

      <DemoBanner>No real authentication is configured. These preferences are stored in the browser session only.</DemoBanner>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SectionCard title="Demo profile" subtitle="Your demonstration account">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-forest-500 to-navy-700 text-white text-xl font-bold">
              {DEMO_USER.initials}
            </div>
            <div>
              <div className="font-bold text-navy-900">{DEMO_USER.name}</div>
              <div className="text-sm text-navy-500">{DEMO_USER.role}</div>
              <div className="text-xs text-navy-400 mt-0.5">{DEMO_USER.email}</div>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Full name"><input className="input" defaultValue={DEMO_USER.name} /></Field>
            <Field label="Organization"><input className="input" defaultValue={DEMO_USER.organization} /></Field>
            <Field label="Email"><input className="input" defaultValue={DEMO_USER.email} /></Field>
            <Field label="Role"><input className="input" defaultValue="Sustainability Lead" /></Field>
          </div>
        </SectionCard>

        <SectionCard title="Interface preferences">
          <div className="space-y-4">
            <ToggleRow
              icon={Ruler}
              title="Display units"
              options={[{ v: 'metric', label: 'Metric (kWh, m²)' }, { v: 'imperial', label: 'Imperial' }]}
              value={units}
              onChange={(v) => setUnits(v as typeof units)}
            />
            <ToggleRow
              icon={SlidersHorizontal}
              title="Layout density"
              options={[{ v: 'comfortable', label: 'Comfortable' }, { v: 'compact', label: 'Compact' }]}
              value={density}
              onChange={(v) => setDensity(v as typeof density)}
            />
            <ToggleRow
              icon={Palette}
              title="Accent theme"
              options={[{ v: 'forest', label: 'Forest green' }, { v: 'navy', label: 'Navy blue' }]}
              value={theme}
              onChange={(v) => setTheme(v as typeof theme)}
            />
            <ToggleRow
              icon={SlidersHorizontal}
              title="Currency"
              options={[{ v: 'EGP', label: 'EGP' }, { v: 'USD', label: 'USD' }]}
              value={currency}
              onChange={(v) => setCurrency(v as typeof currency)}
            />
            <div className="flex items-center justify-between py-2">
              <div>
                <div className="text-sm font-semibold text-navy-900">Animations & micro-interactions</div>
                <div className="text-xs text-navy-500">Enable transitions and subtle motion.</div>
              </div>
              <button
                onClick={() => setAnimations((a) => !a)}
                className={`relative h-6 w-11 rounded-full transition-colors ${animations ? 'bg-forest-600' : 'bg-navy-200'}`}
                aria-pressed={animations}
              >
                <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${animations ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </button>
            </div>
          </div>
          <div className="mt-5 flex justify-end">
            <button className="btn-primary" onClick={save}>
              {saved ? <><Check className="h-4 w-4" /> Saved</> : 'Save preferences'}
            </button>
          </div>
        </SectionCard>

        <SectionCard title="Application information" className="lg:col-span-2">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <InfoTile label="Application" value="EcoGrid Egypt" />
            <InfoTile label="Version" value="1.0.0 demo" />
            <InfoTile label="Mode" value="Frontend demo" />
            <InfoTile label="Data" value="Session-only" />
          </div>
          <div className="mt-4 flex items-start gap-2.5 rounded-xl bg-navy-50 p-4 text-xs text-navy-600">
            <Info className="h-4 w-4 text-navy-400 shrink-0 mt-0.5" />
            <p>EcoGrid Egypt is a frontend demonstration of an AI-powered smart solar and sustainability intelligence platform. No backend, database, live APIs, or real AI models are connected. All data is illustrative and stored only in the current browser session.</p>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="label">{label}</label>
      {children}
    </div>
  );
}

function ToggleRow({ icon: Icon, title, options, value, onChange }: { icon: typeof User; title: string; options: { v: string; label: string }[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <div className="flex items-center gap-2.5">
        <Icon className="h-4 w-4 text-navy-400" />
        <div className="text-sm font-semibold text-navy-900">{title}</div>
      </div>
      <div className="flex rounded-xl border border-navy-200 p-0.5 bg-white">
        {options.map((o) => (
          <button
            key={o.v}
            onClick={() => onChange(o.v)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${value === o.v ? 'bg-forest-600 text-white' : 'text-navy-600 hover:bg-navy-50'}`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-navy-100 p-3">
      <div className="text-[11px] text-navy-400">{label}</div>
      <div className="text-sm font-bold text-navy-900 mt-0.5">{value}</div>
    </div>
  );
}
