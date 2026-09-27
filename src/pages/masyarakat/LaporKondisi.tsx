import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import type { Report } from '../../store/useStore';
import { Card, Button } from '../../components/ui/Core';
import { MapPin, Upload, FileCheck } from 'lucide-react';

export default function LaporKondisi() {
  const { addReport } = useStore();
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [reportId, setReportId] = useState('');

  const [form, setForm] = useState({
    title: '',
    category: 'Sampah',
    location: '',
    desc: ''
  });

  const categories = [
    'Sampah', 'Air berubah warna', 'Bau tidak biasa', 
    'Ketinggian air meningkat', 'Ketinggian air menurun', 
    'Busa/permukaan tidak biasa', 'Banjir/genangan', 'Lainnya'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `RPT-2026-${String(Math.floor(Math.random() * 9000) + 1000).padStart(4, '0')}`;
    const newReport: Report = {
      id: newId,
      title: form.title,
      category: form.category,
      location: form.location,
      desc: form.desc,
      status: 'Menunggu Verifikasi',
      time: new Date().toISOString()
    };
    addReport(newReport);
    setReportId(newId);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto mt-12">
        <Card className="text-center p-12">
          <FileCheck className="w-20 h-20 mx-auto text-brand-forest mb-6" />
          <h2 className="text-3xl font-display font-bold uppercase mb-2">Laporan Terkirim</h2>
          <p className="text-gray-600 mb-6">Terima kasih atas partisipasi Anda. Laporan akan ditinjau oleh operator.</p>
          <div className="bg-brand-sand border-2 border-brand-dark p-4 inline-block font-mono text-xl font-bold mb-8">
            {reportId}
          </div>
          <p className="text-sm font-bold bg-brand-warning/20 border-2 border-brand-warning p-3 inline-block mx-auto mb-8">
            Catatan: Laporan masyarakat bukan otomatis fakta terverifikasi sebelum peninjauan data.
          </p>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => navigate('/masyarakat')}>Kembali ke Dashboard</Button>
            <Button variant="outline" onClick={() => setSubmitted(false)}>Buat Laporan Baru</Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-display font-bold uppercase mb-2">Laporkan Kondisi Sungai</h2>
        <p className="text-gray-600 border-l-4 border-brand-forest pl-3">
          Sampaikan informasi kondisi sungai yang tidak wajar. Laporan Anda membantu melengkapi data pemantauan sensor.
        </p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-bold text-sm uppercase mb-2">Judul Laporan</label>
            <input 
              type="text" 
              required
              value={form.title}
              onChange={e => setForm({...form, title: e.target.value})}
              className="w-full border-2 border-brand-dark p-3 focus:outline-none focus:border-brand-forest focus:ring-1 focus:ring-brand-forest"
              placeholder="Contoh: Sampah menumpuk di pilar jembatan"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block font-bold text-sm uppercase mb-2">Kategori</label>
              <select 
                value={form.category}
                onChange={e => setForm({...form, category: e.target.value})}
                className="w-full border-2 border-brand-dark p-3 focus:outline-none focus:border-brand-forest focus:ring-1 focus:ring-brand-forest bg-white"
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block font-bold text-sm uppercase mb-2">Lokasi / Titik Pantau</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="text" 
                  required
                  value={form.location}
                  onChange={e => setForm({...form, location: e.target.value})}
                  className="w-full border-2 border-brand-dark p-3 pl-10 focus:outline-none focus:border-brand-forest focus:ring-1 focus:ring-brand-forest"
                  placeholder="Nama jalan atau lokasi sekitar"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block font-bold text-sm uppercase mb-2">Deskripsi Detail</label>
            <textarea 
              required
              rows={4}
              value={form.desc}
              onChange={e => setForm({...form, desc: e.target.value})}
              className="w-full border-2 border-brand-dark p-3 focus:outline-none focus:border-brand-forest focus:ring-1 focus:ring-brand-forest"
              placeholder="Jelaskan apa yang Anda lihat..."
            />
          </div>

          <div>
            <label className="block font-bold text-sm uppercase mb-2">Unggah Foto / Video (Opsional)</label>
            <div className="border-2 border-brand-dark border-dashed p-8 text-center bg-brand-sand hover:bg-gray-100 transition-colors cursor-pointer group">
              <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400 group-hover:text-brand-forest" />
              <div className="font-bold text-sm">Klik atau seret file ke sini</div>
              <div className="text-xs text-gray-500 mt-1">Maksimal 10MB (JPG, PNG, MP4)</div>
            </div>
          </div>

          <div className="pt-4 border-t-2 border-gray-200 flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => navigate('/masyarakat')}>Batal</Button>
            <Button type="submit">Kirim Laporan</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
