import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Destination, CreateDestinationDto, RouteResult, GeocodeSuggestion } from '../models/destination.model';

@Injectable({ providedIn: 'root' })
export class DestinationService {
  private readonly baseUrl = '/api/destinations';

  constructor(private http: HttpClient) {}

  list(): Observable<Destination[]> {
    return this.http.get<Destination[]>(this.baseUrl);
  }

  create(dto: CreateDestinationDto): Observable<Destination> {
    return this.http.post<Destination>(this.baseUrl, dto);
  }

  update(id: number, dto: CreateDestinationDto): Observable<Destination> {
    return this.http.put<Destination>(`${this.baseUrl}/${id}`, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  reorder(orderedIds: number[]): Observable<Destination[]> {
    return this.http.put<Destination[]>(`${this.baseUrl}/reorder`, { orderedIds });
  }

  getRoute(): Observable<RouteResult> {
    return this.http.get<RouteResult>('/api/route');
  }

  geocode(query: string): Observable<GeocodeSuggestion[]> {
    return this.http.get<GeocodeSuggestion[]>('/api/geocode', {
      params: { q: query },
    });
  }
}
