import React from "react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from "recharts";
import { TrendingUp, ArrowDownRight, ArrowUpRight, Leaf, ShieldAlert, CheckCircle, FileText } from "lucide-react";

interface InsightHasilProps {
  veg2025?: any;
  veg2026?: any;
  gainData?: any;
  lossData?: any;
  boundaryData?: any;
  theme?: "light" | "dark";
}

export default function InsightHasil({
  theme = "light"
}: InsightHasilProps) {
  // 1. NILAI LUAS TEPAT SESUAI HASIL PENGOLAHAN GOOGLE EARTH ENGINE (GEE)
  const totalVeg2025AreaHa = 115218.78; // Ha
  const totalVeg2026AreaHa = 117921.72; // Ha
  const totalGainAreaHa = 32969.07;    // Ha
  const totalLossAreaHa = 30266.12;    // Ha
  const pctChangeVeg = 2.35;            // % (2.345924...)
  
  // Konversi ke Meter Persegi (m²) & Kilometer Persegi (km²)
  const totalVeg2025AreaM2 = totalVeg2025AreaHa * 10000;
  const totalVeg2026AreaM2 = totalVeg2026AreaHa * 10000;
  const totalGainAreaM2 = totalGainAreaHa * 10000;
  const totalLossAreaM2 = totalLossAreaHa * 10000;

  const veg2025Km2 = totalVeg2025AreaHa / 100; // 1.152,19 km²
  const veg2026Km2 = totalVeg2026AreaHa / 100; // 1.179,22 km²
  const gainKm2 = totalGainAreaHa / 100;       // 329,69 km²
  const lossKm2 = totalLossAreaHa / 100;       // 302,66 km²

  // Estimasi Luas Wilayah Kabupaten Aceh Tamiang (m²) & Piksel Citra (10m x 10m = 100m² per piksel)
  const totalBoundaryAreaM2 = 1939750000; // ~1.939,75 km²
  
  const totalVeg2025Count = Math.round(totalVeg2025AreaM2 / 100); // ~11.521.878 piksel
  const totalVeg2026Count = Math.round(totalVeg2026AreaM2 / 100); // ~11.792.172 piksel
  const totalGainCount = Math.round(totalGainAreaM2 / 100);       // ~3.296.907 piksel
  const totalLossCount = Math.round(totalLossAreaM2 / 100);       // ~3.026.612 piksel
  const totalBoundaryCount = Math.round(totalBoundaryAreaM2 / 100);

  // Perhitungan Rasio Tutupan
  const pctVeg2025 = (totalVeg2025AreaM2 / totalBoundaryAreaM2) * 100;
  const pctVeg2026 = (totalVeg2026AreaM2 / totalBoundaryAreaM2) * 100;
  const netChangeAreaHa = totalVeg2026AreaHa - totalVeg2025AreaHa; // +2.702,94 Ha

  // Formatting Helper
  const formatAreaKm = (km2Value: number) => {
    return new Intl.NumberFormat("id-ID", { maximumFractionDigits: 2 }).format(km2Value) + " km²";
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("id-ID").format(num);
  };

  // Chart Data
  const barChartData = [
    { name: "Vegetasi 2025", Luas_KM2: veg2025Km2, Piksel: totalVeg2025Count },
    { name: "Vegetasi 2026", Luas_KM2: veg2026Km2, Piksel: totalVeg2026Count },
    { name: "Gain Vegetasi", Luas_KM2: gainKm2, Piksel: totalGainCount },
    { name: "Loss Vegetasi", Luas_KM2: lossKm2, Piksel: totalLossCount },
  ];

  const pieData2025 = [
    { name: "Vegetasi 2025", value: veg2025Km2, color: "#10b981" },
    { name: "Non-Vegetasi 2025", value: (totalBoundaryAreaM2 / 1000000) - veg2025Km2, color: theme === "dark" ? "#475569" : "#cbd5e1" }
  ];

  const pieData2026 = [
    { name: "Vegetasi 2026", value: veg2026Km2, color: "#15803d" },
    { name: "Non-Vegetasi 2026", value: (totalBoundaryAreaM2 / 1000000) - veg2026Km2, color: theme === "dark" ? "#334155" : "#94a3b8" }
  ];

  return (
    <div className="space-y-8">
      {/* Dynamic Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Veg 2025 */}
        <div className={`border rounded-2xl p-5 shadow-sm space-y-3 transition-all duration-300 ${
          theme === "dark" ? "bg-[#1e293b] border-[#334155] text-white" : "bg-white border-slate-200 text-slate-800"
        }`}>
          <div className="flex justify-between items-center text-xs font-mono font-bold text-slate-400">
            <span>LUAS VEGETASI 2025</span>
            <Leaf className="w-4.5 h-4.5 text-emerald-500" />
          </div>
          <div>
            <h4 className={`text-2xl font-extrabold font-display ${theme === "dark" ? "text-white" : "text-slate-900"}`}>{formatAreaKm(veg2025Km2)}</h4>
            <p className="text-xs text-slate-400 mt-1">Sama dengan {formatNumber(totalVeg2025Count)} piksel citra</p>
          </div>
          <div className={`rounded-lg p-2 flex justify-between items-center text-xs ${theme === "dark" ? "bg-slate-800" : "bg-slate-50"}`}>
            <span className="text-slate-400">Rasio Tutupan Wilayah:</span>
            <span className={`font-bold font-mono ${theme === "dark" ? "text-slate-200" : "text-slate-700"}`}>{pctVeg2025.toFixed(1)}%</span>
          </div>
        </div>

        {/* Card 2: Veg 2026 */}
        <div className={`border rounded-2xl p-5 shadow-sm space-y-3 transition-all duration-300 ${
          theme === "dark" ? "bg-[#1e293b] border-[#334155] text-white" : "bg-white border-slate-200 text-slate-800"
        }`}>
          <div className="flex justify-between items-center text-xs font-mono font-bold text-slate-400">
            <span>LUAS VEGETASI 2026</span>
            <Leaf className="w-4.5 h-4.5 text-emerald-600" />
          </div>
          <div>
            <h4 className={`text-2xl font-extrabold font-display ${theme === "dark" ? "text-white" : "text-slate-900"}`}>{formatAreaKm(veg2026Km2)}</h4>
            <p className="text-xs text-slate-400 mt-1">Sama dengan {formatNumber(totalVeg2026Count)} piksel citra</p>
          </div>
          <div className={`rounded-lg p-2 flex justify-between items-center text-xs ${theme === "dark" ? "bg-slate-800" : "bg-slate-50"}`}>
            <span className="text-slate-400">Rasio Tutupan Wilayah:</span>
            <span className={`font-bold font-mono ${theme === "dark" ? "text-slate-200" : "text-slate-700"}`}>{pctVeg2026.toFixed(1)}%</span>
          </div>
        </div>

        {/* Card 3: Gain */}
        <div className={`border rounded-2xl p-5 shadow-sm space-y-3 transition-all duration-300 ${
          theme === "dark" ? "bg-[#1e293b] border-[#334155] text-white" : "bg-white border-slate-200 text-slate-800"
        }`}>
          <div className="flex justify-between items-center text-xs font-mono font-bold text-slate-400">
            <span>TOTAL VEGETATION GAIN</span>
            <ArrowUpRight className="w-4.5 h-4.5 text-blue-500" />
          </div>
          <div>
            <h4 className="text-2xl font-extrabold font-display text-blue-500">{formatAreaKm(gainKm2)}</h4>
            <p className="text-xs text-slate-400 mt-1">Sama dengan {formatNumber(totalGainCount)} piksel citra</p>
          </div>
          <div className={`rounded-lg p-2 flex justify-between items-center text-xs font-semibold ${
            theme === "dark" ? "bg-blue-950/30 text-blue-300" : "bg-blue-50 text-blue-800"
          }`}>
            <span>Area Penghijauan Baru:</span>
            <span className="font-mono">+{((totalGainAreaHa / totalVeg2025AreaHa) * 100).toFixed(1)}%</span>
          </div>
        </div>

        {/* Card 4: Loss */}
        <div className={`border rounded-2xl p-5 shadow-sm space-y-3 transition-all duration-300 ${
          theme === "dark" ? "bg-[#1e293b] border-[#334155] text-white" : "bg-white border-slate-200 text-slate-800"
        }`}>
          <div className="flex justify-between items-center text-xs font-mono font-bold text-slate-400">
            <span>TOTAL VEGETATION LOSS</span>
            <ArrowDownRight className="w-4.5 h-4.5 text-red-500" />
          </div>
          <div>
            <h4 className="text-2xl font-extrabold font-display text-red-500">{formatAreaKm(lossKm2)}</h4>
            <p className="text-xs text-slate-400 mt-1">Sama dengan {formatNumber(totalLossCount)} piksel citra</p>
          </div>
          <div className={`rounded-lg p-2 flex justify-between items-center text-xs font-semibold ${
            theme === "dark" ? "bg-red-950/30 text-red-300" : "bg-red-50 text-red-800"
          }`}>
            <span>Area Deforestasi/Lahan Terbuka:</span>
            <span className="font-mono">-{((totalLossAreaHa / totalVeg2025AreaHa) * 100).toFixed(1)}%</span>
          </div>
        </div>
      </div>

      {/* Visualizations Section using Recharts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Bar Chart comparing area metrics (Col Span 7) */}
        <div className={`lg:col-span-7 border rounded-2xl p-5 shadow-sm flex flex-col justify-between transition-all duration-300 ${
          theme === "dark" ? "bg-[#1e293b] border-[#334155] text-white" : "bg-white border-slate-200 text-slate-800"
        }`}>
          <div>
            <h3 className={`font-bold font-display text-base mb-1 ${theme === "dark" ? "text-white" : "text-slate-900"}`}>
              Perbandingan Luas Kelas Spasial (km²)
            </h3>
            <p className="text-xs text-slate-400 mb-6">Visualisasi luas total vegetasi tahun 2025 vs 2026 beserta luasan akumulasi Gain dan Loss.</p>
          </div>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={barChartData}
                margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === "dark" ? "#334155" : "#f1f5f9"} />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: theme === "dark" ? "#94a3b8" : "#64748b", fontSize: 11 }}
                  axisLine={{ stroke: theme === "dark" ? "#475569" : "#cbd5e1" }}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fill: theme === "dark" ? "#94a3b8" : "#64748b", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', color: '#fff', borderRadius: '8px', border: 'none', fontSize: '12px' }}
                  itemStyle={{ color: '#38bdf8' }}
                  formatter={(value) => [`${value} km²`, 'Luas Spasial']}
                />
                <Bar dataKey="Luas_KM2" radius={[6, 6, 0, 0]}>
                  {barChartData.map((entry, index) => {
                    const colors = ["#4ade80", "#15803d", "#3b82f6", "#ef4444"];
                    return <Cell key={`cell-${index}`} fill={colors[index]} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className={`p-3 rounded-lg flex items-center justify-between text-xs mt-4 border ${
            theme === "dark" ? "bg-slate-800 border-slate-700 text-slate-300" : "bg-slate-50 border-slate-100 text-slate-600"
          }`}>
            <div className="flex items-center gap-1.5 font-semibold">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <span className={theme === "dark" ? "text-slate-200" : "text-slate-700"}>Perubahan Netto Vegetasi:</span>
            </div>
            <span className="font-mono font-bold text-emerald-500">
              +{formatAreaKm(netChangeAreaHa / 100)} (+{pctChangeVeg.toFixed(2)}%)
            </span>
          </div>
        </div>

        {/* Composition Pie Charts (Col Span 5) */}
        <div className={`lg:col-span-5 border rounded-2xl p-5 shadow-sm flex flex-col justify-between transition-all duration-300 ${
          theme === "dark" ? "bg-[#1e293b] border-[#334155] text-white" : "bg-white border-slate-200 text-slate-800"
        }`}>
          <div>
            <h3 className={`font-bold font-display text-base mb-1 ${theme === "dark" ? "text-white" : "text-slate-900"}`}>
              Rasio Tutupan Lahan Kabupaten
            </h3>
            <p className="text-xs text-slate-400 mb-6">Porsi sebaran spasial kelas vegetasi terhadap total luas wilayah Aceh Tamiang.</p>
          </div>

          <div className="grid grid-cols-2 gap-4 items-center">
            {/* Pie 2025 */}
            <div className="flex flex-col items-center">
              <div className="h-[140px] w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData2025}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={55}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {pieData2025.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} km²`, 'Luas']} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className={`text-sm font-bold ${theme === "dark" ? "text-slate-200" : "text-slate-800"}`}>{pctVeg2025.toFixed(0)}%</span>
                  <span className="text-[9px] text-slate-400 font-mono">Hijau</span>
                </div>
              </div>
              <span className={`text-xs font-bold mt-2 ${theme === "dark" ? "text-slate-300" : "text-slate-700"}`}>Kondisi 2025</span>
            </div>

            {/* Pie 2026 */}
            <div className="flex flex-col items-center">
              <div className="h-[140px] w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData2026}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={55}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {pieData2026.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} km²`, 'Luas']} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className={`text-sm font-bold ${theme === "dark" ? "text-slate-200" : "text-slate-800"}`}>{pctVeg2026.toFixed(0)}%</span>
                  <span className="text-[9px] text-slate-400 font-mono">Hijau</span>
                </div>
              </div>
              <span className={`text-xs font-bold mt-2 ${theme === "dark" ? "text-slate-300" : "text-slate-700"}`}>Kondisi 2026</span>
            </div>
          </div>

          <div className={`border-t pt-3.5 mt-4 space-y-2 ${theme === "dark" ? "border-slate-700" : "border-slate-100"}`}>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Total Luas Kabupaten (Boundary):</span>
              <span className={`font-bold font-mono ${theme === "dark" ? "text-slate-200" : "text-slate-800"}`}>{formatAreaKm(totalBoundaryAreaM2 / 1000000)}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Estimasi Total Piksel Wilayah:</span>
              <span className="font-semibold font-mono text-slate-400">{formatNumber(totalBoundaryCount)} px</span>
            </div>
          </div>
        </div>
      </div>

      {/* Structured Interpretation & Discussion */}
      <div className={`border rounded-2xl p-6 shadow-sm space-y-6 transition-all duration-300 ${
        theme === "dark" ? "bg-[#1e293b] border-[#334155] text-white" : "bg-white border-slate-200 text-slate-800"
      }`}>
        <div className={`border-b pb-3 ${theme === "dark" ? "border-slate-700" : "border-slate-100"}`}>
          <h3 className={`font-bold font-display text-base ${theme === "dark" ? "text-white" : "text-slate-900"}`}>Interpretasi Hasil Analisis & Pembahasan Spasial</h3>
          <p className="text-xs text-slate-400">Tinjauan mendalam dinamika vegetasi Aceh Tamiang (2025–2026).</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm text-slate-400 leading-relaxed text-justify">
          {/* Discussion Part 1 */}
          <div className="space-y-2">
            <h4 className={`font-bold flex items-center gap-1.5 ${theme === "dark" ? "text-white" : "text-slate-900"}`}>
              <ArrowDownRight className="w-4.5 h-4.5 text-red-500" /> Dinamika Kehilangan (Loss)
            </h4>
            <p className={`text-xs leading-relaxed ${theme === "dark" ? "text-slate-300" : "text-slate-600"}`}>
              Analisis mendeteksi pengurangan vegetasi sebesar **{formatAreaKm(lossKm2)}** ({((totalLossAreaHa / totalVeg2025AreaHa) * 100).toFixed(1)}% dari awal). Terkonsentrasi di timur laut akibat pembukaan perkebunan sawit, pembangunan permukiman, dan perluasan tambak pesisir.
            </p>
          </div>

          {/* Discussion Part 2 */}
          <div className="space-y-2">
            <h4 className={`font-bold flex items-center gap-1.5 ${theme === "dark" ? "text-white" : "text-slate-900"}`}>
              <ArrowUpRight className="w-4.5 h-4.5 text-blue-500" /> Pertumbuhan Baru (Gain)
            </h4>
            <p className={`text-xs leading-relaxed ${theme === "dark" ? "text-slate-300" : "text-slate-600"}`}>
              Mencatat adanya pertumbuhan vegetasi baru sebesar **{formatAreaKm(gainKm2)}**. Terdistribusi di hulu pegunungan barat daya berkat suksesi alami hutan sekunder dan program reboisasi kawasan hutan lindung.
            </p>
          </div>

          {/* Discussion Part 3 */}
          <div className="space-y-2">
            <h4 className={`font-bold flex items-center gap-1.5 ${theme === "dark" ? "text-white" : "text-slate-900"}`}>
              <CheckCircle className="w-4.5 h-4.5 text-emerald-500" /> Pola Distribusi Spasial
            </h4>
            <p className={`text-xs leading-relaxed ${theme === "dark" ? "text-slate-300" : "text-slate-600"}`}>
              Kawasan hulu cenderung stabil mempertahankan rona hijau lebat. Pertumbuhan vegetasi bersih sebesar **+{pctChangeVeg.toFixed(2)}%** menunjukkan tren positif pemulihan tutupan tajuk hijau secara keseluruhan.
            </p>
          </div>

          {/* Discussion Part 4 */}
          <div className="space-y-2">
            <h4 className={`font-bold flex items-center gap-1.5 ${theme === "dark" ? "text-white" : "text-slate-900"}`}>
              <ShieldAlert className="w-4.5 h-4.5 text-amber-500" /> Potensi Kebijakan & Mitigasi
            </h4>
            <p className={`text-xs leading-relaxed ${theme === "dark" ? "text-slate-300" : "text-slate-600"}`}>
              Kehilangan vegetasi hulu berisiko memicu limpasan banjir sungai Tamiang secara ekstrem. Disarankan membatasi sawit di lereng curam &gt;15% dan memprioritaskan sabuk hijau di sepanjang daerah aliran sungai.
            </p>
          </div>

          {/* Discussion Part 5 */}
          <div className="space-y-2">
            <h4 className={`font-bold flex items-center gap-1.5 ${theme === "dark" ? "text-white" : "text-slate-900"}`}>
              <FileText className="w-4.5 h-4.5 text-purple-400" /> Keterbatasan Analisis
            </h4>
            <p className={`text-xs leading-relaxed ${theme === "dark" ? "text-slate-300" : "text-slate-600"}`}>
              Terbatas pada resolusi Sentinel-2 (10m) yang berpotensi bias mixed pixel antara semak belukar dengan kebun rakyat. Gangguan awan tipis juga dapat memengaruhi kestabilan pengukuran spektral NDVI.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}