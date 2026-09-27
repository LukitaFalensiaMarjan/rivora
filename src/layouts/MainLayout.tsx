import { useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useStore, getAvailableScenarios } from '../store/useStore';
import { Activity, LogOut, LayoutDashboard, FileText, Settings, Play, Menu, X, Camera } from 'lucide-react';
import { useState } from 'react';

export default function MainLayout() {
  const { role, setRole, presentationMode, togglePresentationMode, currentScenario, setScenario, fluctuateTelemetry } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      fluctuateTelemetry();
    }, 2000);
    return () => clearInterval(interval);
  }, [fluctuateTelemetry]);

  const handleLogout = () => {
    setRole(null);
    navigate('/');
  };

  const navLinks = role === 'operator' ? [
    { name: 'Dashboard', path: '/operator', icon: LayoutDashboard },
    { name: 'Live Camera', path: '/operator/camera', icon: Camera },
    { name: 'Reports & Verify', path: '/operator/reports', icon: FileText },
  ] : [
    { name: 'Overview', path: '/masyarakat', icon: LayoutDashboard },
    { name: 'Live Monitoring', path: '/masyarakat/camera', icon: Camera },
    { name: 'Reports', path: '/masyarakat/reports', icon: FileText },
  ];

  return (
    <div className="min-h-screen flex bg-brand-sand topo-bg">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-white border-r-2 border-brand-dark flex flex-col transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-4 border-b-2 border-brand-dark flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img src={`${import.meta.env.BASE_URL}logo.png`} alt="RIVORA" className="h-10 object-contain" />
          </div>
          <button className="lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {role && (
          <div className="p-4 border-b-2 border-brand-dark bg-brand-sand">
            <div className="text-[10px] font-bold text-gray-500 uppercase mb-1">Logged in as</div>
            <div className="font-mono text-sm font-bold uppercase">{role}</div>
          </div>
        )}
        
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path || (link.path !== '/operator' && link.path !== '/masyarakat' && location.pathname.startsWith(link.path));
            return (
              <Link 
                key={link.name} 
                to={link.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 p-3 font-bold uppercase tracking-wider text-xs transition-colors border-2 ${isActive ? 'bg-brand-forest text-white border-brand-dark shadow-[2px_2px_0px_0px_rgba(23,23,23,1)]' : 'bg-transparent border-transparent text-gray-600 hover:border-gray-300 hover:bg-gray-50'}`}
              >
                <Icon className="w-4 h-4" />
                {link.name}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t-2 border-brand-dark space-y-2">
          <button onClick={togglePresentationMode} className="w-full flex items-center justify-center gap-2 p-3 font-bold uppercase tracking-wider text-xs bg-brand-water text-white border-2 border-brand-dark shadow-[2px_2px_0px_0px_rgba(23,23,23,1)] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_rgba(23,23,23,1)] transition-all">
            <Play className="h-4 w-4" /> Mode Demo
          </button>
          
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 p-3 font-bold uppercase tracking-wider text-xs bg-brand-critical text-white border-2 border-brand-dark shadow-[2px_2px_0px_0px_rgba(23,23,23,1)] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_rgba(23,23,23,1)] transition-all">
            <LogOut className="h-4 w-4" /> Keluar
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="lg:hidden border-b-2 border-brand-dark bg-white p-4 flex justify-between items-center sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <Activity className="h-6 w-6 text-brand-forest" />
            <span className="font-display font-bold text-xl tracking-tighter">RIVORA</span>
          </div>
          <button onClick={() => setSidebarOpen(true)}>
            <Menu className="w-6 h-6" />
          </button>
        </header>

        {presentationMode && (
          <div className="bg-brand-warning border-b-2 border-brand-dark px-4 py-2 sticky top-0 lg:top-0 z-20 flex flex-col sm:flex-row sm:justify-between sm:items-center shadow-md gap-2">
            <div className="font-bold text-sm uppercase flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Skenario Presentasi Aktif
            </div>
            <div className="flex gap-2 items-center">
              <span className="text-xs font-bold hidden sm:inline">PILIH KONDISI:</span>
              <select 
                className="border-2 border-brand-dark bg-white px-2 py-1 text-sm font-bold w-full sm:w-64"
                value={currentScenario}
                onChange={(e) => setScenario(e.target.value)}
              >
                {getAvailableScenarios().map(sc => (
                  <option key={sc.id} value={sc.id}>{sc.name}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
