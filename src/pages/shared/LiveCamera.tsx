import { useStore, getScenarioData } from '../../store/useStore';
import { Card, Badge, RiskBadge } from '../../components/ui/Core';
import { Camera as CameraIcon, AlertTriangle, Droplets, Thermometer, Wind, BrainCircuit, Search, MapPin } from 'lucide-react';

export default function LiveCamera() {
  const { currentScenario, setScenario } = useStore();
  const scenario = getScenarioData(currentScenario);
  
  const nodes = [
    { id: 'stabil', name: 'Pos Cikapundung', label: 'Cikapundung' },
    { id: 'kualitas_buruk', name: 'Pos Dayeuhkolot', label: 'Dayeuhkolot' },
    { id: 'hujan_intensif', name: 'Pos Antapani', label: 'Antapani' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-4 border-b-2 border-brand-dark pb-4 gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold uppercase mb-1 flex items-center gap-2">
            <CameraIcon className="w-8 h-8 text-brand-water" /> Live Monitoring & Vision
          </h2>
          <p className="text-gray-600 font-mono text-sm flex items-center gap-2">
            <MapPin className="w-4 h-4" /> Pilih Titik Pemantauan (Bandung Raya):
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {nodes.map(n => (
              <button 
                key={n.id}
                onClick={() => setScenario(n.id)}
                className={`text-xs font-bold uppercase tracking-wider px-3 py-1.5 border-2 border-brand-dark shadow-[2px_2px_0px_0px_rgba(23,23,23,1)] hover:-translate-y-0.5 transition-all ${currentScenario === n.id ? 'bg-brand-dark text-white' : 'bg-white hover:bg-gray-100'}`}
              >
                {n.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          <Badge variant="success" className="px-3 py-1.5 flex items-center gap-2 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-white block"></span> FEED ONLINE
          </Badge>
          <RiskBadge risk={scenario.risk} />
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Main Camera Feed Column */}
        <div className="lg:col-span-3 space-y-4">
          <Card noPadding className="relative aspect-video bg-gray-900 overflow-hidden border-4 border-brand-dark shadow-[6px_6px_0px_0px_rgba(23,23,23,1)]">
            
            {/* Top Left HUD */}
            <div className="absolute top-4 left-4 z-10 flex gap-1">
              <span className="bg-red-600 text-white px-3 py-1.5 text-xs font-bold tracking-widest flex items-center gap-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)]">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span> LIVE
              </span>
              <span className="bg-black/80 text-white px-3 py-1.5 text-xs font-mono font-bold tracking-widest shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)]">
                {new Date().toLocaleTimeString('id-ID')}
              </span>
            </div>
            
            {/* Top Right HUD */}
            <div className="absolute top-4 right-4 z-10 bg-black/80 text-white p-2 min-w-[180px] flex flex-col items-end border-t-4 border-brand-water shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)]">
              <span className="text-xs font-bold tracking-wider">AUV-01</span>
              <span className="text-[10px] flex items-center gap-1 text-gray-300">
                <MapPin className="w-3 h-3 text-brand-water" /> {nodes.find(n => n.id === currentScenario)?.label || 'Cikapundung Tengah'}
              </span>
            </div>

            {/* Base Image */}
            <img src="/river_monitoring.jpg" alt="Live River Stream" className="w-full h-full object-cover" />
            
            {/* AI Bounding Boxes */}
            {scenario.cameraDetections.map((det, i) => {
              const colorClass = det.type === 'critical' ? 'border-red-600' : 'border-[#facc15]';
              const bgClass = det.type === 'critical' ? 'bg-red-600' : 'bg-[#facc15]';
              const textClass = det.type === 'critical' ? 'text-white' : 'text-black';

              return (
                <div 
                  key={i} 
                  className={`absolute border-4 ${colorClass} transition-all duration-300 shadow-[0_0_10px_rgba(0,0,0,0.5)]`}
                  style={{ left: `${det.box.x}%`, top: `${det.box.y}%`, width: `${det.box.w}%`, height: `${det.box.h}%` }}
                >
                  {/* Corner Accents */}
                  <div className={`absolute -top-1 -left-1 w-3 h-3 border-t-4 border-l-4 ${colorClass}`}></div>
                  <div className={`absolute -top-1 -right-1 w-3 h-3 border-t-4 border-r-4 ${colorClass}`}></div>
                  <div className={`absolute -bottom-1 -left-1 w-3 h-3 border-b-4 border-l-4 ${colorClass}`}></div>
                  <div className={`absolute -bottom-1 -right-1 w-3 h-3 border-b-4 border-r-4 ${colorClass}`}></div>
                  
                  {/* Label on top of border */}
                  <div className={`absolute -top-7 left-[-4px] ${bgClass} ${textClass} text-xs font-bold px-2 py-1 whitespace-nowrap z-20 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)]`}>
                    {det.class} - {det.confidence}%
                  </div>
                </div>
              );
            })}

            {/* Bottom Left HUD */}
            <div className="absolute bottom-4 left-4 z-10">
              <span className="bg-blue-600 text-white px-3 py-2 text-xs font-bold tracking-widest uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)]">
                AI VISION ACTIVE • {scenario.cameraDetections.length} DETEKSI
              </span>
            </div>

            {/* Bottom Right HUD */}
            <div className="absolute bottom-4 right-4 z-10">
              <span className="bg-black/80 text-gray-300 px-3 py-1.5 text-[10px] font-mono tracking-widest border border-white/20 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)]">
                1920x1080 • 30fps
              </span>
            </div>
          </Card>

          <div className="grid md:grid-cols-2 gap-4">
            <Card className="bg-brand-sand border-brand-dark border-2">
              <div className="flex gap-4 items-start">
                <BrainCircuit className="w-6 h-6 text-brand-dark shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold uppercase text-sm mb-1">AI Predictive Analysis</h4>
                  <p className="text-xs font-mono text-gray-700 bg-white p-3 border border-gray-300 mt-2">
                    {scenario.id === 'stabil' && "Kondisi air terpantau stabil. Tren menunjukkan tidak ada potensi limpasan dalam 6 jam ke depan. Model AI memprediksi kualitas air berada pada batas aman."}
                    {scenario.id === 'kualitas_buruk' && "Deteksi AI: Penumpukan material plastik dan organik terpantau. Potensi penyumbatan pada jeruji penyaring dalam 4-6 jam jika debit naik."}
                    {scenario.id === 'air_naik' && "Analisis hidrologi AI: Peningkatan debit sungai secara eksponensial terdeteksi. Meskipun curah hujan lokal sedang, terdapat potensi banjir kiriman dari hulu yang tiba dalam 45 menit."}
                    {scenario.id === 'hujan_intensif' && "Prediksi Kritis: Hujan intensif bertepatan dengan titik jenuh resapan tanah. Analisis topografi memprediksi limpasan sungai di titik Cikapundung Bawah dalam waktu < 2 jam."}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="bg-brand-sand border-brand-dark border-2">
              <div className="flex gap-4 items-start">
                <Search className="w-6 h-6 text-brand-critical shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold uppercase text-sm mb-1">Root Cause / Rekomendasi</h4>
                  <p className="text-xs font-mono text-gray-700 bg-white p-3 border-l-4 border-brand-critical border border-y-gray-300 border-r-gray-300 mt-2">
                    {scenario.advisory}
                    <br/><br/>
                    <strong className="text-brand-dark">Saran Tindakan:</strong>
                    <br/>
                    {scenario.id === 'stabil' && "- Lanjutkan pemantauan rutin.\n- Tidak diperlukan intervensi lapangan."}
                    {scenario.id === 'kualitas_buruk' && "- Kirim kru pembersih (Tim Gober) ke area penyaring utama.\n- Pantau laju tumpukan sampah."}
                    {scenario.id === 'air_naik' && "- Aktifkan sirine peringatan dini (Early Warning System) level 1.\n- Pantau CCTV hulu sungai secara terus-menerus."}
                    {scenario.id === 'hujan_intensif' && "- EVAKUASI: Sirine level 3 dibunyikan.\n- Koordinasi langsung dengan BPBD Kota Bandung.\n- Tutup pintu air sekunder."}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Side Panel: Detail Data */}
        <div className="space-y-6">
          <Card className="border-brand-dark p-4">
            <h3 className="font-bold uppercase text-sm mb-4 border-b-2 border-gray-200 pb-2 flex justify-between items-center">
              Data Sensor (Live)
              <span className="text-[9px] bg-brand-dark text-white px-1 py-0.5 animate-pulse">SYNC</span>
            </h3>
            <div className="space-y-4 font-mono text-sm">
              <div className="flex justify-between items-center p-2 bg-gray-50 border border-gray-200 hover:border-brand-dark transition-colors">
                <span className="text-gray-500 flex items-center gap-2"><Droplets className="w-4 h-4"/> pH Air:</span>
                <span className="font-bold">{scenario.telemetry.pH.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 border border-gray-200 hover:border-brand-dark transition-colors">
                <span className="text-gray-500 flex items-center gap-2"><Droplets className="w-4 h-4 text-brand-water"/> Oksigen (DO):</span>
                <span className="font-bold">{scenario.telemetry.do.toFixed(2)} mg/L</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 border border-gray-200 hover:border-brand-dark transition-colors">
                <span className="text-gray-500 flex items-center gap-2"><Wind className="w-4 h-4"/> TDS:</span>
                <span className="font-bold">{scenario.telemetry.tds} ppm</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 border border-gray-200 hover:border-brand-dark transition-colors">
                <span className="text-gray-500 flex items-center gap-2"><Thermometer className="w-4 h-4 text-brand-warning"/> Suhu Air:</span>
                <span className="font-bold">{scenario.telemetry.temp.toFixed(1)} °C</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 border border-gray-200 hover:border-brand-dark transition-colors">
                <span className="text-gray-500 flex items-center gap-2"><Wind className="w-4 h-4 text-brand-water"/> Elevasi:</span>
                <span className="font-bold text-brand-water">{scenario.telemetry.waterLevel.toFixed(1)} cm</span>
              </div>
            </div>
          </Card>

          <Card className="border-brand-dark p-4 flex-1">
            <h3 className="font-bold uppercase text-sm mb-4 border-b-2 border-gray-200 pb-2">Log Computer Vision</h3>
            
            {scenario.cameraDetections.length === 0 ? (
              <div className="text-sm text-gray-500 italic py-6 text-center border-2 border-dashed border-gray-200">Tidak ada objek anomali (sampah/penghalang) terdeteksi saat ini.</div>
            ) : (
              <div className="space-y-3">
                {scenario.cameraDetections.map((det, i) => (
                  <div key={i} className="bg-brand-warning/10 border-2 border-brand-warning p-3 hover:bg-brand-warning/20 transition-colors cursor-pointer shadow-sm">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-bold text-xs">{det.class}</span>
                      <span className="font-mono text-xs font-bold text-brand-warning bg-white px-1 border border-brand-warning">{det.confidence}%</span>
                    </div>
                    <div className="text-[10px] text-gray-500 font-mono flex justify-between">
                      <span>Pos: {det.box.x}, {det.box.y}</span>
                      <span className="text-brand-dark font-bold">Auto-Logged</span>
                    </div>
                  </div>
                ))}
                
                <div className="mt-4 p-3 bg-brand-critical/10 border border-brand-critical text-brand-critical text-[10px] font-bold flex gap-2 shadow-sm leading-tight">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  Objek berpotensi menyumbat aliran. Analisis aliran merekomendasikan pembersihan dalam waktu kurang dari 24 jam.
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
