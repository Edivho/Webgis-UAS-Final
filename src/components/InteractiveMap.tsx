import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import { getFeatureArea, getFeaturePixelCount } from "../utils/geoUtils";
import { 
  Layers, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Minimize2, 
  RotateCcw,
  Info,
  Map as MapIcon,
  Globe,
  AlertTriangle,
  Flame,
  Search,
  X,
  MapPin
} from "lucide-react";

interface InteractiveMapProps {
  veg2025: any;
  veg2026: any;
  gainData: any;
  lossData: any;
  boundaryData?: any;
  theme?: "light" | "dark";
}

export default function InteractiveMap({
  veg2025,
  veg2026,
  gainData,
  lossData,
  boundaryData,
  theme = "light"
}: InteractiveMapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const geojsonLayersRef = useRef<{ [key: string]: L.GeoJSON | null }>({});

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const searchMarkerRef = useRef<L.Marker | null>(null);

  const PREDEFINED_LOCATIONS = [
    { name: "Karang Baru", type: "subdistrict", description: "Pusat Pemerintahan / Ibu kota Kabupaten", lat: 4.3681, lon: 98.0514 },
    { name: "Kuala Simpang", type: "subdistrict", description: "Pusat Kota / Bisnis bersejarah", lat: 4.2882, lon: 98.1512 },
    { name: "Seruway", type: "subdistrict", description: "Kawasan Pesisir & Konservasi Hutan Mangrove", lat: 4.4674, lon: 98.1365 },
    { name: "Tamiang Hulu", type: "subdistrict", description: "Kawasan Hulu Sungai, Restorasi Hutan", lat: 4.1873, lon: 97.9015 },
    { name: "Tenggulun", type: "subdistrict", description: "Kawasan Hutan Lindung Gunung Leuser", lat: 4.1202, lon: 98.0211 },
    { name: "Kejuruan Muda", type: "subdistrict", description: "Kawasan Perkebunan Sawit & Karet", lat: 4.2541, lon: 98.0825 },
    { name: "Bendahara", type: "subdistrict", description: "Daerah Aliran Sungai Hilir, Rawan Banjir", lat: 4.4253, lon: 98.2241 },
    { name: "Banda Mulia", type: "subdistrict", description: "Daerah Tambak & Pesisir Pantai", lat: 4.4512, lon: 98.2613 },
    { name: "Manyak Payed", type: "subdistrict", description: "Perbatasan Provinsi Aceh - Sumatera Utara", lat: 4.4532, lon: 98.0125 },
    { name: "Rantau", type: "subdistrict", description: "Sektor Minyak & Gas Bumi Aktif", lat: 4.3125, lon: 98.1141 },
    { name: "Sekerak", type: "subdistrict", description: "Kawasan Perbukitan Karst & Sungai Jeram", lat: 4.3982, lon: 97.9822 },
    { name: "Bandar Pusaka", type: "subdistrict", description: "Kawasan Pertanian Lereng & Hutan Produksi", lat: 4.2751, lon: 97.8712 },
    
    // Key landmarks
    { name: "Kantor Bupati Aceh Tamiang", type: "landmark", description: "Kompleks Perkantoran Pemerintah Kabupaten", lat: 4.3678, lon: 98.0478 },
    { name: "Daerah Aliran Sungai (DAS) Tamiang", type: "landmark", description: "Aliran Utama Sungai Pemicu Limpasan Banjir", lat: 4.3512, lon: 98.1214 },
    { name: "Istana Karang (Situs Kerajaan)", type: "landmark", description: "Situs Sejarah Cagar Budaya Kesultanan Tamiang", lat: 4.2982, lon: 98.1394 },
    { name: "Kuala Penaga", type: "landmark", description: "Kawasan Muara Pertemuan Sungai dan Laut", lat: 4.5021, lon: 98.1815 }
  ];

  // Search autocomplete logic
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const matched = PREDEFINED_LOCATIONS.filter(loc => 
      loc.name.toLowerCase().includes(query) || 
      loc.description.toLowerCase().includes(query)
    );

    setSearchResults(matched);
  }, [searchQuery]);

  const handleSearchAddress = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;
    
    // Exact local match checking
    const exactLocal = PREDEFINED_LOCATIONS.find(loc => loc.name.toLowerCase() === searchQuery.toLowerCase().trim());
    if (exactLocal) {
      handleZoomToLocation(exactLocal.lat, exactLocal.lon, exactLocal.name);
      return;
    }

    setIsGeocoding(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery + ", Aceh Tamiang, Aceh, Indonesia")}&limit=5`
      );
      if (response.ok) {
        const data = await response.json();
        const formatted = data.map((item: any) => ({
          name: item.display_name.split(",")[0],
          type: "nominatim",
          description: item.display_name.split(",").slice(1, 3).join(",").trim(),
          lat: parseFloat(item.lat),
          lon: parseFloat(item.lon)
        }));
        
        if (formatted.length > 0) {
          setSearchResults(formatted);
          setShowSearchDropdown(true);
        } else {
          // Fallback wide search
          const wideResp = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery + ", Indonesia")}&limit=3`
          );
          if (wideResp.ok) {
            const wideData = await wideResp.json();
            const wideFormatted = wideData.map((item: any) => ({
              name: item.display_name.split(",")[0],
              type: "nominatim",
              description: item.display_name.split(",").slice(1, 3).join(",").trim(),
              lat: parseFloat(item.lat),
              lon: parseFloat(item.lon)
            }));
            if (wideFormatted.length > 0) {
              setSearchResults(wideFormatted);
              setShowSearchDropdown(true);
            }
          }
        }
      }
    } catch (err) {
      console.error("Geocoding failed:", err);
    } finally {
      setIsGeocoding(false);
    }
  };

  const handleZoomToLocation = (lat: number, lon: number, name: string) => {
    const map = mapRef.current;
    if (!map) return;

    if (searchMarkerRef.current) {
      searchMarkerRef.current.remove();
    }

    const pinIcon = L.divIcon({
      className: 'custom-search-pin',
      html: `
        <div class="relative flex items-center justify-center">
          <div class="absolute w-8 h-8 rounded-full bg-emerald-500/30 animate-ping"></div>
          <div class="w-6 h-6 rounded-full bg-emerald-500 border-2 border-white shadow-lg flex items-center justify-center">
            <span class="text-[10px]">📍</span>
          </div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    const marker = L.marker([lat, lon], { icon: pinIcon })
      .addTo(map)
      .bindPopup(`
        <div class="p-1 font-sans">
          <h4 class="font-bold text-slate-900 text-xs flex items-center gap-1 leading-tight">📍 ${name}</h4>
          <p class="text-[9px] text-slate-500 mt-0.5 font-mono leading-none">${lat.toFixed(4)}° N, ${lon.toFixed(4)}° E</p>
        </div>
      `, { closeButton: false })
      .openPopup();
      
    searchMarkerRef.current = marker;
    
    map.flyTo([lat, lon], 14, {
      duration: 1.5,
      easeLinearity: 0.25
    });

    setSearchQuery(name);
    setShowSearchDropdown(false);
  };

  // Click outside to close search dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("#search-wrapper")) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Active layers state
  const [activeLayers, setActiveLayers] = useState({
    boundary: true,
    veg2025: false,
    veg2026: false,
    gain: false,
    loss: false,
    floodPriority: true, // Default to true so users see the flood priority right away!
  });

  const [basemap, setBasemap] = useState<"streets" | "satellite" | "dark" | "terrain">("dark");
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedFeatureInfo, setSelectedFeatureInfo] = useState<any>(null);

  // Layer style configurations
  const layerStyles = {
    boundary: {
      color: "#000000",
      weight: 3.0,
      fillOpacity: 0.0,
      fillColor: "transparent",
    },
    veg2025: {
      color: "#84cc16", // Lime Green (contrasting yellowish-green)
      weight: 1,
      fillColor: "#bef264", // Lighter Lime
      fillOpacity: 0.65,
    },
    veg2026: {
      color: "#059669", // Dark Emerald Green (contrasting deep forest)
      weight: 1,
      fillColor: "#047857", // Deep Rich Green
      fillOpacity: 0.75,
    },
    gain: {
      color: "#2563eb", // blue dark
      weight: 1.5,
      fillColor: "#60a5fa", // blue light
      fillOpacity: 0.75,
    },
    loss: {
      color: "#dc2626", // red dark
      weight: 1.5,
      fillColor: "#f87171", // red light
      fillOpacity: 0.75,
    },
    floodPriority: {
      color: "#ea580c", // dark warning orange
      weight: 2,
      fillColor: "#fb923c", // bright disaster warning orange
      fillOpacity: 0.75,
      dashArray: "3, 5",
    },
  };

  // Dynamic style for flood priority features based on restoration priority levels
  const getFloodPriorityStyle = (feature: any) => {
    const level = feature?.properties?.level || "tinggi";
    if (level === "sangat_tinggi") {
      return {
        color: "#b91c1c", // Dark red
        weight: 2,
        fillColor: "#ef4444", // Vibrant red
        fillOpacity: 0.75,
        dashArray: "3, 3",
      };
    } else if (level === "tinggi") {
      return {
        color: "#c2410c", // Dark orange
        weight: 1.8,
        fillColor: "#f97316", // Orange
        fillOpacity: 0.7,
        dashArray: "4, 4",
      };
    } else {
      return {
        color: "#d97706", // Amber dark
        weight: 1.5,
        fillColor: "#f59e0b", // Amber
        fillOpacity: 0.65,
        dashArray: "5, 5",
      };
    }
  };

  // Center of Aceh Tamiang
  const mapCenter: L.LatLngExpression = [4.38, 98.05];
  const defaultZoom = 11;

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Create leaflet map
    const map = L.map(mapContainerRef.current, {
      center: mapCenter,
      zoom: defaultZoom,
      zoomControl: false, // Disable default zoom control to render our beautiful custom buttons
      attributionControl: false, // Custom elegant attribution
    });

    mapRef.current = map;

    // Add CartoDB Dark Matter tile layer by default
    const baseTile = L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      maxZoom: 19,
    }).addTo(map);
    tileLayerRef.current = baseTile;

    // Custom Elegant Scale Bar
    L.control.scale({
      metric: true,
      imperial: false,
      position: "bottomleft",
    }).addTo(map);

    // Initial layer rendering
    renderGeoJSONLayers();

    // Cleanup on unmount
    return () => {
      if (searchMarkerRef.current) {
        searchMarkerRef.current.remove();
        searchMarkerRef.current = null;
      }
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Sync basemap selection
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !tileLayerRef.current) return;

    let url = "";
    if (basemap === "streets") {
      url = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
    } else if (basemap === "satellite") {
      url = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
    } else if (basemap === "dark") {
      url = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
    } else if (basemap === "terrain") {
      url = "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png";
    }

    tileLayerRef.current.setUrl(url);
  }, [basemap]);

  // Sync active layers and layer styles when theme changes
  useEffect(() => {
    if (!mapRef.current) return;

    // Update styles for each layer dynamically when theme changes
    Object.keys(geojsonLayersRef.current).forEach((layerKey) => {
      const layer = geojsonLayersRef.current[layerKey];
      if (layer) {
        if (layerKey === "floodPriority") {
          layer.setStyle(getFloodPriorityStyle as any);
        } else {
          layer.setStyle(layerStyles[layerKey as keyof typeof layerStyles]);
        }
      }
    });
  }, [theme]);

  // Sync active layers
  useEffect(() => {
    if (!mapRef.current) return;
    
    // Toggle each layer based on the state
    Object.keys(activeLayers).forEach((layerKey) => {
      const isVisible = activeLayers[layerKey as keyof typeof activeLayers];
      const layer = geojsonLayersRef.current[layerKey];
      
      if (layer) {
        if (isVisible) {
          if (!mapRef.current!.hasLayer(layer)) {
            layer.addTo(mapRef.current!);
          }
        } else {
          if (mapRef.current!.hasLayer(layer)) {
            layer.remove();
          }
        }
      }
    });
  }, [activeLayers]);

  // Render GeoJSON Layers to reference ref
  const renderGeoJSONLayers = () => {
    const map = mapRef.current;
    if (!map) return;

    // Create flood priority GeoJSON from lossData
    const floodPriorityGeoJSON = lossData ? {
      ...lossData,
      features: lossData.features.map((f: any) => {
        const area = getFeatureArea(f);
        let label = "Prioritas Tinggi: Daerah Penahan Aliran Sungai (DAS)";
        let desc = "Rehabilitasi vegetasi bantaran sungai untuk memperkuat struktur tanah dan mengurangi laju debit limpasan banjir.";
        let level = "tinggi"; // default priority
        
        const coords = f.geometry?.coordinates?.[0]?.[0] || [0, 0];
        const lat = coords[1] || 4.38;
        
        if (lat > 4.45) {
          label = "Prioritas Utama: Restorasi Ekosistem Mangrove";
          desc = "Rehabilitasi ekosistem hutan bakau pesisir Seruway untuk mitigasi erosi pantai, dan intrusi air laut pasca-banjir.";
          level = "sangat_tinggi";
        } else if (area > 150000) {
          label = "Prioritas Utama: Lereng Tangkapan Air Hulu";
          desc = "Rehabilitasi lereng kritis guna mencegah longsoran tanah susulan dan menyerap air hujan secara vertikal.";
          level = "sangat_tinggi";
        } else if (area < 50000) {
          label = "Prioritas Sedang: Penyangga Pemukiman & Lahan Terbuka";
          desc = "Pembuatan zona sabuk hijau penyangga pemukiman padat dan lahan terbuka guna memperlambat genangan air.";
          level = "sedang";
        }
        
        return {
          ...f,
          properties: {
            ...f.properties,
            category: label,
            description: desc,
            class: "prioritas_banjir",
            level: level,
            year: "Pasca-Banjir 2025"
          }
        };
      })
    } : null;

    // Clear previous layers if any
    Object.keys(geojsonLayersRef.current).forEach((key) => {
      const layer = geojsonLayersRef.current[key];
      if (layer && map.hasLayer(layer)) {
        layer.remove();
      }
    });

    // Helper to generate events and popups
    const createOnEachGeoJSONFeature = (layerKey: string) => {
      return (feature: any, layer: L.Layer) => {
        layer.on({
          mouseover: (e) => {
            const target = e.target;
            target.setStyle({
              weight: layerKey === "boundary" ? 3.5 : 2,
              fillOpacity: layerKey === "boundary" ? 0.05 : 0.85,
            });
            
            const area = getFeatureArea(feature);
            const count = getFeaturePixelCount(feature, area);
            const className = feature.properties?.class || (layerKey === "veg2025" || layerKey === "veg2026" ? "vegetasi" : layerKey);
            const yearVal = feature.properties?.year || (layerKey === "veg2025" ? 2025 : layerKey === "veg2026" ? 2026 : "2025-2026");
            const categoryName = feature.properties?.category || (
              layerKey === "veg2025" ? "Vegetasi (Kondisi 2025)" :
              layerKey === "veg2026" ? "Vegetasi (Kondisi 2026)" :
              layerKey === "gain" ? "Penambahan Vegetasi (Gain)" : "Pengurangan Vegetasi (Loss)"
            );

            // Show lightweight preview in sidebar
            setSelectedFeatureInfo({
              category: categoryName,
              class: className,
              year: yearVal,
              area_m2: area,
              count: count
            });
          },
          mouseout: (e) => {
            const target = e.target;
            target.setStyle(layerStyles[layerKey as keyof typeof layerStyles]);
          },
          click: (e) => {
            mapRef.current?.panTo(e.latlng);
          }
        });

        const area = getFeatureArea(feature);
        const count = getFeaturePixelCount(feature, area);
        const className = feature.properties?.class || (layerKey === "veg2025" || layerKey === "veg2026" ? "vegetasi" : layerKey);
        const yearVal = feature.properties?.year || (layerKey === "veg2025" ? 2025 : layerKey === "veg2026" ? 2026 : "2025-2026");
        const categoryName = feature.properties?.category || (
          layerKey === "veg2025" ? "Vegetasi (Kondisi 2025)" :
          layerKey === "veg2026" ? "Vegetasi (Kondisi 2026)" :
          layerKey === "gain" ? "Penambahan Vegetasi (Gain)" : "Pengurangan Vegetasi (Loss)"
        );

        // Generate accurate Leaflet popup HTML
        const formattedArea = new Intl.NumberFormat("id-ID").format(area);
        const formattedCount = new Intl.NumberFormat("id-ID").format(count);
        
        const popupContent = `
          <div class="p-3 font-sans max-w-[240px]">
            <div class="text-[9px] font-mono font-bold tracking-wider uppercase text-slate-400 mb-1">PETA HASIL SENTINEL-2</div>
            <div class="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 mb-2">${categoryName}</div>
            <div class="space-y-1.5 text-xs">
              <div class="flex justify-between">
                <span class="text-slate-500">Kelas:</span>
                <span class="font-medium text-slate-800">${String(className).toUpperCase()}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-500">Tahun:</span>
                <span class="font-semibold text-slate-800">${yearVal}</span>
              </div>
              <div class="flex justify-between items-center bg-slate-50 p-1.5 rounded-md mt-1">
                <span class="text-slate-600 font-medium">Luas:</span>
                <span class="font-bold text-emerald-700 font-mono text-right">${formattedArea} m²</span>
              </div>
              <div class="flex justify-between text-[11px] text-slate-500 font-mono">
                <span>Piksel (Count):</span>
                <span>${formattedCount} px</span>
              </div>
            </div>
          </div>
        `;

        layer.bindPopup(popupContent, {
          className: "custom-leaflet-popup",
          maxWidth: 250,
        });
      };
    };

    // 1. Boundary Layer
    if (boundaryData) {
      geojsonLayersRef.current.boundary = L.geoJSON(boundaryData as any, {
        style: layerStyles.boundary,
        onEachFeature: createOnEachGeoJSONFeature("boundary"),
      });
    } else {
      geojsonLayersRef.current.boundary = null;
    }

    // 2. Vegetasi 2025 Layer
    if (veg2025) {
      geojsonLayersRef.current.veg2025 = L.geoJSON(veg2025 as any, {
        style: layerStyles.veg2025,
        onEachFeature: createOnEachGeoJSONFeature("veg2025"),
      });
    } else {
      geojsonLayersRef.current.veg2025 = null;
    }

    // 3. Vegetasi 2026 Layer
    if (veg2026) {
      geojsonLayersRef.current.veg2026 = L.geoJSON(veg2026 as any, {
        style: layerStyles.veg2026,
        onEachFeature: createOnEachGeoJSONFeature("veg2026"),
      });
    } else {
      geojsonLayersRef.current.veg2026 = null;
    }

    // 4. Gain Vegetasi Layer
    if (gainData) {
      geojsonLayersRef.current.gain = L.geoJSON(gainData as any, {
        style: layerStyles.gain,
        onEachFeature: createOnEachGeoJSONFeature("gain"),
      });
    } else {
      geojsonLayersRef.current.gain = null;
    }

    // 5. Loss Vegetasi Layer
    if (lossData) {
      geojsonLayersRef.current.loss = L.geoJSON(lossData as any, {
        style: layerStyles.loss,
        onEachFeature: createOnEachGeoJSONFeature("loss"),
      });
    } else {
      geojsonLayersRef.current.loss = null;
    }

    // 6. Flood Priority Layer
    if (floodPriorityGeoJSON) {
      geojsonLayersRef.current.floodPriority = L.geoJSON(floodPriorityGeoJSON as any, {
        style: getFloodPriorityStyle,
        onEachFeature: (feature: any, layer: L.Layer) => {
          layer.on({
            mouseover: (e) => {
              const target = e.target;
              const featStyle = getFloodPriorityStyle(feature);
              target.setStyle({
                ...featStyle,
                weight: featStyle.weight + 1.5,
                fillOpacity: featStyle.fillOpacity + 0.1,
              });
              
              const area = getFeatureArea(feature);
              const count = getFeaturePixelCount(feature, area);
              const categoryName = feature.properties?.category || "Prioritas Penanganan Vegetasi Pasca Banjir";
              const desc = feature.properties?.description || "";
              const level = feature.properties?.level || "tinggi";
              const priorityLevelName = level === "sangat_tinggi" 
                ? "SANGAT TINGGI (UTAMA)" 
                : level === "tinggi" 
                  ? "TINGGI" 
                  : "SEDANG";

              setSelectedFeatureInfo({
                category: categoryName,
                class: `REHABILITASI - PRIORITAS ${priorityLevelName}`,
                year: "Akhir 2025",
                area_m2: area,
                count: count,
                notes: desc
              });
            },
            mouseout: (e) => {
              const target = e.target;
              target.setStyle(getFloodPriorityStyle(feature));
            },
            click: (e) => {
              mapRef.current?.panTo(e.latlng);
            }
          });

          const area = getFeatureArea(feature);
          const count = getFeaturePixelCount(feature, area);
          const categoryName = feature.properties?.category || "Prioritas Penanganan Vegetasi Pasca Banjir";
          const desc = feature.properties?.description || "";
          const level = feature.properties?.level || "tinggi";
          const priorityLabel = level === "sangat_tinggi" 
            ? "★ PRIORITAS UTAMA (KRITIS TINGGI)" 
            : level === "tinggi" 
              ? "⚡ PRIORITAS TINGGI (KRITIS SEDANG)" 
              : "● PRIORITAS SEDANG (KRITIS RINGAN)";
          
          const badgeColorClass = level === "sangat_tinggi" 
            ? "text-red-600 bg-red-50 border-red-200" 
            : level === "tinggi" 
              ? "text-orange-600 bg-orange-50 border-orange-200" 
              : "text-amber-600 bg-amber-50 border-amber-200";

          const formattedArea = new Intl.NumberFormat("id-ID").format(area);
          
          const popupContent = `
            <div class="p-3 font-sans max-w-[250px] text-slate-800">
              <div class="text-[9px] font-mono font-bold tracking-wider px-2 py-0.5 rounded-full border ${badgeColorClass} mb-1.5 uppercase inline-block">${priorityLabel}</div>
              <div class="text-xs font-extrabold text-slate-900 border-b border-slate-100 pb-1.5 mb-1.5 leading-tight">${categoryName}</div>
              <p class="text-[10px] text-slate-600 leading-normal mb-2 text-justify">${desc}</p>
              <div class="space-y-1 text-[11px] border-t pt-1.5">
                <div class="flex justify-between items-center ${level === 'sangat_tinggi' ? 'bg-red-50 border-red-150' : level === 'tinggi' ? 'bg-orange-50 border-orange-150' : 'bg-amber-50 border-amber-150'} p-1.5 rounded-md mt-1 border">
                  <span class="font-bold">Luas Area Kritis:</span>
                  <span class="font-bold font-mono">${formattedArea} m²</span>
                </div>
              </div>
            </div>
          `;

          layer.bindPopup(popupContent, {
            className: "custom-leaflet-popup",
            maxWidth: 260,
          });
        }
      });
    } else {
      geojsonLayersRef.current.floodPriority = null;
    }

    // Add initial active layers to map
    Object.keys(activeLayers).forEach((layerKey) => {
      const isVisible = activeLayers[layerKey as keyof typeof activeLayers];
      const layer = geojsonLayersRef.current[layerKey];
      if (layer && isVisible) {
        layer.addTo(map);
      }
    });

    // Fit map bounds perfectly to loaded layers
    const boundaryLayer = geojsonLayersRef.current.boundary;
    if (boundaryLayer) {
      const bounds = boundaryLayer.getBounds();
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [20, 20] });
        return;
      }
    }

    // Fallback: use bounds of any other active/loaded layer
    const fallbackLayers = [
      geojsonLayersRef.current.veg2025,
      geojsonLayersRef.current.veg2026,
      geojsonLayersRef.current.gain,
      geojsonLayersRef.current.loss,
      geojsonLayersRef.current.floodPriority
    ];

    for (const l of fallbackLayers) {
      if (l) {
        const bounds = l.getBounds();
        if (bounds.isValid()) {
          map.fitBounds(bounds, { padding: [20, 20] });
          break;
        }
      }
    }
  };

  // Custom Navigation Controls
  const zoomIn = () => mapRef.current?.zoomIn();
  const zoomOut = () => mapRef.current?.zoomOut();
  
  const resetZoom = () => {
    const map = mapRef.current;
    if (!map) return;

    // Reset search bar and remove search marker
    setSearchQuery("");
    if (searchMarkerRef.current) {
      searchMarkerRef.current.remove();
      searchMarkerRef.current = null;
    }

    if (geojsonLayersRef.current.boundary) {
      const bounds = geojsonLayersRef.current.boundary.getBounds();
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [20, 20] });
        return;
      }
    }

    const fallbackLayers = [
      geojsonLayersRef.current.veg2025,
      geojsonLayersRef.current.veg2026,
      geojsonLayersRef.current.gain,
      geojsonLayersRef.current.loss,
      geojsonLayersRef.current.floodPriority
    ];

    for (const l of fallbackLayers) {
      if (l) {
        const bounds = l.getBounds();
        if (bounds.isValid()) {
          map.fitBounds(bounds, { padding: [20, 20] });
          return;
        }
      }
    }

    map.setView(mapCenter, defaultZoom);
  };

  // HTML5 Fullscreen Toggle
  const toggleFullscreen = () => {
    const mapDiv = mapContainerRef.current;
    if (!mapDiv) return;

    if (!isFullscreen) {
      if (mapDiv.requestFullscreen) {
        mapDiv.requestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  // Listen to fullscreen changes (for Escape key)
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
      setTimeout(() => {
        mapRef.current?.invalidateSize();
      }, 300);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 rounded-2xl border transition-all duration-300 ${
      theme === "dark" ? "bg-[#0f172a] border-[#334155]" : "bg-slate-50 border-slate-100"
    }`}>
      {/* Map Window (Col Span 8) */}
      <div className="lg:col-span-8 flex flex-col gap-3">
        <div 
          className={`relative rounded-xl overflow-hidden border shadow-md bg-slate-100 h-[550px] transition-colors ${
            theme === "dark" ? "border-[#334155]" : "border-slate-200"
          }`} 
          ref={mapContainerRef}
        >
          {/* Top-Centered Geocoding Search Bar */}
          <div id="search-wrapper" className="absolute top-4 left-1/2 -translate-x-1/2 z-[1001] w-[280px] sm:w-[350px] max-w-[calc(100%-140px)]">
            <form 
              onSubmit={handleSearchAddress}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl shadow-lg border transition-all duration-300 ${
                theme === "dark" 
                  ? "bg-[#1e293b]/95 border-[#334155]/90 focus-within:border-emerald-500/50 shadow-black/40" 
                  : "bg-white/95 border-slate-200/90 focus-within:border-emerald-500/50 shadow-slate-200/80"
              } backdrop-blur-md`}
            >
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input 
                type="text"
                placeholder="Cari lokasi/kecamatan..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchDropdown(true);
                }}
                onFocus={() => setShowSearchDropdown(true)}
                className="w-full bg-transparent border-none text-xs outline-none focus:ring-0 text-slate-800 dark:text-slate-100 placeholder-slate-400 font-sans"
              />
              {isGeocoding ? (
                <div className="w-4 h-4 rounded-full border-2 border-slate-300 border-t-emerald-500 animate-spin shrink-0"></div>
              ) : searchQuery && (
                <button 
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setSearchResults([]);
                    setShowSearchDropdown(false);
                    if (searchMarkerRef.current) {
                      searchMarkerRef.current.remove();
                      searchMarkerRef.current = null;
                    }
                  }}
                  className="p-0.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </form>

            {/* Search Dropdown Results */}
            {showSearchDropdown && (searchResults.length > 0 || searchQuery.trim().length > 1) && (
              <div 
                className={`absolute left-0 right-0 mt-2 max-h-60 overflow-y-auto rounded-xl border shadow-xl p-1.5 transition-all duration-300 z-[1002] ${
                  theme === "dark" 
                    ? "bg-[#1e293b]/95 border-[#334155]/90 text-white shadow-black/50" 
                    : "bg-white/95 border-slate-200/95 text-slate-800 shadow-slate-200/90"
                } backdrop-blur-md`}
              >
                {searchResults.length > 0 ? (
                  <div className="space-y-0.5">
                    {searchResults.map((result, idx) => (
                      <button
                        key={`${result.name}-${idx}`}
                        type="button"
                        onClick={() => handleZoomToLocation(result.lat, result.lon, result.name)}
                        className={`w-full flex items-start gap-2.5 p-2 rounded-lg text-left transition-colors cursor-pointer ${
                          theme === "dark" ? "hover:bg-slate-800/80" : "hover:bg-slate-100"
                        }`}
                      >
                        <MapPin className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${
                          result.type === "subdistrict" ? "text-emerald-500" : result.type === "landmark" ? "text-amber-500" : "text-blue-500"
                        }`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold leading-tight truncate">{result.name}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5 leading-normal truncate">{result.description}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 text-center">
                    <p className="text-xs text-slate-400">Tidak ada hasil instan ditemukan.</p>
                  </div>
                )}

                {/* Live OSM search trigger inside autocomplete dropdown */}
                {searchQuery.trim().length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleSearchAddress()}
                    disabled={isGeocoding}
                    className={`w-full mt-1.5 border-t pt-2 pb-1 text-center text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                      theme === "dark" 
                        ? "border-slate-800/80 text-emerald-400 hover:text-emerald-300" 
                        : "border-slate-100 text-emerald-600 hover:text-emerald-700"
                    }`}
                  >
                    <Globe className="w-3 h-3 animate-pulse" />
                    <span>{isGeocoding ? "Mencari..." : "Cari Selengkapnya (OSM Geocoding)"}</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Custom Floating Toolbar Controls */}
          <div className="absolute top-4 left-4 z-[1000] flex flex-col gap-2">
            {/* Zoom Widget */}
            <div className={`flex flex-col border rounded-lg shadow-md overflow-hidden ${
              theme === "dark" ? "bg-[#1e293b] border-[#334155]" : "bg-white border-slate-200/80"
            }`}>
              <button 
                onClick={zoomIn} 
                className={`p-2.5 transition-colors border-b ${
                  theme === "dark" 
                    ? "hover:bg-slate-800 text-slate-200 border-slate-700 active:bg-slate-700" 
                    : "hover:bg-slate-50 text-slate-700 border-slate-100 active:bg-slate-100"
                }`}
                title="Perbesar Peta"
              >
                <ZoomIn className="w-4.5 h-4.5" />
              </button>
              <button 
                onClick={zoomOut} 
                className={`p-2.5 transition-colors ${
                  theme === "dark" 
                    ? "hover:bg-slate-800 text-slate-200 active:bg-slate-700" 
                    : "hover:bg-slate-50 text-slate-700 active:bg-slate-100"
                }`}
                title="Perkecil Peta"
              >
                <ZoomOut className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Reset Widget */}
            <button 
              onClick={resetZoom}
              className={`p-2.5 border rounded-lg shadow-md transition-colors ${
                theme === "dark" 
                  ? "bg-[#1e293b] border-[#334155] text-slate-200 hover:bg-slate-800 active:bg-slate-700" 
                  : "bg-white border-slate-200/80 text-slate-700 hover:bg-slate-50 active:bg-slate-100"
              }`}
              title="Reset Zoom ke Kabupaten"
            >
              <RotateCcw className="w-4.5 h-4.5" />
            </button>

            {/* Fullscreen Widget */}
            <button 
              onClick={toggleFullscreen}
              className={`p-2.5 border rounded-lg shadow-md transition-colors ${
                theme === "dark" 
                  ? "bg-[#1e293b] border-[#334155] text-slate-200 hover:bg-slate-800 active:bg-slate-700" 
                  : "bg-white border-slate-200/80 text-slate-700 hover:bg-slate-50 active:bg-slate-100"
              }`}
              title="Layar Penuh"
            >
              <Maximize2 className="w-4.5 h-4.5" />
            </button>
          </div>

          {/* Floating Basemap Selector Widget */}
          <div className={`absolute top-4 right-4 z-[1000] flex flex-col p-2.5 rounded-xl border shadow-lg max-w-[170px] ${
            theme === "dark" ? "bg-[#1e293b]/95 border-[#334155]/90" : "bg-white/95 border-slate-200/90"
          } backdrop-blur-md`}>
            <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest px-1.5 mb-2 flex items-center gap-1">
              <Globe className="w-3 h-3 text-emerald-500" />
              <span>Tipe Basemap</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { id: "dark", label: "Dark" },
                { id: "satellite", label: "Satelit" },
                { id: "streets", label: "Streets" },
                { id: "terrain", label: "Terrain" }
              ].map((b) => (
                <button
                  key={b.id}
                  onClick={() => setBasemap(b.id as any)}
                  className={`px-2 py-1 text-[11px] font-semibold rounded-lg transition-all cursor-pointer ${
                    basemap === b.id
                      ? "bg-emerald-600 text-white shadow-md font-bold"
                      : theme === "dark"
                        ? "bg-slate-800/80 hover:bg-slate-700 text-slate-300"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>

          {/* Map Layer with CSS Filter for Dark Mode GIS effect */}
          <div 
            className="w-full h-full"
            style={{ 
              filter: (theme === "dark" && basemap === "streets") 
                ? "invert(0.9) hue-rotate(180deg) brightness(0.95) contrast(1.05)" 
                : "none" 
            }}
          />

          {/* Layer Overlay Banner */}
          <div className="absolute bottom-4 right-4 z-[1000] bg-slate-900/90 backdrop-blur-md text-white py-1.5 px-3 rounded-lg text-xs font-mono shadow-lg border border-slate-800">
            Aceh Tamiang WebGIS • {basemap.toUpperCase()} BASEMAP
          </div>
        </div>

        {/* Hover Feature Inspector */}
        <div className={`border rounded-xl p-3.5 flex items-start gap-3.5 shadow-sm transition-all duration-300 ${
          theme === "dark" ? "bg-[#1e293b] border-[#334155] text-white" : "bg-white border-slate-200 text-slate-800"
        }`}>
          <div className={`p-2 rounded-lg shrink-0 ${theme === "dark" ? "bg-slate-800 text-emerald-400" : "bg-emerald-50 text-emerald-800"}`}>
            <Info className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Pemeriksa Objek Peta (Hover Inspector)</h4>
            {selectedFeatureInfo ? (
              <div className="flex flex-col gap-1.5 mt-1 text-xs">
                <div className="flex flex-wrap gap-x-6 gap-y-1">
                  <div>
                    <span className="text-slate-400 font-medium">Kategori: </span>
                    <span className={`font-bold ${theme === "dark" ? "text-slate-200" : "text-slate-800"}`}>{selectedFeatureInfo.category}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium">Tahun: </span>
                    <span className={`font-bold ${theme === "dark" ? "text-slate-200" : "text-slate-800"}`}>{selectedFeatureInfo.year}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium">Luas: </span>
                    <span className="font-bold text-emerald-500 font-mono">{new Intl.NumberFormat("id-ID").format(selectedFeatureInfo.area_m2)} m²</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium">Piksel: </span>
                    <span className={`font-semibold font-mono ${theme === "dark" ? "text-slate-300" : "text-slate-700"}`}>{new Intl.NumberFormat("id-ID").format(selectedFeatureInfo.count)} px</span>
                  </div>
                </div>
                {selectedFeatureInfo.notes && (
                  <div className={`mt-1.5 p-2 rounded-lg text-[11px] leading-normal border ${
                    theme === "dark" ? "bg-amber-950/20 border-amber-900/40 text-amber-200" : "bg-amber-50 border-amber-100 text-amber-800"
                  }`}>
                    <strong>Rekomendasi Pemulihan:</strong> {selectedFeatureInfo.notes}
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-slate-400 mt-1">Arahkan kursor ke objek peta atau klik objek untuk memuat detail spasial lengkap secara real-time.</p>
            )}
          </div>
        </div>
      </div>

      {/* Layer Sidebar + Dynamic Legend (Col Span 4) */}
      <div className="lg:col-span-4 flex flex-col gap-6">
        {/* Layer Checkbox Panel */}
        <div className={`border rounded-xl p-5 shadow-sm transition-all duration-300 ${
          theme === "dark" ? "bg-[#1e293b] border-[#334155] text-white" : "bg-white border-slate-200 text-slate-800"
        }`}>
          <div className={`flex items-center gap-2 border-b pb-3 mb-4 ${theme === "dark" ? "border-slate-700" : "border-slate-100"}`}>
            <Layers className="w-5 h-5 text-emerald-500" />
            <h3 className={`font-bold font-display text-base ${theme === "dark" ? "text-white" : "text-slate-900"}`}>Kontrol Layer Spasial</h3>
          </div>

          <p className="text-xs text-slate-400 mb-4 leading-relaxed">
            Nyalakan atau matikan layer di bawah untuk membandingkan perubahan spasial vegetasi di Kabupaten Aceh Tamiang.
          </p>

          <div className="space-y-3.5">
            {/* 1. Boundary */}
            <button
              onClick={() => setActiveLayers(prev => ({ ...prev, boundary: !prev.boundary }))}
              className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all duration-205 cursor-pointer text-left ${
                activeLayers.boundary
                  ? theme === "dark"
                    ? "bg-[#1e293b] border-blue-500/50 shadow-[0_0_12px_rgba(59,130,246,0.12)] text-white"
                    : "bg-blue-50/50 border-blue-200 text-blue-900"
                  : theme === "dark"
                    ? "bg-slate-900/30 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
                    : "bg-slate-50/50 border-slate-100 text-slate-500 hover:bg-slate-100/50"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-all ${
                  activeLayers.boundary
                    ? "bg-blue-500 border-blue-400"
                    : "border-slate-500 bg-transparent"
                }`}>
                  {activeLayers.boundary && <span className="w-1.5 h-1.5 bg-white rounded-full"></span>}
                </div>
                <span className="text-xs font-bold uppercase tracking-wider">Batas Administrasi</span>
              </div>
              <span className={`w-6 h-1 border border-dashed rounded ${theme === "dark" ? "border-blue-400" : "border-slate-900"}`}></span>
            </button>

            {/* 6. Flood Priority Recovery Layer */}
            <button
              onClick={() => setActiveLayers(prev => ({ ...prev, floodPriority: !prev.floodPriority }))}
              className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all duration-205 cursor-pointer text-left ${
                activeLayers.floodPriority
                  ? theme === "dark"
                    ? "bg-amber-950/20 border-amber-500/50 shadow-[0_0_12px_rgba(245,158,11,0.15)] text-white"
                    : "bg-amber-50 border-amber-200 text-amber-900"
                  : theme === "dark"
                    ? "bg-slate-900/30 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
                    : "bg-slate-50/50 border-slate-100 text-slate-500 hover:bg-slate-100/50"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-all ${
                  activeLayers.floodPriority
                    ? "bg-amber-500 border-amber-400 animate-pulse"
                    : "border-slate-500 bg-transparent"
                }`}>
                  {activeLayers.floodPriority && <span className="w-1.5 h-1.5 bg-white rounded-full"></span>}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                    Prioritas Pasca Banjir
                    <span className="text-[8px] bg-amber-600 text-white px-1 py-0.5 rounded uppercase font-mono tracking-normal shrink-0 animate-pulse">PENTING</span>
                  </span>
                </div>
              </div>
              <span className="w-5 h-5 bg-[#fb923c] border border-[#ea580c] rounded block"></span>
            </button>

            {/* 2. Vegetasi 2025 */}
            <button
              onClick={() => setActiveLayers(prev => ({ ...prev, veg2025: !prev.veg2025 }))}
              className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all duration-205 cursor-pointer text-left ${
                activeLayers.veg2025
                  ? theme === "dark"
                    ? "bg-[#1e293b] border-lime-500/50 shadow-[0_0_12px_rgba(132,204,22,0.12)] text-white"
                    : "bg-lime-50/40 border-lime-200 text-lime-900"
                  : theme === "dark"
                    ? "bg-slate-900/30 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
                    : "bg-slate-50/50 border-slate-100 text-slate-500 hover:bg-slate-100/50"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-all ${
                  activeLayers.veg2025
                    ? "bg-[#a3e635] border-lime-500"
                    : "border-slate-500 bg-transparent"
                }`}>
                  {activeLayers.veg2025 && <span className="w-1.5 h-1.5 bg-white rounded-full"></span>}
                </div>
                <span className="text-xs font-bold uppercase tracking-wider">Vegetasi 2025</span>
              </div>
              <span className="w-5 h-5 bg-[#bef264] border border-[#84cc16] rounded block"></span>
            </button>

            {/* 3. Vegetasi 2026 */}
            <button
              onClick={() => setActiveLayers(prev => ({ ...prev, veg2026: !prev.veg2026 }))}
              className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all duration-205 cursor-pointer text-left ${
                activeLayers.veg2026
                  ? theme === "dark"
                    ? "bg-[#1e293b] border-emerald-700/50 shadow-[0_0_12px_rgba(16,185,129,0.12)] text-white"
                    : "bg-emerald-50/50 border-emerald-300 text-emerald-950"
                  : theme === "dark"
                    ? "bg-slate-900/30 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
                    : "bg-slate-50/50 border-slate-100 text-slate-500 hover:bg-slate-100/50"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-all ${
                  activeLayers.veg2026
                    ? "bg-[#047857] border-emerald-600"
                    : "border-slate-500 bg-transparent"
                }`}>
                  {activeLayers.veg2026 && <span className="w-1.5 h-1.5 bg-white rounded-full"></span>}
                </div>
                <span className="text-xs font-bold uppercase tracking-wider">Vegetasi 2026</span>
              </div>
              <span className="w-5 h-5 bg-[#047857] border border-[#064e3b] rounded block"></span>
            </button>

            {/* 4. Gain Vegetasi */}
            <button
              onClick={() => setActiveLayers(prev => ({ ...prev, gain: !prev.gain }))}
              className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all duration-205 cursor-pointer text-left ${
                activeLayers.gain
                  ? theme === "dark"
                    ? "bg-[#1e293b] border-blue-500/50 shadow-[0_0_12px_rgba(59,130,246,0.12)] text-white"
                    : "bg-blue-50/40 border-blue-200 text-blue-900"
                  : theme === "dark"
                    ? "bg-slate-900/30 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
                    : "bg-slate-50/50 border-slate-100 text-slate-500 hover:bg-slate-100/50"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-all ${
                  activeLayers.gain
                    ? "bg-blue-500 border-blue-400"
                    : "border-slate-500 bg-transparent"
                }`}>
                  {activeLayers.gain && <span className="w-1.5 h-1.5 bg-white rounded-full"></span>}
                </div>
                <span className="text-xs font-bold uppercase tracking-wider">Gain Vegetasi</span>
              </div>
              <span className="w-5 h-5 bg-[#3b82f6] border border-[#1d4ed8] rounded block"></span>
            </button>

            {/* 5. Loss Vegetasi */}
            <button
              onClick={() => setActiveLayers(prev => ({ ...prev, loss: !prev.loss }))}
              className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all duration-205 cursor-pointer text-left ${
                activeLayers.loss
                  ? theme === "dark"
                    ? "bg-[#1e293b] border-red-500/50 shadow-[0_0_12px_rgba(239,68,68,0.12)] text-white"
                    : "bg-red-50/40 border-red-200 text-red-900"
                  : theme === "dark"
                    ? "bg-slate-900/30 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
                    : "bg-slate-50/50 border-slate-100 text-slate-500 hover:bg-slate-100/50"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-all ${
                  activeLayers.loss
                    ? "bg-red-500 border-red-400"
                    : "border-slate-500 bg-transparent"
                }`}>
                  {activeLayers.loss && <span className="w-1.5 h-1.5 bg-white rounded-full"></span>}
                </div>
                <span className="text-xs font-bold uppercase tracking-wider">Loss Vegetasi</span>
              </div>
              <span className="w-5 h-5 bg-[#ef4444] border border-[#b91c1c] rounded block"></span>
            </button>
          </div>
        </div>

        {/* Dynamic Legend Panel */}
        <div className={`border rounded-xl p-5 shadow-sm transition-all duration-300 ${
          theme === "dark" ? "bg-[#1e293b] border-[#334155] text-white" : "bg-white border-slate-200 text-slate-800"
        }`}>
          <div className={`flex items-center gap-2 border-b pb-3 mb-4 ${theme === "dark" ? "border-slate-700" : "border-slate-100"}`}>
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
            <h3 className={`font-bold font-display text-base ${theme === "dark" ? "text-white" : "text-slate-900"}`}>Legenda Dinamis</h3>
          </div>

          <p className="text-xs text-slate-400 mb-4">
            Legenda diperbarui secara otomatis berdasarkan layer yang Anda aktifkan di atas.
          </p>

          <div className="space-y-3.5">
            {/* Render dynamic legend items */}
            {activeLayers.boundary && (
              <div className="flex items-center gap-3">
                <span className={`w-5 h-1 border-t-2 border-dashed inline-block ${theme === "dark" ? "border-blue-400" : "border-slate-850"}`}></span>
                <div className="text-xs">
                  <p className={`font-semibold ${theme === "dark" ? "text-slate-200" : "text-slate-800"}`}>Batas Administrasi</p>
                  <p className="text-[10px] text-slate-400 font-mono">Batas Administrasi Kabupaten</p>
                </div>
              </div>
            )}

            {activeLayers.floodPriority && (
              <div className="space-y-2.5 border-l-2 border-amber-500/30 pl-3">
                <p className={`text-[11px] font-bold uppercase tracking-wider ${theme === "dark" ? "text-amber-400" : "text-amber-700"} flex items-center gap-1`}>
                  Prioritas Rehabilitasi
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full inline-block animate-ping"></span>
                </p>
                
                <div className="flex items-start gap-2.5">
                  <span className="w-4 h-4 bg-[#ef4444]/80 border border-[#b91c1c] rounded-md shrink-0 mt-0.5 animate-pulse"></span>
                  <div className="text-[11px]">
                    <p className={`font-semibold leading-tight ${theme === "dark" ? "text-slate-200" : "text-slate-800"}`}>Utama (Kritis Sangat Tinggi)</p>
                    <p className="text-[9px] text-slate-400">Lereng Tangkapan Hulu & Mangrove Pesisir</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="w-4 h-4 bg-[#f97316]/75 border border-[#c2410c] rounded-md shrink-0 mt-0.5"></span>
                  <div className="text-[11px]">
                    <p className={`font-semibold leading-tight ${theme === "dark" ? "text-slate-200" : "text-slate-800"}`}>Tinggi (Kritis Sedang-Tinggi)</p>
                    <p className="text-[9px] text-slate-400">Koridor Bantaran Sungai DAS Tamiang</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="w-4 h-4 bg-[#f59e0b]/65 border border-[#d97706] rounded-md shrink-0 mt-0.5"></span>
                  <div className="text-[11px]">
                    <p className={`font-semibold leading-tight ${theme === "dark" ? "text-slate-200" : "text-slate-800"}`}>Sedang (Kritis Ringan-Sedang)</p>
                    <p className="text-[9px] text-slate-400">Penyangga Pemukiman & Lahan Marginal</p>
                  </div>
                </div>
              </div>
            )}

            {activeLayers.veg2025 && (
              <div className="flex items-center gap-3">
                <span className="w-5 h-5 bg-[#bef264]/75 border border-[#84cc16] rounded inline-block"></span>
                <div className="text-xs">
                  <p className={`font-semibold ${theme === "dark" ? "text-slate-200" : "text-slate-800"}`}>Vegetasi 2025</p>
                  <p className="text-[10px] text-slate-400 font-mono">Kondisi Rona Hijau Awal</p>
                </div>
              </div>
            )}

            {activeLayers.veg2026 && (
              <div className="flex items-center gap-3">
                <span className="w-5 h-5 bg-[#047857]/80 border border-[#064e3b] rounded inline-block"></span>
                <div className="text-xs">
                  <p className={`font-semibold ${theme === "dark" ? "text-slate-200" : "text-slate-800"}`}>Vegetasi 2026</p>
                  <p className="text-[10px] text-slate-400 font-mono">Kondisi Rona Hijau Akhir</p>
                </div>
              </div>
            )}

            {activeLayers.gain && (
              <div className="flex items-center gap-3">
                <span className="w-5 h-5 bg-[#3b82f6]/80 border border-[#1d4ed8] rounded inline-block"></span>
                <div className="text-xs">
                  <p className={`font-semibold ${theme === "dark" ? "text-slate-200" : "text-slate-800"}`}>Vegetation Gain</p>
                  <p className="text-[10px] text-slate-400 font-mono">Area Penambahan Tutupan</p>
                </div>
              </div>
            )}

            {activeLayers.loss && (
              <div className="flex items-center gap-3">
                <span className="w-5 h-5 bg-[#ef4444]/80 border border-[#b91c1c] rounded inline-block"></span>
                <div className="text-xs">
                  <p className={`font-semibold ${theme === "dark" ? "text-slate-200" : "text-slate-800"}`}>Vegetation Loss</p>
                  <p className="text-[10px] text-slate-400 font-mono">Area Degradasi/Pembukaan Lahan</p>
                </div>
              </div>
            )}

            {!activeLayers.boundary && !activeLayers.floodPriority && !activeLayers.veg2025 && !activeLayers.veg2026 && !activeLayers.gain && !activeLayers.loss && (
              <div className="py-4 text-center text-xs text-slate-400 italic">
                Tidak ada layer yang aktif. Klik tombol kontrol layer untuk memuat legenda.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
