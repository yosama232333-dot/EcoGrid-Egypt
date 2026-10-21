export type BuildingType =
  | 'University'
  | 'Office'
  | 'Residential'
  | 'Hospital'
  | 'Industrial'
  | 'Retail';

export type SuitabilityTier = 'Excellent' | 'Good' | 'Moderate' | 'Limited';

export interface Building {
  id: string;
  name: string;
  type: BuildingType;
  city: string;
  governorate: string;
  lat: number;
  lng: number;
  monthlyConsumptionKWh: number;
  rooftopAreaSqm: number;
  orientation: number; // degrees from south, 0 = south
  shading: 'None' | 'Light' | 'Moderate' | 'Heavy';
  solarSuitabilityScore: number; // 0-100
  estimatedAnnualSavingsEGP: number;
  installCostPerKW: number;
  electricityPricePerKWh: number;
}

export interface MonthlyEnergyPoint {
  month: string;
  consumption: number;
  solarProduction: number;
}

export interface ActivityItem {
  id: string;
  title: string;
  detail: string;
  timestamp: string;
  type: 'analysis' | 'building' | 'report' | 'agent';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'agent';
  content: string;
  timestamp: string;
  actions?: PrioritizedAction[];
  sustainabilityScore?: number;
  estimatedSavings?: { metric: string; value: string }[];
}

export interface PrioritizedAction {
  id: string;
  priority: 'High' | 'Medium' | 'Low';
  title: string;
  description: string;
  estimatedImpact: string;
  timeline: string;
}

export interface SolarAnalysisResult {
  suitableCapacityKW: number;
  annualProductionKWh: number;
  annualBillSavingsEGP: number;
  co2AvoidedTons: number;
  paybackYears: number;
  monthly: { month: string; generation: number }[];
  assumptions: string[];
}

export interface SolarAnalysisInput {
  location: string;
  buildingType: BuildingType;
  monthlyConsumptionKWh: number;
  rooftopAreaSqm: number;
  orientation: number;
  shading: 'None' | 'Light' | 'Moderate' | 'Heavy';
  electricityPricePerKWh: number;
  installCostPerKW: number;
}
