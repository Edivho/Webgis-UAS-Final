import React, { useState } from "react";
import { 
  Waves, 
  CloudRain, 
  Trees, 
  TrendingDown, 
  TrendingUp, 
  Compass, 
  FileText, 
  AlertTriangle, 
  CheckCircle,
  Activity,
  ArrowRight,
  Droplets,
  Sprout
} from "lucide-react";

interface FloodContextProps {
  theme: "light" | "dark";
}

export default function FloodContext({ theme }: FloodContextProps) {
  const [activeSubTab, setActiveSubTab] = useState<"overview" | "dynamics" | "mitigation">("overview");

  const timelineEvents = [
    {
      date: "Oktober – November 2025",
      title: "Anomali Cuaca & Presipitasi Ekstrem",
      description: "Fenomena cuaca regional memicu curah hujan harian melebihi 150 mm/hari di kawasan Pegunungan Leuser dan hulu Aceh Tamiang, menempatkan tanah pada kondisi jenuh air (saturated).",
      icon: <CloudRain className="w-4 h-4 text-blue-500" />
    },
    {
      date: "Desember 2025",
      title: "Puncak Limpasan Banjir (Flash Flood & Inundation)",
      description: "Debit air Sungai Tamiang melampaui kapasitas tampung akibat hilangnya vegetasi penahan di daerah aliran sungai (DAS). Banjir setinggi 1-2.5 meter merendam lebih dari 8 kecamatan dari hulu hingga hilir.",
      icon: <Waves className="w-4 h-4 text-amber-500 animate-pulse" />
    },
    {
      date: "Januari – Februari 2026",
      title: "Asfiksiasi Lahan & Deteksi Kerusakan Tajuk",
      description: "Genangan air yang menetap selama berminggu-minggu mengakibatkan pembusukan akar vegetasi non-adaptif. Analisis Sentinel-2 mencatat penurunan indeks spektral NDVI secara drastis (Loss Vegetasi).",
      icon: <TrendingDown className="w-4 h-4 text-red-500" />
    },
    {
      date: "Maret 2026 – Seterusnya",
      title: "Suksesi Alami & Inisiasi Restorasi Hijau",
      description: "Inisiasi penanaman kembali vegetasi ripari DAS dan mangrove pesisir oleh komunitas lokal, dipadukan dengan suksesi alami tumbuhan pionir yang mulai terdeteksi sebagai area 'Gain'.",
      icon: <Sprout className="w-4 h-4 text-emerald-500" />
    }
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner introducing the disaster-vegetation nexus */}
      <div className={`border rounded-2xl p-6 md:p-8 shadow-sm relative overflow-hidden transition-all duration-300 ${
        theme === "dark" 
          ? "bg-gradient-to-br from-[#1e293b] to-[#0f172a] border-[#334155]" 
          : "bg-gradient-to-br from-white to-slate-50 border-slate-200"
      }`}>
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute left-0 bottom-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-3xl space-y-4 relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400">
            <Activity className="w-3 h-3 text-blue-400" /> Jurnal & Analisis Eco-Geofisika
          </span>
          <h2 className={`text-2xl md:text-3xl font-extrabold font-display leading-tight ${
            theme === "dark" ? "text-white" : "text-slate-900"
          }`}>
            Siklus Bencana Banjir Akhir 2025 & Hubungannya dengan Dinamika Vegetasi
          </h2>
          <p className={`text-xs md:text-sm leading-relaxed text-justify ${
            theme === "dark" ? "text-slate-300" : "text-slate-600"
          }`}>
            Korelasi spasial-temporal membuktikan bahwa daerah dengan tingkat deforestasi/pengurangan vegetasi tinggi di hulu (Tenggulun & Tamiang Hulu) berkolerasi linear terhadap peningkatan intensitas limpasan banjir akhir tahun 2025. Sebaliknya, dampak banjir itu sendiri memicu penurunan kesehatan vegetasi hilir yang terdeteksi secara spektral pada citra awal tahun 2026.
          </p>

          <div className="flex flex-wrap gap-2 pt-2">
            <button
              onClick={() => setActiveSubTab("overview")}
              className={`px-4 py-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                activeSubTab === "overview"
                  ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                  : theme === "dark"
                    ? "bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800"
                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              Kronologi & Aliran Spasial
            </button>
            <button
              onClick={() => setActiveSubTab("dynamics")}
              className={`px-4 py-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                activeSubTab === "dynamics"
                  ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                  : theme === "dark"
                    ? "bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800"
                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              Mekanisme Kerusakan Vegetasi (NDVI vs NDWI)
            </button>
            <button
              onClick={() => setActiveSubTab("mitigation")}
              className={`px-4 py-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                activeSubTab === "mitigation"
                  ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                  : theme === "dark"
                    ? "bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800"
                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              Rekomendasi Restorasi & Kebijakan
            </button>
          </div>
        </div>
      </div>

      {/* Dynamic Subpanels */}
      {activeSubTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Timeline of the Event */}
          <div className={`lg:col-span-7 border rounded-2xl p-6 shadow-sm space-y-6 transition-all duration-300 ${
            theme === "dark" ? "bg-[#1e293b] border-[#334155] text-white" : "bg-white border-slate-200 text-slate-800"
          }`}>
            <div className="border-b pb-3 border-slate-200/10">
              <h3 className={`font-bold font-display text-base ${theme === "dark" ? "text-white" : "text-slate-900"}`}>
                Kronologi Bencana & Respon Vegetasi
              </h3>
              <p className="text-xs text-slate-400">Lintasan waktu bagaimana anomali cuaca mempengaruhi tutupan lahan.</p>
            </div>

            <div className="relative border-l border-slate-200/20 ml-3 pl-6 space-y-6">
              {timelineEvents.map((evt, idx) => (
                <div key={idx} className="relative">
                  {/* Pin Dot Icon */}
                  <span className={`absolute -left-[37px] top-1.5 p-1.5 rounded-full border shadow-md flex items-center justify-center ${
                    theme === "dark" ? "bg-[#0f172a] border-[#334155]" : "bg-white border-slate-200"
                  }`}>
                    {evt.icon}
                  </span>
                  
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold font-mono tracking-wider text-blue-400 uppercase">{evt.date}</span>
                    <h4 className={`text-xs md:text-sm font-bold ${theme === "dark" ? "text-slate-100" : "text-slate-900"}`}>
                      {evt.title}
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed text-justify">
                      {evt.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upstream-Downstream Ecological feedback illustration (Col Span 5) */}
          <div className={`lg:col-span-5 border rounded-2xl p-6 shadow-sm space-y-6 transition-all duration-300 ${
            theme === "dark" ? "bg-[#1e293b] border-[#334155] text-white" : "bg-white border-slate-200 text-slate-800"
          }`}>
            <div className="border-b pb-3 border-slate-200/10">
              <h3 className={`font-bold font-display text-base ${theme === "dark" ? "text-white" : "text-slate-900"}`}>
                Hubungan Ekologi Hulu-Hilir
              </h3>
              <p className="text-xs text-slate-400">Mengapa kesehatan vegetasi hulu melindungi wilayah hilir.</p>
            </div>

            {/* Illustration Steps */}
            <div className="space-y-4">
              {/* Step 1 */}
              <div className={`p-3 rounded-xl border flex gap-3.5 items-start ${
                theme === "dark" ? "bg-slate-800/50 border-slate-700/80" : "bg-slate-50 border-slate-100"
              }`}>
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                  <Trees className="w-5 h-5" />
                </div>
                <div className="space-y-1 min-w-0">
                  <h5 className={`text-xs font-bold leading-tight ${theme === "dark" ? "text-slate-200" : "text-slate-800"}`}>
                    1. Intersepsi Air oleh Kanopi Hulu
                  </h5>
                  <p className="text-[11px] text-slate-400 leading-relaxed text-justify">
                    Hutan lebat memecah butiran hujan dan memperlambat infiltrasi tanah. Ketika lahan hulu dikonversi, air langsung mengalir deras sebagai limpasan permukaan tanpa hambatan.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className={`p-3 rounded-xl border flex gap-3.5 items-start ${
                theme === "dark" ? "bg-slate-800/50 border-slate-700/80" : "bg-slate-50 border-slate-100"
              }`}>
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
                  <Waves className="w-5 h-5" />
                </div>
                <div className="space-y-1 min-w-0">
                  <h5 className={`text-xs font-bold leading-tight ${theme === "dark" ? "text-slate-200" : "text-slate-800"}`}>
                    2. Limpasan Sungai Hilir Ekstrem
                  </h5>
                  <p className="text-[11px] text-slate-400 leading-relaxed text-justify">
                    Sistem hidrologi yang timpang mengirim jutaan meter kubik air ke hilir secara serentak. Sungai Tamiang meluap hebat merendam pemukiman, kelapa sawit, dan perkebunan warga.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className={`p-3 rounded-xl border flex gap-3.5 items-start ${
                theme === "dark" ? "bg-slate-800/50 border-slate-700/80" : "bg-slate-50 border-slate-100"
              }`}>
                <div className="p-2 rounded-lg bg-red-500/10 text-red-500">
                  <TrendingDown className="w-5 h-5" />
                </div>
                <div className="space-y-1 min-w-0">
                  <h5 className={`text-xs font-bold leading-tight ${theme === "dark" ? "text-slate-200" : "text-slate-800"}`}>
                    3. Degradasi Vegetasi (Loss) Pasca Banjir
                  </h5>
                  <p className="text-[11px] text-slate-400 leading-relaxed text-justify">
                    Asfiksiasi akar akibat terendam lumpur banjir menghancurkan tanaman pertanian musiman dan menguningkan tajuk kelapa sawit rakyat, memicu 'Loss' vegetasi seluas ratusan hektar.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === "dynamics" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* NDVI vs NDWI Spectral Context */}
          <div className={`border rounded-2xl p-6 shadow-sm space-y-4 transition-all duration-300 ${
            theme === "dark" ? "bg-[#1e293b] border-[#334155] text-white" : "bg-white border-slate-200 text-slate-800"
          }`}>
            <div className="flex items-center gap-2 text-blue-500 border-b pb-3 border-slate-200/10">
              <Droplets className="w-5 h-5" />
              <h3 className={`font-bold font-display text-base ${theme === "dark" ? "text-white" : "text-slate-900"}`}>
                Metrik Deteksi Spektral
              </h3>
            </div>
            
            <p className="text-xs text-slate-400 leading-relaxed text-justify">
              Dalam penginderaan jauh (Remote Sensing), korelasi antara kandungan air permukaan dan kerapatan hijau vegetasi dianalisis menggunakan dua indeks spektral utama dari Sentinel-2:
            </p>

            <div className="space-y-4 pt-2">
              <div className={`p-4 rounded-xl border ${theme === "dark" ? "bg-slate-800/50 border-slate-700" : "bg-slate-50 border-slate-100"}`}>
                <span className="text-[10px] font-bold font-mono text-emerald-500">NDVI (Normalized Difference Vegetation Index)</span>
                <p className="text-xs text-slate-400 mt-1">
                  Formula: <code className="bg-slate-900 px-1 py-0.5 rounded text-amber-400 font-mono text-[10px]">(NIR - Red) / (NIR + Red)</code>. Sensitif terhadap kandungan klorofil tanaman. Penurunan nilai NDVI secara cepat menandakan stres berat tanaman akibat genangan banjir.
                </p>
              </div>

              <div className={`p-4 rounded-xl border ${theme === "dark" ? "bg-slate-800/50 border-slate-700" : "bg-slate-50 border-slate-100"}`}>
                <span className="text-[10px] font-bold font-mono text-blue-400">NDWI (Normalized Difference Water Index)</span>
                <p className="text-xs text-slate-400 mt-1">
                  Formula: <code className="bg-slate-900 px-1 py-0.5 rounded text-amber-400 font-mono text-[10px]">(Green - NIR) / (Green + NIR)</code>. Sensitif terhadap kandungan air permukaan dan kelembaban kanopi. Peningkatan tajam NDWI melacak luas deliniasi genangan banjir secara presisi.
                </p>
              </div>
            </div>
          </div>

          {/* Observed Vegetation dynamics correlation in actual GeoJSON data */}
          <div className={`border rounded-2xl p-6 shadow-sm space-y-4 transition-all duration-300 ${
            theme === "dark" ? "bg-[#1e293b] border-[#334155] text-white" : "bg-white border-slate-200 text-slate-800"
          }`}>
            <div className="flex items-center gap-2 text-emerald-500 border-b pb-3 border-slate-200/10">
              <Compass className="w-5 h-5" />
              <h3 className={`font-bold font-display text-base ${theme === "dark" ? "text-white" : "text-slate-900"}`}>
                Siklus Respon Data GeoJSON
              </h3>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed text-justify">
              Ketika Anda melihat lapisan peta spasial yang diolah langsung dari dataset GeoJSON Anda:
            </p>

            <div className="space-y-3.5 pt-1">
              <div className="flex gap-2.5 items-start">
                <CheckCircle className="w-4.5 h-4.5 text-red-500 shrink-0 mt-0.5" />
                <div className="text-xs text-slate-400">
                  <strong className={theme === "dark" ? "text-slate-200" : "text-slate-700"}>Layer Loss (Kehilangan):</strong> Sebagian besar cluster merah yang Anda lihat di sepanjang aliran sungai tengah ke hilir (Manyak Payed dan Bendahara) merepresentasikan lahan tani/sawit yang hancur karena layu bakteri dan pembusukan setelah terendam banjir lumpur selama berminggu-minggu pada akhir 2025.
                </div>
              </div>

              <div className="flex gap-2.5 items-start">
                <CheckCircle className="w-4.5 h-4.5 text-blue-500 shrink-0 mt-0.5" />
                <div className="text-xs text-slate-400">
                  <strong className={theme === "dark" ? "text-slate-200" : "text-slate-700"}>Layer Gain (Keuntungan):</strong> Menunjukkan pemulihan cepat semak belukar pionir di kawasan terasering bukit dan hasil program rehabilitasi hulu setelah badai curah hujan reda, memperkuat struktur tanah dari bahaya longsor susulan.
                </div>
              </div>

              <div className="flex gap-2.5 items-start">
                <CheckCircle className="w-4.5 h-4.5 text-emerald-500 shrink-0 mt-0.5" />
                <div className="text-xs text-slate-400">
                  <strong className={theme === "dark" ? "text-slate-200" : "text-slate-700"}>Kondisi Mangrove Pesisir:</strong> Limpasan banjir yang membawa muatan sedimen tinggi mengendap di muara sungai (Seruway/Kuala Penaga), yang mengganggu salinitas air muara sehingga mendegradasi kelestarian sabuk perlindungan alami mangrove pesisir.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === "mitigation" && (
        <div className={`border rounded-2xl p-6 shadow-sm space-y-6 transition-all duration-300 ${
          theme === "dark" ? "bg-[#1e293b] border-[#334155] text-white" : "bg-white border-slate-200 text-slate-800"
        }`}>
          <div className="border-b pb-3 border-slate-200/10">
            <h3 className={`font-bold font-display text-base ${theme === "dark" ? "text-white" : "text-slate-900"}`}>
              Rencana Mitigasi Kebijakan Berbasis Geospasial (WebGIS-driven Policy)
            </h3>
            <p className="text-xs text-slate-400">Rekomendasi taktis berbasis temuan spasial dari citra Sentinel-2.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className={`p-4 rounded-xl border space-y-2.5 ${theme === "dark" ? "bg-slate-800/30 border-slate-700" : "bg-slate-50 border-slate-100"}`}>
              <div className="text-blue-500 font-bold text-xs font-mono uppercase tracking-widest">1. Zonasi Konservasi Riparian</div>
              <p className="text-xs text-slate-400 leading-relaxed text-justify">
                Wajib menetapkan moratorium pembukaan kebun sawit baru dalam jarak minimum 100 meter dari garis sempadan Sungai Tamiang. Zona ini harus ditanami bambu pelindung, aren, atau kayu keras tahan air untuk memperlambat arus sungai.
              </p>
            </div>

            <div className={`p-4 rounded-xl border space-y-2.5 ${theme === "dark" ? "bg-slate-800/30 border-slate-700" : "bg-slate-50 border-slate-100"}`}>
              <div className="text-emerald-500 font-bold text-xs font-mono uppercase tracking-widest">2. Reboisasi Hulu Intensif</div>
              <p className="text-xs text-slate-400 leading-relaxed text-justify">
                Memprioritaskan restorasi hutan lindung Gunung Leuser di hulu Sekerak, Tamiang Hulu, dan Tenggulun. Peta spasial menunjukkan kawasan lereng curam ini adalah kunci utama penyerap volume limpasan air sebelum meluncur ke dataran rendah.
              </p>
            </div>

            <div className={`p-4 rounded-xl border space-y-2.5 ${theme === "dark" ? "bg-slate-800/30 border-slate-700" : "bg-slate-50 border-slate-100"}`}>
              <div className="text-purple-400 font-bold text-xs font-mono uppercase tracking-widest">3. Sabuk Hijau Mangrove</div>
              <p className="text-xs text-slate-400 leading-relaxed text-justify">
                Mempercepat reforestasi mangrove di wilayah pesisir Banda Mulia dan Seruway guna meredam benturan muara akibat peningkatan volume aliran air yang sarat muatan material erosi pasca banjir bandang.
              </p>
            </div>
          </div>

          <div className={`p-4 rounded-xl border border-dashed flex flex-col md:flex-row gap-4 items-center justify-between ${
            theme === "dark" ? "border-slate-700 bg-emerald-950/10 text-emerald-300" : "border-emerald-200 bg-emerald-50/50 text-emerald-800"
          }`}>
            <div className="space-y-1 text-center md:text-left">
              <h5 className="text-xs font-bold flex items-center gap-1.5 justify-center md:justify-start">
                <CheckCircle className="w-4 h-4 text-emerald-500" /> WebGIS Sebagai Instrumen Pendukung Keputusan (DSS)
              </h5>
              <p className="text-[11px] text-slate-400 max-w-2xl leading-relaxed text-justify">
                Melalui peta perubahan vegetasi multitemporal ini, Badan Penanggulangan Bencana Daerah (BPBD) dan Dinas Kehutanan Aceh Tamiang dapat mengidentifikasi daerah kerentanan tinggi secara akurat demi keberhasilan program rehabilitasi lingkungan jangka panjang.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
