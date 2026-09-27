import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import type { UserRole } from '../store/useStore';
import { Card, Button } from '../components/ui/Core';
import { ArrowLeft } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const setRole = useStore(state => state.setRole);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'warga@rivora.id' && password === 'rivora123') {
      setRole('masyarakat');
      navigate('/masyarakat');
    } else if (email === 'operator@rivora.id' && password === 'rivora123') {
      setRole('operator');
      navigate('/operator');
    } else {
      setError('Email atau kata sandi tidak valid (Gunakan akun demo)');
    }
  };

  const handleDemoLogin = (role: UserRole) => {
    setRole(role);
    if (role === 'operator') navigate('/operator');
    else navigate('/masyarakat');
  };

  return (
    <div className="min-h-screen bg-brand-sand topo-bg flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        <button 
          onClick={() => navigate('/')} 
          className="mb-8 flex items-center gap-2 font-bold uppercase tracking-wider text-sm hover:text-brand-forest transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali
        </button>

        <Card className="mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
            <img src={`${import.meta.env.BASE_URL}logo.png`} alt="RIVORA" className="w-32 h-32 object-contain" />
          </div>
          
          <div className="relative z-10">
            <h1 className="font-display font-bold text-3xl uppercase mb-2">Selamat Datang di RIVORA</h1>
            <p className="text-gray-600 mb-8 border-l-4 border-brand-forest pl-3">
              River Intelligence, Risk & Response. Pantau kondisi sungai, terima informasi risiko, dan berpartisipasi.
            </p>

            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <div className="bg-brand-critical text-white p-3 text-sm font-bold border-2 border-brand-dark">
                  {error}
                </div>
              )}
              
              <div>
                <label className="block font-bold text-sm uppercase mb-1">Email</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border-2 border-brand-dark p-3 focus:outline-none focus:ring-2 focus:ring-brand-forest"
                  placeholder="email@contoh.com"
                  required
                />
              </div>
              
              <div>
                <label className="block font-bold text-sm uppercase mb-1">Kata Sandi</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border-2 border-brand-dark p-3 focus:outline-none focus:ring-2 focus:ring-brand-forest"
                  placeholder="••••••••"
                  required
                />
              </div>

              <Button type="submit" className="w-full mt-4">Masuk</Button>
            </form>
          </div>
        </Card>

        <Card className="bg-brand-water text-white border-brand-dark">
          <h2 className="font-bold text-sm uppercase mb-4 text-center">Akun Demo Prototipe</h2>
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="text-xs p-2 whitespace-nowrap" onClick={() => handleDemoLogin('masyarakat')}>
              Masuk Masyarakat
            </Button>
            <Button variant="outline" className="text-xs p-2 whitespace-nowrap" onClick={() => handleDemoLogin('operator')}>
              Masuk Operator
            </Button>
          </div>
          <div className="mt-4 text-xs font-mono opacity-80 text-center">
            Masyarakat: warga@rivora.id | rivora123<br/>
            Operator: operator@rivora.id | rivora123
          </div>
        </Card>
      </div>
    </div>
  );
}
