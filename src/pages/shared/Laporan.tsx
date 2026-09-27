import { useState } from 'react';
import { useStore, getScenarioData } from '../../store/useStore';
import type { Report } from '../../store/useStore';
import { Card, Badge, Button } from '../../components/ui/Core';
import { CheckCircle, XCircle, AlertCircle, RefreshCcw, ShieldAlert, MapPin, Upload, FileText } from 'lucide-react';

export default function Laporan() {
  const { role, reports, addReport, updateReportStatus, currentScenario } = useStore();
  const scenario = getScenarioData(currentScenario);

  // For Masyarakat Form
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Sampah',
    location: '',
    desc: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      const newReport: Report = {
        id: `RPT-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        title: formData.title,
        category: formData.category as Report['category'],
        location: formData.location,
        desc: formData.desc,
        status: 'Menunggu Verifikasi',
        time: new Date().toISOString()
      };
      addReport(newReport);
      setIsSubmitting(false);
      setFormData({ title: '', category: 'Sampah', location: '', desc: '' });
      alert('Laporan berhasil dikirim dan sedang menunggu verifikasi.');
    }, 1000);
  };

  // Common rendering for report cards
  const ReportCard = ({ report, isOperator }: { report: Report, isOperator: boolean }) => (
    <Card key={report.id} className={`p-4 border-l-4 ${report.status === 'Terverifikasi' ? 'border-l-brand-forest' : report.status === 'Menunggu Verifikasi' ? 'border-l-brand-warning' : 'border-l-brand-critical'}`}>
      <div className="flex justify-between items-start mb-2">
        <div className="flex gap-2 items-center">
          <Badge variant="neutral" className="text-[10px]">{report.id}</Badge>
          <span className="text-[10px] font-mono text-gray-500">{new Date(report.time).toLocaleTimeString('id-ID')}</span>
        </div>
        <Badge variant={report.status === 'Terverifikasi' ? 'success' : report.status === 'Menunggu Verifikasi' ? 'warning' : 'critical'}>
          {report.status}
        </Badge>
      </div>
      <h3 className="font-bold text-lg">{report.title}</h3>
      <div className="flex gap-4 text-xs font-mono text-gray-500 mb-3 mt-1">
        <span className="flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {report.category}</span>
        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {report.location}</span>
      </div>
      <p className="text-sm text-gray-700 bg-gray-50 p-3 border border-gray-200">{report.desc}</p>
      
      {isOperator && report.status === 'Menunggu Verifikasi' && (
        <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-3 gap-2">
          <Button variant="primary" className="text-xs py-2 px-1 flex gap-1 justify-center" onClick={() => updateReportStatus(report.id, 'Terverifikasi')}>
            <CheckCircle className="w-3 h-3" /> Verifikasi Laporan
          </Button>
          <Button variant="outline" className="text-xs py-2 px-1 flex gap-1 justify-center" onClick={() => updateReportStatus(report.id, 'Perlu Ditinjau')}>
            <RefreshCcw className="w-3 h-3" /> Tinjau Lapangan
          </Button>
          <Button variant="danger" className="text-xs py-2 px-1 flex gap-1 justify-center" onClick={() => updateReportStatus(report.id, 'Tidak Terdukung Data')}>
            <XCircle className="w-3 h-3" /> Tolak
          </Button>
        </div>
      )}
    </Card>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-display font-bold uppercase mb-1">{role === 'operator' ? 'Laporan & Verifikasi Warga' : 'Lapor Kondisi Sungai'}</h2>
        <p className="text-gray-600 font-mono text-sm">
          {role === 'operator' ? 'Manajemen dan validasi silang laporan dari masyarakat.' : 'Laporkan anomali atau kondisi sungai secara langsung.'}
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        
        {/* Kolom 1: Form Lapor (Masyarakat) ATAU Referensi Data (Operator) */}
        <div>
          {role === 'masyarakat' ? (
            <Card className="border-2 border-brand-dark shadow-[4px_4px_0px_0px_rgba(23,23,23,1)]">
              <h3 className="font-bold text-lg uppercase mb-4 border-b-2 border-brand-dark pb-2 flex items-center gap-2">
                <FileText className="w-5 h-5 text-brand-water" /> Buat Laporan Baru
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold uppercase mb-1">Kategori Masalah</label>
                  <select 
                    className="w-full border-2 border-brand-dark p-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-water bg-white"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  >
                    <option>Sampah</option>
                    <option>Air berubah warna</option>
                    <option>Tanggul bocor/rusak</option>
                    <option>Ketinggian air mendadak naik</option>
                    <option>Lainnya</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-bold uppercase mb-1">Judul Laporan</label>
                  <input 
                    type="text" 
                    className="w-full border-2 border-brand-dark p-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-water"
                    placeholder="Contoh: Sampah menyumbat aliran"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold uppercase mb-1">Lokasi Kejadian (Kota Bandung)</label>
                  <select 
                    className="w-full border-2 border-brand-dark p-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-water bg-white"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    required
                  >
                    <option value="">-- Pilih Lokasi --</option>
                    <option value="Pos Cikapundung">Pos Cikapundung</option>
                    <option value="Pos Dayeuhkolot">Pos Dayeuhkolot</option>
                    <option value="Pos Antapani">Pos Antapani</option>
                    <option value="Area Lainnya">Area Lainnya (Jelaskan di deskripsi)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold uppercase mb-1">Deskripsi & Detail Tambahan</label>
                  <textarea 
                    className="w-full border-2 border-brand-dark p-2 text-sm h-24 focus:outline-none focus:ring-2 focus:ring-brand-water resize-none"
                    placeholder="Jelaskan kondisi yang terjadi..."
                    required
                    value={formData.desc}
                    onChange={(e) => setFormData({...formData, desc: e.target.value})}
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-bold uppercase mb-1">Bukti Foto (Opsional)</label>
                  <div className="border-2 border-dashed border-gray-400 p-6 flex flex-col items-center justify-center bg-gray-50 text-gray-500 hover:bg-gray-100 cursor-pointer transition-colors">
                    <Upload className="w-6 h-6 mb-2" />
                    <span className="text-xs font-mono">Upload atau ambil foto</span>
                  </div>
                </div>

                <Button type="submit" className="w-full py-4 text-base" variant="primary" disabled={isSubmitting}>
                  {isSubmitting ? 'MENGIRIM...' : 'KIRIM LAPORAN'}
                </Button>
              </form>
            </Card>
          ) : (
            <Card className="bg-brand-sand border-2 border-brand-dark h-full">
              <h3 className="font-bold text-lg uppercase mb-4 border-b-2 border-brand-dark pb-2 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-brand-critical" /> Referensi Data Sensor Aktif
              </h3>
              <p className="text-sm mb-4 text-gray-600">Cross-reference kondisi laporan warga dengan data sensor terdekat (Cikapundung/Bandung) untuk mencegah berita palsu.</p>
              
              <div className="bg-white border-2 border-brand-dark p-4 space-y-4">
                <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                  <span className="text-xs font-mono font-bold text-gray-500">WATER LEVEL</span>
                  <span className={`font-bold ${scenario.telemetry.waterLevel > 70 ? 'text-brand-critical' : 'text-brand-forest'}`}>{scenario.telemetry.waterLevel.toFixed(1)} cm</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                  <span className="text-xs font-mono font-bold text-gray-500">pH / DO / TDS</span>
                  <span className="font-bold">{scenario.telemetry.pH.toFixed(1)} / {scenario.telemetry.do.toFixed(1)} / {scenario.telemetry.tds}</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                  <span className="text-xs font-mono font-bold text-gray-500">AI VISUAL (OBJEK)</span>
                  <span className="font-bold text-brand-warning">{scenario.cameraDetections.length} Anomali</span>
                </div>
                
                <div className={`mt-4 p-3 text-xs font-bold border-2 ${scenario.risk === 'Berisiko Tinggi' ? 'bg-brand-critical text-white border-brand-critical' : 'bg-gray-100 border-gray-300'}`}>
                  System Risk: {scenario.risk}
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Kolom 2: Riwayat/Daftar Laporan */}
        <div className="space-y-4">
          <h3 className="font-bold text-lg uppercase mb-4 border-b-2 border-brand-dark pb-2 flex justify-between items-center">
            {role === 'operator' ? 'Antrean Verifikasi' : 'Riwayat Laporan'}
            <span className="bg-brand-dark text-white text-xs px-2 py-1">{reports.length} Laporan</span>
          </h3>
          
          <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2 pb-10">
            {reports.map((report) => (
              <ReportCard key={report.id} report={report} isOperator={role === 'operator'} />
            ))}
            {reports.length === 0 && (
              <div className="text-center p-8 bg-gray-50 border-2 border-dashed border-gray-300 text-gray-500 font-mono text-sm">
                Tidak ada laporan saat ini.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
