import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { ProductService, Product } from '../services/product.service';
import { BreadcrumbComponent } from '../components/breadcrumb.component';
import { ProductGalleryComponent } from '../components/product-gallery.component';
import { ProductInfoComponent, ProductCustomization } from '../components/product-info.component';
import { ProductReviewsComponent, Review } from '../components/product-reviews.component';
import { ProductRecommendationsComponent } from '../components/product-recommendations.component';

@Component({
  selector: 'app-product-detail-enhanced',
  standalone: true,
  imports: [
    BreadcrumbComponent,
    ProductGalleryComponent,
    ProductInfoComponent,
    ProductReviewsComponent,
    ProductRecommendationsComponent
],
  template: `
    @if (product) {
      <div class="product-detail-page">
        <!-- Breadcrumb -->
        <app-breadcrumb [items]="breadcrumbItems"></app-breadcrumb>
        <!-- Product Detail -->
        <section class="product-detail-section">
          <div class="container">
            <div class="product-detail-grid">
              <!-- Product Gallery -->
              <div class="product-gallery-section">
                <app-product-gallery
                  [images]="productImages"
                  [productName]="product.name"
                  [badges]="getProductBadges()">
                </app-product-gallery>
              </div>
              <!-- Product Info -->
              <div class="product-info-section">
                <app-product-info
                  [product]="product"
                  [customization]="productCustomization"
                  (addToCartEvent)="onAddToCart($event)"
                  (addToWishlistEvent)="onAddToWishlist($event)">
                </app-product-info>
              </div>
            </div>
          </div>
        </section>
        <!-- Product Reviews -->
        <section class="product-reviews-section">
          <div class="container">
            <app-product-reviews
              [productId]="product.id"
              [reviews]="productReviews">
            </app-product-reviews>
          </div>
        </section>
        <!-- Product Recommendations -->
        <section class="product-recommendations-section">
          <div class="container">
            <app-product-recommendations
              [currentProduct]="product"
              [relatedProducts]="relatedProducts"
              [frequentlyBought]="frequentlyBought"
              [recentlyViewed]="recentlyViewed"
              [suggestedProducts]="suggestedProducts">
            </app-product-recommendations>
          </div>
        </section>
      </div>
    }
    
    <!-- Loading State -->
    @if (!product && isLoading) {
      <div class="loading-container">
        <div class="loading-spinner">
          <div class="spinner"></div>
          <p>Carregando produto...</p>
        </div>
      </div>
    }
    
    <!-- Error State -->
    @if (!product && !isLoading) {
      <div class="error-container">
        <div class="error-content">
          <h2>🍰 Produto não encontrado</h2>
          <p>Desculpe, não conseguimos encontrar este produto. Que tal explorar nossos outros deliciosos produtos?</p>
          <button class="btn btn--sweet" (click)="navigateToProducts()">
            Ver Produtos
          </button>
        </div>
      </div>
    }
    `,
  styles: [`
    .product-detail-page {
      background: #f8fafc;
      min-height: 100vh;
      padding: 2rem 0;
    }

    .product-detail-section {
      margin-bottom: 3rem;
    }

    .product-detail-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 3rem;
      align-items: start;
    }

    .product-reviews-section,
    .product-recommendations-section {
      margin-bottom: 3rem;
    }

    .loading-container,
    .error-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 60vh;
      padding: 2rem;
    }

    .loading-spinner {
      text-align: center;
    }

    .spinner {
      width: 3rem;
      height: 3rem;
      border: 3px solid #f3f4f6;
      border-top: 3px solid #ec4899;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 1rem;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .error-content {
      text-align: center;
      background: white;
      padding: 3rem;
      border-radius: 1rem;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      max-width: 500px;
    }

    .error-content h2 {
      color: #111827;
      margin: 0 0 1rem 0;
      font-size: 1.5rem;
    }

    .error-content p {
      color: #6b7280;
      margin: 0 0 2rem 0;
      line-height: 1.6;
    }

    /* Responsive Design */
    @media (max-width: 1024px) {
      .product-detail-grid {
        grid-template-columns: 1fr;
        gap: 2rem;
      }
    }

    @media (max-width: 768px) {
      .product-detail-page {
        padding: 1rem 0;
      }
      
      .product-detail-grid {
        gap: 1.5rem;
      }
    }
  `]
})
export class ProductDetailEnhancedComponent implements OnInit {
  product: Product | null = null;
  productImages: string[] = [];
  productCustomization: ProductCustomization = {
    sizes: [],
    flavors: [],
    decorations: [],
    extras: []
  };
  productReviews: Review[] = [];
  relatedProducts: Product[] = [];
  frequentlyBought: Product[] = [];
  recentlyViewed: Product[] = [];
  suggestedProducts: Product[] = [];
  breadcrumbItems: any[] = [];
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = Number(params['id']);
      this.loadProduct(id);
    });
  }

  loadProduct(id: number) {
    this.isLoading = true;
    
    this.productService.getProductById(id).subscribe({
      next: (product: Product | null) => {
        if (product) {
          this.product = product;
          this.setupBreadcrumb();
          this.setupProductImages();
          this.setupCustomizationOptions();
          this.loadProductReviews();
          this.loadRelatedProducts();
          this.loadRecommendations();
        }
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Erro ao carregar produto:', error);
        this.isLoading = false;
      }
    });
  }

  setupBreadcrumb() {
    if (!this.product) return;
    
    this.breadcrumbItems = [
      { label: 'Home', link: '/' },
      { label: 'Produtos', link: '/produtos' },
      { label: this.product.category, link: `/produtos?categoria=${this.product.category}` },
      { label: this.product.name, link: '', active: true }
    ];
  }

  setupProductImages() {
    if (!this.product) return;
    
    // Simular múltiplas imagens do produto
    this.productImages = [
      this.product.image,
      // Adicionar variações simuladas
      this.product.image.replace('.jpg', '_2.jpg'),
      this.product.image.replace('.jpg', '_3.jpg'),
      this.product.image.replace('.jpg', '_4.jpg')
    ];
  }

  setupCustomizationOptions() {
    if (!this.product) return;
    
    // Configurar opções de personalização baseadas no tipo de produto
    if (this.product.category === 'Bolos') {
      this.productCustomization = {
        sizes: [
          { id: 1, name: 'Pequeno (6 fatias)', price: 0, available: true },
          { id: 2, name: 'Médio (10 fatias)', price: 15, available: true },
          { id: 3, name: 'Grande (16 fatias)', price: 30, available: true },
          { id: 4, name: 'Festa (24 fatias)', price: 50, available: true }
        ],
        flavors: [
          { id: 1, name: 'Chocolate', price: 0, available: true },
          { id: 2, name: 'Baunilha', price: 0, available: true },
          { id: 3, name: 'Morango', price: 5, available: true },
          { id: 4, name: 'Limão', price: 5, available: true },
          { id: 5, name: 'Red Velvet', price: 10, available: true }
        ],
        decorations: [
          { id: 1, name: 'Simples', price: 0, available: true },
          { id: 2, name: 'Chantilly', price: 8, available: true },
          { id: 3, name: 'Ganache', price: 12, available: true },
          { id: 4, name: 'Fondant', price: 20, available: true }
        ],
        extras: [
          { id: 1, name: 'Frutas Vermelhas', price: 15, available: true },
          { id: 2, name: 'Doce de Leite', price: 8, available: true },
          { id: 3, name: 'Chocolate Belga', price: 12, available: true },
          { id: 4, name: 'Castanhas', price: 10, available: true }
        ]
      };
    } else {
      // Opções mais simples para outros tipos de produtos
      this.productCustomization = {
        sizes: [
          { id: 1, name: 'Unidade', price: 0, available: true },
          { id: 2, name: 'Kit 6 unidades', price: this.product.price * 5, available: true },
          { id: 3, name: 'Kit 12 unidades', price: this.product.price * 10, available: true }
        ],
        flavors: [],
        decorations: [],
        extras: []
      };
    }
  }

  loadProductReviews() {
    if (!this.product) return;
    
    // Simular avaliações do produto
    this.productReviews = [
      {
        id: 1,
        userName: 'Maria Silva',
        rating: 5,
        comment: 'Produto incrível! Sabor excepcional e entrega rápida. Super recomendo!',
        date: new Date('2024-01-15'),
        verified: true,
        helpful: 12,
        images: []
      },
      {
        id: 2,
        userName: 'João Santos',
        rating: 4,
        comment: 'Muito bom, mas poderia vir melhor embalado. O sabor é delicioso!',
        date: new Date('2024-01-10'),
        verified: true,
        helpful: 8,
        images: []
      },
      {
        id: 3,
        userName: 'Ana Costa',
        rating: 5,
        comment: 'Perfeito para aniversários! As crianças adoraram. Textura macia e sabor perfeito.',
        date: new Date('2024-01-05'),
        verified: true,
        helpful: 15,
        images: []
      }
    ];
  }

  loadRelatedProducts() {
    if (!this.product) return;
    
    this.productService.getProducts().subscribe(products => {
      // Produtos da mesma categoria, excluindo o produto atual
      this.relatedProducts = products
        .filter(p => p.category === this.product!.category && p.id !== this.product!.id)
        .slice(0, 4);
    });
  }

  loadRecommendations() {
    if (!this.product) return;
    
    this.productService.getProducts().subscribe(products => {
      // Simular produtos frequentemente comprados juntos
      this.frequentlyBought = products
        .filter(p => p.id !== this.product!.id)
        .slice(0, 3);
      
      // Simular produtos sugeridos
      this.suggestedProducts = products
        .filter(p => p.featured && p.id !== this.product!.id)
        .slice(0, 6);
      
      // Simular produtos vistos recentemente (do localStorage)
      const recentlyViewedIds = this.getRecentlyViewedIds();
      this.recentlyViewed = products
        .filter(p => recentlyViewedIds.includes(p.id) && p.id !== this.product!.id)
        .slice(0, 5);
      
      // Adicionar produto atual ao histórico
      this.addToRecentlyViewed();
    });
  }

  getRecentlyViewedIds(): number[] {
    const stored = localStorage.getItem('recentlyViewed');
    return stored ? JSON.parse(stored) : [];
  }

  addToRecentlyViewed() {
    if (!this.product) return;
    
    let recentlyViewed = this.getRecentlyViewedIds();
    
    // Remover se já existe
    recentlyViewed = recentlyViewed.filter(id => id !== this.product!.id);
    
    // Adicionar no início
    recentlyViewed.unshift(this.product.id);
    
    // Manter apenas os últimos 10
    recentlyViewed = recentlyViewed.slice(0, 10);
    
    localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed));
  }

  onAddToCart(cartItem: any) {
    console.log('Produto adicionado ao carrinho:', cartItem);
    
    // Aqui você implementaria a lógica real de adicionar ao carrinho
    // Por exemplo, chamar um serviço de carrinho
    
    // Feedback visual para o usuário
    alert(`${cartItem.product.name} foi adicionado ao carrinho!`);
  }

  onAddToWishlist(wishlistItem: any) {
    console.log('Produto alterado na wishlist:', wishlistItem);
    
    // Implementar lógica de wishlist
    const message = wishlistItem.isAdding 
      ? `${wishlistItem.product.name} foi adicionado aos favoritos!`
      : `${wishlistItem.product.name} foi removido dos favoritos.`;
    
    alert(message);
  }

  navigateToProducts() {
    this.router.navigate(['/produtos']);
  }

  getProductBadges() {
    if (!this.product) return [];
    
    const badges = [];
    
    if (this.product.featured) {
      badges.push({ type: 'featured', label: 'Destaque', emoji: '⭐' });
    }
    
    if (this.product.rating >= 4.5) {
      badges.push({ type: 'popular', label: 'Popular', emoji: '🔥' });
    }
    
    if (!this.product.inStock) {
      badges.push({ type: 'unavailable', label: 'Indisponível', emoji: '❌' });
    }
    
    // Verificar se é um produto novo (adicionado nos últimos 30 dias)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    if (this.product.id > 15) { // Simular produtos novos
      badges.push({ type: 'new', label: 'Novo', emoji: '🆕' });
    }
    
    return badges;
  }
}
