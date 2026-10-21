import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Building } from '@/types';
import { DEMO_BUILDINGS } from '@/data/demoData';

interface BuildingsContextValue {
  buildings: Building[];
  addBuilding: (building: Omit<Building, 'id' | 'solarSuitabilityScore' | 'estimatedAnnualSavingsEGP'> & Partial<Pick<Building, 'solarSuitabilityScore' | 'estimatedAnnualSavingsEGP'>>) => void;
  updateBuilding: (id: string, patch: Partial<Building>) => void;
  deleteBuilding: (id: string) => void;
}

const BuildingsContext = createContext<BuildingsContextValue | null>(null);

export function BuildingsProvider({ children }: { children: ReactNode }) {
  const [buildings, setBuildings] = useState<Building[]>(DEMO_BUILDINGS);

  const addBuilding: BuildingsContextValue['addBuilding'] = (building) => {
    const id = `b-${Date.now().toString(36)}`;
    setBuildings((prev) => [{ ...building, id } as Building, ...prev]);
  };
  const updateBuilding = (id: string, patch: Partial<Building>) =>
    setBuildings((prev) => prev.map((b) => (b.id === id ? { ...b, ...patch } : b)));
  const deleteBuilding = (id: string) =>
    setBuildings((prev) => prev.filter((b) => b.id !== id));

  return (
    <BuildingsContext.Provider value={{ buildings, addBuilding, updateBuilding, deleteBuilding }}>
      {children}
    </BuildingsContext.Provider>
  );
}

export function useBuildings() {
  const ctx = useContext(BuildingsContext);
  if (!ctx) throw new Error('useBuildings must be used within BuildingsProvider');
  return ctx;
}
