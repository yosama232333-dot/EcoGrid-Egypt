import { HashRouter, Routes, Route } from 'react-router-dom';
import { AppLayout } from '@/components/AppLayout';
import { BuildingsProvider } from '@/store/buildings';
import { OverviewPage } from '@/pages/OverviewPage';
import { BuildingsPage } from '@/pages/BuildingsPage';
import { MapPage } from '@/pages/MapPage';
import { SolarAnalysisPage } from '@/pages/SolarAnalysisPage';
import { AgentPage } from '@/pages/AgentPage';
import { ReportsPage } from '@/pages/ReportsPage';
import { SettingsPage } from '@/pages/SettingsPage';

export default function App() {
  return (
    <BuildingsProvider>
      <HashRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<OverviewPage />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/buildings" element={<BuildingsPage />} />
            <Route path="/solar-analysis" element={<SolarAnalysisPage />} />
            <Route path="/agent" element={<AgentPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </AppLayout>
      </HashRouter>
    </BuildingsProvider>
  );
}
