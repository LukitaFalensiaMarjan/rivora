import { useStore, getScenarioData } from '../../store/useStore';
import { Card, RiskBadge, Badge } from '../../components/ui/Core';
import { Activity, ShieldAlert, Cpu, Bell, Navigation, Camera as CameraIcon } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Custom icons using divIcon for Neubrutalism style (Square as requested)
const createSquareIcon = (colorClass: string, isPulsing: boolean = false) => {
  return L.divIcon({
    className: 'custom-leaflet-icon',
    html: `
      <div class="w-6 h-6 ${colorClass} border-[3px] border-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all ${isPulsing ? 'animate-pulse' : ''}">
        <div class="w-2.5 h-2.5 bg-white rounded-full border-2 border-black"></div>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
};

const iconNormal = createSquareIcon('bg-brand-forest');
const iconWarning = createSquareIcon('bg-[#facc15]', true); // Yellow
const iconCritical = createSquareIcon('bg-brand-critical', true); // Red
const iconReport = L.divIcon({
  className: 'custom-leaflet-icon',
  html: `<div class="w-5 h-5 bg-[#facc15] rotate-45 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] animate-bounce flex items-center justify-center"><div class="w-1.5 h-1.5 bg-black rounded-full"></div></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10]
});

export default function DashboardOperator() {
  const { currentScenario, reports, setScenario } = useStore();
  const scenario = getScenarioData(currentScenario);

  const unverifiedCount = reports.filter(r => r.status === 'Menunggu Verifikasi').length;

  // Nodes placed along Cikapundung river as shown in screenshot
  const nodes = [
    { id: 'stabil', name: 'Pos Baksil (Hulu)', coords: [-6.8850, 107.6100] as [number, number], defaultStatus: 'normal' },
    { id: 'kualitas_buruk', name: 'Pos Tamansari', coords: [-6.8990, 107.6110] as [number, number], defaultStatus: 'critical' },
    { id: 'hujan_intensif', name: 'Pos Wastukencana', coords: [-6.9080, 107.6100] as [number, number], defaultStatus: 'critical' },
    { id: 'stabil_2', name: 'Pos Braga', coords: [-6.9150, 107.6080] as [number, number], defaultStatus: 'warning' },
    { id: 'air_naik', name: 'Pos Asia Afrika', coords: [-6.9210, 107.6070] as [number, number], defaultStatus: 'critical' },
    { id: 'kualitas_buruk_2', name: 'Pos Lengkong', coords: [-6.9280, 107.6060] as [number, number], defaultStatus: 'warning' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-3xl font-display font-bold uppercase mb-1">Pusat Kendali Operasi</h2>
          <p className="text-gray-600 font-mono text-sm">Pemantauan Terpadu Jaringan Sungai Kota Bandung</p>
        </div>
        <div className="flex gap-4">
          <Badge variant={scenario.risk === 'Berisiko Tinggi' ? 'critical' : 'success'} className="px-4 py-2 text-sm flex items-center gap-2">
            <Activity className="w-4 h-4" /> ENGINE ACTIVE
          </Badge>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        <Card className="bg-brand-dark text-white p-6">
          <div className="text-xs text-gray-400 font-bold uppercase mb-2">Status Risiko (Bandung Raya)</div>
          <div className="text-2xl font-display font-bold uppercase mb-4">{scenario.risk}</div>
          <RiskBadge risk={scenario.risk} />
        </Card>
        
        <Card className="p-6">
          <div className="text-xs text-gray-500 font-bold uppercase mb-2 flex items-center justify-between">
            Node Sensor (Bandung) <Cpu className="w-4 h-4 text-brand-forest" />
          </div>
          <div className="text-3xl font-display font-bold text-brand-forest mb-1">3/3</div>
          <div className="text-xs font-mono font-bold">ONLINE</div>
        </Card>

        <Card className="p-6 bg-brand-warning/10 border-brand-warning">
          <div className="text-xs text-gray-500 font-bold uppercase mb-2 flex items-center justify-between">
            Laporan Warga Tertunda <Bell className="w-4 h-4 text-brand-warning" />
          </div>
          <div className="text-3xl font-display font-bold text-brand-warning mb-1">{unverifiedCount}</div>
          <div className="text-xs font-mono font-bold">MENUNGGU VERIFIKASI</div>
        </Card>
        
        <Card className="p-6">
          <div className="text-xs text-gray-500 font-bold uppercase mb-2 flex items-center justify-between">
            Deteksi Visual AI <ShieldAlert className="w-4 h-4 text-brand-water" />
          </div>
          <div className="text-3xl font-display font-bold text-brand-water mb-1">{scenario.cameraDetections.length}</div>
          <div className="text-xs font-mono font-bold">ANOMALI TERDETEKSI (LIVE)</div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="h-[400px] p-0 overflow-hidden relative">
            <div className="absolute top-4 left-4 z-[400] bg-white border-2 border-brand-dark px-3 py-2 shadow-[4px_4px_0px_0px_rgba(23,23,23,1)] pointer-events-none">
              <h3 className="font-bold uppercase text-sm flex items-center gap-2">
                <Navigation className="w-4 h-4" /> Peta Sensor RIVORA
              </h3>
              <p className="text-[10px] font-mono text-gray-600 mt-1">Area: Bandung Raya</p>
            </div>
            
            <MapContainer center={[-6.9080, 107.6100]} zoom={14} className="w-full h-full z-10" zoomControl={true}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; OpenStreetMap contributors'
              />
              
              {nodes.map(node => {
                // Determine icon based on default status to match user's screenshot layout
                // In a real app, this would be tied to real-time data
                let icon = iconNormal;
                if (node.defaultStatus === 'warning') icon = iconWarning;
                if (node.defaultStatus === 'critical') icon = iconCritical;
                
                // Active scenario override
                if (currentScenario === node.id) {
                  if (scenario.risk === 'Berisiko Tinggi') icon = iconCritical;
                  else if (scenario.risk !== 'Minim Risiko') icon = iconWarning;
                  else icon = iconNormal;
                }

                return (
                  <Marker 
                    key={node.name}
                    position={node.coords} 
                    icon={icon}
                    eventHandlers={{ click: () => {
                      // Map to existing scenario IDs if possible
                      if (['stabil', 'kualitas_buruk', 'air_naik', 'hujan_intensif'].includes(node.id)) {
                        setScenario(node.id);
                      }
                    }}}
                  >
                    <Popup className="font-mono text-xs font-bold">
                      <div className="uppercase border-b border-gray-300 mb-1 pb-1">{node.name}</div>
                      Status: <span className={node.defaultStatus === 'critical' ? 'text-brand-critical' : node.defaultStatus === 'warning' ? 'text-brand-warning' : 'text-brand-forest'}>
                        {node.id === currentScenario ? scenario.risk : node.defaultStatus.toUpperCase()}
                      </span>
                      <br />
                      <button onClick={() => {
                        if (['stabil', 'kualitas_buruk', 'air_naik', 'hujan_intensif'].includes(node.id)) {
                          setScenario(node.id);
                        }
                      }} className="mt-2 bg-brand-dark text-white px-2 py-1 uppercase text-[9px] w-full">Lihat Detail</button>
                    </Popup>
                  </Marker>
                );
              })}

              {/* Citizen Report Marker */}
              {unverifiedCount > 0 && (
                <Marker position={[-6.9050, 107.6150]} icon={iconReport}>
                  <Popup className="font-mono text-xs font-bold">Laporan Warga (Baru)</Popup>
                </Marker>
              )}
            </MapContainer>
          </Card>

          <Card className="flex flex-col gap-6">
            <h3 className="font-display font-bold text-xl uppercase border-b-2 border-brand-dark pb-2 flex justify-between items-center">
              Analisis Komprehensif RIVORA 
              <span className="text-sm bg-gray-200 px-2 py-1 text-gray-600 font-mono">Node Terpilih</span>
            </h3>

            <div>
              <h4 className="font-bold uppercase text-sm mb-3 flex items-center gap-2 border-b border-gray-200 pb-1 text-brand-dark">
                <Cpu className="w-4 h-4" /> Kualitas Air (Sensor Node - ESP32)
              </h4>
              <div className="grid grid-cols-3 gap-4 font-mono text-sm">
                <div className="bg-gray-50 p-2 border border-gray-200">
                  <span className="text-gray-500 block text-[10px]">pH VALUE</span>
                  <span className="text-xl font-bold">{scenario.telemetry.pH.toFixed(1)}</span>
                </div>
                <div className="bg-gray-50 p-2 border border-gray-200">
                  <span className="text-gray-500 block text-[10px]">OXYGEN (DO)</span>
                  <span className="text-xl font-bold">{scenario.telemetry.do.toFixed(1)} <span className="text-[10px]">mg/L</span></span>
                </div>
                <div className="bg-gray-50 p-2 border border-gray-200">
                  <span className="text-gray-500 block text-[10px]">TDS</span>
                  <span className="text-xl font-bold">{scenario.telemetry.tds} <span className="text-[10px]">ppm</span></span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-bold uppercase text-sm mb-3 flex items-center gap-2 border-b border-gray-200 pb-1 text-brand-dark">
                <Activity className="w-4 h-4" /> Hidrologis & Cuaca
              </h4>
              <div className="grid grid-cols-3 gap-4 font-mono text-sm">
                <div className="bg-gray-50 p-2 border border-gray-200">
                  <span className="text-gray-500 block text-[10px]">WATER LEVEL</span>
                  <span className="text-xl font-bold">{scenario.telemetry.waterLevel.toFixed(1)} <span className="text-[10px]">cm</span></span>
                  <span className="ml-2 text-xs font-bold text-brand-forest">{scenario.trend}</span>
                </div>
                <div className="bg-gray-50 p-2 border border-gray-200">
                  <span className="text-gray-500 block text-[10px]">RAINFALL</span>
                  <span className="text-xl font-bold">{scenario.telemetry.rainfall.toFixed(1)} <span className="text-[10px]">mm</span></span>
                </div>
                <div className="bg-gray-50 p-2 border border-gray-200">
                  <span className="text-gray-500 block text-[10px]">TEMP</span>
                  <span className="text-xl font-bold">{scenario.telemetry.temp.toFixed(1)} <span className="text-[10px]">°C</span></span>
                </div>
              </div>
            </div>
            
            <div className="bg-brand-sand/30 p-3 border border-brand-dark text-xs font-mono flex flex-col gap-1">
              <strong>Risk Assessment & Estimasi:</strong>
              <span>Prediksi 6 jam ke depan menunjukkan tingkat risiko <strong>{scenario.forecast6h.toUpperCase()}</strong> berdasarkan tren hidrologis dan cuaca.</span>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Mini Live Camera Feed */}
          <Card className="bg-brand-sand p-4 border-brand-water">
            <h3 className="font-bold uppercase text-sm mb-3 flex justify-between items-center">
              <span className="flex items-center gap-2 truncate"><CameraIcon className="w-4 h-4 text-brand-water shrink-0" /> Edge Node (Reused Smartphone)</span>
              <span className="text-[9px] bg-brand-critical text-white px-1 py-0.5 animate-pulse shrink-0">VISUAL AI</span>
            </h3>
            
            <div className="relative aspect-video bg-gray-900 border-2 border-brand-dark overflow-hidden mb-3">
              <img src={`${import.meta.env.BASE_URL}${scenario.imageSrc || 'river_monitoring.jpg'}`} alt="Mini Feed" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-brand-water/10 mix-blend-overlay"></div>
              {!scenario.imageSrc && scenario.cameraDetections.map((det, i) => (
                <div 
                  key={i} 
                  className="absolute border-2 border-brand-warning bg-brand-warning/20 shadow-[0_0_5px_rgba(245,158,11,0.5)]"
                  style={{ left: `${det.box.x}%`, top: `${det.box.y}%`, width: `${det.box.w}%`, height: `${det.box.h}%` }}
                ></div>
              ))}
            </div>
            
            <div className="text-xs font-mono text-gray-700 bg-white p-2 border border-brand-dark mb-4">
              Lokasi: {nodes.find(n => n.id === currentScenario)?.name || 'Node Terpilih'}
              <br/>
              Anomali Visual: <span className="font-bold text-brand-warning">{scenario.cameraDetections.length} Objek</span>
            </div>
            
            <h3 className="font-bold uppercase text-sm mb-2 border-t-2 border-gray-300 pt-3">AI Prediktif & Root Cause</h3>
            <p className="text-xs font-mono bg-white p-3 border-l-4 border-brand-water border border-y-brand-dark border-r-brand-dark">
              {scenario.advisory}
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
