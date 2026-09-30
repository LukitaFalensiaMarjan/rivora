import { create } from 'zustand';

export type UserRole = 'masyarakat' | 'operator' | null;

export type RiskLevel = 'Sangat Minim Risiko' | 'Minim Risiko' | 'Perlu Perhatian' | 'Risiko Meningkat' | 'Berisiko Tinggi';

export interface Telemetry {
  pH: number;
  tds: number;
  do: number;
  temp: number;
  waterLevel: number;
  rainfall: number;
}

export type DetectionType = 'warning' | 'critical' | 'info';

export interface CameraDetection {
  class: string;
  confidence: number;
  box: { x: number; y: number; w: number; h: number };
  type?: DetectionType;
}

export interface ScenarioData {
  id: string;
  name: string;
  risk: RiskLevel;
  trend: 'Naik' | 'Turun' | 'Stabil';
  telemetry: Telemetry;
  advisory: string;
  forecast1h: RiskLevel;
  forecast3h: RiskLevel;
  forecast6h: RiskLevel;
  cameraDetections: CameraDetection[];
  history: Telemetry[];
  imageSrc?: string;
}

const scenarios: Record<string, ScenarioData> = {
  'stabil': {
    id: 'stabil',
    name: '1. Kondisi Stabil',
    risk: 'Minim Risiko',
    trend: 'Stabil',
    telemetry: { pH: 7.1, tds: 350, do: 6.8, temp: 26.5, waterLevel: 45, rainfall: 0 },
    advisory: 'Kondisi sungai normal. Kualitas air dalam batas wajar, ketinggian air stabil.',
    forecast1h: 'Minim Risiko',
    forecast3h: 'Minim Risiko',
    forecast6h: 'Sangat Minim Risiko',
    imageSrc: 'river_trash.jpg',
    cameraDetections: [
      { class: 'Sampah Plastik', confidence: 98, box: { x: 0, y: 0, w: 0, h: 0 }, type: 'warning' },
      { class: 'Sampah Lainnya', confidence: 88, box: { x: 0, y: 0, w: 0, h: 0 }, type: 'warning' },
      { class: 'Sampah Lainnya', confidence: 85, box: { x: 0, y: 0, w: 0, h: 0 }, type: 'warning' },
      { class: 'Sampah Plastik', confidence: 92, box: { x: 0, y: 0, w: 0, h: 0 }, type: 'warning' },
      { class: 'Sampah Plastik', confidence: 90, box: { x: 0, y: 0, w: 0, h: 0 }, type: 'warning' },
      { class: 'Sampah Plastik', confidence: 94, box: { x: 0, y: 0, w: 0, h: 0 }, type: 'warning' },
      { class: 'Sampah Plastik', confidence: 97, box: { x: 0, y: 0, w: 0, h: 0 }, type: 'warning' },
      { class: 'Sampah Plastik', confidence: 96, box: { x: 0, y: 0, w: 0, h: 0 }, type: 'warning' }
    ],
    history: Array.from({length: 6}, (_, i) => ({ pH: 7.1, tds: 345 + i, do: 6.7 + Math.random()*0.2, temp: 26.4, waterLevel: 44 + Math.random(), rainfall: 0, time: `${i+6}:00` }))
  },
  'kualitas_buruk': {
    id: 'kualitas_buruk',
    name: '2. Risiko Kualitas Air Meningkat',
    risk: 'Perlu Perhatian',
    trend: 'Stabil',
    telemetry: { pH: 5.8, tds: 850, do: 3.2, temp: 28.1, waterLevel: 42, rainfall: 0 },
    advisory: 'Terdeteksi penurunan kualitas air (DO rendah, TDS tinggi). Disarankan menghindari aktivitas kontak langsung dengan air sungai sampai kondisi kembali stabil.',
    forecast1h: 'Perlu Perhatian',
    forecast3h: 'Perlu Perhatian',
    forecast6h: 'Minim Risiko',
    imageSrc: 'river_trash.jpg',
    cameraDetections: [
      { class: 'Sampah Plastik', confidence: 98, box: { x: 0, y: 0, w: 0, h: 0 }, type: 'warning' },
      { class: 'Sampah Lainnya', confidence: 88, box: { x: 0, y: 0, w: 0, h: 0 }, type: 'warning' },
      { class: 'Sampah Lainnya', confidence: 85, box: { x: 0, y: 0, w: 0, h: 0 }, type: 'warning' },
      { class: 'Sampah Plastik', confidence: 92, box: { x: 0, y: 0, w: 0, h: 0 }, type: 'warning' },
      { class: 'Sampah Plastik', confidence: 90, box: { x: 0, y: 0, w: 0, h: 0 }, type: 'warning' },
      { class: 'Sampah Plastik', confidence: 94, box: { x: 0, y: 0, w: 0, h: 0 }, type: 'warning' },
      { class: 'Sampah Plastik', confidence: 97, box: { x: 0, y: 0, w: 0, h: 0 }, type: 'warning' },
      { class: 'Sampah Plastik', confidence: 96, box: { x: 0, y: 0, w: 0, h: 0 }, type: 'warning' }
    ],
    history: Array.from({length: 6}, (_, i) => ({ pH: 6.5 - i*0.1, tds: 500 + i*60, do: 5.0 - i*0.3, temp: 27 + i*0.2, waterLevel: 42, rainfall: 0, time: `${i+6}:00` }))
  },
  'air_naik': {
    id: 'air_naik',
    name: '3. Ketinggian Air Meningkat',
    risk: 'Risiko Meningkat',
    trend: 'Naik',
    telemetry: { pH: 6.9, tds: 420, do: 5.5, temp: 25.8, waterLevel: 85, rainfall: 15 },
    advisory: 'Ketinggian air meningkat cepat dalam 2 jam terakhir. Hindari mendekati bantaran sungai dan area dengan arus yang meningkat.',
    forecast1h: 'Berisiko Tinggi',
    forecast3h: 'Risiko Meningkat',
    forecast6h: 'Perlu Perhatian',
    cameraDetections: [
      { class: 'Penyumbatan Aliran', confidence: 88, box: { x: 30, y: 50, w: 40, h: 25 }, type: 'critical' }
    ],
    history: Array.from({length: 6}, (_, i) => ({ pH: 7.0, tds: 400, do: 6.0, temp: 26.0, waterLevel: 45 + i*8, rainfall: 5 + i*2, time: `${i+6}:00` }))
  },
  'hujan_intensif': {
    id: 'hujan_intensif',
    name: '4. Hujan Intensif + Air Naik',
    risk: 'Berisiko Tinggi',
    trend: 'Naik',
    telemetry: { pH: 6.8, tds: 550, do: 4.8, temp: 24.5, waterLevel: 115, rainfall: 45 },
    advisory: 'Hujan intensif menyebabkan debit sungai sangat tinggi. Indikasi limpasan pada beberapa titik rawan. Jauhi area sungai.',
    forecast1h: 'Berisiko Tinggi',
    forecast3h: 'Berisiko Tinggi',
    forecast6h: 'Risiko Meningkat',
    imageSrc: 'river_trash.jpg',
    cameraDetections: [
      { class: 'Sampah Plastik', confidence: 98, box: { x: 0, y: 0, w: 0, h: 0 }, type: 'warning' },
      { class: 'Sampah Lainnya', confidence: 88, box: { x: 0, y: 0, w: 0, h: 0 }, type: 'warning' },
      { class: 'Sampah Lainnya', confidence: 85, box: { x: 0, y: 0, w: 0, h: 0 }, type: 'warning' },
      { class: 'Sampah Plastik', confidence: 92, box: { x: 0, y: 0, w: 0, h: 0 }, type: 'warning' },
      { class: 'Sampah Plastik', confidence: 90, box: { x: 0, y: 0, w: 0, h: 0 }, type: 'warning' },
      { class: 'Sampah Plastik', confidence: 94, box: { x: 0, y: 0, w: 0, h: 0 }, type: 'warning' },
      { class: 'Sampah Plastik', confidence: 97, box: { x: 0, y: 0, w: 0, h: 0 }, type: 'warning' },
      { class: 'Sampah Plastik', confidence: 96, box: { x: 0, y: 0, w: 0, h: 0 }, type: 'warning' }
    ],
    history: Array.from({length: 6}, (_, i) => ({ pH: 6.9, tds: 450 + i*20, do: 5.5, temp: 25, waterLevel: 60 + i*11, rainfall: 10 + i*7, time: `${i+6}:00` }))
  }
};

