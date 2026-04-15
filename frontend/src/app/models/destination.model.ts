export interface Destination {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDestinationDto {
  name: string;
  latitude: number;
  longitude: number;
}

export interface GeocodeSuggestion {
  name: string;
  label: string;
  latitude: number;
  longitude: number;
}

export interface RouteSegment {
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
