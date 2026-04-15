import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { DestinationService } from './services/destination.service';
import { Destination, CreateDestinationDto, RouteResult } from './models/destination.model';
import { DestinationFormComponent } from './components/destination-form/destination-form.component';
import { DestinationListComponent } from './components/destination-list/destination-list.component';
import { TripMapComponent } from './components/trip-map/trip-map.component';
import { RouteSummaryComponent } from './components/route-summary/route-summary.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatSnackBarModule,
    MatIconModule,
    DestinationFormComponent,
    DestinationListComponent,
    TripMapComponent,
    RouteSummaryComponent,
  ],
  template: `
    <mat-toolbar color="primary" class="app-toolbar">
      <mat-icon>flight_takeoff</mat-icon>
      <span class="toolbar-title">Trip Planner</span>
      <span class="toolbar-subtitle">Desafio MMTECH</span>
    </mat-toolbar>

    <div class="app-layout">
      <aside class="sidebar">
        <app-destination-form
          [editingDestination]="editingDestination"
          (saved)="onDestinationSaved($event)"
          (cancelled)="onEditCancelled()">
        </app-destination-form>

        <app-destination-list
          [destinations]="destinations"
          (reordered)="onReordered($event)"
          (edit)="onEdit($event)"
          (deleted)="onDeleted($event)">
        </app-destination-list>

        <app-route-summary
          *ngIf="routeResult"
          [route]="routeResult">
        </app-route-summary>
      </aside>

      <main class="map-area">
        <app-trip-map
          [destinations]="destinations"
          [routeGeometry]="routeResult?.geometry || []">
        </app-trip-map>
      </main>
    </div>
  `,
  styles: [`
    .app-toolbar {
      gap: 8px;
      position: sticky;
      top: 0;
      z-index: 1000;
    }

    .toolbar-title {
      font-weight: 500;
      font-size: 20px;
    }

    .toolbar-subtitle {
      font-size: 13px;
      opacity: 0.8;
      margin-left: auto;
    }

    .app-layout {
      display: flex;
      height: calc(100vh - 64px);
    }

    .sidebar {
      width: 400px;
      min-width: 340px;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      background: #fff;
      border-right: 1px solid #e0e0e0;
    }

    .map-area {
      flex: 1;
      position: relative;
    }

    @media (max-width: 768px) {
      .app-layout {
        flex-direction: column;
        height: auto;
      }

      .sidebar {
        width: 100%;
        min-width: unset;
        border-right: none;
        border-bottom: 1px solid #e0e0e0;
      }

      .map-area {
        height: 50vh;
      }
    }
  `],
})
export class AppComponent implements OnInit {
  destinations: Destination[] = [];
  editingDestination: Destination | null = null;
  routeResult: RouteResult | null = null;

  constructor(
    private destinationService: DestinationService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.loadDestinations();
  }

  loadDestinations(): void {
    this.destinationService.list().subscribe({
      next: (data) => {
        this.destinations = data;
        this.loadRoute();
      },
      error: () => this.showError('Falha ao carregar destinos'),
    });
  }

  loadRoute(): void {
    if (this.destinations.length < 2) {
      this.routeResult = null;
      return;
    }

    this.destinationService.getRoute().subscribe({
      next: (route) => (this.routeResult = route),
      error: () => (this.routeResult = null),
    });
  }

  onDestinationSaved(dto: CreateDestinationDto): void {
    if (this.editingDestination) {
      this.destinationService.update(this.editingDestination.id, dto).subscribe({
        next: () => {
          this.editingDestination = null;
          this.loadDestinations();
          this.showSuccess('Destino atualizado');
        },
        error: () => this.showError('Falha ao atualizar destino'),
      });
    } else {
      this.destinationService.create(dto).subscribe({
        next: () => {
          this.loadDestinations();
          this.showSuccess('Destino adicionado');
        },
        error: () => this.showError('Falha ao adicionar destino'),
      });
    }
  }

  onEdit(destination: Destination): void {
    this.editingDestination = destination;
  }

  onEditCancelled(): void {
    this.editingDestination = null;
  }

  onDeleted(id: number): void {
    this.destinationService.delete(id).subscribe({
      next: () => {
        this.loadDestinations();
        this.showSuccess('Destino removido');
      },
      error: () => this.showError('Falha ao remover destino'),
    });
  }

  onReordered(ids: number[]): void {
    this.destinationService.reorder(ids).subscribe({
      next: (data) => {
        this.destinations = data;
        this.loadRoute();
      },
      error: () => this.showError('Falha ao reordenar'),
    });
  }

  private showSuccess(msg: string): void {
    this.snackBar.open(msg, 'OK', { duration: 2000 });
  }

  private showError(msg: string): void {
    this.snackBar.open(msg, 'Fechar', { duration: 4000, panelClass: 'error-snack' });
  }
}
