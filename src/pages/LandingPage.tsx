import { useNavigate } from 'react-router-dom';
import { Droplets, Cpu, Activity } from 'lucide-react';
import { Button } from '../components/ui/Core';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-brand-sand topo-bg flex flex-col">
      <header className="border-b-2 border-brand-dark bg-white p-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <img src={`${import.meta.env.BASE_URL}logo.png`} alt="RIVORA" className="h-12 object-contain" />
        </div>
        <Button onClick={() => navigate('/login')}>Masuk</Button>
      </header>

      <main className="flex-1">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl lg:text-7xl font-display font-bold leading-none mb-6">
              MEMAHAMI SUNGAI.<br/>
              <span className="text-brand-water">SEBELUM RISIKONYA MEMBESAR.</span>
            </h1>
            <p className="text-xl mb-8 border-l-4 border-brand-forest pl-4 max-w-lg">
              RIVORA mengintegrasikan data sensor, kamera, cuaca, dan laporan masyarakat untuk membantu memahami kondisi serta risiko sungai.
            </p>
            <div className="flex gap-4">
              <Button onClick={() => navigate('/login')}>Masuk ke RIVORA</Button>
              <Button variant="outline" onClick={() => document.getElementById('cara-kerja')?.scrollIntoView({behavior: 'smooth'})}>Lihat Cara Kerja</Button>
            </div>
          </div>
          
          <div className="relative flex justify-center items-center">
            <img src={`${import.meta.env.BASE_URL}logo.png`} alt="RIVORA" className="w-2/3 max-w-sm object-contain drop-shadow-xl animate-pulse" style={{ animationDuration: '3s' }} />
          </div>
        </section>

        <section id="cara-kerja" className="border-t-2 border-brand-dark bg-white py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-display font-bold uppercase mb-4">Cara Kerja RIVORA</h2>
              <p className="max-w-2xl mx-auto text-lg text-gray-600">
                RIVORA menghubungkan perangkat monitoring sungai dengan informasi publik dan mekanisme pelaporan masyarakat.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="border-2 border-brand-dark p-8 shadow-[4px_4px_0px_0px_rgba(23,23,23,1)] bg-brand-sand">
                <Cpu className="w-12 h-12 mb-6 text-brand-forest" />
                <h3 className="text-xl font-bold uppercase mb-3">1. MONITOR</h3>
                <p>Sensor dan kamera mengumpulkan data kondisi sungai secara langsung, memanfaatkan kembali perangkat smartphone yang masih layak digunakan sebagai edge node.</p>
              </div>
              
              <div className="border-2 border-brand-dark p-8 shadow-[4px_4px_0px_0px_rgba(23,23,23,1)] bg-brand-water text-white">
                <Activity className="w-12 h-12 mb-6" />
                <h3 className="text-xl font-bold uppercase mb-3">2. ANALYZE</h3>
                <p>Data digabungkan untuk menilai kondisi, risiko, dan tren perubahan. Termasuk analisis kualitas air, tinggi muka air, dan cuaca.</p>
              </div>
              
              <div className="border-2 border-brand-dark p-8 shadow-[4px_4px_0px_0px_rgba(23,23,23,1)] bg-brand-warning">
                <Droplets className="w-12 h-12 mb-6" />
                <h3 className="text-xl font-bold uppercase mb-3">3. RESPOND</h3>
                <p>Informasi dan himbauan diberikan kepada masyarakat, sementara laporan diteruskan melalui proses verifikasi dan tindak lanjut.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t-2 border-brand-dark bg-brand-dark text-white p-8 text-center">
        <div className="font-display font-bold text-2xl tracking-tighter mb-2">RIVORA</div>
        <p className="text-sm font-mono text-gray-400">Prototype IoT untuk pemantauan kondisi sungai • IT Fest 2026</p>
      </footer>
    </div>
  );
}
