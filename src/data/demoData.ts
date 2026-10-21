import type {
  Building,
  BuildingType,
  MonthlyEnergyPoint,
  ActivityItem,
  SuitabilityTier,
} from '@/types';

export const DEMO_BADGE: Record<SuitabilityTier, { label: string; classes: string }> = {
  Excellent: { label: 'Excellent', classes: 'bg-forest-100 text-forest-700' },
  Good: { label: 'Good', classes: 'bg-emerald-100 text-emerald-700' },
  Moderate: { label: 'Moderate', classes: 'bg-amber-100 text-amber-700' },
  Limited: { label: 'Limited', classes: 'bg-rose-100 text-rose-700' },
};

export const BUILDING_TYPE_OPTIONS: BuildingType[] = [
  'University',
  'Office',
  'Residential',
  'Hospital',
  'Industrial',
  'Retail',
];

export function tierFromScore(score: number): SuitabilityTier {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Moderate';
  return 'Limited';
}

export const DEMO_BUILDINGS: Building[] = [
  {
    id: 'b-001',
    name: 'Cairo University — Faculty of Engineering',
    type: 'University',
    city: 'Giza',
    governorate: 'Giza',
    lat: 30.0261,
    lng: 31.2072,
    monthlyConsumptionKWh: 84000,
    rooftopAreaSqm: 4200,
    orientation: 10,
    shading: 'Light',
    solarSuitabilityScore: 88,
    estimatedAnnualSavingsEGP: 1260000,
    installCostPerKW: 38000,
    electricityPricePerKWh: 1.25,
  },
  {
    id: 'b-002',
    name: 'Ain Shams University — Main Campus',
    type: 'University',
    city: 'Cairo',
    governorate: 'Cairo',
    lat: 30.0789,
    lng: 31.2842,
    monthlyConsumptionKWh: 72000,
    rooftopAreaSqm: 3600,
    orientation: 25,
    shading: 'Moderate',
    solarSuitabilityScore: 71,
    estimatedAnnualSavingsEGP: 880000,
    installCostPerKW: 39000,
    electricityPricePerKWh: 1.25,
  },
  {
    id: 'b-003',
    name: 'Smart Village — Tower A',
    type: 'Office',
    city: '6th of October',
    governorate: 'Giza',
    lat: 29.9702,
    lng: 30.9773,
    monthlyConsumptionKWh: 38000,
    rooftopAreaSqm: 1850,
    orientation: 5,
    shading: 'None',
    solarSuitabilityScore: 92,
    estimatedAnnualSavingsEGP: 610000,
    installCostPerKW: 40000,
    electricityPricePerKWh: 1.35,
  },
  {
    id: 'b-004',
    name: 'Bibliotheca Alexandrina',
    type: 'University',
    city: 'Alexandria',
    governorate: 'Alexandria',
    lat: 31.2089,
    lng: 29.9092,
    monthlyConsumptionKWh: 56000,
    rooftopAreaSqm: 2800,
    orientation: 15,
    shading: 'Light',
    solarSuitabilityScore: 78,
    estimatedAnnualSavingsEGP: 740000,
    installCostPerKW: 38500,
    electricityPricePerKWh: 1.30,
  },
  {
    id: 'b-005',
    name: 'Mansoura University — Medical Campus',
    type: 'University',
    city: 'Mansoura',
    governorate: 'Dakahlia',
    lat: 31.0375,
    lng: 31.3789,
    monthlyConsumptionKWh: 61000,
    rooftopAreaSqm: 3100,
    orientation: 40,
    shading: 'Moderate',
    solarSuitabilityScore: 64,
    estimatedAnnualSavingsEGP: 690000,
    installCostPerKW: 39500,
    electricityPricePerKWh: 1.22,
  },
  {
    id: 'b-006',
    name: 'Aswan University — Solar Research Lab',
    type: 'University',
    city: 'Aswan',
    governorate: 'Aswan',
    lat: 24.0889,
    lng: 32.8998,
    monthlyConsumptionKWh: 28000,
    rooftopAreaSqm: 1600,
    orientation: 0,
    shading: 'None',
    solarSuitabilityScore: 96,
    estimatedAnnualSavingsEGP: 520000,
    installCostPerKW: 37000,
    electricityPricePerKWh: 1.15,
  },
  {
    id: 'b-007',
    name: 'New Administrative Capital — Civic Tower',
    type: 'Office',
    city: 'New Capital',
    governorate: 'Cairo',
    lat: 30.0121,
    lng: 31.7521,
    monthlyConsumptionKWh: 45000,
    rooftopAreaSqm: 2100,
    orientation: 8,
    shading: 'Light',
    solarSuitabilityScore: 85,
    estimatedAnnualSavingsEGP: 720000,
    installCostPerKW: 41000,
    electricityPricePerKWh: 1.40,
  },
  {
    id: 'b-008',
    name: 'Maadi Residential Complex',
    type: 'Residential',
    city: 'Cairo',
    governorate: 'Cairo',
    lat: 29.9602,
    lng: 31.2569,
    monthlyConsumptionKWh: 12500,
    rooftopAreaSqm: 720,
    orientation: 35,
    shading: 'Moderate',
    solarSuitabilityScore: 58,
    estimatedAnnualSavingsEGP: 165000,
    installCostPerKW: 42000,
    electricityPricePerKWh: 1.10,
  },
  {
    id: 'b-009',
    name: 'Gouna Hospital — Main Wing',
    type: 'Hospital',
    city: 'El Gouna',
    governorate: 'Red Sea',
    lat: 27.3983,
    lng: 33.6747,
    monthlyConsumptionKWh: 34000,
    rooftopAreaSqm: 1500,
    orientation: 12,
    shading: 'None',
    solarSuitabilityScore: 89,
    estimatedAnnualSavingsEGP: 540000,
    installCostPerKW: 38000,
    electricityPricePerKWh: 1.28,
  },
  {
    id: 'b-010',
    name: 'Suez Industrial Park — Facility 3',
    type: 'Industrial',
    city: 'Suez',
    governorate: 'Suez',
    lat: 29.9667,
    lng: 32.5167,
    monthlyConsumptionKWh: 112000,
    rooftopAreaSqm: 6400,
    orientation: 20,
    shading: 'Light',
    solarSuitabilityScore: 82,
    estimatedAnnualSavingsEGP: 1650000,
    installCostPerKW: 36500,
    electricityPricePerKWh: 1.18,
  },
  {
    id: 'b-011',
    name: 'Citystars Heliopolis Retail',
    type: 'Retail',
    city: 'Cairo',
    governorate: 'Cairo',
    lat: 30.0915,
    lng: 31.3365,
    monthlyConsumptionKWh: 52000,
    rooftopAreaSqm: 2400,
    orientation: 28,
    shading: 'Heavy',
    solarSuitabilityScore: 47,
    estimatedAnnualSavingsEGP: 430000,
    installCostPerKW: 42000,
    electricityPricePerKWh: 1.32,
  },
  {
    id: 'b-012',
    name: 'Assiut University — Science Block',
    type: 'University',
    city: 'Assiut',
    governorate: 'Assiut',
    lat: 27.1839,
    lng: 31.1849,
    monthlyConsumptionKWh: 48000,
    rooftopAreaSqm: 2500,
    orientation: 18,
    shading: 'Light',
    solarSuitabilityScore: 81,
    estimatedAnnualSavingsEGP: 700000,
    installCostPerKW: 37500,
    electricityPricePerKWh: 1.20,
  },
];

