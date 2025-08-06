import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../services/product.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="product-card" [class]="'card-' + viewMode">
      <!-- Imagem do produto -->
      <div class="product-image-container">
        <div class="product-image">
          <img [src]="product.image" [alt]="product.name" class="product-img">
        </div>
        
        <!-- Badges -->
        <div class="product-badges">
          <span class="badge badge--new" *ngIf="product.featured">Destaque</span>
          <span class="badge badge--popular" *ngIf="product.rating >= 4.5">Popular</span>
          <span class="badge badge--unavailable" *ngIf="!product.inStock">Indisponível</span>
        </div>
        
        <!-- Quick actions para grid view -->
        <div class="quick-actions" *ngIf="viewMode === 'grid'">
          <button 
            class="quick-action-btn"
            (click)="onViewDetails()"
            title="Ver detalhes">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
            </svg>
          </button>
        </div>
      </div>
      
      <!-- Conteúdo do produto -->
      <div class="product-content">
        <div class="product-header">
          <div class="product-category">{{ product.category }}</div>
          <h3 class="product-title">{{ product.name }}</h3>
        </div>
        
        <p class="product-description">{{ product.description }}</p>
        
        <!-- Rating -->
        <div class="product-rating">
          <div class="stars">
            <span 
              *ngFor="let star of getStars(); let i = index"
              class="star"
              [class.filled]="star">
              ⭐
            </span>
          </div>
          <span class="rating-count">({{ product.reviewCount }})</span>
        </div>
        
        <!-- Preço e ações -->
        <div class="product-footer">
          <div class="product-price">
            <span class="price">R$ {{ formatPrice(product.price) }}</span>
          </div>
          
          <div class="product-actions">
            <button 
              class="btn btn--outline btn--sm"
              *ngIf="viewMode === 'list'"
              (click)="onViewDetails()">
              Ver Detalhes
            </button>
            
            <button 
              class="btn btn--sweet btn--sm"
              [disabled]="!product.inStock"
              (click)="onAddToCart()">
              <span *ngIf="product.inStock">Adicionar 🛒</span>
              <span *ngIf="!product.inStock">Indisponível</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .product-card {
      background: white;
      border-radius: 1rem;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      transition: all 0.3s ease;
      border: 1px solid #f3f4f6;
    }

    .product-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
    }

    /* Grid View */
    .card-grid {
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .card-grid .product-image-container {
      position: relative;
      height: 200px;
      overflow: hidden;
    }

    .card-grid .product-content {
      padding: 1.5rem;
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    /* List View */
    .card-list {
      display: flex;
      align-items: stretch;
    }

    .card-list .product-image-container {
      width: 200px;
      min-height: 150px;
    }

    .card-list .product-content {
      flex: 1;
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    /* Product Image */
    .product-image {
      width: 100%;
      height: 100%;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .product-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    /* Product Badges */
    .product-badges {
      position: absolute;
      top: 0.75rem;
      left: 0.75rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      z-index: 2;
    }

    .badge {
      padding: 0.25rem 0.5rem;
      border-radius: 0.375rem;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.025em;
    }

    .badge--new {
      background: linear-gradient(135deg, #10b981, #059669);
      color: white;
    }

    .badge--popular {
      background: linear-gradient(135deg, #f59e0b, #d97706);
      color: white;
    }

    .badge--unavailable {
      background: linear-gradient(135deg, #ef4444, #dc2626);
      color: white;
    }

    /* Quick Actions */
    .quick-actions {
      position: absolute;
      top: 0.75rem;
      right: 0.75rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .product-card:hover .quick-actions {
      opacity: 1;
    }

    .quick-action-btn {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      border: none;
      background: rgba(255, 255, 255, 0.9);
      color: #6b7280;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
      backdrop-filter: blur(4px);
    }

    .quick-action-btn:hover {
      background: white;
      color: #ec4899;
      transform: scale(1.1);
    }

    /* Product Content */
    .product-header {
      margin-bottom: 0.75rem;
    }

    .product-category {
      font-size: 0.75rem;
      font-weight: 600;
      color: #ec4899;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 0.25rem;
    }

    .product-title {
      font-size: 1.25rem;
      font-weight: 700;
      color: #111827;
      margin: 0;
      line-height: 1.3;
    }

    .card-list .product-title {
      font-size: 1.5rem;
    }

    .product-description {
      color: #6b7280;
      font-size: 0.875rem;
      line-height: 1.5;
      margin: 0 0 1rem 0;
      flex: 1;
    }

    .card-list .product-description {
      font-size: 1rem;
      margin-bottom: 1.5rem;
    }

    /* Rating */
    .product-rating {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    .stars {
      display: flex;
      gap: 0.125rem;
    }

    .star {
      font-size: 0.875rem;
      opacity: 0.3;
      transition: opacity 0.2s ease;
    }

    .star.filled {
      opacity: 1;
    }

    .rating-count {
      font-size: 0.75rem;
      color: #6b7280;
    }

    /* Product Footer */
    .product-footer {
      margin-top: auto;
    }

    .card-list .product-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .product-price {
      margin-bottom: 1rem;
    }

    .card-list .product-price {
      margin-bottom: 0;
    }

    .price {
      font-size: 1.5rem;
      font-weight: 700;
      color: #111827;
    }

    .card-list .price {
      font-size: 1.75rem;
    }

    /* Product Actions */
    .product-actions {
      display: flex;
      gap: 0.5rem;
    }

    .card-list .product-actions {
      flex-shrink: 0;
    }

    /* Buttons */
    .btn {
      padding: 0.5rem 1rem;
      border-radius: 0.5rem;
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      border: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }

    .btn--sm {
      padding: 0.375rem 0.75rem;
      font-size: 0.75rem;
    }

    .btn--sweet {
      background: linear-gradient(135deg, #ec4899, #be185d);
      color: white;
    }

    .btn--sweet:hover:not(:disabled) {
      background: linear-gradient(135deg, #be185d, #9d174d);
      transform: translateY(-1px);
    }

    .btn--outline {
      background: transparent;
      color: #6b7280;
      border: 1px solid #e5e7eb;
    }

    .btn--outline:hover {
      background: #f9fafb;
      color: #374151;
      border-color: #d1d5db;
    }

    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none !important;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .card-list {
        flex-direction: column;
      }

      .card-list .product-image-container {
        width: 100%;
        height: 200px;
      }

      .card-list .product-footer {
        flex-direction: column;
        align-items: stretch;
        gap: 1rem;
      }

      .card-list .product-actions {
        width: 100%;
      }

      .card-list .btn {
        flex: 1;
      }
    }
  `]
})
export class ProductCardComponent {
  @Input() product!: Product;
  @Input() viewMode: 'grid' | 'list' = 'grid';

  @Output() addToCart = new EventEmitter<Product>();
  @Output() viewDetails = new EventEmitter<Product>();

  getStars(): boolean[] {
    const fullStars = Math.floor(this.product.rating);
    const hasHalfStar = this.product.rating % 1 >= 0.5;
    const stars: boolean[] = [];
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(true);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(true);
      } else {
        stars.push(false);
      }
    }
    
    return stars;
  }

  formatPrice(price: number): string {
    return price.toFixed(2).replace('.', ',');
  }

  onAddToCart() {
    if (this.product.inStock) {
      this.addToCart.emit(this.product);
    }
  }

  onViewDetails() {
    this.viewDetails.emit(this.product);
  }
}
