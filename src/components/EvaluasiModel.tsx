import React from "react";
import { Award, Target, CheckCircle2, ShieldAlert, Sparkles, TrendingUp } from "lucide-react";

interface EvaluasiModelProps {
  theme?: "light" | "dark";
}

export default function EvaluasiModel({ theme = "light" }: EvaluasiModelProps) {
  const metrics = [
    {
      title: "Overall Accuracy",
      value: "87.91%",
      decimal: "0.8791",
      desc: "Ketepatan prediksi total terhadap uji lapangan.",
      icon: <Award className="w-5 h-5 text-emerald-500" />,
      colorClass: theme === "dark" ? "bg-emerald-950/40 border-emerald-900/50 text-emerald-300" : "bg-emerald-50 border-emerald-100 text-emerald-800",
      progressColor: "bg-emerald-500"
    },
    {
      title: "Precision (Vegetasi)",
      value: "86.05%",
      decimal: "0.8605",
      desc: "Keandalan prediksi kelas vegetasi tepat.",
      icon: <Target className="w-5 h-5 text-teal-500" />,
      colorClass: theme === "dark" ? "bg-teal-950/40 border-teal-900/50 text-teal-300" : "bg-teal-50 border-teal-100 text-teal-800",
      progressColor: "bg-teal-500"
    },
    {
      title: "Recall (Vegetasi)",
      value: "88.10%",
      decimal: "0.8810",
      desc: "Kemampuan mendeteksi vegetasi aktual lapangan.",
      icon: <CheckCircle2 className="w-5 h-5 text-indigo-500" />,
      colorClass: theme === "dark" ? "bg-indigo-950/40 border-indigo-900/50 text-indigo-300" : "bg-indigo-50 border-indigo-100 text-indigo-800",
      progressColor: "bg-indigo-500"
    },
    {
      title: "F1 Score (Vegetasi)",
      value: "87.06%",
      decimal: "0.8706",
      desc: "Rata-rata penyeimbang nilai presisi dan recall.",
      icon: <Sparkles className="w-5 h-5 text-pink-500" />,
      colorClass: theme === "dark" ? "bg-pink-950/40 border-pink-900/50 text-pink-300" : "bg-pink-50 border-pink-100 text-pink-800",
      progressColor: "bg-pink-500"
    },
  ];

  const tp = 43; // True Positive
  const tn = 37; // True Negative
  const fp = 5;  // False Positive
  const fn = 6;  // False Negative
  const total = tp + tn + fp + fn;

  return (
    <div className="space-y-6">
      {/* Overview Explanation */}
      <div className={`border rounded-xl p-5 shadow-sm transition-all duration-300 ${
        theme === "dark" ? "bg-[#1e293b] border-[#334155] text-white" : "bg-white border-slate-200 text-slate-800"
      }`}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className={`text-lg font-bold font-display mb-1 ${theme === "dark" ? "text-white" : "text-slate-900"}`}>
              Evaluasi Performa & Validasi Model
            </h2>
            <p className={`text-xs leading-relaxed max-w-2xl ${theme === "dark" ? "text-slate-300" : "text-slate-600"}`}>
              Pengujian model menggunakan 91 sampel uji independen (30% dari total) untuk mengukur tingkat akurasi riil.
            </p>
          </div>
          <div className="px-3 py-1.5 bg-slate-900 rounded-lg text-white font-mono text-[11px] flex items-center gap-1.5 shrink-0 shadow-sm border border-slate-800">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span>Kappa: 0.757 (Sangat Tinggi)</span>
          </div>
        </div>
      </div>

      {/* Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, idx) => (
          <div key={idx} className={`border rounded-xl p-4 shadow-sm space-y-3 flex flex-col justify-between transition-all duration-300 ${
            theme === "dark" ? "bg-[#1e293b] border-[#334155] text-white" : "bg-white border-slate-200 text-slate-800"
          }`}>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{metric.title}</span>
                <div className={`p-1.5 rounded-md shrink-0 ${theme === "dark" ? "bg-slate-800 text-slate-200" : "bg-slate-50"}`}>{metric.icon}</div>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className={`text-2xl font-extrabold font-display ${theme === "dark" ? "text-white" : "text-slate-900"}`}>{metric.value}</span>
                <span className="text-[10px] font-mono text-slate-400">({metric.decimal})</span>
              </div>
              <p className={`text-[11px] leading-normal ${theme === "dark" ? "text-slate-300" : "text-slate-500"}`}>{metric.desc}</p>
            </div>
            {/* Progress bar visual indicator */}
            <div className={`w-full h-1 rounded-full overflow-hidden mt-1 ${theme === "dark" ? "bg-slate-800" : "bg-slate-100"}`}>
              <div 
                className={`${metric.progressColor} h-full rounded-full`} 
                style={{ width: metric.value }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Confusion Matrix Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Visual Heatmap Table (Col Span 5) */}
        <div className={`lg:col-span-5 border rounded-xl p-4 shadow-sm flex flex-col justify-between transition-all duration-300 ${
          theme === "dark" ? "bg-[#1e293b] border-[#334155] text-white" : "bg-white border-slate-200 text-slate-800"
        }`}>
          <div>
            <h3 className={`font-bold font-display text-sm mb-1 ${theme === "dark" ? "text-white" : "text-slate-900"}`}>Confusion Matrix Heatmap</h3>
            <p className="text-[11px] text-slate-400 mb-4">Matriks sebaran aktual vs prediksi model (N = {total} titik uji).</p>
          </div>

          <div className="space-y-3">
            <div className="relative">
              {/* Actual Y-axis Label */}
              <div className="absolute -left-10 top-1/2 -rotate-90 origin-center text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                ACTUAL
              </div>

              <div className="pl-5 pb-2">
                <table className="w-full border-collapse text-center">
                  <thead>
                    <tr>
                      <th className="w-1/4"></th>
                      <th className="w-3/8 pb-2 text-[10px] font-mono font-semibold text-slate-400 uppercase">Pred. Veg</th>
                      <th className="w-3/8 pb-2 text-[10px] font-mono font-semibold text-slate-400 uppercase">Pred. Non-Veg</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Actual Vegetasi Row */}
                    <tr>
                      <td className={`pr-2 py-3 text-left text-xs font-bold border-r ${
                        theme === "dark" ? "text-slate-300 border-slate-700" : "text-slate-700 border-slate-100"
                      }`}>Vegetasi</td>
                      
                      {/* True Positive Cell */}
                      <td className={`p-3 border rounded-tl-lg transition-all hover:scale-[1.01] cursor-pointer shadow-sm ${
                        theme === "dark" ? "border-slate-700 bg-emerald-950/60 text-emerald-200" : "border-slate-100 bg-emerald-50 text-emerald-900"
                      }`}>
                        <div className="flex flex-col items-center justify-center space-y-1">
                          <span className="text-xl font-extrabold font-mono">{tp}</span>
                          <span className={`text-[9px] font-sans font-medium uppercase tracking-wider ${theme === "dark" ? "text-emerald-400" : "text-emerald-700"}`}>TP</span>
                          <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${theme === "dark" ? "bg-emerald-900/40 text-emerald-300" : "bg-emerald-100 text-emerald-800"}`}>47.3%</span>
                        </div>
                      </td>

                      {/* False Negative Cell */}
                      <td className={`p-3 border rounded-tr-lg transition-all hover:scale-[1.01] cursor-pointer shadow-sm ${
                        theme === "dark" ? "border-slate-700 bg-red-950/40 text-red-300" : "border-slate-100 bg-red-50 text-red-900"
                      }`}>
                        <div className="flex flex-col items-center justify-center space-y-1">
                          <span className="text-xl font-extrabold font-mono">{fn}</span>
                          <span className={`text-[9px] font-sans font-medium uppercase tracking-wider ${theme === "dark" ? "text-red-400" : "text-red-700"}`}>FN</span>
                          <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${theme === "dark" ? "bg-red-900/40 text-red-300" : "bg-red-100 text-red-800"}`}>6.6%</span>
                        </div>
                      </td>
                    </tr>

                    {/* Actual Non-Vegetasi Row */}
                    <tr>
                      <td className={`pr-2 py-3 text-left text-xs font-bold border-r ${
                        theme === "dark" ? "text-slate-300 border-slate-700" : "text-slate-700 border-slate-100"
                      }`}>Non-Veg</td>

                      {/* False Positive Cell */}
                      <td className={`p-3 border rounded-bl-lg transition-all hover:scale-[1.01] cursor-pointer shadow-sm ${
                        theme === "dark" ? "border-slate-700 bg-red-950/40 text-red-300" : "border-slate-100 bg-red-50 text-red-900"
                      }`}>
                        <div className="flex flex-col items-center justify-center space-y-1">
                          <span className="text-xl font-extrabold font-mono">{fp}</span>
                          <span className={`text-[9px] font-sans font-medium uppercase tracking-wider ${theme === "dark" ? "text-red-400" : "text-red-700"}`}>FP</span>
                          <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${theme === "dark" ? "bg-red-900/40 text-red-300" : "bg-red-100 text-red-800"}`}>5.5%</span>
                        </div>
                      </td>

                      {/* True Negative Cell */}
                      <td className={`p-3 border rounded-br-lg transition-all hover:scale-[1.01] cursor-pointer shadow-sm ${
                        theme === "dark" ? "border-slate-700 bg-teal-950/60 text-teal-200" : "border-slate-100 bg-teal-50 text-teal-900"
                      }`}>
                        <div className="flex flex-col items-center justify-center space-y-1">
                          <span className="text-xl font-extrabold font-mono">{tn}</span>
                          <span className={`text-[9px] font-sans font-medium uppercase tracking-wider ${theme === "dark" ? "text-teal-400" : "text-teal-700"}`}>TN</span>
                          <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${theme === "dark" ? "bg-teal-900/40 text-teal-300" : "bg-teal-100 text-teal-800"}`}>40.7%</span>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Predict X-axis Label */}
              <div className="text-center text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest mt-1">
                PREDICTED
              </div>
            </div>

            {/* Matrix total summary footer */}
            <div className={`flex justify-between items-center border-t pt-2.5 text-[11px] font-mono ${
              theme === "dark" ? "border-slate-700 text-slate-400" : "border-slate-100 text-slate-500"
            }`}>
              <span>Sampel Validasi Uji:</span>
              <span className={`font-bold ${theme === "dark" ? "text-slate-200" : "text-slate-800"}`}>{total} Titik</span>
            </div>
          </div>
        </div>

        {/* Interpretation & Glossary (Col Span 7) */}
        <div className={`lg:col-span-7 border rounded-xl p-4 shadow-sm space-y-4 transition-all duration-300 ${
          theme === "dark" ? "bg-[#1e293b] border-[#334155] text-white" : "bg-white border-slate-200 text-slate-800"
        }`}>
          <div className={`border-b pb-2 ${theme === "dark" ? "border-slate-700" : "border-slate-100"}`}>
            <h3 className={`font-bold font-display text-sm ${theme === "dark" ? "text-white" : "text-slate-900"}`}>Interpretasi Kelas Model</h3>
            <p className="text-[11px] text-slate-400">Tinjauan ringkas hasil klasifikasi model di lapangan.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {/* TP */}
            <div className={`space-y-1 p-2.5 rounded-lg border ${
              theme === "dark" ? "bg-[#0f172a]/40 border-slate-700" : "bg-slate-50/60 border-slate-100"
            }`}>
              <div className="flex items-center gap-1.5 text-emerald-500">
                <span className="w-4 h-4 bg-emerald-600 rounded text-white text-[9px] font-mono font-bold flex items-center justify-center">TP</span>
                <h4 className={`font-bold text-[11px] ${theme === "dark" ? "text-white" : "text-slate-900"}`}>True Positive (TP)</h4>
              </div>
              <p className={`text-[11px] leading-normal ${theme === "dark" ? "text-slate-300" : "text-slate-600"}`}>
                **{tp} titik** vegetasi terklasifikasi benar sesuai kondisi riil.
              </p>
            </div>

            {/* TN */}
            <div className={`space-y-1 p-2.5 rounded-lg border ${
              theme === "dark" ? "bg-[#0f172a]/40 border-slate-700" : "bg-slate-50/60 border-slate-100"
            }`}>
              <div className="flex items-center gap-1.5 text-teal-500">
                <span className="w-4 h-4 bg-teal-600 rounded text-white text-[9px] font-mono font-bold flex items-center justify-center">TN</span>
                <h4 className={`font-bold text-[11px] ${theme === "dark" ? "text-white" : "text-slate-900"}`}>True Negative (TN)</h4>
              </div>
              <p className={`text-[11px] leading-normal ${theme === "dark" ? "text-slate-300" : "text-slate-600"}`}>
                **{tn} titik** non-vegetasi terklasifikasi tepat pada air/pemukiman.
              </p>
            </div>

            {/* FP */}
            <div className={`space-y-1 p-2.5 rounded-lg border ${
              theme === "dark" ? "bg-[#0f172a]/40 border-slate-700" : "bg-slate-50/60 border-slate-100"
            }`}>
              <div className="flex items-center gap-1.5 text-red-400">
                <span className="w-4 h-4 bg-red-500 rounded text-white text-[9px] font-mono font-bold flex items-center justify-center">FP</span>
                <h4 className={`font-bold text-[11px] ${theme === "dark" ? "text-white" : "text-slate-900"}`}>False Positive (FP)</h4>
              </div>
              <p className={`text-[11px] leading-normal ${theme === "dark" ? "text-slate-300" : "text-slate-600"}`}>
                **{fp} titik** non-vegetasi keliru diprediksi sebagai vegetasi akibat semak.
              </p>
            </div>

            {/* FN */}
            <div className={`space-y-1 p-2.5 rounded-lg border ${
              theme === "dark" ? "bg-[#0f172a]/40 border-slate-700" : "bg-slate-50/60 border-slate-100"
            }`}>
              <div className="flex items-center gap-1.5 text-red-400">
                <span className="w-4 h-4 bg-red-500 rounded text-white text-[9px] font-mono font-bold flex items-center justify-center">FN</span>
                <h4 className={`font-bold text-[11px] ${theme === "dark" ? "text-white" : "text-slate-900"}`}>False Negative (FN)</h4>
              </div>
              <p className={`text-[11px] leading-normal ${theme === "dark" ? "text-slate-300" : "text-slate-600"}`}>
                **{fn} titik** vegetasi terlewatkan akibat kanopi yang tipis.
              </p>
            </div>
          </div>

          <div className={`p-3 rounded-lg border text-[11px] space-y-1.5 ${
            theme === "dark" ? "bg-slate-800/80 border-slate-700" : "bg-slate-50 border-slate-100"
          }`}>
            <h4 className={`font-bold flex items-center gap-1 ${theme === "dark" ? "text-white" : "text-slate-800"}`}>
              <ShieldAlert className="w-3.5 h-3.5 text-emerald-500" /> Catatan Akurasi Spasial
            </h4>
            <p className={`leading-relaxed ${theme === "dark" ? "text-slate-300" : "text-slate-600"}`}>
              Akurasi **87.91%** melampaui standar global GIS (85%), membuktikan keandalan tinggi model Random Forest.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
