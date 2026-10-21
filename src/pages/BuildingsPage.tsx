import { useEffect, useMemo, useState } from 'react';
import {
  Plus, Search, LayoutGrid, List, Pencil, Trash2, Eye, MapPin,
  Zap, Maximize, Gauge, PiggyBank,
} from 'lucide-react';
import { PageHeader, SectionCard, DemoBanner } from '@/components/ui';
import { Modal } from '@/components/Modal';
import { useBuildings } from '@/store/buildings';
import { BUILDING_TYPE_OPTIONS, DEMO_BADGE, tierFromScore } from '@/data/demoData';
import { suitabilityScoreFor, formatEGP, formatKWh } from '@/utils/solar';
import type { Building, BuildingType } from '@/types';

type View = 'table' | 'cards';

export function BuildingsPage() {
  const { buildings, addBuilding, updateBuilding, deleteBuilding } = useBuildings();
  const [view, setView] = useState<View>('table');
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<BuildingType | 'All'>('All');
  const [tierFilter, setTierFilter] = useState<string>('All');
  const [page, setPage] = useState(0);
  const pageSize = 8;

  const [addOpen, setAddOpen] = useState(false);
  const [editing, setEditing] = useState<Building | null>(null);
  const [viewing, setViewing] = useState<Building | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Building | null>(null);

  const filtered = useMemo(() => {
    return buildings.filter((b) => {
      if (typeFilter !== 'All' && b.type !== typeFilter) return false;
      if (tierFilter !== 'All' && tierFromScore(b.solarSuitabilityScore) !== tierFilter) return false;
      if (query) {
        const q = query.toLowerCase();
        return b.name.toLowerCase().includes(q) || b.city.toLowerCase().includes(q) || b.governorate.toLowerCase().includes(q);
      }
      return true;
    });
  }, [buildings, query, typeFilter, tierFilter]);

  const paged = filtered.slice(page * pageSize, page * pageSize + pageSize);
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Buildings Management"
        subtitle="Search, filter, and manage buildings in your portfolio. Data is stored in the current session only."
        actions={
          <button className="btn-primary" onClick={() => setAddOpen(true)}>
            <Plus className="h-4 w-4" /> Add Building
          </button>
        }
      />

      <DemoBanner />

      <SectionCard>
        <div className="flex flex-col lg:flex-row lg:items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-navy-400" />
            <input
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(0); }}
              placeholder="Search by name, city, or governorate…"
              className="input pl-9"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <select value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value as BuildingType | 'All'); setPage(0); }} className="input w-auto">
              <option value="All">All types</option>
              {BUILDING_TYPE_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <select value={tierFilter} onChange={(e) => { setTierFilter(e.target.value); setPage(0); }} className="input w-auto">
              <option value="All">All suitability</option>
              <option value="Excellent">Excellent</option>
              <option value="Good">Good</option>
              <option value="Moderate">Moderate</option>
              <option value="Limited">Limited</option>
            </select>
            <div className="flex rounded-xl border border-navy-200 p-0.5 bg-white">
              <button onClick={() => setView('table')} className={`rounded-lg px-2.5 py-1.5 ${view === 'table' ? 'bg-forest-600 text-white' : 'text-navy-600 hover:bg-navy-50'}`} aria-label="Table view">
                <List className="h-4 w-4" />
              </button>
              <button onClick={() => setView('cards')} className={`rounded-lg px-2.5 py-1.5 ${view === 'cards' ? 'bg-forest-600 text-white' : 'text-navy-600 hover:bg-navy-50'}`} aria-label="Card view">
                <LayoutGrid className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-4 text-xs text-navy-500">
          {filtered.length} of {buildings.length} buildings
        </div>

        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <div className="mx-auto h-12 w-12 rounded-2xl bg-navy-100 flex items-center justify-center text-navy-400">
              <Search className="h-5 w-5" />
            </div>
            <p className="mt-3 text-sm font-semibold text-navy-700">No buildings match your filters</p>
            <p className="text-xs text-navy-400">Try adjusting your search or filters.</p>
          </div>
        ) : view === 'table' ? (
          <div className="-mx-5 mt-3 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-y border-navy-100 bg-navy-50/40 text-left text-xs font-semibold text-navy-500">
                  <th className="px-5 py-3">Building</th>
                  <th className="px-3 py-3">Type</th>
                  <th className="px-3 py-3">Location</th>
                  <th className="px-3 py-3 text-right">Consumption</th>
                  <th className="px-3 py-3 text-right">Rooftop</th>
                  <th className="px-3 py-3">Suitability</th>
                  <th className="px-3 py-3 text-right">Annual Savings</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-100">
                {paged.map((b) => {
                  const tier = tierFromScore(b.solarSuitabilityScore);
                  return (
                    <tr key={b.id} className="hover:bg-navy-50/40 transition-colors">
                      <td className="px-5 py-3 font-semibold text-navy-900">{b.name}</td>
                      <td className="px-3 py-3"><span className="badge bg-navy-100 text-navy-700">{b.type}</span></td>
                      <td className="px-3 py-3 text-navy-600">{b.city}</td>
                      <td className="px-3 py-3 text-right text-navy-700 font-medium">{formatKWh(b.monthlyConsumptionKWh)}</td>
                      <td className="px-3 py-3 text-right text-navy-700 font-medium">{b.rooftopAreaSqm.toLocaleString()} m²</td>
                      <td className="px-3 py-3"><span className={`badge ${DEMO_BADGE[tier].classes}`}>{tier} · {b.solarSuitabilityScore}</span></td>
                      <td className="px-3 py-3 text-right text-forest-700 font-semibold">{formatEGP(b.estimatedAnnualSavingsEGP)}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => setViewing(b)} className="rounded-lg p-1.5 text-navy-500 hover:bg-navy-100 hover:text-forest-700" aria-label="View"><Eye className="h-4 w-4" /></button>
                          <button onClick={() => setEditing(b)} className="rounded-lg p-1.5 text-navy-500 hover:bg-navy-100 hover:text-forest-700" aria-label="Edit"><Pencil className="h-4 w-4" /></button>
                          <button onClick={() => setConfirmDelete(b)} className="rounded-lg p-1.5 text-navy-500 hover:bg-rose-100 hover:text-rose-600" aria-label="Delete"><Trash2 className="h-4 w-4" /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {paged.map((b) => {
              const tier = tierFromScore(b.solarSuitabilityScore);
              return (
                <div key={b.id} className="rounded-2xl border border-navy-100 p-4 hover:border-forest-300 hover:shadow-card-hover transition-all">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h4 className="font-bold text-navy-900 truncate">{b.name}</h4>
                      <div className="text-xs text-navy-500 flex items-center gap-1 mt-0.5"><MapPin className="h-3 w-3" /> {b.city}, {b.governorate}</div>
                    </div>
                    <span className={`badge ${DEMO_BADGE[tier].classes}`}>{tier}</span>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
                    <Metric icon={Zap} label="Consumption" value={formatKWh(b.monthlyConsumptionKWh)} />
                    <Metric icon={Maximize} label="Rooftop" value={`${b.rooftopAreaSqm.toLocaleString()} m²`} />
                    <Metric icon={Gauge} label="Suitability" value={`${b.solarSuitabilityScore}/100`} />
                    <Metric icon={PiggyBank} label="Savings" value={formatEGP(b.estimatedAnnualSavingsEGP)} />
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <button onClick={() => setViewing(b)} className="btn-secondary flex-1 text-xs"><Eye className="h-3.5 w-3.5" /> View</button>
                    <button onClick={() => setEditing(b)} className="btn-secondary text-xs"><Pencil className="h-3.5 w-3.5" /></button>
                    <button onClick={() => setConfirmDelete(b)} className="btn-secondary text-xs hover:!border-rose-300 hover:!text-rose-600"><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {filtered.length > pageSize && (
          <div className="mt-5 flex items-center justify-between">
            <div className="text-xs text-navy-500">Page {page + 1} of {pageCount}</div>
            <div className="flex gap-2">
              <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0} className="btn-secondary text-xs">Previous</button>
              <button onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))} disabled={page >= pageCount - 1} className="btn-secondary text-xs">Next</button>
            </div>
          </div>
        )}
      </SectionCard>

      <BuildingFormModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Add Building"
        description="Register a new building. Suitability score is auto-estimated client-side."
        onSubmit={(data) => { addBuilding(data); setAddOpen(false); }}
      />
      <BuildingFormModal
        open={!!editing}
        onClose={() => setEditing(null)}
        title="Edit Building"
        description={editing?.name}
        building={editing ?? undefined}
        onSubmit={(data) => { if (editing) updateBuilding(editing.id, data); setEditing(null); }}
      />

      <Modal
        open={!!viewing}
        onClose={() => setViewing(null)}
        title={viewing?.name ?? ''}
        description={viewing ? `${viewing.type} · ${viewing.city}, ${viewing.governorate}` : ''}
        size="lg"
      >
        {viewing && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <DetailRow label="Monthly consumption" value={formatKWh(viewing.monthlyConsumptionKWh)} />
              <DetailRow label="Rooftop area" value={`${viewing.rooftopAreaSqm.toLocaleString()} m²`} />
              <DetailRow label="Orientation" value={`${viewing.orientation}° from south`} />
              <DetailRow label="Shading" value={viewing.shading} />
              <DetailRow label="Suitability score" value={`${viewing.solarSuitabilityScore}/100`} />
              <DetailRow label="Annual savings" value={formatEGP(viewing.estimatedAnnualSavingsEGP)} />
            </div>
            <DemoBanner />
          </div>
        )}
      </Modal>

      <Modal
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        title="Delete building?"
        description={confirmDelete?.name}
        footer={
          <div className="flex justify-end gap-2">
            <button className="btn-secondary" onClick={() => setConfirmDelete(null)}>Cancel</button>
            <button className="btn bg-rose-600 text-white hover:bg-rose-700" onClick={() => { if (confirmDelete) deleteBuilding(confirmDelete.id); setConfirmDelete(null); }}>Delete</button>
          </div>
        }
      >
        <p className="text-sm text-navy-600">This removes the building from the current session. This action cannot be undone in the demo.</p>
      </Modal>
    </div>
  );
}

function Metric({ icon: Icon, label, value }: { icon: typeof Zap; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="h-3.5 w-3.5 text-navy-400" />
      <div>
        <div className="text-navy-400 text-[11px]">{label}</div>
        <div className="text-navy-900 font-semibold">{value}</div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-navy-100 p-3">
      <div className="text-xs text-navy-400">{label}</div>
      <div className="text-sm font-bold text-navy-900 mt-0.5">{value}</div>
    </div>
  );
}

interface BuildingFormModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  building?: Building;
  onSubmit: (data: Omit<Building, 'id' | 'solarSuitabilityScore' | 'estimatedAnnualSavingsEGP'> & Partial<Pick<Building, 'solarSuitabilityScore' | 'estimatedAnnualSavingsEGP'>>) => void;
}

