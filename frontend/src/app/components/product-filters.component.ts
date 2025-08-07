import { Component, Input, Output, EventEmitter } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { Category } from '../services/product.service';

@Component({
  selector: 'app-product-filters',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="filters-container">
    
      <!-- Categorias -->
      <div class="filter-group">
        <h4 class="filter-title">Categorias</h4>
        <div class="filter-content">
          <label class="filter-option">
            <input
              type="radio"
              name="category"
              [value]="null"
              [checked]="selectedCategory === null"
              (change)="onCategoryChange(null)">
            <span class="filter-label">Todas as categorias</span>
          </label>
    
          @for (category of categories; track category) {
            <label
              class="filter-option">
              <input
                type="radio"
                name="category"
                [value]="category.id"
                [checked]="selectedCategory === category.id"
                (change)="onCategoryChange(category.id)">
              <span class="filter-label">
                {{ category.name }}
              </span>
            </label>
          }
        </div>
      </div>
    
      <!-- Faixa de Preço -->
      <div class="filter-group">
        <h4 class="filter-title">Preço</h4>
        <div class="filter-content">
          <div class="price-range">
            <div class="price-inputs">
              <div class="price-input-group">
                <label>Mín</label>
                <input
                  type="number"
                  class="price-input"
                  [value]="priceRange.min"
                  (input)="onPriceMinChange($event)"
                  min="0">
              </div>
              <div class="price-input-group">
                <label>Máx</label>
                <input
                  type="number"
                  class="price-input"
                  [value]="priceRange.max"
                  (input)="onPriceMaxChange($event)"
                  min="0">
              </div>
            </div>
    
            <div class="price-presets">
              @for (preset of pricePresets; track preset) {
                <button
                  class="price-preset-btn"
                  (click)="setPriceRange(preset.min, preset.max)">
                  {{ preset.label }}
                </button>
              }
            </div>
          </div>
        </div>
      </div>
    
      <!-- Ordenação -->
      <div class="filter-group">
        <h4 class="filter-title">Ordenar por</h4>
        <div class="filter-content">
          <select
            class="sort-select"
            [value]="sortBy"
            (change)="onSortChange($event)">
            <option value="name">Nome (A-Z)</option>
            <option value="price-asc">Menor preço</option>
            <option value="price-desc">Maior preço</option>
            <option value="rating">Melhor avaliado</option>
            <option value="popular">Mais popular</option>
          </select>
        </div>
      </div>
    
      <!-- Limpar Filtros -->
      <div class="filter-actions">
        <button class="clear-filters-btn" (click)="onClearFilters()">
          🗑️ Limpar filtros
        </button>
      </div>
    
    </div>
    `,
  styles: [`
    .filters-container {
      background: white;
    }

    .filter-group {
      margin-bottom: 2rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid #f3f4f6;
    }

    .filter-group:last-of-type {
      border-bottom: none;
      margin-bottom: 1.5rem;
    }

    .filter-title {
      font-size: 1.125rem;
      font-weight: 600;
      color: #374151;
      margin-bottom: 1rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .filter-content {
      space-y: 0.75rem;
    }

    .filter-option {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 0.75rem;
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 0.5rem;
      transition: background-color 0.2s ease;
    }

    .filter-option:hover {
      background: #f9fafb;
    }

    .filter-option input[type="radio"] {
      width: 16px;
      height: 16px;
      accent-color: #ec4899;
    }

    .filter-label {
      font-size: 0.875rem;
      color: #374151;
      flex: 1;
    }

    .price-range {
      space-y: 1rem;
    }

    .price-inputs {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.75rem;
    }

    .price-input-group {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .price-input-group label {
      font-size: 0.875rem;
      color: #6b7280;
      font-weight: 500;
    }

    .price-input {
      padding: 0.5rem;
      border: 1px solid #d1d5db;
      border-radius: 0.375rem;
      font-size: 0.875rem;
      width: 100%;
    }

    .price-input:focus {
      outline: none;
      ring: 2px;
      ring-color: #ec4899;
      border-color: #ec4899;
    }

    .price-presets {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-top: 1rem;
    }

    .price-preset-btn {
      padding: 0.5rem 0.75rem;
      border: 1px solid #e5e7eb;
      background: white;
      border-radius: 0.375rem;
      font-size: 0.875rem;
      color: #374151;
      cursor: pointer;
      transition: all 0.2s ease;
      text-align: left;
    }

    .price-preset-btn:hover {
      background: #f9fafb;
      border-color: #d1d5db;
    }

    .sort-select {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 0.5rem;
      font-size: 0.875rem;
      background: white;
      cursor: pointer;
    }

    .sort-select:focus {
      outline: none;
      ring: 2px;
      ring-color: #ec4899;
      border-color: #ec4899;
    }

    .filter-actions {
      margin-top: 1.5rem;
      padding-top: 1.5rem;
      border-top: 1px solid #f3f4f6;
    }

    .clear-filters-btn {
      width: 100%;
      padding: 0.75rem;
      background: #f3f4f6;
      border: 1px solid #e5e7eb;
      border-radius: 0.5rem;
      color: #6b7280;
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .clear-filters-btn:hover {
      background: #e5e7eb;
      color: #374151;
    }

    /* Mobile adjustments */
    @media (max-width: 1024px) {
      .filters-container {
        border-radius: 0.75rem;
        padding: 1.5rem;
      }
      
      .price-inputs {
        grid-template-columns: 1fr;
        gap: 1rem;
      }
      
      .price-presets {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 0.5rem;
      }
    }
  `]
})
export class ProductFiltersComponent {
  @Input() categories: Category[] = [];
  @Input() selectedCategory: number | null = null;
  @Input() priceRange: { min: number; max: number } = { min: 0, max: 1000 };
  @Input() sortBy: string = 'name';

  @Output() categoryChange = new EventEmitter<number | null>();
  @Output() priceRangeChange = new EventEmitter<{ min: number; max: number }>();
  @Output() sortChange = new EventEmitter<string>();
  @Output() clearFilters = new EventEmitter<void>();

  pricePresets = [
    { label: 'Até R$ 50', min: 0, max: 50 },
    { label: 'R$ 50 - R$ 100', min: 50, max: 100 },
    { label: 'R$ 100 - R$ 200', min: 100, max: 200 },
    { label: 'Acima de R$ 200', min: 200, max: 1000 }
  ];

  onCategoryChange(categoryId: number | null) {
    this.categoryChange.emit(categoryId);
  }

  onPriceMinChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const min = parseInt(target.value) || 0;
    this.priceRangeChange.emit({ min, max: this.priceRange.max });
  }

  onPriceMaxChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const max = parseInt(target.value) || 1000;
    this.priceRangeChange.emit({ min: this.priceRange.min, max });
  }

  setPriceRange(min: number, max: number) {
    this.priceRangeChange.emit({ min, max });
  }

  onSortChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.sortChange.emit(target.value);
  }

  onClearFilters() {
    this.clearFilters.emit();
  }
}
