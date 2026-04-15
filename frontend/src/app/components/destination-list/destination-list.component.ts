import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Destination } from '../../models/destination.model';

@Component({
  selector: 'app-destination-list',
  standalone: true,
  imports: [
    CommonModule,
    DragDropModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatTooltipModule,
  ],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>
          <mat-icon>list</mat-icon>
          Roteiro ({{ destinations.length }} destinos)
        </mat-card-title>
      </mat-card-header>

      <mat-card-content>
        <div
          *ngIf="destinations.length === 0"
          class="empty-state">
          <mat-icon>explore</mat-icon>
          <p>Nenhum destino adicionado ainda.</p>
          <p class="hint">Use o campo acima para buscar e adicionar cidades.</p>
        </div>

        <div
          cdkDropList
          class="destination-list"
          (cdkDropListDropped)="onDrop($event)">
          <div
            *ngFor="let dest of destinations; let i = index"
            cdkDrag
            class="destination-item">
            <div class="drag-handle" cdkDragHandle>
              <mat-icon>drag_indicator</mat-icon>
            </div>

            <div class="destination-info">
              <span class="order-badge">{{ i + 1 }}</span>
              <div class="destination-text">
                <strong>{{ dest.name }}</strong>
                <small>{{ dest.latitude.toFixed(4) }}°, {{ dest.longitude.toFixed(4) }}°</small>
              </div>
            </div>

            <div class="destination-actions">
              <button
                mat-icon-button
                matTooltip="Editar"
                (click)="edit.emit(dest)">
                <mat-icon>edit</mat-icon>
              </button>
              <button
                mat-icon-button
                color="warn"
                matTooltip="Excluir"
                (click)="deleted.emit(dest.id)">
                <mat-icon>delete</mat-icon>
              </button>
            </div>
          </div>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    mat-card-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 16px;
    }

    .empty-state {
      text-align: center;
      padding: 24px;
      color: #999;
    }

    .empty-state mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: #ccc;
    }

    .empty-state .hint {
      font-size: 13px;
    }

    .destination-list {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .destination-item {
      display: flex;
      align-items: center;
      padding: 8px;
      background: #fafafa;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      cursor: move;
      transition: box-shadow 0.2s;
    }

    .destination-item:hover {
      box-shadow: 0 2px 6px rgba(0,0,0,0.1);
    }

    .cdk-drag-preview {
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    }

    .cdk-drag-placeholder {
      opacity: 0.3;
    }

    .drag-handle {
      color: #bbb;
      cursor: grab;
      margin-right: 4px;
    }

    .destination-info {
      display: flex;
      align-items: center;
      gap: 8px;
      flex: 1;
    }

    .order-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: #3f51b5;
      color: #fff;
      font-size: 13px;
      font-weight: 500;
      flex-shrink: 0;
    }

    .destination-text {
      display: flex;
      flex-direction: column;
    }

    .destination-text strong {
      font-size: 14px;
    }

    .destination-text small {
      font-size: 11px;
      color: #999;
    }

    .destination-actions {
      display: flex;
      gap: 0;
    }
  `],
})
export class DestinationListComponent {
  @Input() destinations: Destination[] = [];
  @Output() reordered = new EventEmitter<number[]>();
  @Output() edit = new EventEmitter<Destination>();
  @Output() deleted = new EventEmitter<number>();

  onDrop(event: CdkDragDrop<Destination[]>): void {
    const items = [...this.destinations];
    moveItemInArray(items, event.previousIndex, event.currentIndex);
    this.reordered.emit(items.map((d) => d.id));
  }
}
