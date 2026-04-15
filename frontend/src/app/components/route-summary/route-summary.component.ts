import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { RouteResult } from '../../models/destination.model';

@Component({
  selector: 'app-route-summary',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatDividerModule],
  template: `
    <mat-card class="summary-card">
      <mat-card-header>
        <mat-card-title>
          <mat-icon>directions_car</mat-icon>
          Resumo da Viagem
        </mat-card-title>
      </mat-card-header>

      <mat-card-content>
        <div class="totals">
          <div class="total-item">
            <mat-icon>straighten</mat-icon>
            <div>
              <strong>{{ route.totalDistanceKm | number:'1.1-1' }} km</strong>
              <small>Distância total</small>
            </div>
          </div>
          <div class="total-item">
            <mat-icon>schedule</mat-icon>
            <div>
              <strong>{{ formatDuration(route.totalDurationMinutes) }}</strong>
              <small>Tempo estimado</small>
            </div>
          </div>
        </div>

        <mat-divider></mat-divider>

        <div class="segments">
          <div *ngFor="let seg of route.segments" class="segment">
            <div class="segment-cities">
              <span>{{ seg.from }}</span>
              <mat-icon class="arrow">arrow_forward</mat-icon>
              <span>{{ seg.to }}</span>
            </div>
            <div class="segment-stats">
              <span>{{ seg.distanceKm | number:'1.1-1' }} km</span>
              <span>{{ formatDuration(seg.durationMinutes) }}</span>
            </div>
          </div>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .summary-card {
      background: #e8eaf6;
    }

    mat-card-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 16px;
    }

    .totals {
      display: flex;
      gap: 16px;
      margin: 12px 0;
    }

    .total-item {
      display: flex;
      align-items: center;
      gap: 8px;
      flex: 1;
      background: #fff;
      padding: 12px;
      border-radius: 8px;
    }

    .total-item mat-icon {
      color: #3f51b5;
    }

    .total-item strong {
      display: block;
      font-size: 16px;
    }

    .total-item small {
      color: #666;
      font-size: 12px;
    }

    mat-divider {
      margin: 12px 0;
    }

    .segments {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .segment {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 6px 0;
      font-size: 13px;
    }

    .segment-cities {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .arrow {
      font-size: 16px;
      width: 16px;
      height: 16px;
      color: #999;
    }

    .segment-stats {
      display: flex;
      gap: 12px;
      color: #666;
      font-size: 12px;
    }
  `],
})
export class RouteSummaryComponent {
  @Input() route!: RouteResult;

  formatDuration(minutes: number): string {
    const h = Math.floor(minutes / 60);
    const m = Math.round(minutes % 60);
    if (h === 0) return `${m} min`;
    return `${h}h ${m}min`;
  }
}
