import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { debounceTime, distinctUntilChanged, switchMap, filter } from 'rxjs/operators';
import { of } from 'rxjs';
import { DestinationService } from '../../services/destination.service';
import { CreateDestinationDto, Destination, GeocodeSuggestion } from '../../models/destination.model';

@Component({
  selector: 'app-destination-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
  ],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>
          <mat-icon>add_location</mat-icon>
          {{ editingDestination ? 'Editar Destino' : 'Adicionar Destino' }}
        </mat-card-title>
      </mat-card-header>

      <mat-card-content>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Buscar cidade</mat-label>
          <input
            matInput
            [formControl]="searchControl"
            [matAutocomplete]="auto"
            placeholder="Ex: Curitiba, PR">
          <mat-autocomplete
            #auto="matAutocomplete"
            [displayWith]="displayFn"
            (optionSelected)="onCitySelected($event.option.value)">
            <mat-option *ngFor="let s of suggestions" [value]="s">
              {{ s.label }}
            </mat-option>
          </mat-autocomplete>
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>

        <div class="coords" *ngIf="selectedCity">
          <span class="coord-label">
            <mat-icon>place</mat-icon>
            {{ selectedCity.name }}
          </span>
          <span class="coord-detail">
            {{ selectedCity.latitude.toFixed(4) }}°,
            {{ selectedCity.longitude.toFixed(4) }}°
          </span>
        </div>
      </mat-card-content>

      <mat-card-actions align="end">
        <button
          mat-button
          *ngIf="editingDestination"
          (click)="onCancel()">
          Cancelar
        </button>
        <button
          mat-raised-button
          color="primary"
          [disabled]="!selectedCity"
          (click)="onSave()">
          <mat-icon>{{ editingDestination ? 'save' : 'add' }}</mat-icon>
          {{ editingDestination ? 'Salvar' : 'Adicionar' }}
        </button>
      </mat-card-actions>
    </mat-card>
  `,
  styles: [`
    mat-card-header { margin-bottom: 12px; }

    mat-card-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 16px;
    }

    .full-width { width: 100%; }

    .coords {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #e8f5e9;
      padding: 8px 12px;
      border-radius: 8px;
      margin-top: 4px;
    }

    .coord-label {
      display: flex;
      align-items: center;
      gap: 4px;
      font-weight: 500;
    }

    .coord-detail {
      font-size: 13px;
      color: #666;
    }
  `],
})
export class DestinationFormComponent implements OnChanges {
  @Input() editingDestination: Destination | null = null;
  @Output() saved = new EventEmitter<CreateDestinationDto>();
  @Output() cancelled = new EventEmitter<void>();

  searchControl = new FormControl('');
  suggestions: GeocodeSuggestion[] = [];
  selectedCity: GeocodeSuggestion | null = null;

  constructor(private destinationService: DestinationService) {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(350),
        distinctUntilChanged(),
        filter((v): v is string => typeof v === 'string' && v.length >= 2),
        switchMap((q) => this.destinationService.geocode(q)),
      )
      .subscribe((results) => (this.suggestions = results));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['editingDestination'] && this.editingDestination) {
      this.selectedCity = {
        name: this.editingDestination.name,
        label: this.editingDestination.name,
        latitude: this.editingDestination.latitude,
        longitude: this.editingDestination.longitude,
      };
      this.searchControl.setValue(this.editingDestination.name);
    }
  }

  displayFn(suggestion: GeocodeSuggestion | string): string {
    if (typeof suggestion === 'string') return suggestion;
    return suggestion?.label || '';
  }

  onCitySelected(suggestion: GeocodeSuggestion): void {
    this.selectedCity = suggestion;
  }

  onSave(): void {
    if (!this.selectedCity) return;

    this.saved.emit({
      name: this.selectedCity.name,
      latitude: this.selectedCity.latitude,
      longitude: this.selectedCity.longitude,
    });

    this.searchControl.setValue('');
    this.selectedCity = null;
    this.suggestions = [];
  }

  onCancel(): void {
    this.editingDestination = null;
    this.selectedCity = null;
    this.searchControl.setValue('');
    this.cancelled.emit();
  }
}
