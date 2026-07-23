import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowRight, 
  Activity, 
  Trees, 
  ShieldCheck, 
  Database, 
  Cpu, 
  Layers, 
  AlertTriangle, 
  CloudRain, 
  Droplet, 
  Skull, 
  Sprout, 
  Compass, 
  Eye, 
  FileSpreadsheet,
  Sun,
  Moon,
  Music,
  Volume2,
  VolumeX,
  X
} from "lucide-react";
import { TIMELINE_DATA, METHODOLOGY_STEPS, RESEARCH_RESULTS } from "../data/geojson";
import { useMusicPlayer } from "../hooks/useMusicPlayer";
const satelliteBg = new URL("../assets/images/aceh_tamiang_satellite_bg_1784643991782.jpg", import.meta.url).href;

interface LandingPageProps {
  onEnterWebGIS: () => void;
  onEnterDashboard?: () => void; // Support both naming styles for high resilience
  theme: "light" | "dark";
  onToggleTheme: () => void;
}

export default function LandingPage({ 
  onEnterWebGIS, 
  onEnterDashboard, 
  theme, 
  onToggleTheme 
}: LandingPageProps) {
  
  const handleEnter = onEnterDashboard || onEnterWebGIS;

  // Sound Player State from global context (persistent across all pages)
  const {
    selectedTrack,
    isPlaying,
    volume,
    isMuted,
    showMusicDropdown,
    showPlayerFloat,
    setSelectedTrack,
    setIsPlaying,
    setVolume,
    setIsMuted,
    setShowMusicDropdown,
    setShowPlayerFloat,
    handleTrackChange
  } = useMusicPlayer();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div id="landing-container" className="min-h-screen font-sans bg-slate-50 text-slate-800 transition-colors duration-300 dark:bg-[#090d16] dark:text-slate-100 selection:bg-emerald-500 selection:text-white">
      
      {/* SIMPLE CAPSULE FLOATING MUSIC BUTTON (LAGU ACEH) */}
      <AnimatePresence>
        {showPlayerFloat && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 flex items-center bg-slate-900/90 dark:bg-slate-950/95 text-white backdrop-blur-md px-4 py-2.5 rounded-full border border-slate-700/50 shadow-xl gap-2 hover:bg-slate-950 dark:hover:bg-black transition-all cursor-pointer select-none"
            onClick={() => {
              setIsPlaying(!isPlaying);
              setIsMuted(false);
            }}
          >
            {isPlaying ? (
              <Volume2 className="w-4 h-4 text-emerald-400 animate-pulse shrink-0" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-400 shrink-0" />
            )}
            <span className="text-xs font-bold font-sans tracking-tight">
              {isPlaying ? "Musik Hidup" : "Musik Mati"}
            </span>
            <div className="h-4 w-[1px] bg-slate-700/50 mx-1"></div>
            <div 
              onClick={(e) => {
                e.stopPropagation();
                setShowPlayerFloat(false);
              }}
              className="p-0.5 hover:bg-slate-800 rounded-full text-slate-500 hover:text-slate-300 transition-colors"
              title="Tutup"
            >
              <X className="w-3 h-3" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER SECTION - logo & theme toggle */}
      <header className={`border-b sticky top-0 z-40 px-6 py-4 backdrop-blur-md transition-colors duration-300 ${
        theme === "dark" 
          ? "border-slate-800/80 bg-slate-950/80" 
          : "border-slate-100 bg-white/80"
      }`}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
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

          <div className="flex items-center gap-3">
            {/* Play music indicator when floating player closed */}
            {!showPlayerFloat && (
              <button 
                onClick={() => setShowPlayerFloat(true)}
                className="p-2 rounded-lg border border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10 flex items-center gap-1.5 text-xs font-semibold cursor-pointer animate-pulse"
                title="Buka Pemutar Lagu Aceh"
              >
                <Music className="w-4 h-4" /> Lagu Aceh
              </button>
            )}

            {/* Theme switcher */}
            <button
              onClick={onToggleTheme}
              className={`px-3 py-2 rounded-lg border transition-all text-xs font-semibold flex items-center gap-1.5 cursor-pointer ${
                theme === "dark" 
                  ? "bg-slate-900 border-slate-800 text-amber-400 hover:bg-slate-800" 
                  : "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
              {theme === "dark" ? "☀ Light Mode" : "🌙 Dark Mode"}
            </button>
            <button
              onClick={handleEnter}
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-sm font-semibold rounded-lg shadow-md transition-all duration-200 group cursor-pointer"
            >
              Masuk ke WebGIS
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </header>
      
      {/* SECTION 1: HERO SECTION */}
      <section 
        id="hero" 
        className="relative h-screen flex items-center justify-center overflow-hidden bg-cover bg-center" 
        style={{ 
          backgroundImage: `linear-gradient(rgba(9, 13, 22, 0.72), rgba(9, 13, 22, 0.88)), url(${satelliteBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-radial-at-c from-transparent via-[#090d16]/40 to-[#090d16]/90 pointer-events-none"></div>
        
        {/* Decorative Grid */}
        <div className="absolute inset-0 opacity-15 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none"></div>

        {/* Professional Metadata Overlays (GIS style) */}
        <div className="absolute top-8 left-8 hidden lg:block text-left font-mono text-[10px] tracking-wider text-emerald-500/60 space-y-1">
          <div>LATITUDE RANGE: 4.050°N - 4.510°N</div>
          <div>LONGITUDE RANGE: 97.800°E - 98.220°E</div>
          <div>SPATIAL RESOLUTION: 10M (SENTINEL-2)</div>
        </div>

        <div className="absolute top-8 right-8 hidden lg:block text-right font-mono text-[10px] tracking-wider text-emerald-500/60 space-y-1">
          <div>CLASSIFIER: RANDOM FOREST (150 TREES)</div>
          <div>ACCURACY: 87.91% (KAPPA: 0.757)</div>
          <div>DATA CYCLE: 2025 - 2026</div>
        </div>

        <div className="relative max-w-5xl mx-auto px-6 text-center z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="space-y-6"
          >
            {/* Tagline */}
            <span id="hero-tag" className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-emerald-500/5 text-emerald-400 border border-emerald-500/30 backdrop-blur-sm">
              <Activity className="h-3.5 w-3.5 animate-pulse text-emerald-400" /> Platform Pemantauan Spasial 
            </span>

            {/* Title */}
            <h1 id="hero-title" className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight">
              Monitoring Dinamika Vegetasi <br />
              <span className="text-emerald-400 block mt-2 text-3xl md:text-5xl lg:text-6xl">
                Aceh Tamiang 2025–2026
              </span>
            </h1>

            {/* Subtitle */}
            <p id="hero-sub" className="max-w-3xl mx-auto text-sm md:text-lg text-slate-300 font-light leading-relaxed">
              WebGIS berbasis NDVI, Ground Truth, dan Random Forest untuk analisis perubahan vegetasi serta pemantauan ekosistem lingkungan hidup di Kabupaten Aceh Tamiang.
            </p>

            {/* Buttons */}
            <div id="hero-actions" className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <button
                onClick={handleEnter}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-slate-950 font-bold bg-emerald-400 hover:bg-emerald-300 shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer group"
              >
                Explore Dashboard 
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button
                onClick={() => scrollToSection('research-overview')}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-slate-200 hover:text-white font-semibold bg-slate-950/40 hover:bg-slate-900/60 active:scale-[0.98] border border-slate-700 hover:border-slate-600 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                Learn More
                <motion.span animate={{ y: [0, 4, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>↓</motion.span>
              </button>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-60 hover:opacity-100 transition-opacity cursor-pointer text-white" onClick={() => scrollToSection('research-overview')}>
          <span className="text-xs tracking-widest uppercase font-mono">GULIR KE BAWAH</span>
          <motion.div 
            animate={{ y: [0, 8, 0] }} 
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-1 h-3 rounded-full bg-emerald-400 mt-1"
          />
        </div>
      </section>

      {/* SECTION 2: RESEARCH OVERVIEW */}
      <section id="research-overview" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 id="overview-title" className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-2">Tinjauan Penelitian</h2>
          <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight">Mengapa Pemantauan Vegetasi Aceh Tamiang Sangat Krusial?</h3>
          <div className="w-16 h-1 bg-emerald-500 mx-auto mt-4 rounded-full"></div>
        </div>

        <div id="overview-cards" className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-slate-900/20 p-8 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm hover:shadow-md hover:border-emerald-500/30 dark:hover:border-emerald-500/30 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 flex items-center justify-center mb-6">
              <Trees className="h-6 w-6" />
            </div>
            <h4 className="text-xl font-bold mb-3 dark:text-white">Latar Belakang Ekologis</h4>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              Aceh Tamiang memiliki topografi unik dari pegunungan hulu Gunung Leuser hingga hilir pesisir Selat Malaka. Keragaman penutupan lahan ini rentan terhadap perubahan konversi pertanian kering, perkebunan kelapa sawit aktif, dan degradasi hutan sekunder.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900/20 p-8 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm hover:shadow-md hover:border-emerald-500/30 dark:hover:border-emerald-500/30 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-teal-500/10 text-teal-500 dark:text-teal-400 flex items-center justify-center mb-6">
              <Activity className="h-6 w-6" />
            </div>
            <h4 className="text-xl font-bold mb-3 dark:text-white">Dinamika Perubahan Spasial</h4>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              Pemantauan vegetasi temporal memungkinkan deteksi dini deforestasi, ekspansi perkebunan komersial, serta konversi lahan basah secara kuantitatif. Indeks vegetasi NDVI menyajikan data numerik kesehatan klorofil tanaman yang objektif.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900/20 p-8 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm hover:shadow-md hover:border-emerald-500/30 dark:hover:border-emerald-500/30 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 dark:text-amber-400 flex items-center justify-center mb-6">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <h4 className="text-xl font-bold mb-3 dark:text-white">Ketahanan Bencana Regional</h4>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              Kerusakan vegetasi di hulu merusak kapasitas retensi air tanah, yang berkontribusi memperparah luapan banjir hilir. Menghubungkan spasial bencana banjir dengan perubahan tutupan vegetasi membantu perencanaan mitigasi regional.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 3: MAJOR FLOOD EVENT STORY */}
      <section id="flood-story" className="py-24 bg-slate-100/60 dark:bg-slate-950/40 border-y border-slate-200/50 dark:border-slate-900/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-500 border border-rose-500/20">
              <AlertTriangle className="h-3 w-3" /> Studi Kasus Bencana Utama
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mt-3 dark:text-white">Banjir Besar Aceh Tamiang Akhir Tahun 2025</h2>
            <p className="text-slate-600 dark:text-slate-400 mt-4 text-sm md:text-base">
              Menjelang akhir tahun 2025, Kabupaten Aceh Tamiang menghadapi salah satu peristiwa bencana hidrometeorologi terparah dalam satu dekade terakhir. Pahami kronologi spasial dan signifikansi ekologis pasca-kejadian di bawah ini.
            </p>
          </div>

          {/* Timeline */}
          <div className="relative max-w-4xl mx-auto pl-6 border-l-2 border-emerald-500/30 dark:border-emerald-500/10 space-y-12">
            {TIMELINE_DATA.map((event, index) => (
              <div key={index} className="relative group">
                {/* Bullet */}
                <div className="absolute -left-[35px] top-1.5 w-6 h-6 rounded-full border-4 border-slate-100 dark:border-[#090d16] bg-emerald-500 flex items-center justify-center shadow-sm">
                  {event.icon === 'CloudRain' && <CloudRain className="h-2.5 w-2.5 text-white" />}
                  {event.icon === 'Droplet' && <Droplet className="h-2.5 w-2.5 text-white" />}
                  {event.icon === 'Skull' && <Skull className="h-2.5 w-2.5 text-white" />}
                  {event.icon === 'Layers' && <Layers className="h-2.5 w-2.5 text-white" />}
                  {event.icon === 'Sprout' && <Sprout className="h-2.5 w-2.5 text-white" />}
                </div>

                <div className="bg-white dark:bg-slate-900/40 p-6 rounded-2xl shadow-sm border border-slate-200/50 dark:border-slate-800/50 hover:border-emerald-500/30 dark:hover:border-emerald-500/30 transition-all duration-300">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono tracking-wider">{event.date}</span>
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">{event.title}</h4>
                  </div>
                  
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">
                    {event.description}
                  </p>

                  <div className="pl-4 border-l-2 border-rose-500/30 py-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-950/30 pr-3 rounded-r-md">
                    <strong className="text-rose-500 dark:text-rose-400 font-semibold">Relevansi Vegetasi:</strong> {event.impact}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Scientific Cautious Statement */}
          <div className="max-w-3xl mx-auto mt-12 p-6 rounded-xl border border-amber-500/20 bg-amber-500/5 text-amber-800 dark:text-amber-300 text-xs leading-relaxed flex gap-3">
            <span className="text-lg">💡</span>
            <div>
              <strong>Catatan Saintifik & Transparansi:</strong> Hubungan kausal antara banjir akhir tahun 2025 dan dinamika perubahan vegetasi dalam analisis ini dirumuskan berdasarkan korelasi spasial temporal. Degradasi di hilir <em>mungkin mengindikasikan</em> stres fisik tanaman akibat genangan sedimen berkepanjangan, sedangkan penambahan vegetasi <em>potensial diasosiasikan dengan</em> fase penanaman kembali oleh warga lokal. Pembuktian kausalitas mekanistik absolut <em>memerlukan investigasi lapangan lebih lanjut</em> yang melibatkan data parameter hidrologi dan fisiologi tumbuhan mikro.
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: RESEARCH OBJECTIVES */}
      <section id="objectives" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-2">Tujuan & Sasaran</h2>
          <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight dark:text-white">Sasaran Strategis Sistem Pemantauan</h3>
          <div className="w-16 h-1 bg-emerald-500 mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {[
            { title: 'Vegetation Monitoring', desc: 'Pemantauan temporal kerapatan klorofil tajuk pohon di Kabupaten Aceh Tamiang pra dan pasca banjir.', icon: Trees },
            { title: 'Change Detection', desc: 'Deteksi transisi spasial klasifikasi pixel tutupan lahan (Gain vs Loss) secara otomatis.', icon: Layers },
            { title: 'Random Forest', desc: 'Klasifikasi citra terarah multi-spektral bersumber Sentinel-2 dengan tingkat akurasi tinggi.', icon: Cpu },
            { title: 'Environmental Insight', desc: 'Penyajian wawasan keterkaitan zonasi bencana hidrologi dan respons degradasi vegetasi hilir.', icon: Compass },
            { title: 'Decision Support', desc: 'Pendukung keputusan perencanaan spasial daerah rawan dan evaluasi reklamasi penanaman lahan.', icon: ShieldCheck }
          ].map((item, i) => (
            <div key={i} className="bg-white dark:bg-slate-900/20 p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm flex flex-col justify-between hover:border-emerald-500/20 dark:hover:border-emerald-500/20 transition-all duration-300">
              <div>
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 flex items-center justify-center mb-5">
                  <item.icon className="h-5 w-5" />
                </div>
                <h4 className="text-base font-bold mb-2 text-slate-900 dark:text-white">{item.title}</h4>
                <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">{item.desc}</p>
              </div>
              <span className="text-[10px] font-mono text-slate-400 dark:text-slate-600 uppercase tracking-widest mt-6">Sasaran 0{i+1}</span>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 5: METHODOLOGY OVERVIEW */}
      <section id="methodology" className="py-24 bg-slate-900 text-slate-100 overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.08),transparent_50%)]"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-2">Metodologi Pemrosesan Spasial</h2>
            <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">Alur Aliansi Algoritma GEE & Machine Learning</h3>
            <div className="w-16 h-1 bg-emerald-500 mx-auto mt-4 rounded-full"></div>
          </div>

          {/* Methodology Interactive Line */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {METHODOLOGY_STEPS.map((step, idx) => (
              <div key={step.id} className="bg-slate-800/40 p-6 rounded-xl border border-slate-800/80 hover:border-emerald-500/30 transition-all group">
                <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-widest bg-emerald-500/10 px-2 py-1 rounded">
                  LANGKAH {idx + 1}
                </span>
                <h4 className="text-lg font-bold text-white mt-4 mb-1 group-hover:text-emerald-400 transition-colors">{step.title}</h4>
                <p className="text-xs text-slate-400 font-medium mb-3">{step.sub}</p>
                <p className="text-slate-400 text-xs leading-relaxed font-light">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6: QUICK STATISTICS PREVIEW */}
      <section id="statistics-preview" className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-2">Pratinjau Statistik Utama</h2>
          <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight dark:text-white">Kondisi Hasil Analisis Dinamika</h3>
          <div className="w-16 h-1 bg-emerald-500 mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { value: RESEARCH_RESULTS.vegetation2025Ha.toLocaleString('id-ID', { maximumFractionDigits: 2 }), label: 'Vegetasi Total 2025 (Pre-Banjir)', sub: 'Luas tutupan vegetasi hasil klasifikasi', change: 'Akurasi 87,91%', unit: 'Hektar', isPositive: true },
            { value: RESEARCH_RESULTS.vegetation2026Ha.toLocaleString('id-ID', { maximumFractionDigits: 2 }), label: 'Vegetasi Total 2026 (Pasca)', sub: 'Luas tutupan vegetasi hasil klasifikasi', change: '+2,35% Perubahan Bersih', unit: 'Hektar', isPositive: true },
            { value: RESEARCH_RESULTS.gainHa.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), label: 'Gain Vegetasi', sub: 'Revegetasi alamiah & replanting', change: 'Penambahan terdeteksi', unit: 'Hektar', isPositive: true },
            { value: RESEARCH_RESULTS.lossHa.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), label: 'Loss Vegetasi', sub: 'Dinamika kehilangan tutupan', change: 'Pengurangan terdeteksi', unit: 'Hektar', isPositive: false }
          ].map((stat, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-900/20 p-8 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm text-center hover:border-emerald-500/20 dark:hover:border-emerald-500/20 transition-all duration-300">
              <span className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wider font-medium">{stat.label}</span>
              <div className="my-4 flex items-baseline justify-center gap-1.5">
                <span className="text-3xl md:text-4xl font-extrabold tracking-tight dark:text-white">{stat.value}</span>
                <span className="text-xs text-slate-400 dark:text-slate-500">{stat.unit}</span>
              </div>
              <p className="text-slate-400 dark:text-slate-400 text-xs mb-3 font-light leading-relaxed">{stat.sub}</p>
              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-bold ${stat.isPositive ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'}`}>
                {stat.isPositive ? '↑' : '↓'} {stat.change}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 7: CALL TO ACTION */}
      <section id="cta" className="py-24 bg-gradient-to-br from-slate-950 to-[#0c1827] text-white relative border-t border-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.12),transparent_50%)] pointer-events-none"></div>
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10 space-y-8">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3.5 py-1.5 rounded-full">
            Eksplorasi Spasial Temporal Aktif
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
            Masuk ke Konsol Analisis WebGIS Aceh Tamiang
          </h2>
          <p className="max-w-2xl mx-auto text-slate-300 text-sm md:text-base font-light leading-relaxed">
            Akses interaktif penuh untuk peta hasil klasifikasi, deteksi gain-loss pixel, konfigurasi machine learning, evaluasi matriks model, serta wawasan kesimpulan bencana.
          </p>
          <div>
            <button
              onClick={handleEnter}
              className="px-10 py-5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl shadow-xl shadow-emerald-950/40 hover:shadow-emerald-400/20 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3 mx-auto cursor-pointer text-base"
            >
              Buka Interactive WebGIS Dashboard
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
          <div className="flex justify-center gap-8 pt-6 border-t border-slate-800/80 text-slate-400 text-xs">
            <span className="flex items-center gap-1.5"><Eye className="h-4 w-4 text-emerald-500" /> Visualisasi Sentinel-2</span>
            <span className="flex items-center gap-1.5"><Cpu className="h-4 w-4 text-emerald-500" /> GEE Machine Learning</span>
            <span className="flex items-center gap-1.5"><FileSpreadsheet className="h-4 w-4 text-emerald-500" /> Tabel Data Mutu</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-slate-100 dark:bg-[#070b12] border-t border-slate-200 dark:border-slate-900 text-slate-500 text-center text-xs">
        <p>© 2026 Universitas Riset Spasial & Lingkungan Aceh. Semua Hak Dilindungi Undang-Undang.</p>
        <p className="mt-1 text-slate-400 dark:text-slate-600">Dipersembahkan untuk Kajian Pemantauan Kerusakan Ekologis Pascabencana Hidrologi.</p>
      </footer>

    </div>
  );
}
