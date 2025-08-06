import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../services/product.service';

@Component({
  selector: 'app-featured-products',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="featured-section section">
      <div class="container">
        <div class="section-header text-center mb-12">
          <h2 class="sweet-text text-4xl mb-4">
            {{ title }} 🌟
          </h2>
          <p class="text-lg text-neutral max-w-2xl mx-auto">
            {{ subtitle }}
          </p>
        </div>
        
        <div class="products-grid grid grid--3 gap-8">
          @for (product of products; track product.id) {
            <div class="product-card card card--product card--hover animate-fade-in">
              <div class="product-image">
                <img [src]="product.image" [alt]="product.name" class="product-img">
                
                @if (product.featured) {
                  <span class="product-badge badge--new">Destaque!</span>
                }
                @if (product.rating >= 4.5) {
                  <span class="product-badge badge--popular">Popular</span>
                }
                @if (!product.inStock) {
                  <span class="product-badge badge--unavailable">Indisponível</span>
                }
              </div>
              
              <div class="product-content">
                <div class="product-header">
                  <h3 class="product-title">{{ product.name }}</h3>
                  <div class="product-rating">
                    <div class="stars">
                      @for (star of getStars(product.rating); track $index) {
                        <span class="star">⭐</span>
                      }
                    </div>
                    <span class="rating-text">({{ product.reviewCount }})</span>
                  </div>
                </div>
                
                <p class="product-description">{{ product.description }}</p>
                
                <div class="product-footer">
                  <div class="product-price">
                    R$ {{ product.price.toFixed(2).replace('.', ',') }}
                  </div>
                  
                  <button 
                    class="btn btn--primary btn--sm hover-lift"
                    [disabled]="!product.inStock"
                    (click)="onAddToCart(product)">
                    {{ product.inStock ? 'Comprar 🛒' : 'Indisponível' }}
                  </button>
                </div>
              </div>
            </div>
          }
        </div>
        
        @if (showViewMore) {
          <div class="section-cta text-center mt-12">
            <button 
              class="btn btn--outline btn--lg hover-lift"
              (click)="onViewMoreClick()">
              Ver Mais Produtos 👀
            </button>
          </div>
        }
      </div>
    </section>
  `,
  styles: [`
    .featured-section {
      background: white;
    }

    .section-header h2 {
      background: linear-gradient(135deg, #ec4899 0%, #f59e0b 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .product-card {
      background: white;
      border-radius: 1.5rem;
      overflow: hidden;
      transition: all 0.3s ease;
      border: 1px solid #f3f4f6;
    }

    .product-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
      border-color: #ec4899;
    }

    .product-image {
      height: 200px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;
    }

    .product-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    .product-card:hover .product-img {
      transform: scale(1.05);
    }

    .product-card:hover .product-emoji {
      transform: scale(1.1) rotate(5deg);
    }

    .product-badge {
      position: absolute;
      top: 1rem;
      right: 1rem;
      padding: 0.25rem 0.75rem;
      border-radius: 1rem;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .badge--new {
      background: #10b981;
      color: white;
    }

    .badge--popular {
      background: #f59e0b;
      color: white;
    }

    .badge--unavailable {
      background: #ef4444;
      color: white;
    }

    .product-content {
      padding: 1.5rem;
    }

    .product-header {
      margin-bottom: 1rem;
    }

    .product-title {
      font-family: 'Quicksand', sans-serif;
      font-size: 1.25rem;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 0.5rem;
      line-height: 1.3;
    }

    .product-rating {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .stars {
      display: flex;
    }

    .star {
      font-size: 0.875rem;
    }

    .rating-text {
      font-size: 0.875rem;
      color: #6b7280;
    }

    .product-description {
      color: #6b7280;
      font-size: 0.875rem;
      line-height: 1.5;
      margin-bottom: 1.5rem;
    }

    .product-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .product-price {
      font-family: 'Fredoka One', cursive;
      font-size: 1.5rem;
      color: #ec4899;
      font-weight: 600;
    }

    .section-cta {
      padding-top: 2rem;
      border-top: 1px solid rgba(107, 114, 128, 0.1);
    }

    /* Responsive */
    @media (max-width: 1024px) {
      .products-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 640px) {
      .products-grid {
        grid-template-columns: 1fr;
      }
      
      .product-content {
        padding: 1.25rem;
      }

      .product-footer {
        flex-direction: column;
        gap: 1rem;
        align-items: stretch;
      }

      .product-price {
        text-align: center;
      }
    }
  `]
})
export class FeaturedProductsComponent {
  @Input() products: Product[] = [];
  @Input() title: string = 'Produtos em Destaque';
  @Input() subtitle: string = 'Os sabores mais amados pelos nossos clientes';
  @Input() showViewMore: boolean = true;
  
  @Output() addToCart = new EventEmitter<Product>();
  @Output() viewMoreClick = new EventEmitter<void>();

  getStars(rating: number): number[] {
    return Array(Math.floor(rating)).fill(0);
  }

  getProductBackground(product: Product): string {
    // Usando um gradiente baseado na categoria do produto
    const gradients = {
      'Bolos': 'linear-gradient(135deg, #fef7ed, #fed7aa)',
      'Tortas': 'linear-gradient(135deg, #f0fdf4, #bbf7d0)',
      'Doces': 'linear-gradient(135deg, #fef2f2, #fecaca)',
      'Salgados': 'linear-gradient(135deg, #f0f9ff, #bae6fd)',
      'Bebidas': 'linear-gradient(135deg, #faf5ff, #e9d5ff)'
    };
    
    return gradients[product.category as keyof typeof gradients] || 'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)';
  }

  onAddToCart(product: Product) {
    if (product.inStock) {
      this.addToCart.emit(product);
    }
  }

  onViewMoreClick() {
    this.viewMoreClick.emit();
  }
}
