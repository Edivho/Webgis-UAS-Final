import React from "react";
import { Award, Target, CheckCircle2, Sparkles, ShieldCheck } from "lucide-react";

interface EvaluasiPerformaProps {
  theme?: "light" | "dark";
}

export default function EvaluasiPerforma({ theme = "dark" }: EvaluasiPerformaProps) {
  // Data Hasil Evaluasi Performa Terbaru (N = 91)
  const accuracy = "85.71%";
  const precision = "82.22%";
  const recall = "88.10%";
  const f1Score = "85.06%";
  const kappaScore = "0.7140";

  // Confusion Matrix Counts
  const tp = 37; // Actual Veg -> Pred Veg
  const fn = 5;  // Actual Veg -> Pred Non-Veg
  const fp = 8;  // Actual Non-Veg -> Pred Veg
  const tn = 41; // Actual Non-Veg -> Pred Non-Veg
  const totalN = tp + fn + fp + tn; // 91

  // Percentages against total sample
  const tpPct = ((tp / totalN) * 100).toFixed(1); // 40.7%
  const fnPct = ((fn / totalN) * 100).toFixed(1); // 5.5%
  const fpPct = ((fp / totalN) * 100).toFixed(1); // 8.8%
  const tnPct = ((tn / totalN) * 100).toFixed(1); // 45.1%

  return (
    <div className="space-y-6">
      {/* 1. TOP METRICS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Overall Accuracy */}
        <div className={`border rounded-2xl p-5 relative overflow-hidden transition-all duration-300 ${
          theme === "dark" ? "bg-[#121a2d] border-slate-800/80 text-white" : "bg-white border-slate-200 text-slate-800"
        }`}>
          <div className="flex justify-between items-start mb-3">
            <span className="text-[11px] font-mono font-bold tracking-wider text-slate-400 uppercase">
              OVERALL ACCURACY
            </span>
            <div className="p-2 rounded-xl bg-emerald-950/50 text-emerald-400 border border-emerald-500/20">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <h3 className="text-3xl font-extrabold font-display tracking-tight text-white">{accuracy}</h3>
            <span className="text-xs text-slate-400 font-mono">(0.8571)</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">Ketepatan prediksi total terhadap uji lapangan.</p>
          <div className="w-full h-1 bg-slate-800 rounded-full mt-4 overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: accuracy }} />
          </div>
        </div>

        {/* Precision */}
        <div className={`border rounded-2xl p-5 relative overflow-hidden transition-all duration-300 ${
          theme === "dark" ? "bg-[#121a2d] border-slate-800/80 text-white" : "bg-white border-slate-200 text-slate-800"
        }`}>
          <div className="flex justify-between items-start mb-3">
            <span className="text-[11px] font-mono font-bold tracking-wider text-slate-400 uppercase">
              PRECISION (VEGETASI)
            </span>
            <div className="p-2 rounded-xl bg-cyan-950/50 text-cyan-400 border border-cyan-500/20">
              <Target className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <h3 className="text-3xl font-extrabold font-display tracking-tight text-white">{precision}</h3>
            <span className="text-xs text-slate-400 font-mono">(0.8222)</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">Keandalan prediksi kelas vegetasi tepat.</p>
          <div className="w-full h-1 bg-slate-800 rounded-full mt-4 overflow-hidden">
            <div className="h-full bg-cyan-500 rounded-full" style={{ width: precision }} />
          </div>
        </div>

        {/* Recall */}
        <div className={`border rounded-2xl p-5 relative overflow-hidden transition-all duration-300 ${
          theme === "dark" ? "bg-[#121a2d] border-slate-800/80 text-white" : "bg-white border-slate-200 text-slate-800"
        }`}>
          <div className="flex justify-between items-start mb-3">
            <span className="text-[11px] font-mono font-bold tracking-wider text-slate-400 uppercase">
              RECALL (VEGETASI)
            </span>
            <div className="p-2 rounded-xl bg-indigo-950/50 text-indigo-400 border border-indigo-500/20">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <h3 className="text-3xl font-extrabold font-display tracking-tight text-white">{recall}</h3>
            <span className="text-xs text-slate-400 font-mono">(0.8810)</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">Kemampuan mendeteksi vegetasi aktual lapangan.</p>
          <div className="w-full h-1 bg-slate-800 rounded-full mt-4 overflow-hidden">
            <div className="h-full bg-indigo-500 rounded-full" style={{ width: recall }} />
          </div>
        </div>

        {/* F1 Score */}
        <div className={`border rounded-2xl p-5 relative overflow-hidden transition-all duration-300 ${
          theme === "dark" ? "bg-[#121a2d] border-slate-800/80 text-white" : "bg-white border-slate-200 text-slate-800"
        }`}>
          <div className="flex justify-between items-start mb-3">
            <span className="text-[11px] font-mono font-bold tracking-wider text-slate-400 uppercase">
              F1 SCORE (VEGETASI)
            </span>
            <div className="p-2 rounded-xl bg-fuchsia-950/50 text-fuchsia-400 border border-fuchsia-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <h3 className="text-3xl font-extrabold font-display tracking-tight text-white">{f1Score}</h3>
            <span className="text-xs text-slate-400 font-mono">(0.8506)</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">Rata-rata penyeimbang nilai presisi dan recall.</p>
          <div className="w-full h-1 bg-slate-800 rounded-full mt-4 overflow-hidden">
            <div className="h-full bg-fuchsia-500 rounded-full" style={{ width: f1Score }} />
          </div>
        </div>
      </div>

      {/* 2. HEATMAP CONFUSION MATRIX & INTERPRETASI */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Confusion Matrix Heatmap (Span 5) */}
        <div className={`lg:col-span-5 border rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 ${
          theme === "dark" ? "bg-[#121a2d] border-slate-800/80 text-white" : "bg-white border-slate-200 text-slate-800"
        }`}>
          <div>
            <h3 className="font-bold text-base text-white mb-1">Confusion Matrix Heatmap</h3>
            <p className="text-xs text-slate-400 mb-6">
              Matriks sebaran aktual vs prediksi model (N = {totalN} titik uji).
            </p>
          </div>

          <div className="space-y-2">
            {/* Column Headers */}
            <div className="grid grid-cols-12 text-[10px] font-mono text-slate-400 font-bold uppercase text-center mb-1">
              <div className="col-span-4"></div>
              <div className="col-span-4">PRED. VEG</div>
              <div className="col-span-4">PRED. NON-VEG</div>
            </div>

            {/* Row 1: Actual Vegetasi */}
            <div className="grid grid-cols-12 gap-2 items-center">
              <div className="col-span-4 text-xs font-semibold text-slate-300 text-right pr-2">
                Vegetasi
              </div>
              {/* TP Box */}
              <div className="col-span-4 bg-emerald-950/60 border border-emerald-500/40 rounded-xl p-4 text-center">
                <span className="block text-2xl font-black text-emerald-400">{tp}</span>
                <span className="block text-[10px] font-mono text-emerald-300/80 font-semibold mt-0.5">TP</span>
                <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-900/60 text-emerald-300">
                  {tpPct}%
                </span>
              </div>
              {/* FN Box */}
              <div className="col-span-4 bg-red-950/30 border border-red-500/20 rounded-xl p-4 text-center">
                <span className="block text-2xl font-black text-red-400">{fn}</span>
                <span className="block text-[10px] font-mono text-red-300/80 font-semibold mt-0.5">FN</span>
                <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-900/40 text-red-300">
                  {fnPct}%
                </span>
              </div>
            </div>

            {/* Row 2: Actual Non-Vegetasi */}
            <div className="grid grid-cols-12 gap-2 items-center">
              <div className="col-span-4 text-xs font-semibold text-slate-300 text-right pr-2">
                Non-Veg
              </div>
              {/* FP Box */}
              <div className="col-span-4 bg-red-950/30 border border-red-500/20 rounded-xl p-4 text-center">
                <span className="block text-2xl font-black text-red-400">{fp}</span>
                <span className="block text-[10px] font-mono text-red-300/80 font-semibold mt-0.5">FP</span>
                <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-900/40 text-red-300">
                  {fpPct}%
                </span>
              </div>
              {/* TN Box */}
              <div className="col-span-4 bg-teal-950/60 border border-teal-500/40 rounded-xl p-4 text-center">
                <span className="block text-2xl font-black text-teal-400">{tn}</span>
                <span className="block text-[10px] font-mono text-teal-300/80 font-semibold mt-0.5">TN</span>
                <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-teal-900/60 text-teal-300">
                  {tnPct}%
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] font-mono text-slate-400 text-center uppercase tracking-wider">
            ACTUAL \ PREDICTED
          </div>
        </div>

        {/* Right Column: Interpretasi Kelas Model (Span 7) */}
        <div className={`lg:col-span-7 border rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 ${
          theme === "dark" ? "bg-[#121a2d] border-slate-800/80 text-white" : "bg-white border-slate-200 text-slate-800"
        }`}>
          <div>
            <h3 className="font-bold text-base text-white mb-1">Interpretasi Kelas Model</h3>
            <p className="text-xs text-slate-400 mb-6">
              Tinjauan ringkas hasil klasifikasi model di lapangan.
            </p>

            {/* 2x2 Interpretation Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* TP Card */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                    TP
                  </span>
                  <span className="text-xs font-bold text-white">True Positive ({tp})</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  <strong className="text-slate-200">{tp} titik</strong> vegetasi terklasifikasi benar sesuai kondisi riil.
                </p>
              </div>

              {/* TN Card */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-teal-950 text-teal-400 border border-teal-500/30">
                    TN
                  </span>
                  <span className="text-xs font-bold text-white">True Negative ({tn})</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  <strong className="text-slate-200">{tn} titik</strong> non-vegetasi terklasifikasi tepat pada air/pemukiman/lahan terbuka.
                </p>
              </div>

              {/* FP Card */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-red-950 text-red-400 border border-red-500/30">
                    FP
                  </span>
                  <span className="text-xs font-bold text-white">False Positive ({fp})</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  <strong className="text-slate-200">{fp} titik</strong> non-vegetasi keliru diprediksi sebagai vegetasi akibat semak/bayangan.
                </p>
              </div>

              {/* FN Card */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-red-950 text-red-400 border border-red-500/30">
                    FN
                  </span>
                  <span className="text-xs font-bold text-white">False Negative ({fn})</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  <strong className="text-slate-200">{fn} titik</strong> vegetasi terlewatkan akibat kanopi yang tipis.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Alert / Note Box */}
          <div className="mt-6 p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-bold text-emerald-400 block mb-0.5">Catatan Akurasi Spasial</span>
              <p className="text-slate-300 leading-relaxed">
                Akurasi <strong className="text-white">{accuracy}</strong> (Cohens Kappa: <strong className="text-white">{kappaScore}</strong>) melampaui standar global GIS (&gt;85%), membuktikan keandalan tinggi klasifikasi model Random Forest.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}