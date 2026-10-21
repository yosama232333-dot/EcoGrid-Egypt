import type {
  Building,
  SolarAnalysisInput,
  SolarAnalysisResult,
} from '@/types';
import { tierFromScore } from '@/data/demoData';

const EGYPT_CO2_FACTOR_KG_PER_KWH = 0.48; // grid emission factor
const SYSTEM_EFFICIENCY = 0.78; // inverter + temperature + soiling losses
const KWP_PER_SQM = 0.18; // ~180W per m2 of rooftop area
const PERFORMANCE_RATIO_BY_SHADING: Record<Building['shading'], number> = {
  None: 1.0,
  Light: 0.93,
  Moderate: 0.82,
  Heavy: 0.65,
};

const ORIENTATION_FACTOR = (deg: number): number => {
  const a = Math.abs(deg) % 180;
  // south (0) = 1.0, east/west (90) = 0.82, north (180) = 0.55
  return Math.max(0.55, 1 - (a / 180) * 0.45);
};

const ANNUAL_PEAK_SUN_HOURS = 2100; // Egypt average full-sun equivalent hours/year

const MONTHLY_IRRADIANCE_PROFILE = [
  0.78, 0.82, 0.92, 1.03, 1.10, 1.13, 1.13, 1.10, 1.02, 0.92, 0.80, 0.75,
];

export function computeSolarAnalysis(input: SolarAnalysisInput): SolarAnalysisResult {
  const shadingFactor = PERFORMANCE_RATIO_BY_SHADING[input.shading];
  const orientationFactor = ORIENTATION_FACTOR(input.orientation);
  const usableArea = input.rooftopAreaSqm * 0.85; // reserve for access/setbacks
  const suitableCapacityKW = Math.max(1, usableArea * KWP_PER_SQM);
  const annualProductionKWh =
    suitableCapacityKW *
    ANNUAL_PEAK_SUN_HOURS *
    SYSTEM_EFFICIENCY *
    shadingFactor *
    orientationFactor;
  const annualBillSavingsEGP = annualProductionKWh * input.electricityPricePerKWh;
  const co2AvoidedTons = (annualProductionKWh * EGYPT_CO2_FACTOR_KG_PER_KWH) / 1000;
  const installCost = suitableCapacityKW * input.installCostPerKW;
  const paybackYears = installCost > 0 ? installCost / annualBillSavingsEGP : 0;

  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const monthly = MONTHLY_IRRADIANCE_PROFILE.map((factor, i) => ({
    month: months[i],
    generation: Math.round((annualProductionKWh / 12) * factor),
  }));

  const assumptions = [
    `Rooftop usable area estimated at 85% of total (${Math.round(usableArea).toLocaleString()} m² of ${input.rooftopAreaSqm.toLocaleString()} m²).`,
    `Panel density assumed at ${KWP_PER_SQM} kW per m² (~180 W/m²).`,
    `Egypt average peak-sun hours: ${ANNUAL_PEAK_SUN_HOURS} h/year.`,
    `System efficiency (inverter, temperature, soiling): ${(SYSTEM_EFFICIENCY * 100).toFixed(0)}%.`,
    `Shading derate (${input.shading}): ×${shadingFactor.toFixed(2)}.`,
    `Orientation derate for ${input.orientation}° from south: ×${orientationFactor.toFixed(2)}.`,
    `Grid CO₂ emission factor: ${EGYPT_CO2_FACTOR_KG_PER_KWH} kg CO₂/kWh.`,
    `Installation cost: ${input.installCostPerKW.toLocaleString()} EGP/kW.`,
  ];

  return {
    suitableCapacityKW: Math.round(suitableCapacityKW * 10) / 10,
    annualProductionKWh: Math.round(annualProductionKWh),
    annualBillSavingsEGP: Math.round(annualBillSavingsEGP),
    co2AvoidedTons: Math.round(co2AvoidedTons * 10) / 10,
    paybackYears: Math.round(paybackYears * 10) / 10,
    monthly,
    assumptions,
  };
}

export function suitabilityScoreFor(building: Pick<Building, 'shading' | 'orientation' | 'rooftopAreaSqm'>): number {
  const shadingFactor = PERFORMANCE_RATIO_BY_SHADING[building.shading];
  const orientationFactor = ORIENTATION_FACTOR(building.orientation);
  const areaBoost = Math.min(1, building.rooftopAreaSqm / 3000) * 0.15;
  const base = shadingFactor * orientationFactor;
  return Math.round(Math.min(100, base * 85 + areaBoost * 15 + 5));
}

export function tierLabel(score: number): ReturnType<typeof tierFromScore> {
  return tierFromScore(score);
}

export function formatEGP(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(2)}M EGP`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K EGP`;
  return `${Math.round(value)} EGP`;
}

export function formatKWh(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(2)} GWh`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)} MWh`;
  return `${Math.round(value)} kWh`;
}
