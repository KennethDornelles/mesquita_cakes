import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService, Product } from '../services/product.service';
import { BreadcrumbComponent } from '../components/breadcrumb.component';
import { ProductCardComponent } from '../components/product-card.component';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, BreadcrumbComponent, ProductCardComponent],
  template: `
    <div class="product-detail-page" *ngIf="product">
      
      <!-- Breadcrumb -->
      <app-breadcrumb [items]="breadcrumbItems"></app-breadcrumb>
      
      <!-- Product Detail -->
      <section class="product-detail-section">
        <div class="container">
          <div class="product-detail-grid">
            
            <!-- Product Image -->
            <div class="product-image-section">
              <div class="main-image">
                <img [src]="product.image" [alt]="product.name" class="product-image-large">
                
                <!-- Badges -->
                <div class="product-badges">
                  <span class="badge badge--new" *ngIf="product.featured">🆕 Destaque</span>
                  <span class="badge badge--popular" *ngIf="product.rating >= 4.5">🔥 Popular</span>
                  <span class="badge badge--unavailable" *ngIf="!product.inStock">❌ Indisponível</span>
                </div>
              </div>
            </div>
            
            <!-- Product Info -->
            <div class="product-info-section">
              <div class="product-header">
                <div class="category-badge">{{ product.category }}</div>
                <h1 class="product-title">{{ product.name }}</h1>
                
                <!-- Rating -->
                <div class="product-rating">
                  <div class="stars-large">
                    <span 
                      *ngFor="let star of getStars(); let i = index"
                      class="star-large"
                      [class.filled]="star">
                      ⭐
                    </span>
                  </div>
                  <span class="rating-text-large">
                    {{ product.rating }} de 5 estrelas ({{ product.reviewCount }} avaliações)
                  </span>
                </div>
              </div>
              
              <div class="product-description-section">
                <h3 class="section-title">Descrição</h3>
                <p class="product-description-full">{{ product.description }}</p>
              </div>
              
              <!-- Ingredients -->
              <div class="ingredients-section" *ngIf="product.ingredients">
                <h3 class="section-title">🥄 Ingredientes</h3>
                <div class="ingredients-grid">
                  <span 
                    *ngFor="let ingredient of product.ingredients"
                    class="ingredient-tag">
                    {{ ingredient }}
                  </span>
                </div>
              </div>
              
              <!-- Nutritional Info -->
              <div class="nutrition-section" *ngIf="product.nutritionalInfo">
                <h3 class="section-title">📊 Informação Nutricional</h3>
                <div class="nutrition-grid">
                  <div class="nutrition-item">
                    <span class="nutrition-label">Calorias</span>
                    <span class="nutrition-value">{{ product.nutritionalInfo.calories }} kcal</span>
                  </div>
                  <div class="nutrition-item">
                    <span class="nutrition-label">Carboidratos</span>
                    <span class="nutrition-value">{{ product.nutritionalInfo.carbs }}g</span>
                  </div>
                  <div class="nutrition-item">
                    <span class="nutrition-label">Proteínas</span>
                    <span class="nutrition-value">{{ product.nutritionalInfo.protein }}g</span>
                  </div>
                  <div class="nutrition-item">
                    <span class="nutrition-label">Gorduras</span>
                    <span class="nutrition-value">{{ product.nutritionalInfo.fat }}g</span>
                  </div>
                </div>
              </div>
              
              <!-- Price and Actions -->
              <div class="purchase-section">
                <div class="price-section">
                  <span class="price-large">R$ {{ formatPrice(product.price) }}</span>
                  <span class="price-label-large">por unidade</span>
                </div>
                
                <div class="quantity-selector">
                  <label class="quantity-label">Quantidade:</label>
                  <div class="quantity-controls">
                    <button 
                      class="quantity-btn"
                      (click)="decreaseQuantity()"
                      [disabled]="quantity <= 1">
                      -
                    </button>
                    <span class="quantity-display">{{ quantity }}</span>
                    <button 
                      class="quantity-btn"
                      (click)="increaseQuantity()">
                      +
                    </button>
                  </div>
                </div>
                
                <div class="total-price">
                  <span class="total-label">Total:</span>
                  <span class="total-value">R$ {{ formatPrice(product.price * quantity) }}</span>
                </div>
                
                <div class="action-buttons">
                  <button 
                    class="btn btn--sweet btn--lg btn--full"
                    [disabled]="!product.inStock"
                    (click)="addToCart()">
                    <span *ngIf="product.inStock">🛒 Adicionar ao Carrinho</span>
                    <span *ngIf="!product.inStock">Produto Indisponível</span>
                  </button>
                  
                  <button 
                    class="btn btn--outline btn--lg btn--full"
                    (click)="orderViaWhatsApp()">
                    💬 Pedir pelo WhatsApp
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <!-- Related Products -->
      <section class="related-products-section" *ngIf="relatedProducts.length > 0">
        <div class="container">
          <h2 class="section-title-large">Produtos Relacionados</h2>
          <p class="section-subtitle">Outros produtos que você pode gostar</p>
          
          <div class="related-products-grid">
            <app-product-card
              *ngFor="let relatedProduct of relatedProducts"
              [product]="relatedProduct"
              [viewMode]="'grid'"
              (addToCart)="onAddToCart($event)"
              (viewDetails)="onViewDetails($event)">
            </app-product-card>
          </div>
        </div>
      </section>
    </div>
    
    <!-- Loading State -->
    <div class="loading-state" *ngIf="!product && !notFound">
      <div class="loading-content">
        <div class="loading-spinner">🍰</div>
        <p>Carregando produto...</p>
      </div>
    </div>
    
    <!-- Not Found State -->
    <div class="not-found-state" *ngIf="notFound">
      <div class="container">
        <div class="not-found-content">
          <div class="not-found-icon">😔</div>
          <h2>Produto não encontrado</h2>
          <p>O produto que você está procurando não existe ou foi removido.</p>
          <button class="btn btn--primary" (click)="goToMenu()">
            Ver Cardápio Completo
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .product-detail-page {
      min-height: 100vh;
      background: #fafafa;
    }

    .product-detail-section {
      padding: 2rem 0;
    }

    .product-detail-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4rem;
      align-items: start;
    }

    .product-image-section {
      position: sticky;
      top: 100px;
    }

    .main-image {
      background: white;
      border-radius: 1.5rem;
      padding: 3rem;
      box-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.1);
      aspect-ratio: 1;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .product-image-large {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 1rem;
    }

    .product-background-large {
      position: absolute;
      inset: 0;
      border-radius: 1rem;
      opacity: 0.7;
      z-index: 1;
    }

    .product-badges {
      position: absolute;
      top: 1.5rem;
      left: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      z-index: 3;
    }

    .badge {
      padding: 0.5rem 1rem;
      border-radius: 1.5rem;
      font-size: 0.875rem;
      font-weight: 600;
      color: white;
      backdrop-filter: blur(10px);
    }

    .badge--new {
      background: linear-gradient(135deg, #10b981, #059669);
    }

    .badge--popular {
      background: linear-gradient(135deg, #f59e0b, #d97706);
    }

    .badge--unavailable {
      background: linear-gradient(135deg, #ef4444, #dc2626);
    }

    .product-info-section {
      background: white;
      border-radius: 1.5rem;
      padding: 2.5rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }

    .product-header {
      margin-bottom: 2rem;
    }

    .category-badge {
      display: inline-block;
      padding: 0.5rem 1rem;
      background: linear-gradient(135deg, #ec4899, #be185d);
      color: white;
      border-radius: 1rem;
      font-size: 0.875rem;
      font-weight: 600;
      margin-bottom: 1rem;
    }

    .product-title {
      font-size: 2.5rem;
      font-weight: 700;
      color: #374151;
      font-family: 'Fredoka One', cursive;
      margin-bottom: 1rem;
      line-height: 1.2;
    }

    .product-rating {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .stars-large {
      display: flex;
      gap: 0.25rem;
    }

    .star-large {
      font-size: 1.5rem;
      opacity: 0.3;
      transition: opacity 0.2s ease;
    }

    .star-large.filled {
      opacity: 1;
    }

    .rating-text-large {
      color: #6b7280;
      font-size: 1rem;
    }

    .section-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: #374151;
      margin-bottom: 1rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .product-description-section {
      margin-bottom: 2rem;
      padding-bottom: 2rem;
      border-bottom: 1px solid #e5e7eb;
    }

    .product-description-full {
      color: #6b7280;
      font-size: 1.125rem;
      line-height: 1.7;
    }

    .ingredients-section {
      margin-bottom: 2rem;
      padding-bottom: 2rem;
      border-bottom: 1px solid #e5e7eb;
    }

    .ingredients-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
    }

    .ingredient-tag {
      padding: 0.5rem 1rem;
      background: #f3f4f6;
      border-radius: 1rem;
      font-size: 0.875rem;
      color: #374151;
      border: 1px solid #e5e7eb;
    }

    .nutrition-section {
      margin-bottom: 2rem;
      padding-bottom: 2rem;
      border-bottom: 1px solid #e5e7eb;
    }

    .nutrition-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
    }

    .nutrition-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem;
      background: #f9fafb;
      border-radius: 0.5rem;
    }

    .nutrition-label {
      font-weight: 500;
      color: #374151;
    }

    .nutrition-value {
      font-weight: 600;
      color: #ec4899;
    }

    .purchase-section {
      background: #f9fafb;
      border-radius: 1rem;
      padding: 2rem;
    }

    .price-section {
      text-align: center;
      margin-bottom: 1.5rem;
    }

    .price-large {
      font-size: 3rem;
      font-weight: 700;
      color: #ec4899;
      font-family: 'Fredoka One', cursive;
      display: block;
    }

    .price-label-large {
      color: #6b7280;
      font-size: 1rem;
    }

    .quantity-selector {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1.5rem;
    }

    .quantity-label {
      font-weight: 600;
      color: #374151;
    }

    .quantity-controls {
      display: flex;
      align-items: center;
      background: white;
      border-radius: 0.5rem;
      border: 1px solid #e5e7eb;
    }

    .quantity-btn {
      width: 40px;
      height: 40px;
      border: none;
      background: none;
      cursor: pointer;
      font-size: 1.25rem;
      font-weight: 600;
      color: #6b7280;
      transition: color 0.2s ease;
    }

    .quantity-btn:hover:not(:disabled) {
      color: #ec4899;
    }

    .quantity-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .quantity-display {
      min-width: 60px;
      text-align: center;
      font-size: 1.125rem;
      font-weight: 600;
      color: #374151;
    }

    .total-price {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      padding: 1rem;
      background: white;
      border-radius: 0.5rem;
      border: 2px solid #ec4899;
    }

    .total-label {
      font-size: 1.125rem;
      font-weight: 600;
      color: #374151;
    }

    .total-value {
      font-size: 1.5rem;
      font-weight: 700;
      color: #ec4899;
      font-family: 'Fredoka One', cursive;
    }

    .action-buttons {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .related-products-section {
      padding: 4rem 0;
      background: white;
    }

    .section-title-large {
      font-size: 2rem;
      font-weight: 700;
      color: #374151;
      text-align: center;
      margin-bottom: 0.5rem;
    }

    .section-subtitle {
      text-align: center;
      color: #6b7280;
      font-size: 1.125rem;
      margin-bottom: 3rem;
    }

    .related-products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 2rem;
    }

    .loading-state,
    .not-found-state {
      min-height: 50vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .loading-content,
    .not-found-content {
      text-align: center;
    }

    .loading-spinner {
      font-size: 4rem;
      animation: bounce 1s infinite;
    }

    .not-found-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }

    @keyframes bounce {
      0%, 20%, 50%, 80%, 100% {
        transform: translateY(0);
      }
      40% {
        transform: translateY(-10px);
      }
      60% {
        transform: translateY(-5px);
      }
    }

    /* Responsive */
    @media (max-width: 1024px) {
      .product-detail-grid {
        grid-template-columns: 1fr;
        gap: 2rem;
      }

      .product-image-section {
        position: static;
      }

      .main-image {
        aspect-ratio: 4/3;
      }
    }

    @media (max-width: 768px) {
      .product-title {
        font-size: 2rem;
      }

      .price-large {
        font-size: 2.5rem;
      }

      .nutrition-grid {
        grid-template-columns: 1fr;
      }

      .related-products-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  relatedProducts: Product[] = [];
  quantity: number = 1;
  notFound: boolean = false;
  breadcrumbItems: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const slug = params['slug'];
      this.loadProduct(slug);
    });
  }

  loadProduct(slug: string) {
    this.productService.getProductBySlug(slug).subscribe((product: Product | undefined) => {
      if (product) {
        this.product = product;
        this.updateBreadcrumb();
        this.loadRelatedProducts();
      } else {
        this.notFound = true;
      }
    });
  }

  updateBreadcrumb() {
    if (!this.product) return;

    this.breadcrumbItems = [
      { label: 'Home', link: '/home' },
      { label: 'Cardápio', link: '/cardapio' },
      { label: this.product.category, link: `/cardapio?categoria=${this.product.categoryId}` },
      { label: this.product.name, active: true }
    ];
  }

  loadRelatedProducts() {
    if (!this.product) return;

    this.productService.getRelatedProducts(this.product.categoryId, this.product.id).subscribe((products: Product[]) => {
      this.relatedProducts = products;
    });
  }

  getStars() {
    if (!this.product) return [];

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
    return price.toLocaleString('pt-BR', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });
  }

  generateBackground(): string {
    if (!this.product) return '';

    const gradients = {
      1: 'linear-gradient(135deg, #fef7ed, #fed7aa)',
      2: 'linear-gradient(135deg, #f0fdf4, #bbf7d0)',
      3: 'linear-gradient(135deg, #fef2f2, #fecaca)',
      4: 'linear-gradient(135deg, #f0f9ff, #bae6fd)',
      5: 'linear-gradient(135deg, #faf5ff, #e9d5ff)'
    };
    
    return gradients[this.product.categoryId as keyof typeof gradients] || gradients[1];
  }

  increaseQuantity() {
    this.quantity++;
  }

  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart() {
    if (this.product) {
      // TODO: Implementar adição ao carrinho
      console.log('Adicionando ao carrinho:', this.product, 'Quantidade:', this.quantity);
    }
  }

  orderViaWhatsApp() {
    if (!this.product) return;

    const message = encodeURIComponent(
      `Olá! Gostaria de pedir:\n\n` +
      `🎂 ${this.product.name}\n` +
      `📦 Quantidade: ${this.quantity}\n` +
      `💰 Total: R$ ${this.formatPrice(this.product.price * this.quantity)}\n\n` +
      `Pode me ajudar com o pedido?`
    );
    
    const whatsappUrl = `https://wa.me/5511999999999?text=${message}`;
    window.open(whatsappUrl, '_blank');
  }

  onAddToCart(product: Product) {
    // TODO: Implementar adição ao carrinho
    console.log('Adicionando produto relacionado ao carrinho:', product);
  }

  onViewDetails(product: Product) {
    this.router.navigate(['/produto', product.slug]);
  }

  goToMenu() {
    this.router.navigate(['/cardapio']);
  }
}
