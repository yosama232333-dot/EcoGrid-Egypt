import { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Search, Map as MapIcon, List, X, Zap, Maximize, Gauge, PiggyBank, MapPin } from 'lucide-react';
import { PageHeader, DemoBanner } from '@/components/ui';
import { useBuildings } from '@/store/buildings';
import { BUILDING_TYPE_OPTIONS, DEMO_BADGE, tierFromScore } from '@/data/demoData';
import { formatEGP, formatKWh } from '@/utils/solar';
import type { Building, BuildingType, SuitabilityTier } from '@/types';

const TIER_COLOR: Record<SuitabilityTier, string> = {
  Excellent: '#1f7258',
  Good: '#10b981',
  Moderate: '#f59e0b',
  Limited: '#f43f5e',
};

function makeIcon(color: string, selected: boolean): L.DivIcon {
  return L.divIcon({
    className: 'ecogrid-marker',
    html: `<div style="width:18px;height:18px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:${color};border:3px solid #fff;box-shadow:0 2px 8px rgba(16,59,48,0.35);${selected ? 'outline:3px solid #103b30;outline-offset:2px;' : ''}"></div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 18],
    popupAnchor: [0, -16],
  });
}

function Recenter({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => { map.flyTo([lat, lng], 11, { duration: 0.8 }); }, [lat, lng, map]);
  return null;
}

const EGYPT_CENTER: [number, number] = [30.0444, 31.2357];

export function MapPage() {
  const { buildings } = useBuildings();
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<BuildingType | 'All'>('All');
  const [tierFilter, setTierFilter] = useState<string>('All');
  const [selected, setSelected] = useState<Building | null>(null);
  const [mode, setMode] = useState<'map' | 'list'>('map');
  const [recenter, setRecenter] = useState<[number, number]>(EGYPT_CENTER);

  const filtered = useMemo(() => {
    return buildings.filter((b) => {
      if (typeFilter !== 'All' && b.type !== typeFilter) return false;
      if (tierFilter !== 'All' && tierFromScore(b.solarSuitabilityScore) !== tierFilter) return false;
      if (query) {
        const q = query.toLowerCase();
        return b.name.toLowerCase().includes(q) || b.city.toLowerCase().includes(q);
      }
      return true;
    });
  }, [buildings, query, typeFilter, tierFilter]);

  const onSearchLocation = () => {
    // demo geocoding: match known city, else recenter on Egypt
    const q = query.trim().toLowerCase();
    const match = buildings.find((b) => b.city.toLowerCase() === q);
    if (match) {
      setRecenter([match.lat, match.lng]);
      setSelected(match);
    } else {
      setRecenter(EGYPT_CENTER);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Smart City Map"
        subtitle="Explore buildings across Egypt with color-coded solar suitability markers."
        actions={
          <div className="flex rounded-xl border border-navy-200 p-0.5 bg-white">
            <button onClick={() => setMode('map')} className={`rounded-lg px-3 py-1.5 text-sm font-medium ${mode === 'map' ? 'bg-forest-600 text-white' : 'text-navy-600 hover:bg-navy-50'}`}>
              <MapIcon className="h-4 w-4 inline mr-1.5" />Map
            </button>
            <button onClick={() => setMode('list')} className={`rounded-lg px-3 py-1.5 text-sm font-medium ${mode === 'list' ? 'bg-forest-600 text-white' : 'text-navy-600 hover:bg-navy-50'}`}>
              <List className="h-4 w-4 inline mr-1.5" />List
            </button>
          </div>
        }
      />

      <DemoBanner>Map tiles by OpenStreetMap. Building coordinates are demo values.</DemoBanner>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-1 space-y-4 order-2 lg:order-1">
          <div className="card p-4 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-navy-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && onSearchLocation()}
                placeholder="Search city in Egypt…"
                className="input pl-9"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as BuildingType | 'All')} className="input text-sm">
                <option value="All">All types</option>
                {BUILDING_TYPE_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              <select value={tierFilter} onChange={(e) => setTierFilter(e.target.value)} className="input text-sm">
                <option value="All">All tiers</option>
                <option value="Excellent">Excellent</option>
                <option value="Good">Good</option>
                <option value="Moderate">Moderate</option>
                <option value="Limited">Limited</option>
              </select>
            </div>
            <button onClick={onSearchLocation} className="btn-primary w-full text-sm"><Search className="h-4 w-4" /> Locate</button>
          </div>

          <div className="card p-4">
            <h4 className="text-sm font-bold text-navy-900 mb-3">Legend</h4>
            <ul className="space-y-2 text-xs">
              {(['Excellent', 'Good', 'Moderate', 'Limited'] as SuitabilityTier[]).map((t) => (
                <li key={t} className="flex items-center gap-2.5">
                  <span className="h-3 w-3 rounded-full" style={{ background: TIER_COLOR[t] }} />
                  <span className="text-navy-700 font-medium">{t}</span>
                  <span className="ml-auto text-navy-400">{buildings.filter((b) => tierFromScore(b.solarSuitabilityScore) === t).length}</span>
                </li>
              ))}
            </ul>
          </div>

          {mode === 'list' && (
            <div className="card p-2 max-h-[480px] overflow-y-auto">
              {filtered.map((b) => {
                const tier = tierFromScore(b.solarSuitabilityScore);
                return (
                  <button key={b.id} onClick={() => { setSelected(b); setRecenter([b.lat, b.lng]); setMode('map'); }} className={`flex w-full items-center gap-3 rounded-xl p-3 text-left transition-colors ${selected?.id === b.id ? 'bg-forest-50' : 'hover:bg-navy-50'}`}>
                    <span className="h-3 w-3 rounded-full shrink-0" style={{ background: TIER_COLOR[tier] }} />
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-navy-900 truncate">{b.name}</div>
                      <div className="text-xs text-navy-500">{b.city} · {b.type}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="lg:col-span-3 order-1 lg:order-2 space-y-4">
          <div className="card overflow-hidden">
            {mode === 'map' ? (
              <div className="relative h-[520px] w-full">
                <MapContainer center={EGYPT_CENTER} zoom={6} scrollWheelZoom className="h-full w-full">
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Recenter lat={recenter[0]} lng={recenter[1]} />
                  {filtered.map((b) => {
                    const tier = tierFromScore(b.solarSuitabilityScore);
                    return (
                      <Marker
                        key={b.id}
                        position={[b.lat, b.lng]}
                        icon={makeIcon(TIER_COLOR[tier], selected?.id === b.id)}
                        eventHandlers={{ click: () => setSelected(b) }}
                      >
                        <Popup>
                          <div className="min-w-[180px]">
                            <div className="font-bold text-navy-900 text-sm">{b.name}</div>
                            <div className="text-xs text-navy-500 mt-0.5">{b.city} · {b.type}</div>
                            <div className="mt-2 flex items-center gap-1.5">
                              <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold" style={{ background: `${TIER_COLOR[tier]}20`, color: TIER_COLOR[tier] }}>
                                {tier} · {b.solarSuitabilityScore}
                              </span>
                            </div>
                            <div className="mt-2 text-xs text-navy-600">Savings: <span className="font-semibold text-forest-700">{formatEGP(b.estimatedAnnualSavingsEGP)}</span></div>
                          </div>
                        </Popup>
                      </Marker>
                    );
                  })}
                </MapContainer>
              </div>
            ) : (
              <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[520px] overflow-y-auto">
                {filtered.map((b) => {
                  const tier = tierFromScore(b.solarSuitabilityScore);
                  return (
                    <button key={b.id} onClick={() => setSelected(b)} className="text-left rounded-xl border border-navy-100 p-3 hover:border-forest-300 hover:shadow-card-hover transition-all">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="text-sm font-bold text-navy-900 truncate">{b.name}</div>
                          <div className="text-xs text-navy-500 flex items-center gap-1 mt-0.5"><MapPin className="h-3 w-3" /> {b.city}</div>
                        </div>
                        <span className="h-3 w-3 rounded-full shrink-0 mt-1" style={{ background: TIER_COLOR[tier] }} />
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {selected && (
            <div className="card p-5 animate-slide-in-right">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-bold text-navy-900">{selected.name}</h3>
                  <div className="text-xs text-navy-500 mt-0.5">{selected.type} · {selected.city}, {selected.governorate}</div>
                </div>
                <button onClick={() => setSelected(null)} className="rounded-lg p-1.5 text-navy-400 hover:bg-navy-50"><X className="h-4 w-4" /></button>
              </div>
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                <Detail icon={Zap} label="Monthly consumption" value={formatKWh(selected.monthlyConsumptionKWh)} />
                <Detail icon={Maximize} label="Rooftop area" value={`${selected.rooftopAreaSqm.toLocaleString()} m²`} />
                <Detail icon={Gauge} label="Solar suitability" value={`${selected.solarSuitabilityScore}/100`} />
                <Detail icon={PiggyBank} label="Annual savings" value={formatEGP(selected.estimatedAnnualSavingsEGP)} />
              </div>
              <div className="mt-3">
                <span className={`badge ${DEMO_BADGE[tierFromScore(selected.solarSuitabilityScore)].classes}`}>
                  {tierFromScore(selected.solarSuitabilityScore)} suitability
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Detail({ icon: Icon, label, value }: { icon: typeof Zap; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-navy-100 p-3">
      <div className="flex items-center gap-1.5 text-navy-400 text-[11px]"><Icon className="h-3 w-3" /> {label}</div>
      <div className="text-sm font-bold text-navy-900 mt-1">{value}</div>
    </div>
  );
}