export interface Report {
  id: string;
  title: string;
  category: string;
  location: string;
  desc: string;
  status: 'Menunggu Verifikasi' | 'Terverifikasi' | 'Perlu Ditinjau' | 'Tidak Terdukung Data' | 'Selesai Ditindaklanjuti';
  time: string;
}

interface AppState {
  role: UserRole;
  setRole: (role: UserRole) => void;
  
  currentScenario: string;
  setScenario: (id: string) => void;
  
  reports: Report[];
  addReport: (report: Report) => void;
  updateReportStatus: (id: string, status: Report['status']) => void;

  presentationMode: boolean;
  togglePresentationMode: () => void;
  
  fluctuateTelemetry: () => void;
}

const initialReports: Report[] = [
  {
    id: 'RPT-2026-0041',
    title: 'Warna air menghitam',
    category: 'Air berubah warna',
    location: 'Pos Pantau Cikapundung',
    desc: 'Air terlihat hitam pekat dan berbau menyengat sejak pagi tadi.',
    status: 'Terverifikasi',
    time: '2026-09-27T06:15:00Z'
  },
  {
    id: 'RPT-2026-0042',
    title: 'Sampah plastik menumpuk',
    category: 'Sampah',
    location: 'Sektor 3 Citarum',
    desc: 'Banyak sampah tersangkut di pilar jembatan.',
    status: 'Menunggu Verifikasi',
    time: '2026-09-27T07:10:00Z'
  }
];

export const useStore = create<AppState>((set) => ({
  role: (localStorage.getItem('rivora_role') as UserRole) || null,
  setRole: (role) => {
    if (role) {
      localStorage.setItem('rivora_role', role);
    } else {
      localStorage.removeItem('rivora_role');
    }
    set({ role });
  },
  
  currentScenario: 'stabil',
  setScenario: (id) => set({ currentScenario: id }),
  
  reports: initialReports,
  addReport: (report) => set((state) => ({ reports: [report, ...state.reports] })),
  updateReportStatus: (id, status) => set((state) => ({
    reports: state.reports.map(r => r.id === id ? { ...r, status } : r)
  })),

  presentationMode: false,
  togglePresentationMode: () => set((state) => ({ presentationMode: !state.presentationMode })),

  fluctuateTelemetry: () => set((state) => {
    // Made fully static as requested for presentation
    return state;
  }),
}));

export const getScenarioData = (id: string) => scenarios[id] || scenarios['stabil'];
export const getAvailableScenarios = () => Object.values(scenarios);
