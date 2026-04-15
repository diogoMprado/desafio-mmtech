import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  AfterViewInit,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';
import { Destination } from '../../models/destination.model';

// Fix Leaflet default marker icons in bundled environments
const iconRetinaUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png';
const iconUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png';
const shadowUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({ iconRetinaUrl, iconUrl, shadowUrl });

@Component({
  selector: 'app-trip-map',
  standalone: true,
  imports: [CommonModule],
  template: `<div #mapContainer class="map-container"></div>`,
  styles: [`
    .map-container {
      width: 100%;
      height: 100%;
      min-height: 400px;
    }
  `],
})
export class TripMapComponent implements AfterViewInit, OnChanges {
  @ViewChild('mapContainer') mapEl!: ElementRef<HTMLDivElement>;
  @Input() destinations: Destination[] = [];
  @Input() routeGeometry: Array<[number, number]> = [];

  private map!: L.Map;
  private markersLayer = L.layerGroup();
  private routeLayer = L.layerGroup();
  private initialized = false;

  ngAfterViewInit(): void {
    this.map = L.map(this.mapEl.nativeElement, {
      center: [-15.78, -47.93], // Brazil center
      zoom: 4,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://openstreetmap.org">OpenStreetMap</a>',
      maxZoom: 18,
    }).addTo(this.map);

    this.markersLayer.addTo(this.map);
    this.routeLayer.addTo(this.map);
    this.initialized = true;
    this.updateMap();
  }

  ngOnChanges(_changes: SimpleChanges): void {
    if (this.initialized) {
      this.updateMap();
    }
  }

  private updateMap(): void {
    this.markersLayer.clearLayers();
    this.routeLayer.clearLayers();

    if (this.destinations.length === 0) return;

    const bounds: L.LatLngExpression[] = [];

    this.destinations.forEach((dest, i) => {
      const lat = Number(dest.latitude);
      const lng = Number(dest.longitude);
      const latlng: L.LatLngExpression = [lat, lng];
      bounds.push(latlng);

      const marker = L.marker(latlng).bindPopup(
        `<strong>${i + 1}. ${dest.name}</strong><br>
         <small>${lat.toFixed(4)}°, ${lng.toFixed(4)}°</small>`,
      );
      this.markersLayer.addLayer(marker);
    });

    if (this.routeGeometry.length > 0) {
      const polyline = L.polyline(this.routeGeometry, {
        color: '#3f51b5',
        weight: 4,
        opacity: 0.8,
      });
      this.routeLayer.addLayer(polyline);
    }

    if (bounds.length > 0) {
      this.map.fitBounds(L.latLngBounds(bounds), { padding: [40, 40] });
    }
  }
}
