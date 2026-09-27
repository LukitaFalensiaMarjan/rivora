import { useStore, getScenarioData } from '../../store/useStore';
import { Card, RiskBadge, Button } from '../../components/ui/Core';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AlertTriangle, Info, Camera as CameraIcon, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function DashboardMasyarakat() {
  const { currentScenario, reports } = useStore();
  const scenario = getScenarioData(currentScenario);
  const navigate = useNavigate();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Top Banner - Condition & Advisory */}
      <section>
        <Card className={`text-white p-8 ${
          scenario.risk === 'Sangat Minim Risiko' || scenario.risk === 'Minim Risiko' ? 'bg-brand-forest' :
          scenario.risk === 'Berisiko Tinggi' ? 'bg-brand-critical' : 'bg-brand-warning text-black'
        }`}>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-widest mb-2 opacity-90">STATUS SUNGAI SAAT INI</h2>
              <div className="text-4xl font-display font-bold mb-4 uppercase">{scenario.risk}</div>
              <div className="flex items-center gap-2 mb-2 font-mono text-sm">
                <Clock className="w-4 h-4" /> Pembaruan Terakhir: {new Date().toLocaleTimeString('id-ID')} WIB
              </div>
              <div className="flex items-center gap-2 font-mono text-sm">
                <Info className="w-4 h-4" /> Pos Pantau Sungai Cikapundung — Bandung
              </div>
            </div>
            
            <div className="bg-black/10 p-6 border-l-4 border-current">
              <h3 className="font-bold uppercase mb-2 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Himbauan untuk Masyarakat
              </h3>
              <p className="text-lg leading-relaxed">{scenario.advisory}</p>
            </div>
          </div>
        </Card>
      </section>

      {/* Main Metrics Grid */}
      <section className="grid lg:grid-cols-3 gap-6">
        
        <Card className="col-span-2">
          <h3 className="font-display font-bold text-xl uppercase mb-6 flex justify-between items-center">
            <span>Data Pemantauan Sensor</span>
            <span className="text-xs font-mono bg-gray-200 px-2 py-1">REAL-TIME</span>
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="border-2 border-brand-dark p-4 bg-brand-sand">
              <div className="text-sm font-bold text-gray-500 uppercase mb-1">Tinggi Air</div>
              <div className="text-3xl font-display font-bold">{scenario.telemetry.waterLevel.toFixed(1)} <span className="text-sm">cm</span></div>
              <div className="text-xs font-bold mt-2 text-brand-forest">{scenario.trend === 'Naik' ? '↑ Naik' : scenario.trend === 'Turun' ? '↓ Turun' : '→ Stabil'}</div>
            </div>
            <div className="border-2 border-brand-dark p-4">
              <div className="text-sm font-bold text-gray-500 uppercase mb-1">Curah Hujan</div>
              <div className="text-3xl font-display font-bold">{scenario.telemetry.rainfall.toFixed(1)} <span className="text-sm">mm</span></div>
            </div>
            <div className="border-2 border-brand-dark p-4">
              <div className="text-sm font-bold text-gray-500 uppercase mb-1">pH Air</div>
              <div className="text-3xl font-display font-bold">{scenario.telemetry.pH.toFixed(1)}</div>
            </div>
            <div className="border-2 border-brand-dark p-4">
              <div className="text-sm font-bold text-gray-500 uppercase mb-1">Oksigen (DO)</div>
              <div className="text-3xl font-display font-bold">{scenario.telemetry.do.toFixed(1)} <span className="text-sm">mg/L</span></div>
            </div>
          </div>

          <div className="h-64 mt-4">
            <h4 className="text-sm font-bold uppercase mb-4 text-gray-500">Tren Ketinggian Air (6 Jam Terakhir)</h4>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={scenario.history}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="time" stroke="#171717" fontSize={12} tickLine={false} />
                <YAxis stroke="#171717" fontSize={12} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 0, border: '2px solid #171717', boxShadow: '4px 4px 0px 0px rgba(23,23,23,1)' }} />
                <Line type="monotone" dataKey="waterLevel" name="Tinggi Air (cm)" stroke="#0e7490" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* AI Camera & Forecast */}
        <div className="space-y-6">
          <Card noPadding>
            <div className="p-4 border-b-2 border-brand-dark bg-brand-dark text-white flex justify-between items-center">
              <h3 className="font-bold uppercase flex items-center gap-2">
                <CameraIcon className="w-5 h-5" /> Visual AI
              </h3>
              <span className="text-xs font-mono bg-brand-forest px-2 py-0.5 border border-white/20">AKTIF</span>
            </div>
            <div className="relative aspect-video bg-gray-200 overflow-hidden">
              <img src={`${import.meta.env.BASE_URL}river_monitoring.jpg`} alt="Live River" className="w-full h-full object-cover grayscale opacity-90" />
              <div className="absolute inset-0 bg-brand-forest/10 mix-blend-multiply"></div>
              
              {scenario.cameraDetections.map((det, i) => (
                <div 
                  key={i} 
                  className="absolute border-2 border-brand-warning bg-brand-warning/20 transition-all duration-300"
                  style={{ left: `${det.box.x}%`, top: `${det.box.y}%`, width: `${det.box.w}%`, height: `${det.box.h}%` }}
                >
                  <div className="absolute -top-6 left-[-2px] bg-brand-warning text-black text-[10px] font-bold px-1 whitespace-nowrap border-2 border-brand-warning shadow-[2px_2px_0px_0px_rgba(23,23,23,1)]">
                    {det.class} ({det.confidence}%)
                  </div>
                </div>
              ))}
              
              <div className="absolute bottom-2 left-2 bg-black/70 text-white text-[10px] font-mono px-2 py-1">
                Data Demonstrasi — Simulasi CV
              </div>
            </div>
            {scenario.cameraDetections.length > 0 && (
              <div className="p-4 bg-brand-warning/10 border-t-2 border-brand-dark">
                <div className="text-sm font-bold text-brand-dark">Indikasi objek terdeteksi. Pemeriksaan lanjutan disarankan.</div>
              </div>
            )}
          </Card>

          <Card>
            <h3 className="font-display font-bold uppercase mb-4">Estimasi Risiko Jangka Pendek</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center border-b-2 border-dashed border-gray-300 pb-2">
                <span className="text-sm font-bold text-gray-600">Saat Ini</span>
                <RiskBadge risk={scenario.risk} />
              </div>
              <div className="flex justify-between items-center border-b-2 border-dashed border-gray-300 pb-2">
                <span className="text-sm font-bold text-gray-600">+1 Jam</span>
                <RiskBadge risk={scenario.forecast1h} />
              </div>
              <div className="flex justify-between items-center border-b-2 border-dashed border-gray-300 pb-2">
                <span className="text-sm font-bold text-gray-600">+3 Jam</span>
                <RiskBadge risk={scenario.forecast3h} />
              </div>
              <div className="flex justify-between items-center pb-2">
                <span className="text-sm font-bold text-gray-600">+6 Jam</span>
                <RiskBadge risk={scenario.forecast6h} />
              </div>
            </div>
            <div className="mt-4 text-xs text-gray-500 italic bg-gray-100 p-2 border border-gray-200">
              Berdasarkan model tren hidrologi dan cuaca. Bukan kepastian absolut.
            </div>
          </Card>
        </div>
      </section>

      {/* Community Reports */}
      <section>
        <div className="flex justify-between items-end mb-6">
          <div>
            <h3 className="font-display font-bold text-2xl uppercase">Laporan Masyarakat</h3>
            <p className="text-gray-600">Partisipasi publik dalam memantau kondisi sungai.</p>
          </div>
          <Button onClick={() => navigate('/masyarakat/lapor')}>Laporkan Kondisi</Button>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.slice(0, 3).map(report => (
            <Card key={report.id} className="flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-mono font-bold bg-brand-dark text-white px-2 py-1">{report.id}</span>
                <span className={`text-[10px] font-bold uppercase px-2 py-1 border-2 ${
                  report.status === 'Terverifikasi' ? 'bg-brand-forest text-white border-brand-dark' :
                  report.status === 'Menunggu Verifikasi' ? 'bg-brand-warning text-black border-brand-dark' :
                  'bg-gray-200 text-gray-800 border-gray-800'
                }`}>
                  {report.status}
                </span>
              </div>
              <h4 className="font-bold text-lg mb-1">{report.title}</h4>
              <div className="text-sm text-gray-600 mb-4">{report.location} • {new Date(report.time).toLocaleDateString('id-ID')}</div>
              <p className="text-sm mb-6 flex-1 line-clamp-3">{report.desc}</p>
              <Button variant="outline" className="w-full text-xs">Lihat Detail</Button>
            </Card>
          ))}
        </div>
      </section>

    </div>
  );
}
