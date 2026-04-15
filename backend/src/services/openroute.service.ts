import { AppError } from '../middlewares/error-handler';

const ORS_BASE_URL = 'https://api.openrouteservice.org';

function getApiKey(): string {
  const key = process.env.ORS_API_KEY;
  if (!key || key === 'your_api_key_here') {
    throw new AppError(
      503,
      'ORS_API_KEY não configurada. Obtenha sua chave em https://openrouteservice.org/dev/#/signup',
    );
  }
  return key;
}

interface Coordinate {
  latitude: number;
  longitude: number;
}

interface RouteSegment {
  from: string;
  to: string;
  distanceKm: number;
  durationMinutes: number;
}

export interface RouteResult {
  segments: RouteSegment[];
  totalDistanceKm: number;
  totalDurationMinutes: number;
  geometry: Array<[number, number]>;
}

export async function calculateRoute(
  destinations: Array<Coordinate & { name: string }>,
): Promise<RouteResult> {
  if (destinations.length < 2) {
    throw new AppError(400, 'São necessários pelo menos 2 destinos para calcular a rota');
  }

  const apiKey = getApiKey();

  const coordinates = destinations.map((d) => [
    Number(d.longitude),
    Number(d.latitude),
  ]);

  const response = await fetch(`${ORS_BASE_URL}/v2/directions/driving-car`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      coordinates,
      instructions: false,
      geometry: true,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    console.error('ORS error:', response.status, body);
    throw new AppError(502, 'Falha ao calcular a rota via OpenRouteService');
  }

  const data: any = await response.json();
  const route = data.routes?.[0];

  if (!route) {
    throw new AppError(502, 'Nenhuma rota encontrada');
  }

  const segments: RouteSegment[] = route.segments.map(
    (seg: { distance: number; duration: number }, idx: number) => ({
      from: destinations[idx].name,
      to: destinations[idx + 1].name,
      distanceKm: Math.round((seg.distance / 1000) * 100) / 100,
      durationMinutes: Math.round((seg.duration / 60) * 100) / 100,
    }),
  );

  const totalDistanceKm = segments.reduce((sum, s) => sum + s.distanceKm, 0);
  const totalDurationMinutes = segments.reduce((sum, s) => sum + s.durationMinutes, 0);

  // Decode geometry (ORS returns encoded polyline by default in GeoJSON)
  const geometry: Array<[number, number]> = route.geometry?.coordinates
    ? route.geometry.coordinates.map((c: number[]) => [c[1], c[0]])
    : [];

  return {
    segments,
    totalDistanceKm: Math.round(totalDistanceKm * 100) / 100,
    totalDurationMinutes: Math.round(totalDurationMinutes * 100) / 100,
    geometry,
  };
}

export interface GeocodeSuggestion {
  name: string;
  label: string;
  latitude: number;
  longitude: number;
}

export async function geocodeSearch(query: string): Promise<GeocodeSuggestion[]> {
  if (!query || query.trim().length < 2) {
    return [];
  }

  const apiKey = getApiKey();

  const params = new URLSearchParams({
    text: query.trim(),
    size: '5',
    layers: 'locality,county,region',
    'boundary.country': 'BR',
  });

  const response = await fetch(
    `${ORS_BASE_URL}/geocode/search?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    },
  );

  if (!response.ok) {
    console.error('ORS geocode error:', response.status);
    return [];
  }

  const data: any = await response.json();

  return (data.features || []).map(
    (f: { properties: { name: string; label: string }; geometry: { coordinates: number[] } }) => ({
      name: f.properties.name,
      label: f.properties.label,
      latitude: f.geometry.coordinates[1],
      longitude: f.geometry.coordinates[0],
    }),
  );
}
