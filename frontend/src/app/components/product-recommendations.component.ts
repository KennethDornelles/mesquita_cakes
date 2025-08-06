import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-product-recommendations',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="product-recommendations">
      <!-- Related Products -->
      <div *ngIf="relatedProducts.length > 0" class="recommendation-section">
        <h3 class="section-title">
          <span class="title-icon">🍰</span>
          Produtos Relacionados
        </h3>
        <p class="section-description">Outros sabores que você pode gostar</p>
        
        <div class="products-grid">
          <div *ngFor="let product of relatedProducts" class="product-card" (click)="navigateToProduct(product.id)">
            <div class="product-image">
              <img [src]="product.image" [alt]="product.name" loading="lazy">
              <div class="product-badges">
                <span *ngIf="product.isNew" class="badge badge--new">Novo</span>
                <span *ngIf="product.discount > 0" class="badge badge--sale">{{ product.discount }}% OFF</span>
              </div>
              <button class="wishlist-btn" (click)="toggleWishlist(product, $event)">
                <span *ngIf="!isInWishlist(product.id)">🤍</span>
                <span *ngIf="isInWishlist(product.id)">❤️</span>
              </button>
            </div>
            
            <div class="product-info">
              <h4 class="product-name">{{ product.name }}</h4>
              <div class="product-rating">
                <div class="rating-stars">
                  <span 
                    *ngFor="let star of getStars(product.rating); let i = index"
                    class="star"
                    [class.filled]="star">
                    ⭐
                  </span>
                </div>
                <span class="rating-count">({{ product.reviewCount }})</span>
              </div>
              
              <div class="product-pricing">
                <span *ngIf="product.discount > 0" class="original-price">
                  R$ {{ product.originalPrice?.toFixed(2).replace('.', ',') }}
                </span>
                <span class="current-price">
                  R$ {{ getCurrentPrice(product).toFixed(2).replace('.', ',') }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Frequently Bought Together -->
      <div *ngIf="frequentlyBought.length > 0" class="recommendation-section">
        <h3 class="section-title">
          <span class="title-icon">👥</span>
          Frequentemente Comprados Juntos
        </h3>
        <p class="section-description">Clientes que compraram este item também levaram</p>
        
        <div class="bundle-container">
          <div class="bundle-items">
            <!-- Current Product -->
            <div class="bundle-item current-product">
              <img [src]="currentProduct.image" [alt]="currentProduct.name">
              <span class="product-name">{{ currentProduct.name }}</span>
              <span class="product-price">R$ {{ getCurrentPrice(currentProduct).toFixed(2).replace('.', ',') }}</span>
            </div>
            
            <!-- Plus Icon -->
            <div class="bundle-plus">+</div>
            
            <!-- Frequently Bought Products -->
            <div *ngFor="let product of frequentlyBought; let last = last" class="bundle-group">
              <div class="bundle-item">
                <img [src]="product.image" [alt]="product.name">
                <span class="product-name">{{ product.name }}</span>
                <span class="product-price">R$ {{ getCurrentPrice(product).toFixed(2).replace('.', ',') }}</span>
                <label class="bundle-checkbox">
                  <input 
                    type="checkbox" 
                    [checked]="isBundleSelected(product.id)"
                    (change)="toggleBundleItem(product)">
                  <span class="checkmark"></span>
                </label>
              </div>
              <div *ngIf="!last" class="bundle-plus">+</div>
            </div>
          </div>
          
          <!-- Bundle Summary -->
          <div *ngIf="selectedBundleItems.length > 0" class="bundle-summary">
            <div class="bundle-total">
              <span class="total-label">Total do pacote:</span>
              <div class="total-pricing">
                <span class="original-total">R$ {{ getBundleOriginalTotal().toFixed(2).replace('.', ',') }}</span>
                <span class="discounted-total">R$ {{ getBundleDiscountedTotal().toFixed(2).replace('.', ',') }}</span>
              </div>
              <span class="savings">Economize R$ {{ getBundleSavings().toFixed(2).replace('.', ',') }}</span>
            </div>
            
            <button class="btn btn--sweet bundle-btn" (click)="addBundleToCart()">
              🛒 Adicionar Pacote ao Carrinho
            </button>
          </div>
        </div>
      </div>

      <!-- Recently Viewed -->
      <div *ngIf="recentlyViewed.length > 0" class="recommendation-section">
        <h3 class="section-title">
          <span class="title-icon">👁️</span>
          Vistos Recentemente
        </h3>
        <p class="section-description">Continue de onde parou</p>
        
        <div class="products-carousel">
          <div class="carousel-container" #carouselContainer>
            <div *ngFor="let product of recentlyViewed" class="carousel-item">
              <div class="product-card compact" (click)="navigateToProduct(product.id)">
                <div class="product-image">
                  <img [src]="product.image" [alt]="product.name" loading="lazy">
                </div>
                <div class="product-info">
                  <h5 class="product-name">{{ product.name }}</h5>
                  <span class="product-price">R$ {{ getCurrentPrice(product).toFixed(2).replace('.', ',') }}</span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Carousel Controls -->
          <button 
            *ngIf="canScrollLeft" 
            class="carousel-btn carousel-btn--prev"
            (click)="scrollCarousel('left')">
            ‹
          </button>
          <button 
            *ngIf="canScrollRight" 
            class="carousel-btn carousel-btn--next"
            (click)="scrollCarousel('right')">
            ›
          </button>
        </div>
      </div>

      <!-- You May Also Like -->
      <div *ngIf="suggestedProducts.length > 0" class="recommendation-section">
        <h3 class="section-title">
          <span class="title-icon">✨</span>
          Você Também Pode Gostar
        </h3>
        <p class="section-description">Baseado no seu histórico de navegação</p>
        
        <div class="products-grid">
          <div *ngFor="let product of suggestedProducts" class="product-card" (click)="navigateToProduct(product.id)">
            <div class="product-image">
              <img [src]="product.image" [alt]="product.name" loading="lazy">
              <div class="product-badges">
                <span *ngIf="product.featured" class="badge badge--featured">⭐ Destaque</span>
                <span *ngIf="product.isPopular" class="badge badge--popular">🔥 Popular</span>
              </div>
              <button class="wishlist-btn" (click)="toggleWishlist(product, $event)">
                <span *ngIf="!isInWishlist(product.id)">🤍</span>
                <span *ngIf="isInWishlist(product.id)">❤️</span>
              </button>
            </div>
            
            <div class="product-info">
              <h4 class="product-name">{{ product.name }}</h4>
              <div class="product-rating">
                <div class="rating-stars">
                  <span 
                    *ngFor="let star of getStars(product.rating); let i = index"
                    class="star"
                    [class.filled]="star">
                    ⭐
                  </span>
                </div>
                <span class="rating-count">({{ product.reviewCount }})</span>
              </div>
              
              <div class="product-pricing">
                <span *ngIf="product.discount > 0" class="original-price">
                  R$ {{ product.originalPrice?.toFixed(2).replace('.', ',') }}
                </span>
                <span class="current-price">
                  R$ {{ getCurrentPrice(product).toFixed(2).replace('.', ',') }}
                </span>
              </div>
              
              <button class="btn btn--outline product-btn" (click)="quickAddToCart(product, $event)">
                Adicionar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .product-recommendations {
      display: flex;
      flex-direction: column;
      gap: 3rem;
    }

    .recommendation-section {
      background: white;
      border-radius: 1rem;
      padding: 2rem;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    }

    .section-title {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 1.5rem;
      font-weight: 700;
      color: #111827;
      margin: 0 0 0.5rem 0;
    }

    .title-icon {
      font-size: 1.75rem;
    }

    .section-description {
      color: #6b7280;
      margin: 0 0 2rem 0;
      font-size: 1.125rem;
    }

    /* Products Grid */
    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.5rem;
    }

    .product-card {
      border: 1px solid #e5e7eb;
      border-radius: 1rem;
      overflow: hidden;
      cursor: pointer;
      transition: all 0.3s ease;
      background: white;
    }

    .product-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
      border-color: #ec4899;
    }

    .product-image {
      position: relative;
      aspect-ratio: 1;
      overflow: hidden;
    }

    .product-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    .product-card:hover .product-image img {
      transform: scale(1.05);
    }

    .product-badges {
      position: absolute;
      top: 0.75rem;
      left: 0.75rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .badge {
      padding: 0.25rem 0.75rem;
      border-radius: 1rem;
      font-size: 0.75rem;
      font-weight: 600;
      backdrop-filter: blur(10px);
    }

    .badge--new {
      background: rgba(16, 185, 129, 0.9);
      color: white;
    }

    .badge--sale {
      background: rgba(239, 68, 68, 0.9);
      color: white;
    }

    .badge--featured {
      background: rgba(251, 191, 36, 0.9);
      color: white;
    }

    .badge--popular {
      background: rgba(236, 72, 153, 0.9);
      color: white;
    }

    .wishlist-btn {
      position: absolute;
      top: 0.75rem;
      right: 0.75rem;
      width: 2.5rem;
      height: 2.5rem;
      border: none;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(10px);
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
    }

    .wishlist-btn:hover {
      background: white;
      transform: scale(1.1);
    }

    .product-info {
      padding: 1.25rem;
    }

    .product-name {
      font-weight: 600;
      color: #111827;
      margin: 0 0 0.75rem 0;
      line-height: 1.4;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .product-rating {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.75rem;
    }

    .rating-stars .star {
      font-size: 1rem;
      color: #d1d5db;
    }

    .rating-stars .star.filled {
      color: #fbbf24;
    }

    .rating-count {
      color: #6b7280;
      font-size: 0.875rem;
    }

    .product-pricing {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1rem;
    }

    .original-price {
      color: #6b7280;
      text-decoration: line-through;
      font-size: 0.875rem;
    }

    .current-price {
      font-size: 1.25rem;
      font-weight: 700;
      color: #111827;
    }

    .product-btn {
      width: 100%;
      padding: 0.75rem;
      font-weight: 600;
    }

    /* Bundle Container */
    .bundle-container {
      background: #f8fafc;
      border-radius: 1rem;
      padding: 2rem;
    }

    .bundle-items {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 2rem;
      flex-wrap: wrap;
      justify-content: center;
    }

    .bundle-group {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .bundle-item {
      background: white;
      border-radius: 1rem;
      padding: 1rem;
      text-align: center;
      min-width: 180px;
      border: 2px solid #e5e7eb;
      transition: all 0.3s ease;
      position: relative;
    }

    .bundle-item.current-product {
      border-color: #ec4899;
      background: linear-gradient(135deg, #fdf2f8, #fce7f3);
    }

    .bundle-item img {
      width: 80px;
      height: 80px;
      object-fit: cover;
      border-radius: 0.5rem;
      margin-bottom: 0.75rem;
    }

    .bundle-item .product-name {
      display: block;
      font-weight: 600;
      color: #111827;
      margin-bottom: 0.5rem;
      font-size: 0.875rem;
    }

    .bundle-item .product-price {
      color: #ec4899;
      font-weight: 700;
      font-size: 1rem;
    }

    .bundle-checkbox {
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      cursor: pointer;
    }

    .bundle-checkbox input {
      display: none;
    }

    .checkmark {
      width: 1.5rem;
      height: 1.5rem;
      border: 2px solid #d1d5db;
      border-radius: 0.25rem;
      display: block;
      position: relative;
      transition: all 0.3s ease;
    }

    .bundle-checkbox input:checked + .checkmark {
      background: #ec4899;
      border-color: #ec4899;
    }

    .bundle-checkbox input:checked + .checkmark::after {
      content: '✓';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: white;
      font-weight: bold;
      font-size: 0.875rem;
    }

    .bundle-plus {
      font-size: 2rem;
      font-weight: 700;
      color: #6b7280;
      flex-shrink: 0;
    }

    .bundle-summary {
      background: white;
      border-radius: 1rem;
      padding: 1.5rem;
      border: 2px solid #ec4899;
    }

    .bundle-total {
      text-align: center;
      margin-bottom: 1.5rem;
    }

    .total-label {
      display: block;
      color: #6b7280;
      margin-bottom: 0.5rem;
    }

    .total-pricing {
      margin-bottom: 0.5rem;
    }

    .original-total {
      color: #6b7280;
      text-decoration: line-through;
      margin-right: 0.75rem;
    }

    .discounted-total {
      font-size: 1.5rem;
      font-weight: 700;
      color: #111827;
    }

    .savings {
      color: #10b981;
      font-weight: 600;
      background: #d1fae5;
      padding: 0.25rem 0.75rem;
      border-radius: 0.5rem;
      font-size: 0.875rem;
    }

    .bundle-btn {
      width: 100%;
      padding: 1rem;
      font-size: 1.125rem;
      font-weight: 600;
    }

    /* Carousel */
    .products-carousel {
      position: relative;
    }

    .carousel-container {
      display: flex;
      gap: 1rem;
      overflow-x: auto;
      scroll-behavior: smooth;
      padding-bottom: 1rem;
      scrollbar-width: none;
      -ms-overflow-style: none;
    }

    .carousel-container::-webkit-scrollbar {
      display: none;
    }

    .carousel-item {
      flex-shrink: 0;
      width: 200px;
    }

    .product-card.compact {
      width: 100%;
    }

    .product-card.compact .product-info {
      padding: 1rem;
    }

    .product-card.compact .product-name {
      font-size: 0.875rem;
      margin-bottom: 0.5rem;
    }

    .product-card.compact .product-price {
      font-size: 1rem;
      font-weight: 700;
      color: #ec4899;
    }

    .carousel-btn {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 3rem;
      height: 3rem;
      border: none;
      border-radius: 50%;
      background: white;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      cursor: pointer;
      font-size: 1.5rem;
      font-weight: 700;
      color: #374151;
      transition: all 0.3s ease;
      z-index: 2;
    }

    .carousel-btn:hover {
      background: #ec4899;
      color: white;
      transform: translateY(-50%) scale(1.1);
    }

    .carousel-btn--prev {
      left: -1.5rem;
    }

    .carousel-btn--next {
      right: -1.5rem;
    }

    /* Responsive Design */
    @media (max-width: 1024px) {
      .products-grid {
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      }
      
      .bundle-items {
        flex-direction: column;
        gap: 1.5rem;
      }
      
      .bundle-group {
        flex-direction: column;
        gap: 1rem;
      }
      
      .bundle-plus {
        transform: rotate(90deg);
      }
    }

    @media (max-width: 768px) {
      .recommendation-section {
        padding: 1.5rem;
      }

      .products-grid {
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 1rem;
      }

      .section-title {
        font-size: 1.25rem;
      }

      .carousel-btn--prev {
        left: -0.75rem;
      }

      .carousel-btn--next {
        right: -0.75rem;
      }

      .bundle-item {
        min-width: 150px;
      }
    }
  `]
})
export class ProductRecommendationsComponent implements OnInit {
  @Input() currentProduct: any = {};
  @Input() relatedProducts: any[] = [];
  @Input() frequentlyBought: any[] = [];
  @Input() recentlyViewed: any[] = [];
  @Input() suggestedProducts: any[] = [];

  selectedBundleItems: any[] = [];
  wishlistItems = new Set<number>();
  canScrollLeft = false;
  canScrollRight = true;

  constructor(private router: Router) {}

  ngOnInit() {
    // Simular itens da wishlist do localStorage
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      const wishlist = JSON.parse(savedWishlist);
      wishlist.forEach((id: number) => this.wishlistItems.add(id));
    }

    // Pré-selecionar primeiro item do bundle
    if (this.frequentlyBought.length > 0) {
      this.selectedBundleItems.push(this.frequentlyBought[0]);
    }
  }

  getStars(rating: number) {
    return Array(5).fill(false).map((_, i) => i < Math.floor(rating || 0));
  }

  getCurrentPrice(product: any): number {
    if (product.discount > 0 && product.originalPrice) {
      return product.originalPrice * (1 - product.discount / 100);
    }
    return product.price || 0;
  }

  navigateToProduct(productId: number) {
    this.router.navigate(['/produto', productId]);
  }

  toggleWishlist(product: any, event: Event) {
    event.stopPropagation();
    
    if (this.wishlistItems.has(product.id)) {
      this.wishlistItems.delete(product.id);
    } else {
      this.wishlistItems.add(product.id);
    }
    
    // Salvar no localStorage
    localStorage.setItem('wishlist', JSON.stringify([...this.wishlistItems]));
  }

  isInWishlist(productId: number): boolean {
    return this.wishlistItems.has(productId);
  }

  isBundleSelected(productId: number): boolean {
    return this.selectedBundleItems.some(item => item.id === productId);
  }

  toggleBundleItem(product: any) {
    const index = this.selectedBundleItems.findIndex(item => item.id === product.id);
    if (index > -1) {
      this.selectedBundleItems.splice(index, 1);
    } else {
      this.selectedBundleItems.push(product);
    }
  }

  getBundleOriginalTotal(): number {
    let total = this.getCurrentPrice(this.currentProduct);
    this.selectedBundleItems.forEach(item => {
      total += this.getCurrentPrice(item);
    });
    return total;
  }

  getBundleDiscountedTotal(): number {
    const original = this.getBundleOriginalTotal();
    return original * 0.9; // 10% de desconto no bundle
  }

  getBundleSavings(): number {
    return this.getBundleOriginalTotal() - this.getBundleDiscountedTotal();
  }

  addBundleToCart() {
    const bundleItems = [this.currentProduct, ...this.selectedBundleItems];
    console.log('Adicionando bundle ao carrinho:', bundleItems);
    // Implementar lógica de adicionar bundle ao carrinho
  }

  quickAddToCart(product: any, event: Event) {
    event.stopPropagation();
    console.log('Adicionando ao carrinho:', product);
    // Implementar lógica de adição rápida ao carrinho
  }

  scrollCarousel(direction: 'left' | 'right') {
    const container = document.querySelector('.carousel-container') as HTMLElement;
    if (container) {
      const scrollAmount = 220; // Width of item + gap
      const newScrollLeft = direction === 'left' 
        ? container.scrollLeft - scrollAmount
        : container.scrollLeft + scrollAmount;
      
      container.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
      
      // Update button states
      setTimeout(() => {
        this.canScrollLeft = container.scrollLeft > 0;
        this.canScrollRight = container.scrollLeft < container.scrollWidth - container.clientWidth;
      }, 300);
    }
  }
}
