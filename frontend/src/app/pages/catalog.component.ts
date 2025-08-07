import { Component, OnInit } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { ProductService } from '../services/product.service';
import { Product, Category } from '../services/product.service';
import { ProductCardComponent } from '../components/product-card.component';
import { ProductFiltersComponent } from '../components/product-filters.component';
import { ProductSearchComponent } from '../components/product-search.component';
import { BreadcrumbComponent } from '../components/breadcrumb.component';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [
    FormsModule,
    ProductCardComponent,
    ProductFiltersComponent,
    ProductSearchComponent,
    BreadcrumbComponent
],
  template: `
    <div class="catalog-page">
      <!-- Breadcrumb -->
      <app-breadcrumb
        [items]="breadcrumbItems">
      </app-breadcrumb>
    
      <!-- Page Header -->
      <section class="catalog-header">
        <div class="container">
          <div class="header-content">
            <h1 class="page-title font-primary">
              Nosso Cardápio 🎂
            </h1>
            <p class="page-subtitle">
              Descubra todos os nossos deliciosos produtos artesanais
            </p>
          </div>
        </div>
      </section>
    
      <!-- Search Section -->
      <section class="search-section">
        <div class="container">
          <app-product-search
            (searchChange)="onSearchChange($event)"
            [placeholder]="'Buscar produtos...'">
          </app-product-search>
        </div>
      </section>
    
      <div class="catalog-content">
        <div class="container">
          <div class="catalog-layout">
    
            <!-- Sidebar Filters -->
            <aside class="catalog-sidebar">
              <app-product-filters
                [categories]="categories"
                [selectedCategory]="selectedCategoryId"
                [priceRange]="priceRange"
                [sortBy]="sortBy"
                (categoryChange)="onCategoryChange($event)"
                (priceRangeChange)="onPriceRangeChange($event)"
                (sortChange)="onSortChange($event)"
                (clearFilters)="onClearFilters()">
              </app-product-filters>
            </aside>
    
            <!-- Products Grid -->
            <main class="catalog-main">
              <!-- Results Header -->
              <div class="results-header">
                <div class="results-info">
                  <span class="results-count">
                    {{ filteredProducts.length }} produtos encontrados
                  </span>
                  @if (selectedCategory) {
                    <span class="results-category">
                      em {{ selectedCategory.name }}
                    </span>
                  }
                </div>
    
                <!-- View Toggle -->
                <div class="view-toggle">
                  <button
                    class="view-btn"
                    [class.active]="viewMode === 'grid'"
                    (click)="viewMode = 'grid'"
                    title="Visualização em grade">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M4 11h5V5H4v6zm0 7h5v-6H4v6zm6 0h5v-6h-5v6zm6 0h5v-6h-5v6zm-6-7h5V5h-5v6zm6-6v6h5V5h-5z"/>
                    </svg>
                  </button>
                  <button
                    class="view-btn"
                    [class.active]="viewMode === 'list'"
                    (click)="viewMode = 'list'"
                    title="Visualização em lista">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M4 14h4v-4H4v4zm0 5h4v-4H4v4zM4 9h4V5H4v4zm5 5h12v-4H9v4zm0 5h12v-4H9v4zM9 5v4h12V5H9z"/>
                    </svg>
                  </button>
                </div>
              </div>
    
              <!-- Products Grid/List -->
              <div class="products-container" [class]="'view-' + viewMode">
                @if (filteredProducts.length > 0) {
                  <div class="products-grid">
                    @for (product of paginatedProducts; track trackByProductId($index, product)) {
                      <app-product-card
                        [product]="product"
                        [viewMode]="viewMode"
                        (addToCart)="onAddToCart($event)"
                        (viewDetails)="onViewDetails($event)">
                      </app-product-card>
                    }
                  </div>
                }
    
                <!-- Empty State -->
                @if (filteredProducts.length === 0) {
                  <div class="empty-state">
                    <div class="empty-content">
                      <div class="empty-icon">🔍</div>
                      <h3 class="empty-title">Nenhum produto encontrado</h3>
                      <p class="empty-description">
                        Tente ajustar os filtros ou buscar por outro termo
                      </p>
                      <button class="btn btn--primary" (click)="onClearFilters()">
                        Limpar filtros
                      </button>
                    </div>
                  </div>
                }
              </div>
    
              <!-- Pagination -->
              @if (totalPages > 1) {
                <div class="pagination-container">
                  <nav class="pagination">
                    <button
                      class="pagination-btn"
                      [disabled]="currentPage === 1"
                      (click)="goToPage(currentPage - 1)">
                      ‹ Anterior
                    </button>
                    <span class="pagination-info">
                      Página {{ currentPage }} de {{ totalPages }}
                    </span>
                    <button
                      class="pagination-btn"
                      [disabled]="currentPage === totalPages"
                      (click)="goToPage(currentPage + 1)">
                      Próxima ›
                    </button>
                  </nav>
                </div>
              }
            </main>
          </div>
        </div>
      </div>
    </div>
    `,
  styles: [`
    .catalog-page {
      min-height: 100vh;
      background: #fafafa;
    }

    .catalog-header {
      background: linear-gradient(135deg, #fef7ed 0%, #fce7f3 100%);
      padding: 3rem 0 2rem;
      position: relative;
      overflow: hidden;
    }

    .catalog-header::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-image: radial-gradient(circle, #ec4899 1px, transparent 1px);
      background-size: 30px 30px;
      opacity: 0.1;
      z-index: 1;
    }

    .header-content {
      text-align: center;
      position: relative;
      z-index: 2;
    }

    .page-title {
      font-size: 3.5rem;
      color: #ec4899;
      margin-bottom: 1rem;
      text-shadow: 2px 2px 4px rgba(236, 72, 153, 0.1);
    }

    .page-subtitle {
      font-size: 1.25rem;
      color: #6b7280;
      max-width: 600px;
      margin: 0 auto;
    }

    .search-section {
      padding: 2rem 0;
      background: white;
      border-bottom: 1px solid #e5e7eb;
    }

    .catalog-content {
      padding: 2rem 0;
    }

    .catalog-layout {
      display: grid;
      grid-template-columns: 280px 1fr;
      gap: 2rem;
      align-items: start;
    }

    .catalog-sidebar {
      background: white;
      border-radius: 1rem;
      padding: 1.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      position: sticky;
      top: 100px;
    }

    .catalog-main {
      background: white;
      border-radius: 1rem;
      padding: 2rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .results-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #e5e7eb;
    }

    .results-info {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .results-count {
      font-weight: 600;
      color: #374151;
    }

    .results-category {
      color: #6b7280;
      font-style: italic;
    }

    .view-toggle {
      display: flex;
      gap: 0.5rem;
    }

    .view-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border: 1px solid #e5e7eb;
      background: white;
      border-radius: 0.5rem;
      color: #6b7280;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .view-btn:hover {
      background: #f9fafb;
      color: #374151;
    }

    .view-btn.active {
      background: #ec4899;
      color: white;
      border-color: #ec4899;
    }

    .products-container {
      margin-bottom: 2rem;
    }

    .products-grid {
      display: grid;
      gap: 1.5rem;
    }

    .view-grid .products-grid {
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    }

    .view-list .products-grid {
      grid-template-columns: 1fr;
    }

    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
    }

    .empty-content {
      max-width: 400px;
      margin: 0 auto;
    }

    .empty-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }

    .empty-title {
      font-size: 1.5rem;
      color: #374151;
      margin-bottom: 0.5rem;
    }

    .empty-description {
      color: #6b7280;
      margin-bottom: 2rem;
    }

    .pagination-container {
      display: flex;
      justify-content: center;
      margin-top: 2rem;
    }

    .pagination {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .pagination-btn {
      padding: 0.75rem 1.5rem;
      border: 1px solid #e5e7eb;
      background: white;
      border-radius: 0.5rem;
      color: #374151;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .pagination-btn:hover:not(:disabled) {
      background: #f9fafb;
    }

    .pagination-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .pagination-info {
      color: #6b7280;
      font-size: 0.875rem;
    }

    /* Responsive */
    @media (max-width: 1024px) {
      .catalog-layout {
        grid-template-columns: 1fr;
      }

      .catalog-sidebar {
        position: static;
        order: 2;
        margin-top: 2rem;
      }

      .catalog-main {
        order: 1;
      }
    }

    @media (max-width: 768px) {
      .page-title {
        font-size: 2.5rem;
      }

      .results-header {
        flex-direction: column;
        gap: 1rem;
        align-items: stretch;
      }

      .view-toggle {
        justify-content: center;
      }

      .view-grid .products-grid {
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      }

      .pagination {
        flex-direction: column;
        gap: 0.5rem;
      }
    }

    @media (max-width: 480px) {
      .catalog-header {
        padding: 2rem 0 1.5rem;
      }

      .page-title {
        font-size: 2rem;
      }

      .catalog-main,
      .catalog-sidebar {
        padding: 1.5rem;
      }

      .view-grid .products-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class CatalogComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  filteredProducts: Product[] = [];
  paginatedProducts: Product[] = [];
  
  // Filtros
  selectedCategoryId: number | null = null;
  selectedCategory: Category | null = null;
  searchTerm: string = '';
  priceRange: { min: number; max: number } = { min: 0, max: 1000 };
  sortBy: string = 'name';
  
  // Visualização
  viewMode: 'grid' | 'list' = 'grid';
  
  // Paginação
  currentPage: number = 1;
  itemsPerPage: number = 12;
  totalPages: number = 1;
  
  // Breadcrumb
  breadcrumbItems = [
    { label: 'Home', link: '/home' },
    { label: 'Cardápio', link: '/cardapio', active: true }
  ];

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.productService.getCategories().subscribe(categories => {
      this.categories = categories;
    });
    
    this.productService.getProducts().subscribe(products => {
      this.products = products;
      this.applyFilters();
    });
  }

  onSearchChange(searchTerm: string) {
    this.searchTerm = searchTerm;
    this.currentPage = 1;
    this.applyFilters();
  }

  onCategoryChange(categoryId: number | null) {
    this.selectedCategoryId = categoryId;
    this.selectedCategory = categoryId ? 
      this.categories.find(c => c.id === categoryId) || null : null;
    this.currentPage = 1;
    this.applyFilters();
  }

  onPriceRangeChange(range: { min: number; max: number }) {
    this.priceRange = range;
    this.currentPage = 1;
    this.applyFilters();
  }

  onSortChange(sortBy: string) {
    this.sortBy = sortBy;
    this.applyFilters();
  }

  onClearFilters() {
    this.selectedCategoryId = null;
    this.selectedCategory = null;
    this.searchTerm = '';
    this.priceRange = { min: 0, max: 1000 };
    this.sortBy = 'name';
    this.currentPage = 1;
    this.applyFilters();
  }

  applyFilters() {
    let filtered = [...this.products];

    // Filtro por categoria
    if (this.selectedCategoryId) {
      filtered = filtered.filter(p => p.categoryId === this.selectedCategoryId);
    }

    // Filtro por busca
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term)
      );
    }

    // Filtro por preço
    filtered = filtered.filter(p => 
      p.price >= this.priceRange.min && p.price <= this.priceRange.max
    );

    // Ordenação
    filtered.sort((a, b) => {
      switch (this.sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'featured':
          return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
        default: // name
          return a.name.localeCompare(b.name);
      }
    });

    this.filteredProducts = filtered;
    this.updatePagination();
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.filteredProducts.length / this.itemsPerPage);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedProducts = this.filteredProducts.slice(startIndex, endIndex);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  onAddToCart(product: Product) {
    // TODO: Implementar adição ao carrinho
    console.log('Adicionando ao carrinho:', product);
  }

  onViewDetails(product: Product) {
    // TODO: Implementar navegação para detalhes
    console.log('Ver detalhes:', product);
  }

  trackByProductId(index: number, product: Product): number {
    return product.id;
  }
}
