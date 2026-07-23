import React, { useState } from "react";
import { Database, HelpCircle, HardDrive, Share2, Layers, Cpu, Compass, Settings } from "lucide-react";

interface DataProsesProps {
  theme?: "light" | "dark";
}

export default function DataProses({ theme = "light" }: DataProsesProps) {
  const [activeStep, setActiveStep] = useState(0);

  const stepsDetails = [
    {
      title: "1. Sentinel-2 Imagery Acquisition",
      desc: "Citra satelit Sentinel-2 Level-2A (Bottom-Of-Atmosphere / Surface Reflectance) diunduh melalui API Google Earth Engine. Periode pencarian citra dibatasi pada musim kemarau tahun 2025 dan 2026 untuk meminimalkan gangguan awan pada citra komposit.",
      tech: "Google Earth Engine API, Javascript/Python, Sentinel-2 MSI",
      stat: "Resolusi Spasial: 10m (Band 2, 3, 4, 8)"
    },
    {
      title: "2. Cloud Masking & Composite",
      desc: "Prosedur Cloud Masking menggunakan QA60 band diterapkan untuk membuang piksel awan dan bayangan awan. Setelah awan dibersihkan, diterapkan reduktor 'median' untuk menghasilkan citra komposit bebas awan yang mewakili kondisi tahun 2025 dan 2026.",
      tech: "GEE imageCollection.filterDate(), ee.Algorithms.Sentinel2.cloudMask()",
      stat: "Tutupan Awan Akhir: < 2% Rata-rata"
    },
    {
      title: "3. NDVI Calculation",
      desc: "Normalized Difference Vegetation Index (NDVI) dihitung dengan formula (NIR - Red) / (NIR + Red) atau (Band 8 - Band 4) / (Band 8 + Band 4) untuk mengukur tingkat kehijauan tajuk vegetasi.",
      tech: "Image Normalized Difference, Raster Calculator",
      stat: "Rentang Nilai: -1.0 s/d 1.0"
    },
    {
      title: "4. Ground Truth Points Collection",
      desc: "Pengumpulan data kebenaran lapangan dilakukan melalui interpretasi visual resolusi sangat tinggi dan verifikasi spasial terbatas. 300 titik sampel diklasifikasikan secara seimbang: 150 titik vegetasi (hutan, kebun, sawah) dan 150 titik non-vegetasi (sungai, laut, lahan terbuka, pemukiman).",
      tech: "Global Positioning System (GPS), GEE Hand Labeling",
      stat: "Total Sampel: 300 Titik Kebenaran Lapangan"
    },
    {
      title: "5. Train-Test Split",
      desc: "Untuk menjamin validitas pengujian, data ground truth dibagi secara acak menggunakan metode stratified random sampling dengan rasio 70% sebagai data pelatihan (training) dan 30% sebagai data pengujian mandiri (testing).",
      tech: "Random Split, Stratified Stratification",
      stat: "Training: 209 titik (70%) | Testing: 91 titik (30%)"
    },
    {
      title: "6. Random Forest Classifier Training",
      desc: "Model Random Forest dilatih menggunakan data training. Pohon keputusan (decision trees) dibuat secara acak untuk mempelajari pola spektral (band reflektansi & NDVI). Setiap pohon memberikan voting kelas, dan mayoritas voting menentukan hasil akhir klasifikasi.",
      tech: "ee.Classifier.smileRandomForest()",
      stat: "Trees: 100 • Seed: 42 • Predictors: B2, B3, B4, B8, NDVI"
    },
    {
      title: "7. Change Detection Analysis",
      desc: "Peta klasifikasi tahun 2025 dan 2026 ditumpangsusunkan (overlay). Matriks perubahan mendeteksi transisi sel: Kelas Vegetasi ke Non-Vegetasi dianggap sebagai Loss, sedangkan kelas Non-Vegetasi ke Vegetasi dianggap sebagai Gain.",
      tech: "Spatial Overlay, Transition Matrix, Area Calculation",
      stat: "Output: Peta Gain & Loss Spasial"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Top Academic Intro Card */}
      <div className={`border rounded-2xl p-6 shadow-sm transition-all duration-300 ${
        theme === "dark" ? "bg-[#1e293b] border-[#334155] text-[#f8fafc]" : "bg-white border-slate-200 text-slate-800"
      }`}>
        <h2 className={`text-xl font-bold font-display mb-2 ${theme === "dark" ? "text-white" : "text-slate-900"}`}>
          Transparansi Data & Metodologi Komputasi
        </h2>
        <p className={`text-sm leading-relaxed max-w-4xl ${theme === "dark" ? "text-slate-300" : "text-slate-600"}`}>
          Eksplorasi rincian parameter teknis dan data mentah yang digunakan untuk menghasilkan peta klasifikasi perubahan vegetasi di Kabupaten Aceh Tamiang. Model machine learning ini dibangun berbasis platform komputasi awan Google Earth Engine demi menjamin reproduksibilitas analisis yang tinggi.
        </p>
      </div>

      {/* 2x2 Grid of Technical Specifications */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Data Citra */}
        <div className={`border rounded-2xl p-5 shadow-sm space-y-4 transition-all duration-300 ${
          theme === "dark" ? "bg-[#1e293b] border-[#334155] text-white" : "bg-white border-slate-200 text-slate-800"
        }`}>
          <div className="flex justify-between items-start">
            <div className={`p-3 rounded-xl ${theme === "dark" ? "bg-slate-800 text-emerald-400" : "bg-emerald-50 text-emerald-800"}`}>
              <Database className="w-5.5 h-5.5" />
            </div>
            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${theme === "dark" ? "bg-slate-800 text-slate-400" : "bg-slate-100 text-slate-600"}`}>INPUT DATA</span>
          </div>
          <div>
            <h3 className={`font-bold text-sm ${theme === "dark" ? "text-white" : "text-slate-900"}`}>Sumber Citra Satelit</h3>
            <p className="text-xs text-slate-400 mt-1">Sentinel-2 Surface Reflectance</p>
          </div>
          <div className={`border-t pt-3 space-y-2 ${theme === "dark" ? "border-slate-700" : "border-slate-100"}`}>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Periode</span>
              <span className={`font-semibold ${theme === "dark" ? "text-slate-200" : "text-slate-800"}`}>2025 & 2026</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Penyedia</span>
              <span className={`font-semibold ${theme === "dark" ? "text-slate-200" : "text-slate-800"}`}>ESA / Copernicus</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Resolusi</span>
              <span className={`font-semibold font-mono ${theme === "dark" ? "text-slate-200" : "text-slate-800"}`}>10 Meter</span>
            </div>
          </div>
        </div>

        {/* Card 2: Ground Truth */}
        <div className={`border rounded-2xl p-5 shadow-sm space-y-4 transition-all duration-300 ${
          theme === "dark" ? "bg-[#1e293b] border-[#334155] text-white" : "bg-white border-slate-200 text-slate-800"
        }`}>
          <div className="flex justify-between items-start">
            <div className={`p-3 rounded-xl ${theme === "dark" ? "bg-slate-800 text-teal-400" : "bg-teal-50 text-teal-800"}`}>
              <Compass className="w-5.5 h-5.5" />
            </div>
            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${theme === "dark" ? "bg-slate-800 text-slate-400" : "bg-slate-100 text-slate-600"}`}>VALIDASI</span>
          </div>
          <div>
            <h3 className={`font-bold text-sm ${theme === "dark" ? "text-white" : "text-slate-900"}`}>Ground Truth (Sampel)</h3>
            <p className="text-xs text-slate-400 mt-1">Titik Sampel Lapangan Seimbang</p>
          </div>
          <div className={`border-t pt-3 space-y-2 ${theme === "dark" ? "border-slate-700" : "border-slate-100"}`}>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Vegetasi</span>
              <span className={`font-semibold ${theme === "dark" ? "text-slate-200" : "text-slate-800"}`}>150 Titik</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Non-Vegetasi</span>
              <span className={`font-semibold ${theme === "dark" ? "text-slate-200" : "text-slate-800"}`}>150 Titik</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Total</span>
              <span className="font-bold text-teal-500 font-mono">300 Titik</span>
            </div>
          </div>
        </div>

        {/* Card 3: Split Data */}
        <div className={`border rounded-2xl p-5 shadow-sm space-y-4 transition-all duration-300 ${
          theme === "dark" ? "bg-[#1e293b] border-[#334155] text-white" : "bg-white border-slate-200 text-slate-800"
        }`}>
          <div className="flex justify-between items-start">
            <div className={`p-3 rounded-xl ${theme === "dark" ? "bg-slate-800 text-indigo-400" : "bg-indigo-50 text-indigo-800"}`}>
              <Share2 className="w-5.5 h-5.5" />
            </div>
            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${theme === "dark" ? "bg-slate-800 text-slate-400" : "bg-slate-100 text-slate-600"}`}>STRATEGI</span>
          </div>
          <div>
            <h3 className={`font-bold text-sm ${theme === "dark" ? "text-white" : "text-slate-900"}`}>Pembagian Data (Split)</h3>
            <p className="text-xs text-slate-400 mt-1">Rasio Evaluasi Latih-Uji</p>
          </div>
          <div className={`border-t pt-3 space-y-2 ${theme === "dark" ? "border-slate-700" : "border-slate-100"}`}>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Data Training</span>
              <span className={`font-semibold ${theme === "dark" ? "text-slate-200" : "text-slate-800"}`}>209 Sampel (70%)</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Data Testing</span>
              <span className={`font-semibold ${theme === "dark" ? "text-slate-200" : "text-slate-800"}`}>91 Sampel (30%)</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Metode</span>
              <span className={`font-semibold ${theme === "dark" ? "text-slate-200" : "text-slate-800"}`}>Stratified Random</span>
            </div>
          </div>
        </div>

        {/* Card 4: Model Param */}
        <div className={`border rounded-2xl p-5 shadow-sm space-y-4 transition-all duration-300 ${
          theme === "dark" ? "bg-[#1e293b] border-[#334155] text-white" : "bg-white border-slate-200 text-slate-800"
        }`}>
          <div className="flex justify-between items-start">
            <div className={`p-3 rounded-xl ${theme === "dark" ? "bg-slate-800 text-pink-400" : "bg-pink-50 text-pink-800"}`}>
              <Cpu className="w-5.5 h-5.5" />
            </div>
            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${theme === "dark" ? "bg-slate-800 text-slate-400" : "bg-slate-100 text-slate-600"}`}>HYPERPARAMETERS</span>
          </div>
          <div>
            <h3 className={`font-bold text-sm ${theme === "dark" ? "text-white" : "text-slate-900"}`}>Konfigurasi Random Forest</h3>
            <p className="text-xs text-slate-400 mt-1">Parameter Pelatihan Model GEE</p>
          </div>
          <div className={`border-t pt-3 space-y-2 ${theme === "dark" ? "border-slate-700" : "border-slate-100"}`}>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Jumlah Trees</span>
              <span className={`font-bold font-mono ${theme === "dark" ? "text-slate-200" : "text-slate-800"}`}>100</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Seed Nilai</span>
              <span className={`font-semibold font-mono ${theme === "dark" ? "text-slate-200" : "text-slate-800"}`}>123</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Prediktor Spektral</span>
              <span className={`font-semibold ${theme === "dark" ? "text-slate-200" : "text-slate-800"}`}>B2, B3, B4, B8, NDVI</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Workflow Explainer */}
      <div className={`border rounded-2xl overflow-hidden shadow-sm transition-all duration-300 ${
        theme === "dark" ? "bg-[#1e293b] border-[#334155]" : "bg-white border-slate-200"
      }`}>
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-850">
          <div className="flex items-center gap-3">
            <Settings className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="font-bold font-display text-base">Alur Kerja (Workflow) Interaktif</h3>
              <p className="text-xs text-slate-400">Klik langkah-langkah di bawah untuk mempelajari detail setiap proses analisis GIS.</p>
            </div>
          </div>
          <span className="text-[10px] font-mono bg-emerald-600 px-2 py-0.5 rounded text-white">GOOGLE EARTH ENGINE FLOW</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[350px]">
          {/* Navigation Sidebar List (Col Span 4) */}
          <div className={`lg:col-span-4 border-r transition-colors duration-300 ${
            theme === "dark" ? "border-slate-700 bg-slate-900/40 divide-y divide-slate-800" : "border-slate-100 bg-slate-50/50 divide-y divide-slate-100"
          }`}>
            {stepsDetails.map((step, idx) => (
              <button
                key={idx}
                onClick={() => setActiveStep(idx)}
                className={`w-full text-left p-4 flex items-center gap-3 transition-colors cursor-pointer ${
                  activeStep === idx 
                    ? theme === "dark"
                      ? "bg-slate-800 border-l-4 border-emerald-500 text-white font-semibold"
                      : "bg-emerald-50 border-l-4 border-emerald-600 text-emerald-900 font-semibold" 
                    : theme === "dark"
                      ? "hover:bg-slate-800 text-slate-300"
                      : "hover:bg-slate-100 text-slate-700"
                }`}
              >
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 ${
                  activeStep === idx ? "bg-emerald-600 text-white font-bold" : "bg-slate-200 text-slate-600"
                }`}>
                  {idx + 1}
                </span>
                <span className="text-xs font-medium truncate">{step.title.substring(3)}</span>
              </button>
            ))}
          </div>

          {/* Detailed Content Panel (Col Span 8) */}
          <div className={`lg:col-span-8 p-8 flex flex-col justify-between transition-colors duration-300 ${
            theme === "dark" ? "bg-[#1e293b]" : "bg-white"
          }`}>
            <div className="space-y-6">
              <span className={`text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${
                theme === "dark" ? "text-emerald-400 bg-emerald-950/40" : "text-emerald-600 bg-emerald-50"
              }`}>
                Langkah {activeStep + 1} Dari 7
              </span>
              <h4 className={`text-xl font-bold font-display ${theme === "dark" ? "text-white" : "text-slate-900"}`}>{stepsDetails[activeStep].title}</h4>
              <p className={`text-sm leading-relaxed text-justify ${theme === "dark" ? "text-slate-300" : "text-slate-600"}`}>
                {stepsDetails[activeStep].desc}
              </p>
            </div>

            <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 border-t pt-6 mt-8 ${
              theme === "dark" ? "border-slate-700" : "border-slate-100"
            }`}>
              <div className={`p-3 rounded-lg ${theme === "dark" ? "bg-slate-800/80" : "bg-slate-50"}`}>
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Teknologi / Fungsi</span>
                <p className={`text-xs font-semibold mt-1 ${theme === "dark" ? "text-slate-200" : "text-slate-800"}`}>{stepsDetails[activeStep].tech}</p>
              </div>
              <div className={`p-3 rounded-lg ${theme === "dark" ? "bg-slate-800/80" : "bg-slate-50"}`}>
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Statistik / Standar</span>
                <p className="text-xs font-bold text-emerald-500 mt-1">{stepsDetails[activeStep].stat}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