function BuildingFormModal({ open, onClose, title, description, building, onSubmit }: BuildingFormModalProps) {
  const [form, setForm] = useState({
    name: building?.name ?? '',
    type: building?.type ?? ('University' as BuildingType),
    city: building?.city ?? '',
    governorate: building?.governorate ?? '',
    lat: building?.lat ?? 30.0444,
    lng: building?.lng ?? 31.2357,
    monthlyConsumptionKWh: building?.monthlyConsumptionKWh ?? 20000,
    rooftopAreaSqm: building?.rooftopAreaSqm ?? 1000,
    orientation: building?.orientation ?? 15,
    shading: building?.shading ?? ('Light' as Building['shading']),
    installCostPerKW: building?.installCostPerKW ?? 39000,
    electricityPricePerKWh: building?.electricityPricePerKWh ?? 1.25,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setForm({
      name: building?.name ?? '',
      type: building?.type ?? 'University',
      city: building?.city ?? '',
      governorate: building?.governorate ?? '',
      lat: building?.lat ?? 30.0444,
      lng: building?.lng ?? 31.2357,
      monthlyConsumptionKWh: building?.monthlyConsumptionKWh ?? 20000,
      rooftopAreaSqm: building?.rooftopAreaSqm ?? 1000,
      orientation: building?.orientation ?? 15,
      shading: building?.shading ?? 'Light',
      installCostPerKW: building?.installCostPerKW ?? 39000,
      electricityPricePerKWh: building?.electricityPricePerKWh ?? 1.25,
    });
    setErrors({});
  }, [building]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.city.trim()) e.city = 'City is required';
    if (form.monthlyConsumptionKWh <= 0) e.monthlyConsumptionKWh = 'Must be greater than 0';
    if (form.rooftopAreaSqm <= 0) e.rooftopAreaSqm = 'Must be greater than 0';
    if (form.orientation < -180 || form.orientation > 180) e.orientation = 'Between -180 and 180';
    if (form.electricityPricePerKWh <= 0) e.electricityPricePerKWh = 'Must be greater than 0';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = () => {
    if (!validate()) return;
    const score = suitabilityScoreFor({ shading: form.shading, orientation: form.orientation, rooftopAreaSqm: form.rooftopAreaSqm });
    const annualProduction = Math.round(form.rooftopAreaSqm * 0.85 * 0.18 * 2100 * 0.78 * ({ None: 1, Light: 0.93, Moderate: 0.82, Heavy: 0.65 }[form.shading]) * (Math.max(0.55, 1 - (Math.abs(form.orientation) % 180) / 180 * 0.45)));
    const savings = Math.round(annualProduction * form.electricityPricePerKWh);
    onSubmit({ ...form, solarSuitabilityScore: score, estimatedAnnualSavingsEGP: savings });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      description={description}
      size="xl"
      footer={
        <div className="flex justify-end gap-2">
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={submit}>{building ? 'Save Changes' : 'Add Building'}</button>
        </div>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Building name" error={errors.name} className="sm:col-span-2">
          <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Cairo University — Faculty of Science" />
        </Field>
        <Field label="Building type">
          <select className="input" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as BuildingType })}>
            {BUILDING_TYPE_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </Field>
        <Field label="Shading level">
          <select className="input" value={form.shading} onChange={(e) => setForm({ ...form, shading: e.target.value as Building['shading'] })}>
            <option>None</option><option>Light</option><option>Moderate</option><option>Heavy</option>
          </select>
        </Field>
        <Field label="City" error={errors.city}>
          <input className="input" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="e.g. Cairo" />
        </Field>
        <Field label="Governorate">
          <input className="input" value={form.governorate} onChange={(e) => setForm({ ...form, governorate: e.target.value })} placeholder="e.g. Cairo" />
        </Field>
        <Field label="Latitude" >
          <input type="number" step="0.0001" className="input" value={form.lat} onChange={(e) => setForm({ ...form, lat: parseFloat(e.target.value) || 0 })} />
        </Field>
        <Field label="Longitude">
          <input type="number" step="0.0001" className="input" value={form.lng} onChange={(e) => setForm({ ...form, lng: parseFloat(e.target.value) || 0 })} />
        </Field>
        <Field label="Monthly consumption (kWh)" error={errors.monthlyConsumptionKWh}>
          <input type="number" className="input" value={form.monthlyConsumptionKWh} onChange={(e) => setForm({ ...form, monthlyConsumptionKWh: parseFloat(e.target.value) || 0 })} />
        </Field>
        <Field label="Rooftop area (m²)" error={errors.rooftopAreaSqm}>
          <input type="number" className="input" value={form.rooftopAreaSqm} onChange={(e) => setForm({ ...form, rooftopAreaSqm: parseFloat(e.target.value) || 0 })} />
        </Field>
        <Field label="Roof orientation (° from south)" error={errors.orientation}>
          <input type="number" className="input" value={form.orientation} onChange={(e) => setForm({ ...form, orientation: parseFloat(e.target.value) || 0 })} />
        </Field>
        <Field label="Electricity price (EGP/kWh)" error={errors.electricityPricePerKWh}>
          <input type="number" step="0.01" className="input" value={form.electricityPricePerKWh} onChange={(e) => setForm({ ...form, electricityPricePerKWh: parseFloat(e.target.value) || 0 })} />
        </Field>
        <Field label="Install cost (EGP/kW)" className="sm:col-span-2">
          <input type="number" className="input" value={form.installCostPerKW} onChange={(e) => setForm({ ...form, installCostPerKW: parseFloat(e.target.value) || 0 })} />
        </Field>
      </div>
    </Modal>
  );
}

function Field({ label, error, children, className = '' }: { label: string; error?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <label className="label">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-rose-600">{error}</p>}
    </div>
  );
}
