import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import InteractiveMap from "./InteractiveMap";
import DataProses from "./DataProses";
import EvaluasiModel from "./EvaluasiModel";
import InsightHasil from "./InsightHasil";
import FloodContext from "./FloodContext";
import { getFeatureArea } from "../utils/geoUtils";
import { 
  Map, 
  Database, 
  BarChart3, 
  Award, 
  ArrowLeft, 
  Sun,
  Moon,
  Calendar,
  Layers,
  TrendingUp,
  TrendingDown,
  AlertTriangle
} from "lucide-react";

interface WebGISDashboardProps {
  onBackToLanding: () => void;
  theme: "light" | "dark";
  onToggleTheme: () => void;
}

type TabType = "map" | "data" | "evaluation" | "insights" | "flood";

function AnimatedCounter({ value, suffix = " Ha" }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const duration = 1200; // 1.2s animation duration
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(progress * value);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [value]);

  const formatter = new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });

  return (
    <span className="font-extrabold font-display">
      {formatter.format(count)}
      <span className="text-xs font-medium ml-1 font-sans">{suffix}</span>
    </span>
  );
}

export default function WebGISDashboard({ onBackToLanding, theme, onToggleTheme }: WebGISDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>("map");
  
  // Real datasets state
  const [veg2025, setVeg2025] = useState<any>(null);
  const [veg2026, setVeg2026] = useState<any>(null);
  const [gainData, setGainData] = useState<any>(null);
  const [lossData, setLossData] = useState<any>(null);
  const [boundaryData, setBoundaryData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    // Asynchronously fetch the four GeoJSON datasets from /geojson/
    Promise.all([
      fetch('/geojson/Vegetasi_2025.geojson')
        .then(res => {
          if (!res.ok) throw new Error("Gagal mengambil file Vegetasi_2025.geojson (" + res.status + ")");
          return res.json();
        }),
      fetch('/geojson/Vegetasi_2026.geojson')
        .then(res => {
          if (!res.ok) throw new Error("Gagal mengambil file Vegetasi_2026.geojson (" + res.status + ")");
          return res.json();
        }),
      fetch('/geojson/Gain_Vegetasi_2025_2026.geojson')
        .then(res => {
          if (!res.ok) throw new Error("Gagal mengambil file Gain_Vegetasi_2025_2026.geojson (" + res.status + ")");
          return res.json();
        }),
      fetch('/geojson/Loss_Vegetasi_2025_2026.geojson')
        .then(res => {
          if (!res.ok) throw new Error("Gagal mengambil file Loss_Vegetasi_2025_2026.geojson (" + res.status + ")");
          return res.json();
        })
    ])
    .then(([data2025, data2026, dataGain, dataLoss]) => {
      console.log("Vegetasi 2025 features:", data2025.features?.length || 0);
      console.log("Vegetasi 2026 features:", data2026.features?.length || 0);
      console.log("Gain features:", dataGain.features?.length || 0);
      console.log("Loss features:", dataLoss.features?.length || 0);

      setVeg2025(data2025);
      setVeg2026(data2026);
      setGainData(dataGain);
      setLossData(dataLoss);

      // Fetch boundary geojson from /geojson/
      fetch('/geojson/Batas_Kabupaten_Aceh_Tamiang.geojson')
        .then(res => res.ok ? res.json() : null)
        .then(boundary => {
          setBoundaryData(boundary);
          setIsLoading(false);
        })
        .catch(() => {
          // Gracefully handle if boundary dataset is optional/missing
          setIsLoading(false);
        });
    })
    .catch((err: any) => {
      console.error("Error loading GIS data:", err);
      setError(err.message || "Gagal memuat data spasial.");
      setIsLoading(false);
    });
  }, []);

  const tabItems = [
    { id: "map", name: "Peta Hasil", icon: <Map className="w-4 h-4" /> },
    { id: "data", name: "Data & Proses", icon: <Database className="w-4 h-4" /> },
    { id: "evaluation", name: "Evaluasi Performa", icon: <Award className="w-4 h-4" /> },
    { id: "insights", name: "Analisis Statistik", icon: <BarChart3 className="w-4 h-4" /> },
    { id: "flood", name: "Konteks Banjir 2025", icon: <AlertTriangle className="w-4 h-4 text-amber-500 animate-pulse" /> },
  ] as const;

  // Compute stats for KPI cards directly from actual features
  const veg2025Features = veg2025?.features || [];
  const veg2026Features = veg2026?.features || [];
  const gainFeatures = gainData?.features || [];
  const lossFeatures = lossData?.features || [];

  const totalVeg2025AreaHa = veg2025Features.reduce((acc: number, f: any) => acc + getFeatureArea(f), 0) / 10000;
  const totalVeg2026AreaHa = veg2026Features.reduce((acc: number, f: any) => acc + getFeatureArea(f), 0) / 10000;
  const totalGainAreaHa = gainFeatures.reduce((acc: number, f: any) => acc + getFeatureArea(f), 0) / 10000;
  const totalLossAreaHa = lossFeatures.reduce((acc: number, f: any) => acc + getFeatureArea(f), 0) / 10000;

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === "dark" ? "bg-[#0f172a] text-[#f8fafc]" : "bg-slate-50 text-slate-800"
    }`}>
      {/* Professional Navbar */}
      <header className={`sticky top-0 z-50 px-6 py-4 border-b transition-colors duration-300 shadow-md ${
        theme === "dark" 
          ? "bg-[#1e293b] border-[#334155] text-white" 
          : "bg-white border-slate-200 text-slate-800"
      }`}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          
          {/* Brand with logo layout */}
          <div className="flex items-center gap-4">
            <button
              onClick={onBackToLanding}
              className={`p-2.5 rounded-lg transition-colors group flex items-center justify-center cursor-pointer ${
                theme === "dark" ? "bg-slate-800 hover:bg-slate-700 text-slate-200" : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              }`}
              title="Kembali ke Landing Page"
            >
              <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
            </button>
            
            <div className="flex items-center gap-4">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/3/35/Lambang_Kabupaten_Aceh_Tamiang.png" 
                alt="Logo Aceh Tamiang" 
                className="w-12 h-12 md:w-14 md:h-14 object-contain shrink-0"
                referrerPolicy="no-referrer"
              />
              <div>
                <h1 className={`text-base md:text-lg font-bold font-display tracking-tight leading-tight ${
                  theme === "dark" ? "text-white" : "text-slate-900"
                }`}>
                  WebGIS Perubahan Vegetasi
                </h1>
                <p className={`text-xs md:text-sm font-semibold tracking-wider ${
                  theme === "dark" ? "text-emerald-400" : "text-emerald-600"
                } font-sans`}>
                  Kabupaten Aceh Tamiang
                </p>
              </div>
            </div>
          </div>

          {/* Theme switcher & Info Panel */}
          <div className="flex flex-wrap items-center gap-3 md:gap-4 text-xs font-mono">
            {/* Theme Toggle Button */}
            <button
              onClick={onToggleTheme}
              className={`px-3 py-2 rounded-lg border transition-all text-xs font-semibold flex items-center gap-1.5 cursor-pointer ${
                theme === "dark" 
                  ? "bg-[#1e293b] border-[#334155] text-amber-400 hover:bg-[#334155]" 
                  : "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
              {theme === "dark" ? "☀ Light" : "🌙 Dark"}
            </button>

            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${
              theme === "dark" ? "bg-slate-800 border-[#334155] text-slate-300" : "bg-slate-100 border-slate-200 text-slate-600"
            }`}>
              <Calendar className="w-3.5 h-3.5 text-emerald-500" />
              <span>Pemantauan: 2025–2026</span>
            </div>
            
            <div className={`hidden sm:flex items-center gap-1.5 border px-3 py-1.5 rounded-lg font-semibold ${
              theme === "dark" ? "bg-emerald-950/40 border-emerald-900 text-emerald-300" : "bg-emerald-50 border-emerald-100 text-emerald-700"
            }`}>
              <span>Akurasi Model: 87.91%</span>
            </div>
          </div>

        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        
        {isLoading ? (
          <div className={`border rounded-2xl p-12 text-center shadow-sm space-y-4 flex flex-col items-center justify-center min-h-[450px] ${
            theme === "dark" ? "bg-[#1e293b] border-[#334155]" : "bg-white border-slate-200"
          }`}>
            <div className="relative flex items-center justify-center">
              <div className="w-16 h-16 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
              <Layers className="w-6 h-6 text-emerald-600 absolute animate-pulse" />
            </div>
            <div className="space-y-1.5 max-w-md">
              <h3 className={`text-base font-bold ${theme === "dark" ? "text-white" : "text-slate-900"}`}>Memuat Data Spasial Sentinel-2...</h3>
              <p className={`text-xs leading-relaxed ${theme === "dark" ? "text-slate-400" : "text-slate-600"}`}>
                Sedang mengolah dan melakukan rendering spasial untuk Vegetasi 2025, Vegetasi 2026, Gain, dan Loss Kabupaten Aceh Tamiang secara real-time.
              </p>
            </div>
          </div>
        ) : error ? (
          <div className={`border rounded-2xl p-12 text-center shadow-sm space-y-4 flex flex-col items-center justify-center min-h-[450px] ${
            theme === "dark" ? "bg-[#1e293b] border-red-900/40" : "bg-white border-red-100"
          }`}>
            <div className="p-4 bg-red-50 text-red-600 rounded-full">
              <Database className="w-8 h-8" />
            </div>
            <div className="space-y-2 max-w-md">
              <h3 className="text-base font-bold text-red-600">Gagal Memuat Data Spasial</h3>
              <p className={`text-xs leading-relaxed ${theme === "dark" ? "text-slate-400" : "text-slate-600"}`}>
                {error}. Pastikan folder <code className="bg-slate-800 text-red-400 px-1.5 py-0.5 rounded font-mono text-[11px]">public/geojson/</code> terkonfigurasi dengan benar.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-md transition-colors cursor-pointer"
              >
                Coba Muat Ulang
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* KPI Cards Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: Vegetasi 2025 */}
              <div className={`border rounded-xl p-4 shadow-sm flex items-center justify-between transition-all duration-300 ${
                theme === "dark" 
                  ? "bg-[#1e293b] border-[#334155] text-white" 
                  : "bg-white border-slate-200 text-slate-800"
              }`}>
                <div className="space-y-1">
                  <span className="text-xs font-medium text-slate-400 uppercase tracking-wider block">Vegetasi 2025</span>
                  <div className="text-2xl font-extrabold font-display">
                    <AnimatedCounter value={totalVeg2025AreaHa} />
                  </div>
                  <span className="text-[10px] text-slate-400 block font-mono">Tutupan awal baseline</span>
                </div>
                <div className="p-3.5 bg-emerald-500/10 text-emerald-400 rounded-xl">
                  <Layers className="w-6 h-6 text-emerald-500" />
                </div>
              </div>

              {/* Card 2: Vegetasi 2026 */}
              <div className={`border rounded-xl p-4 shadow-sm flex items-center justify-between transition-all duration-300 ${
                theme === "dark" 
                  ? "bg-[#1e293b] border-[#334155] text-white" 
                  : "bg-white border-slate-200 text-slate-800"
              }`}>
                <div className="space-y-1">
                  <span className="text-xs font-medium text-slate-400 uppercase tracking-wider block">Vegetasi 2026</span>
                  <div className="text-2xl font-extrabold font-display">
                    <AnimatedCounter value={totalVeg2026AreaHa} />
                  </div>
                  <span className="text-[10px] text-slate-400 block font-mono">Tutupan akhir terverifikasi</span>
                </div>
                <div className="p-3.5 bg-teal-500/10 text-teal-400 rounded-xl">
                  <Layers className="w-6 h-6 text-teal-500" />
                </div>
              </div>

              {/* Card 3: Vegetation Gain */}
              <div className={`border rounded-xl p-4 shadow-sm flex items-center justify-between transition-all duration-300 ${
                theme === "dark" 
                  ? "bg-[#1e293b] border-[#334155] text-white" 
                  : "bg-white border-slate-200 text-slate-800"
              }`}>
                <div className="space-y-1">
                  <span className="text-xs font-medium text-slate-400 uppercase tracking-wider block">Gain Vegetasi</span>
                  <div className="text-2xl font-extrabold font-display text-cyan-500">
                    <AnimatedCounter value={totalGainAreaHa} suffix=" Ha" />
                  </div>
                  <span className="text-[10px] text-slate-400 block font-mono">Pertambahan tajuk hijau</span>
                </div>
                <div className="p-3.5 bg-cyan-500/10 text-cyan-400 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-cyan-500" />
                </div>
              </div>

              {/* Card 4: Vegetation Loss */}
              <div className={`border rounded-xl p-4 shadow-sm flex items-center justify-between transition-all duration-300 ${
                theme === "dark" 
                  ? "bg-[#1e293b] border-[#334155] text-white" 
                  : "bg-white border-slate-200 text-slate-800"
              }`}>
                <div className="space-y-1">
                  <span className="text-xs font-medium text-slate-400 uppercase tracking-wider block">Loss Vegetasi</span>
                  <div className="text-2xl font-extrabold font-display text-rose-500">
                    <AnimatedCounter value={totalLossAreaHa} suffix=" Ha" />
                  </div>
                  <span className="text-[10px] text-slate-400 block font-mono">Konversi / Pengurangan tutupan</span>
                </div>
                <div className="p-3.5 bg-rose-500/10 text-rose-400 rounded-xl">
                  <TrendingDown className="w-6 h-6 text-rose-500" />
                </div>
              </div>
            </div>

            {/* Tab Switching Navigation Menu */}
            <div className={`border p-2 rounded-xl shadow-sm flex flex-wrap gap-1.5 transition-colors duration-300 ${
              theme === "dark" ? "bg-[#1e293b] border-[#334155]" : "bg-white border-slate-200"
            }`}>
              {tabItems.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-3 text-xs md:text-sm font-semibold rounded-lg transition-all duration-200 cursor-pointer ${
                    activeTab === tab.id
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-950/20"
                      : theme === "dark"
                        ? "text-slate-300 hover:bg-[#334155] hover:text-white"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  {tab.icon}
                  {tab.name}
                </button>
              ))}
            </div>

            {/* Dynamic Tab Panel Content */}
            <div className="min-h-[500px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                >
                  {activeTab === "map" && (
                    <InteractiveMap 
                      veg2025={veg2025}
                      veg2026={veg2026}
                      gainData={gainData}
                      lossData={lossData}
                      boundaryData={boundaryData}
                      theme={theme}
                    />
                  )}
                  {activeTab === "data" && <DataProses theme={theme} />}
                  {activeTab === "evaluation" && <EvaluasiModel theme={theme} />}
                  {activeTab === "insights" && (
                    <InsightHasil 
                      veg2025={veg2025}
                      veg2026={veg2026}
                      gainData={gainData}
                      lossData={lossData}
                      boundaryData={boundaryData}
                      theme={theme}
                    />
                  )}
                  {activeTab === "flood" && (
                    <FloodContext theme={theme} />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </>
        )}

        {/* Footer info banner - Disaster Mitigation Insights */}
        <footer className={`border p-6 rounded-2xl shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6 transition-colors duration-300 ${
          theme === "dark" 
            ? "bg-[#1e293b] border-[#334155] text-slate-300" 
            : "bg-white border-slate-200 text-slate-600"
        }`}>
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-amber-500">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
              <h4 className="text-xs font-mono font-bold uppercase tracking-widest">Bencana Banjir Akhir 2025</h4>
            </div>
            <p className="text-xs leading-relaxed text-justify">
              Curah hujan ekstrem pada akhir tahun 2025 memicu banjir besar di sepanjang Daerah Aliran Sungai (DAS) Tamiang, yang diperparah oleh penurunan kerapatan vegetasi penahan air di hulu wilayah.
            </p>
          </div>
          <div className={`space-y-2 border-t md:border-t-0 md:border-x px-0 md:px-6 py-4 md:py-0 ${
            theme === "dark" ? "border-slate-700" : "border-slate-100"
          }`}>
            <div className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <h4 className="text-xs font-mono font-bold uppercase tracking-widest">Peran Sabuk Hijau Alami</h4>
            </div>
            <p className="text-xs leading-relaxed text-justify">
              Hilangnya rona vegetasi bantaran sungai memperlemah stabilitas tanah. Rehabilitasi sabuk hijau (greenbelt) sangat krusial guna menahan laju debit limpasan banjir dan mengontrol erosi tebing sungai.
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-blue-400">
              <span className="w-2 h-2 rounded-full bg-blue-400"></span>
              <h4 className="text-xs font-mono font-bold uppercase tracking-widest">Prioritas Pemulihan Spasial</h4>
            </div>
            <p className="text-xs leading-relaxed text-justify flex flex-col gap-1.5">
              <span>Restorasi difokuskan pada dua wilayah utama: reboisasi hutan lindung di lereng curam barat daya untuk menyerap limpasan hulu, serta penanaman kembali ekosistem mangrove di pesisir utara.</span>
            </p>
          </div>
        </footer>

      </main>
    </div>
  );
}