export const MONTHLY_ENERGY: MonthlyEnergyPoint[] = [
  { month: 'Jan', consumption: 9800, solarProduction: 7600 },
  { month: 'Feb', consumption: 9100, solarProduction: 8400 },
  { month: 'Mar', consumption: 8700, solarProduction: 10200 },
  { month: 'Apr', consumption: 8400, solarProduction: 11800 },
  { month: 'May', consumption: 9200, solarProduction: 13200 },
  { month: 'Jun', consumption: 10800, solarProduction: 14100 },
  { month: 'Jul', consumption: 12400, solarProduction: 14200 },
  { month: 'Aug', consumption: 12100, solarProduction: 13400 },
  { month: 'Sep', consumption: 9600, solarProduction: 12000 },
  { month: 'Oct', consumption: 8900, solarProduction: 10300 },
  { month: 'Nov', consumption: 9300, solarProduction: 8200 },
  { month: 'Dec', consumption: 10100, solarProduction: 7100 },
];

export const ENERGY_TREND: { month: string; consumption: number; solar: number; grid: number }[] =
  MONTHLY_ENERGY.map((m) => ({
    month: m.month,
    consumption: m.consumption,
    solar: m.solarProduction,
    grid: Math.max(0, m.consumption - m.solarProduction),
  }));

