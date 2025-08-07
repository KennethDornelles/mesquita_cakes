import { Component, Input, Output, EventEmitter } from '@angular/core';

import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-search',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="search-container">
      <div class="search-input-wrapper">
        <div class="search-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
        </div>
    
        <input
          type="text"
          class="search-input"
          [placeholder]="placeholder"
          [value]="searchTerm"
          (input)="onSearchInput($event)"
          (keydown.enter)="onSearchSubmit()">
    
        @if (searchTerm) {
          <button
            class="clear-search-btn"
            (click)="clearSearch()"
            title="Limpar busca">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        }
      </div>
    
      <!-- Sugestões de busca -->
      @if (showSuggestions && suggestions.length > 0) {
        <div class="search-suggestions">
          <div class="suggestions-header">
            <span class="suggestions-title">Sugestões populares:</span>
          </div>
          <div class="suggestions-list">
            @for (suggestion of suggestions; track suggestion) {
              <button
                class="suggestion-item"
                (click)="applySuggestion(suggestion)">
                {{ suggestion }}
              </button>
            }
          </div>
        </div>
      }
    </div>
    `,
  styles: [`
    .search-container {
      position: relative;
      max-width: 600px;
      margin: 0 auto;
    }

    .search-input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
      background: white;
      border: 2px solid #e5e7eb;
      border-radius: 2rem;
      padding: 0.75rem 1.5rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
    }

    .search-input-wrapper:focus-within {
      border-color: #ec4899;
      box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.1);
    }

    .search-icon {
      color: #9ca3af;
      margin-right: 0.75rem;
      flex-shrink: 0;
    }

    .search-input {
      flex: 1;
      border: none;
      outline: none;
      font-size: 1rem;
      color: #374151;
      background: transparent;
    }

    .search-input::placeholder {
      color: #9ca3af;
    }

    .clear-search-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      background: #f3f4f6;
      border: none;
      border-radius: 50%;
      color: #6b7280;
      cursor: pointer;
      transition: all 0.2s ease;
      margin-left: 0.5rem;
    }

    .clear-search-btn:hover {
      background: #e5e7eb;
      color: #374151;
    }

    .search-suggestions {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 0.75rem;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      margin-top: 0.5rem;
      z-index: 10;
      overflow: hidden;
    }

    .suggestions-header {
      padding: 0.75rem 1rem;
      background: #f9fafb;
      border-bottom: 1px solid #e5e7eb;
    }

    .suggestions-title {
      font-size: 0.875rem;
      color: #6b7280;
      font-weight: 500;
    }

    .suggestions-list {
      padding: 0.5rem;
    }

    .suggestion-item {
      display: block;
      width: 100%;
      padding: 0.75rem 1rem;
      text-align: left;
      border: none;
      background: none;
      color: #374151;
      cursor: pointer;
      border-radius: 0.5rem;
      transition: background-color 0.2s ease;
      font-size: 0.875rem;
    }

    .suggestion-item:hover {
      background: #f3f4f6;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .search-container {
        max-width: 100%;
      }

      .search-input-wrapper {
        padding: 0.625rem 1.25rem;
      }

      .search-input {
        font-size: 0.875rem;
      }

      .suggestions-list {
        max-height: 200px;
        overflow-y: auto;
      }
    }
  `]
})
export class ProductSearchComponent {
  @Input() placeholder: string = 'Buscar produtos...';
  @Input() showSuggestions: boolean = true;
  
  @Output() searchChange = new EventEmitter<string>();

  searchTerm: string = '';
  
  suggestions: string[] = [
    'Bolo de chocolate',
    'Torta de morango',
    'Cupcakes',
    'Brigadeiro gourmet',
    'Cheesecake',
    'Brownie',
    'Bolo red velvet',
    'Torta de limão'
  ];

  onSearchInput(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchTerm = target.value;
    this.searchChange.emit(this.searchTerm);
  }

  onSearchSubmit() {
    this.searchChange.emit(this.searchTerm);
  }

  clearSearch() {
    this.searchTerm = '';
    this.searchChange.emit('');
  }

  applySuggestion(suggestion: string) {
    this.searchTerm = suggestion;
    this.searchChange.emit(suggestion);
  }
}
