import type { ReactNode } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import DashboardMasyarakat from './pages/masyarakat/DashboardMasyarakat';
import LiveCamera from './pages/shared/LiveCamera';
import Laporan from './pages/shared/Laporan';
import DashboardOperator from './pages/operator/DashboardOperator';
import { useStore } from './store/useStore';

// Protective routing wrappers
const RequireMasyarakat = ({ children }: { children: ReactNode }) => {
  const role = useStore(state => state.role);
  if (role !== 'masyarakat') return <Navigate to="/login" replace />;
  return children;
};

const RequireOperator = ({ children }: { children: ReactNode }) => {
  const role = useStore(state => state.role);
  if (role !== 'operator') return <Navigate to="/login" replace />;
  return children;
};

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        
        <Route element={<MainLayout />}>
          {/* PUBLIC ROUTES */}
          <Route path="/masyarakat" element={<RequireMasyarakat><DashboardMasyarakat /></RequireMasyarakat>} />
          <Route path="/masyarakat/camera" element={<RequireMasyarakat><LiveCamera /></RequireMasyarakat>} />
          <Route path="/masyarakat/reports" element={<RequireMasyarakat><Laporan /></RequireMasyarakat>} />
          
          {/* OPERATOR ROUTES */}
          <Route path="/operator" element={<RequireOperator><DashboardOperator /></RequireOperator>} />
          <Route path="/operator/camera" element={<RequireOperator><LiveCamera /></RequireOperator>} />
          <Route path="/operator/reports" element={<RequireOperator><Laporan /></RequireOperator>} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
