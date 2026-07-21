/**
 * Geographic utility functions for Aceh Tamiang WebGIS.
 * Performs planar approximation for area calculations at ~4.38° Latitude.
 */

/**
 * Calculates the approximate area of a coordinate loop in square meters.
 */
export function calculatePolygonArea(coords: number[][]): number {
  let area = 0;
  if (!coords || coords.length < 3) return 0;
  
  for (let i = 0; i < coords.length; i++) {
    const j = (i + 1) % coords.length;
    area += coords[i][0] * coords[j][1];
    area -= coords[j][0] * coords[i][1];
  }
  
  area = Math.abs(area) / 2;
  
  // Convert square degrees to square meters at ~4.38 deg Latitude
  // 1 degree latitude = 111,132 meters
  // 1 degree longitude = 111,132 * cos(4.38°) ≈ 111,132 * 0.997 = 110,800 meters
  const factor = 111132 * 110800;
  return area * factor;
}

/**
 * Calculates the approximate area of a GeoJSON Geometry in square meters.
 */
export function calculateGeoJSONArea(geometry: any): number {
  if (!geometry) return 0;
  
  if (geometry.type === 'Polygon') {
    return calculatePolygonArea(geometry.coordinates[0]);
  } else if (geometry.type === 'MultiPolygon') {
    let total = 0;
    for (const poly of geometry.coordinates) {
      if (poly && poly[0]) {
        total += calculatePolygonArea(poly[0]);
      }
    }
    return total;
  }
  return 0;
}

/**
 * Extracts or calculates the area in square meters for any GeoJSON feature.
 */
export function getFeatureArea(feature: any): number {
  if (!feature || !feature.properties) return 0;
  const props = feature.properties;
  
  // Try common property names first (pre-computed attributes)
  const areaKeys = [
    'area_m2', 'area_m', 'luas_m2', 'luas', 'Luas', 'area', 'Area', 
    'area_ha', 'ha', 'hectares', 'Hectares', 'luas_ha'
  ];
  
  for (const key of areaKeys) {
    if (props[key] !== undefined && props[key] !== null) {
      const val = parseFloat(props[key]);
      if (!isNaN(val)) {
        // If the key is hectare-related, convert to m²
        if (key.includes('ha') || key === 'hectares' || key === 'Hectares') {
          return val * 10000;
        }
        return val;
      }
    }
  }
  
  // Fallback: Calculate physically from polygon geometry coordinates
  try {
    if (feature.geometry) {
      return calculateGeoJSONArea(feature.geometry);
    }
  } catch (e) {
    console.error("Failed to calculate fallback area for feature:", e);
  }
  
  return 0;
}

/**
 * Gets or estimates pixel count for a feature (1 pixel = 10m x 10m = 100m² for Sentinel-2).
 */
export function getFeaturePixelCount(feature: any, areaM2: number): number {
  if (feature?.properties?.count !== undefined && feature.properties.count !== null) {
    const val = parseInt(feature.properties.count);
    if (!isNaN(val)) return val;
  }
  return Math.round(areaM2 / 100);
}
