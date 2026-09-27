import { useState } from 'react';
import { useStore, getScenarioData } from '../../store/useStore';
import { Card, Badge, Button } from '../../components/ui/Core';
import { CheckCircle, XCircle, AlertCircle, RefreshCcw, ShieldAlert } from 'lucide-react';

export default function VerifikasiLaporan() {
  const { reports, updateReportStatus, currentScenario } = useStore();
  const scenario = getScenarioData(currentScenario);
  
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);

  const pendingReports = reports.filter(r => r.status === 'Menunggu Verifikasi' || r.status === 'Perlu Ditinjau');
  const verifiedReports = reports.filter(r => r.status === 'Terverifikasi' || r.status === 'Tidak Terdukung Data');

  const selectedReport = reports.find(r => r.id === selectedReportId);

  const handleVerify = (status: 'Terverifikasi' | 'Perlu Ditinjau' | 'Tidak Terdukung Data') => {
    if (selectedReportId) {
      updateReportStatus(selectedReportId, status);
      setSelectedReportId(null);
    }
  };

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1 border-r-2 border-brand-dark pr-8">
        <h2 className="text-2xl font-display font-bold uppercase mb-6">Antrean Laporan</h2>
        
        <div className="space-y-4 mb-8">
          <h3 className="text-sm font-bold uppercase text-gray-500 border-b-2 border-brand-dark pb-1">Menunggu Tindakan ({pendingReports.length})</h3>
          {pendingReports.map(report => (
            <div 
              key={report.id} 
              onClick={() => setSelectedReportId(report.id)}
              className={`p-4 border-2 cursor-pointer transition-all ${
                selectedReportId === report.id 
                  ? 'border-brand-forest shadow-[4px_4px_0px_0px_rgba(26,71,49,1)] translate-x-[-2px] translate-y-[-2px]' 
                  : 'border-brand-dark bg-white hover:bg-gray-50'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="font-mono text-xs font-bold">{report.id}</span>
                <Badge variant={report.status === 'Perlu Ditinjau' ? 'warning' : 'neutral'} className="text-[10px]">{report.status}</Badge>
              </div>
              <div className="font-bold text-sm mb-1">{report.title}</div>
              <div className="text-xs text-gray-500">{report.category} • {new Date(report.time).toLocaleDateString('id-ID')}</div>
            </div>
          ))}
          {pendingReports.length === 0 && (
            <div className="text-sm italic text-gray-500">Tidak ada antrean baru.</div>
          )}
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase text-gray-500 border-b-2 border-brand-dark pb-1">Riwayat Selesai ({verifiedReports.length})</h3>
          {verifiedReports.map(report => (
            <div 
              key={report.id} 
              onClick={() => setSelectedReportId(report.id)}
              className="p-3 border border-gray-300 bg-gray-50 cursor-pointer hover:bg-gray-100"
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-mono text-[10px] font-bold text-gray-500">{report.id}</span>
                <span className={`text-[10px] font-bold uppercase ${report.status === 'Terverifikasi' ? 'text-brand-forest' : 'text-gray-500'}`}>
                  {report.status}
                </span>
              </div>
              <div className="text-xs font-bold text-gray-700">{report.title}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="lg:col-span-2">
        {selectedReport ? (
          <div className="space-y-6">
            <Card className="border-t-8 border-t-brand-dark">
              <div className="flex justify-between items-start mb-6 border-b-2 border-gray-200 pb-4">
                <div>
                  <h2 className="text-2xl font-display font-bold mb-2">{selectedReport.title}</h2>
                  <div className="flex gap-3 text-sm text-gray-600 font-mono">
                    <span>ID: {selectedReport.id}</span>
                    <span>WAKTU: {new Date(selectedReport.time).toLocaleString('id-ID')}</span>
                  </div>
                </div>
                <Badge variant={
                  selectedReport.status === 'Terverifikasi' ? 'success' :
                  selectedReport.status === 'Tidak Terdukung Data' ? 'neutral' : 'warning'
                }>{selectedReport.status}</Badge>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-6">
                <div>
                  <h4 className="text-xs font-bold uppercase text-gray-500 mb-1">Lokasi Laporan</h4>
                  <div className="font-bold mb-4">{selectedReport.location}</div>
                  
                  <h4 className="text-xs font-bold uppercase text-gray-500 mb-1">Kategori</h4>
                  <div className="font-bold mb-4">{selectedReport.category}</div>
                  
                  <h4 className="text-xs font-bold uppercase text-gray-500 mb-1">Deskripsi Warga</h4>
                  <p className="text-sm bg-gray-50 p-4 border border-gray-200 italic">"{selectedReport.desc}"</p>
                </div>
                
                <div>
                  <h4 className="text-xs font-bold uppercase text-gray-500 mb-2">Lampiran Media</h4>
                  <div className="aspect-video bg-gray-200 border-2 border-brand-dark flex items-center justify-center text-gray-400 font-mono text-sm">
                    [Tidak ada foto dilampirkan]
                  </div>
                </div>
              </div>
            </Card>

            <Card className="bg-brand-sand border-brand-water border-2">
              <h3 className="font-display font-bold uppercase mb-4 flex items-center gap-2">
                <RefreshCcw className="w-5 h-5 text-brand-water" /> Cross-Reference Data Telemetri
              </h3>
              
              <div className="grid grid-cols-3 gap-4 font-mono text-sm mb-6">
                <div className="bg-white p-3 border-2 border-brand-dark">
                  <div className="text-xs text-gray-500 mb-1">WATER LEVEL</div>
                  <div className="font-bold">{scenario.telemetry.waterLevel.toFixed(1)} cm</div>
                </div>
                <div className="bg-white p-3 border-2 border-brand-dark">
                  <div className="text-xs text-gray-500 mb-1">pH / DO</div>
                  <div className="font-bold">{scenario.telemetry.pH} / {scenario.telemetry.do}</div>
                </div>
                <div className="bg-white p-3 border-2 border-brand-dark">
                  <div className="text-xs text-gray-500 mb-1">CAMERA DETECTIONS</div>
                  <div className="font-bold">{scenario.cameraDetections.length} Obj</div>
                </div>
              </div>

              {selectedReport.status === 'Menunggu Verifikasi' || selectedReport.status === 'Perlu Ditinjau' ? (
                <div className="border-t-2 border-brand-dark pt-6 mt-6">
                  <h4 className="font-bold uppercase text-sm mb-4">Tindakan Operator</h4>
                  <div className="flex gap-4">
                    <Button 
                      variant="primary" 
                      className="flex-1 flex justify-center items-center gap-2"
                      onClick={() => handleVerify('Terverifikasi')}
                    >
                      <CheckCircle className="w-4 h-4" /> Verifikasi
                    </Button>
                    <Button 
                      variant="outline"
                      className="flex-1 flex justify-center items-center gap-2"
                      onClick={() => handleVerify('Perlu Ditinjau')}
                    >
                      <AlertCircle className="w-4 h-4" /> Perlu Ditinjau
                    </Button>
                    <Button 
                      variant="danger"
                      className="flex-1 flex justify-center items-center gap-2"
                      onClick={() => handleVerify('Tidak Terdukung Data')}
                    >
                      <XCircle className="w-4 h-4" /> Tolak (Data Tidak Relevan)
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="border-t-2 border-brand-dark pt-6 mt-6">
                  <div className="bg-white p-4 border border-gray-300">
                    <div className="text-sm font-bold uppercase mb-2">Laporan telah diproses</div>
                    <p className="text-sm text-gray-600">Status akhir: <span className="font-bold text-brand-dark">{selectedReport.status}</span></p>
                  </div>
                </div>
              )}
            </Card>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 border-4 border-dashed border-gray-200 p-12">
            <ShieldAlert className="w-16 h-16 mb-4 opacity-50" />
            <h3 className="text-xl font-bold uppercase mb-2">Pilih Laporan</h3>
            <p className="text-center text-sm max-w-sm">
              Pilih laporan dari daftar di sebelah kiri untuk melihat detail, melakukan cross-reference dengan data sensor, dan memberikan verifikasi.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
