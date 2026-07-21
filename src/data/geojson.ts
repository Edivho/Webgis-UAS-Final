// Metadata and spatial research constants for Aceh Tamiang WebGIS

export const TIMELINE_DATA = [
  {
    date: "Oktober 2025",
    title: "Anomali Curah Hujan Ekstrem",
    description: "Sistem awan konvektif regional memicu presipitasi di atas rata-rata tahunan (menggunakan data GPM IMERG) di bagian hulu cekungan aliran sungai Tamiang.",
    impact: "Menjenuhkan pori-pori tanah di lereng curam hulu, melemahkan ikatan akar vegetasi alami sebelum banjir bandang terjadi.",
    icon: "CloudRain"
  },
  {
    date: "November 2025",
    title: "Puncak Limpasan & Banjir Bandang",
    description: "Debit air sungai melampaui ambang batas maksimum tampung tebing (overbank flow), menggenangi dataran rendah pemukiman dan perkebunan kelapa sawit aktif hingga ketinggian 1.5 - 2.5 meter.",
    impact: "Memicu kerusakan fisik langsung (uprooting) pada vegetasi bantaran sungai, menyisakan tumpukan sedimen tebal.",
    icon: "Droplet"
  },
  {
    date: "Desember 2025",
    title: "Fase Genangan & Stres Fisiologis",
    description: "Sistem drainase alami tersumbat, mengakibatkan genangan air bercampur lumpur bertahan selama lebih dari 14 hari di wilayah hilir Seruway dan Bendahara.",
    impact: "Menimbulkan anoksia akar, memicu kerontokan klorofil daun pada tanaman semak dan perkebunan sensitif (stres klorofil).",
    icon: "Skull"
  },
  {
    date: "Januari 2026",
    title: "Akuisisi Citra Sentinel-2 & Analisis GEE",
    description: "Data raster multispektral setelah puncak bencana diunduh dan diproses menggunakan Google Earth Engine dengan penyaringan awan ketat (< 10% QA60).",
    impact: "Menyajikan potret rona degradasi vegetasi pasca-banjir (Loss) serta pemetaan daerah kritis yang memerlukan restorasi.",
    icon: "Layers"
  },
  {
    date: "Maret - Juli 2026",
    title: "Pemulihan Vegetasi & Reboisasi",
    description: "Inisiasi program penanaman kembali (reboisasi) sabuk hijau hulu oleh Dinas Lingkungan Hidup, serta suksesi alami herba pionir di lahan bekas tergenang.",
    impact: "Terdeteksi pixel 'Gain' baru pada analisis temporal, memperkuat kapasitas serapan air untuk antisipasi musim hujan berikutnya.",
    icon: "Sprout"
  }
];

export const METHODOLOGY_STEPS = [
  {
    id: "step1",
    title: "Akuisisi Sentinel-2",
    sub: "Satelit Multispektral 10m",
    desc: "Pengunduhan otomatis citra Surface Reflectance Level-2A Sentinel-2 untuk wilayah Kabupaten Aceh Tamiang pra dan pasca kejadian."
  },
  {
    id: "step2",
    title: "Pembersihan Awan",
    sub: "QA60 Cloud Masking",
    desc: "Menyaring piksel awan dan bayangan awan menggunakan band QA60 serta menerapkan reduksi median musiman bebas hambatan cuaca."
  },
  {
    id: "step3",
    title: "Perhitungan NDVI",
    sub: "Normalized Difference Index",
    desc: "Mengalkulasi rasio klorofil tajuk tanaman menggunakan selisih band Near-Infrared (NIR - B8) dan Red (R - B4) secara temporal."
  },
  {
    id: "step4",
    title: "Klasifikasi Random Forest",
    sub: "Supervised Machine Learning",
    desc: "Melatih 150 pohon keputusan menggunakan prediktor spektral dan NDVI bersandar pada 300 titik validasi ground truth lapangan."
  }
];

export const RESEARCH_RESULTS = {
  vegetation2025Ha: 135420.5,
  vegetation2026Ha: 138612.8,
  gainHa: 5240.3,
  lossHa: 2048.0
};