export const RECENT_ACTIVITY: ActivityItem[] = [
  {
    id: 'a-1',
    title: 'Solar analysis completed',
    detail: 'Cairo University — Faculty of Engineering · 88 suitability score',
    timestamp: '12 min ago',
    type: 'analysis',
  },
  {
    id: 'a-2',
    title: 'New building added',
    detail: 'Aswan University — Solar Research Lab',
    timestamp: '1 hour ago',
    type: 'building',
  },
  {
    id: 'a-3',
    title: 'Report exported',
    detail: 'Q3 2026 Sustainability Summary (PDF)',
    timestamp: '3 hours ago',
    type: 'report',
  },
  {
    id: 'a-4',
    title: 'AI Agent recommendation',
    detail: 'Prioritized 4 actions to reduce campus consumption by 20%',
    timestamp: 'Yesterday',
    type: 'agent',
  },
  {
    id: 'a-5',
    title: 'Building updated',
    detail: 'Smart Village — Tower A · rooftop area revised',
    timestamp: '2 days ago',
    type: 'building',
  },
];

export const NOTIFICATIONS = [
  {
    id: 'n-1',
    title: 'Solar potential threshold reached',
    detail: '3 buildings now exceed 85% suitability.',
    timestamp: '20 min ago',
    unread: true,
  },
  {
    id: 'n-2',
    title: 'Monthly report ready',
    detail: 'Your October sustainability digest is available.',
    timestamp: '2 hours ago',
    unread: true,
  },
  {
    id: 'n-3',
    title: 'New incentive program',
    detail: 'Egypt updated net-metering rates — review impact.',
    timestamp: '1 day ago',
    unread: false,
  },
];

export const DEMO_USER = {
  name: 'Eng.Yousef Osama',
  role: 'Sustainability Lead · Cairo University',
  email: 'yosef123@gmail.com',
  initials: 'YO',
  organization: 'Cairo University',
};

// Monthly irradiance profile (relative to annual average = 1.0)
// Jan–Dec — matches the profile used in solar.ts
export const MONTHLY_IRRADIANCE_PROFILE = [
  0.78, 0.82, 0.92, 1.03, 1.10, 1.13, 1.13, 1.10, 1.02, 0.92, 0.80, 0.75,
];

// Day-of-week labels
const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/**
 * Generate a 7-day daily solar forecast starting from today.
 * @param annualProductionKWh  Total annual production across all buildings (kWh)
 */
export function generateWeeklyForecast(annualProductionKWh: number): { day: string; date: string; expectedKWh: number; isToday: boolean }[] {
  const today = new Date();
  // deterministic variance seed per calendar-day so values don't jump on re-render
  const seed = (n: number) => (Math.sin(n * 127.1 + 311.7) * 0.5 + 0.5); // 0..1

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const monthIdx = d.getMonth();           // 0-based
    const dayOfYear = d.getDate();
    const irradianceFactor = MONTHLY_IRRADIANCE_PROFILE[monthIdx];
    // daily base = annual / 365 * irradiance_factor
    const baseKWh = (annualProductionKWh / 365) * irradianceFactor;
    // ±6 % deterministic variance
    const variance = 0.94 + seed(d.getMonth() * 31 + dayOfYear) * 0.12;
    const expectedKWh = Math.round(baseKWh * variance);

    return {
      day: DAY_LABELS[d.getDay()],
      date: `${d.getDate()}/${d.getMonth() + 1}`,
      expectedKWh,
      isToday: i === 0,
    };
  });
}
