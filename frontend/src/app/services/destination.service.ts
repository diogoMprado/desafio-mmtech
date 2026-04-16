import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Destination, CreateDestinationDto, RouteResult, GeocodeSuggestion } from '../models/destination.model';

@Injectable({ providedIn: 'root' })
export class DestinationService {
  private readonly baseUrl = '/api/destinations';

  constructor(private http: HttpClient) {}

  private parseCoords(d: any): Destination {
    return { ...d, latitude: Number(d.latitude), longitude: Number(d.longitude) };
  }

  list(): Observable<Destination[]> {
    return this.http.get<any[]>(this.baseUrl).pipe(
      map(data => data.map(d => this.parseCoords(d)))
    );
  }

  create(dto: CreateDestinationDto): Observable<Destination> {
    return this.http.post<any>(this.baseUrl, dto).pipe(map(d => this.parseCoords(d)));
  }

  update(id: number, dto: CreateDestinationDto): Observable<Destination> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, dto).pipe(map(d => this.parseCoords(d)));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  reorder(orderedIds: number[]): Observable<Destination[]> {
    return this.http.put<any[]>(`${this.baseUrl}/reorder`, { orderedIds }).pipe(
      map(data => data.map(d => this.parseCoords(d)))
    );
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
