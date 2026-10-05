import { ALL_MAJOR_CITIES } from '../data/indiaLocations';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface SavedAddress {
  id: string;
  label: 'Home' | 'Work' | 'Other';
  customTitle?: string;
  flatNumber: string;
  street: string;
  landmark?: string;
  area: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
  lat: number;
  lng: number;
  isDefault?: boolean;
}

/**
 * Calculates the great-circle distance between two coordinates in kilometers (Haversine formula).
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Math.round(d * 10) / 10;
}

/**
 * Calculates estimated travel time in minutes based on distance and average urban speed (22 km/h).
 */
export function calculateETAminutes(distanceKm: number): number {
  if (distanceKm <= 0.2) return 1;
  const avgSpeedKmPerHour = 22;
  const trafficBuffer = 3; // 3 min traffic/parking buffer
  const minutes = Math.round((distanceKm / avgSpeedKmPerHour) * 60) + trafficBuffer;
  return Math.max(2, minutes);
}

/**
 * Generates an interpolated realistic road route with waypoints between two points.
 */
export function generateRoutePoints(
  start: Coordinates,
  end: Coordinates,
  stepsCount: number = 20
): Coordinates[] {
  const points: Coordinates[] = [];
  
  // Add subtle curved realistic street deviation
  const midLat = (start.lat + end.lat) / 2;
  const midLng = (start.lng + end.lng) / 2;
  const deltaLat = end.lat - start.lat;
  const deltaLng = end.lng - start.lng;
  
  // Perpendicular curve offset
  const curveFactor = 0.15;
  const control1: Coordinates = {
    lat: start.lat + deltaLat * 0.33 - deltaLng * curveFactor,
    lng: start.lng + deltaLng * 0.33 + deltaLat * curveFactor,
  };
  const control2: Coordinates = {
    lat: start.lat + deltaLat * 0.66 + deltaLng * curveFactor * 0.5,
    lng: start.lng + deltaLng * 0.66 - deltaLat * curveFactor * 0.5,
  };

  for (let i = 0; i <= stepsCount; i++) {
    const t = i / stepsCount;
    // Cubic Bezier curve
    const lat =
      Math.pow(1 - t, 3) * start.lat +
      3 * Math.pow(1 - t, 2) * t * control1.lat +
      3 * (1 - t) * Math.pow(t, 2) * control2.lat +
      Math.pow(t, 3) * end.lat;

    const lng =
      Math.pow(1 - t, 3) * start.lng +
      3 * Math.pow(1 - t, 2) * t * control1.lng +
      3 * (1 - t) * Math.pow(t, 2) * control2.lng +
      Math.pow(t, 3) * end.lng;

    points.push({ lat, lng });
  }

  return points;
}

/**
 * Reverse geocodes coordinates (lat, lng) to actual locality and address via OpenStreetMap Nominatim API & BigDataCloud API, with spatial fallback.
 */
export async function reverseGeocodeCoords(lat: number, lng: number): Promise<{
  area: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
  street: string;
  country: string;
  formattedAddress: string;
}> {
  // 1. Primary: Nominatim OpenStreetMap API
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=18`,
      {
        headers: {
          'Accept-Language': 'en-US,en;q=0.9',
        },
        signal: controller.signal,
      }
    );
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && data.address) {
        const addr = data.address;
        const street = addr.house_number
          ? `${addr.house_number}, ${addr.road || addr.pedestrian || addr.footway || ''}`
          : addr.road || addr.pedestrian || addr.footway || addr.highway || '';

        const area =
          addr.suburb ||
          addr.neighbourhood ||
          addr.residential ||
          addr.subdistrict ||
          addr.village ||
          addr.quarter ||
          addr.city_district ||
          addr.locality ||
          '';

        const city =
          addr.city ||
          addr.town ||
          addr.municipality ||
          addr.village ||
          addr.state_district ||
          addr.county ||
          '';

        const state = addr.state || '';
        const pincode = addr.postcode || '';
        const country = addr.country || 'India';

        const addressParts = [
          street,
          area,
          city,
          addr.state_district || addr.county || '',
          state,
          pincode ? `PIN: ${pincode}` : '',
          country,
        ].filter(Boolean);

        const formattedAddress = data.display_name || addressParts.join(', ');

        return {
          area: area || city || 'Current Area',
          city: city || 'Current City',
          district: addr.state_district || addr.county || city || 'District',
          state: state || 'State',
          pincode: pincode || '',
          street: street || 'Current Location',
          country,
          formattedAddress,
        };
      }
    }
  } catch (e) {
    console.warn('Nominatim reverse geocoding unavailable, trying secondary client API...', e);
  }

  // 2. Secondary: BigDataCloud Reverse Geocode Client API (Free, CORS enabled)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`,
      { signal: controller.signal }
    );
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data) {
        const locality = data.locality || data.city || data.localityInfo?.informative?.[0]?.name || '';
        const city = data.city || data.principalSubdivision || '';
        const state = data.principalSubdivision || '';
        const country = data.countryName || 'India';
        const formattedAddress = data.localityInfo?.administrative
          ? data.localityInfo.administrative.map((a: any) => a.name).join(', ')
          : `${locality}, ${city}, ${state}, ${country}`;

        return {
          area: locality || city || 'Local Area',
          city: city || 'Local City',
          district: city || 'Local District',
          state: state || 'India',
          pincode: data.postcode || '',
          street: 'Current Location',
          country,
          formattedAddress: formattedAddress || `GPS (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
        };
      }
    }
  } catch (e) {
    console.warn('BigDataCloud reverse geocoding unavailable, matching nearest spatial city...', e);
  }

  // 3. Spatial nearest city matching fallback with accurate lat/lng display
  const nearest = findNearestIndianCity(lat, lng);
  const formattedAddress = `GPS Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)} (${nearest.suggestedArea}, ${nearest.city}, ${nearest.state} - ${nearest.pincode})`;

  return {
    area: nearest.suggestedArea,
    city: nearest.city,
    district: nearest.district,
    state: nearest.state,
    pincode: nearest.pincode,
    street: `GPS Coordinates (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
    country: 'India',
    formattedAddress,
  };
}

/**
 * Reverse geocodes a latitude/longitude to the closest Indian city and district.
 */
export function findNearestIndianCity(lat: number, lng: number) {
  let nearestCity = ALL_MAJOR_CITIES[0];
  let minDistance = Infinity;

  for (const city of ALL_MAJOR_CITIES) {
    const dist = calculateDistanceKm(lat, lng, city.lat, city.lng);
    if (dist < minDistance) {
      minDistance = dist;
      nearestCity = city;
    }
  }

  return {
    city: nearestCity.cityName,
    state: nearestCity.stateName,
    district: nearestCity.districtName,
    pincode: nearestCity.pincode,
    suggestedArea: nearestCity.popularAreas[0] || 'Main City Area',
    distanceKm: minDistance,
  };
}

/**
 * Formats a saved address into a clean single or multi-line display string.
 */
export function formatAddress(addr: Partial<SavedAddress>): string {
  const parts = [
    addr.flatNumber,
    addr.street,
    addr.landmark ? `Near ${addr.landmark}` : '',
    addr.area,
    addr.city,
    addr.state ? `${addr.state} - ${addr.pincode || ''}` : addr.pincode,
  ].filter(Boolean);

  return parts.join(', ');
}
