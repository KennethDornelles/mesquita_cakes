import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

export interface ProductOption {
  id: number;
  name: string;
  price: number;
  available: boolean;
}

export interface ProductCustomization {
  sizes: ProductOption[];
  flavors: ProductOption[];
  decorations: ProductOption[];
  extras: ProductOption[];
}

@Component({
  selector: 'app-product-info',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="product-info">
      <!-- Product Header -->
      <div class="product-header">
        <div class="product-badges">
          @if (product.featured) {
            <span class="badge badge--featured">⭐ Destaque</span>
          }
          @if (product.isNew) {
            <span class="badge badge--new">🆕 Novo</span>
          }
          @if (product.discount > 0) {
            <span class="badge badge--sale">
              🏷️ {{ product.discount }}% OFF
            </span>
          }
          @if (!product.available) {
            <span class="badge badge--unavailable">Indisponível</span>
          }
        </div>
    
        <h1 class="product-title">{{ product.name }}</h1>
        <p class="product-description">{{ product.description }}</p>
    
        <!-- Rating -->
        <div class="product-rating">
          <div class="rating-stars">
            @for (star of getStars(); track star; let i = $index) {
              <span
                class="star"
                [class.filled]="star">
                ⭐
              </span>
            }
          </div>
          <span class="rating-text">({{ product.rating }} - {{ product.reviewCount }} avaliações)</span>
        </div>
      </div>
    
      <!-- Pricing Section -->
      <div class="pricing-section">
        <div class="price-container">
          @if (product.discount > 0) {
            <span class="original-price">
              R$ {{ product.originalPrice?.toFixed(2).replace('.', ',') }}
            </span>
          }
          <span class="current-price">
            R$ {{ getCurrentPrice().toFixed(2).replace('.', ',') }}
          </span>
          @if (product.discount > 0) {
            <span class="discount-amount">
              Economize R$ {{ getSavings().toFixed(2).replace('.', ',') }}
            </span>
          }
        </div>
    
        <!-- Installments -->
        @if (product.allowInstallments) {
          <div class="installments">
            <span class="installment-text">
              ou 12x de R$ {{ getInstallmentPrice().toFixed(2).replace('.', ',') }} sem juros
            </span>
          </div>
        }
      </div>
    
      <!-- Customization Form -->
      <form [formGroup]="customizationForm" class="customization-form">
    
        <!-- Size Selection -->
        @if (customization.sizes.length > 0) {
          <div class="customization-group">
            <label class="customization-label">Tamanho *</label>
            <div class="option-grid">
              @for (size of customization.sizes; track size) {
                <label
                  class="option-card"
                  [class.selected]="selectedSize?.id === size.id"
                  [class.unavailable]="!size.available">
                  <input
                    type="radio"
                    [value]="size.id"
                    (change)="selectSize(size)"
                    [disabled]="!size.available"
                    style="display: none;">
                  <div class="option-content">
                    <span class="option-name">{{ size.name }}</span>
                    @if (size.price > 0) {
                      <span class="option-price">
                        +R$ {{ size.price.toFixed(2).replace('.', ',') }}
                      </span>
                    }
                  </div>
                </label>
              }
            </div>
          </div>
        }
    
        <!-- Flavor Selection -->
        @if (customization.flavors.length > 0) {
          <div class="customization-group">
            <label class="customization-label">Sabor *</label>
            <div class="option-grid">
              @for (flavor of customization.flavors; track flavor) {
                <label
                  class="option-card"
                  [class.selected]="selectedFlavor?.id === flavor.id"
                  [class.unavailable]="!flavor.available">
                  <input
                    type="radio"
                    [value]="flavor.id"
                    (change)="selectFlavor(flavor)"
                    [disabled]="!flavor.available"
                    style="display: none;">
                  <div class="option-content">
                    <span class="option-name">{{ flavor.name }}</span>
                    @if (flavor.price > 0) {
                      <span class="option-price">
                        +R$ {{ flavor.price.toFixed(2).replace('.', ',') }}
                      </span>
                    }
                  </div>
                </label>
              }
            </div>
          </div>
        }
    
        <!-- Decoration Selection -->
        @if (customization.decorations.length > 0) {
          <div class="customization-group">
            <label class="customization-label">Decoração</label>
            <div class="option-grid">
              @for (decoration of customization.decorations; track decoration) {
                <label
                  class="option-card"
                  [class.selected]="selectedDecoration?.id === decoration.id"
                  [class.unavailable]="!decoration.available">
                  <input
                    type="radio"
                    [value]="decoration.id"
                    (change)="selectDecoration(decoration)"
                    [disabled]="!decoration.available"
                    style="display: none;">
                  <div class="option-content">
                    <span class="option-name">{{ decoration.name }}</span>
                    @if (decoration.price > 0) {
                      <span class="option-price">
                        +R$ {{ decoration.price.toFixed(2).replace('.', ',') }}
                      </span>
                    }
                  </div>
                </label>
              }
            </div>
          </div>
        }
    
        <!-- Extras Selection -->
        @if (customization.extras.length > 0) {
          <div class="customization-group">
            <label class="customization-label">Extras</label>
            <div class="option-grid">
              @for (extra of customization.extras; track extra) {
                <label
                  class="option-card checkbox-card"
                  [class.selected]="isExtraSelected(extra.id)"
                  [class.unavailable]="!extra.available">
                  <input
                    type="checkbox"
                    [value]="extra.id"
                    (change)="toggleExtra(extra)"
                    [disabled]="!extra.available"
                    style="display: none;">
                  <div class="option-content">
                    <span class="option-name">{{ extra.name }}</span>
                    <span class="option-price">
                      +R$ {{ extra.price.toFixed(2).replace('.', ',') }}
                    </span>
                  </div>
                </label>
              }
            </div>
          </div>
        }
    
        <!-- Quantity Selection -->
        <div class="customization-group">
          <label class="customization-label">Quantidade</label>
          <div class="quantity-selector">
            <button
              type="button"
              class="quantity-btn"
              (click)="decreaseQuantity()"
              [disabled]="quantity <= 1">
              -
            </button>
            <span class="quantity-display">{{ quantity }}</span>
            <button
              type="button"
              class="quantity-btn"
              (click)="increaseQuantity()"
              [disabled]="quantity >= maxQuantity">
              +
            </button>
          </div>
        </div>
    
        <!-- Special Instructions -->
        <div class="customization-group">
          <label for="specialInstructions" class="customization-label">
            Instruções Especiais (opcional)
          </label>
          <textarea
            id="specialInstructions"
            formControlName="specialInstructions"
            class="special-instructions"
            rows="3"
          placeholder="Ex: Escrever 'Parabéns João' no bolo, sem nozes, etc."></textarea>
        </div>
      </form>
    
      <!-- Total Price Summary -->
      <div class="price-summary">
        <div class="summary-row">
          <span>Produto base:</span>
          <span>R$ {{ getCurrentPrice().toFixed(2).replace('.', ',') }}</span>
        </div>
        @if (getCustomizationTotal() > 0) {
          <div class="summary-row">
            <span>Personalizações:</span>
            <span>+R$ {{ getCustomizationTotal().toFixed(2).replace('.', ',') }}</span>
          </div>
        }
        @if (quantity > 1) {
          <div class="summary-row">
            <span>Quantidade ({{ quantity }}x):</span>
            <span>-</span>
          </div>
        }
        <div class="summary-row total-row">
          <span>Total:</span>
          <span class="total-price">R$ {{ getFinalPrice().toFixed(2).replace('.', ',') }}</span>
        </div>
      </div>
    
      <!-- Action Buttons -->
      <div class="action-buttons">
        <button
          class="btn btn--outline btn--large"
          (click)="addToWishlist()"
          [class.active]="isInWishlist">
          @if (!isInWishlist) {
            <span>🤍 Favoritar</span>
          }
          @if (isInWishlist) {
            <span>❤️ Favoritado</span>
          }
        </button>
    
        <button
          class="btn btn--sweet btn--large"
          (click)="addToCart()"
          [disabled]="!canAddToCart() || isAddingToCart"
          [class.loading]="isAddingToCart">
          @if (!isAddingToCart && product.available) {
            <span>
              🛒 Adicionar ao Carrinho
            </span>
          }
          @if (!isAddingToCart && !product.available) {
            <span>
              Produto Indisponível
            </span>
          }
          @if (isAddingToCart) {
            <span>
              Adicionando...
            </span>
          }
        </button>
      </div>
    
      <!-- Delivery Info -->
      <div class="delivery-info">
        <div class="delivery-item">
          <span class="delivery-icon">🚚</span>
          <div class="delivery-content">
            <strong>Entrega rápida</strong>
            <p>Receba em 24-48h na Grande São Paulo</p>
          </div>
        </div>
    
        <div class="delivery-item">
          <span class="delivery-icon">🎂</span>
          <div class="delivery-content">
            <strong>Produto fresco</strong>
            <p>Feito no dia da entrega para máxima qualidade</p>
          </div>
        </div>
    
        <div class="delivery-item">
          <span class="delivery-icon">💝</span>
          <div class="delivery-content">
            <strong>Embalagem especial</strong>
            <p>Cuidado extra no transporte e apresentação</p>
          </div>
        </div>
      </div>
    
      <!-- Product Details -->
      <div class="product-details">
        @if (product.weight) {
          <div class="detail-item">
            <strong>Peso:</strong> {{ product.weight }}
          </div>
        }
        @if (product.serves) {
          <div class="detail-item">
            <strong>Serve:</strong> {{ product.serves }} pessoas
          </div>
        }
        @if (product.preparationTime) {
          <div class="detail-item">
            <strong>Tempo de preparo:</strong> {{ product.preparationTime }}
          </div>
        }
        @if (product.shelfLife) {
          <div class="detail-item">
            <strong>Validade:</strong> {{ product.shelfLife }}
          </div>
        }
      </div>
    </div>
    `,
  styles: [`
    .product-info {
      background: white;
      border-radius: 1rem;
      padding: 2rem;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    }

    .product-header {
      margin-bottom: 2rem;
    }

    .product-badges {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    .badge {
      padding: 0.25rem 0.75rem;
      border-radius: 1rem;
      font-size: 0.875rem;
      font-weight: 600;
    }

    .badge--featured {
      background: linear-gradient(135deg, #fbbf24, #f59e0b);
      color: white;
    }

    .badge--new {
      background: linear-gradient(135deg, #10b981, #059669);
      color: white;
    }

    .badge--sale {
      background: linear-gradient(135deg, #ef4444, #dc2626);
      color: white;
    }

    .badge--unavailable {
      background: #6b7280;
      color: white;
    }

    .product-title {
      font-size: 2rem;
      font-weight: 700;
      color: #111827;
      margin: 0 0 1rem 0;
      line-height: 1.2;
    }

    .product-description {
      color: #6b7280;
      font-size: 1.125rem;
      line-height: 1.6;
      margin: 0 0 1rem 0;
    }

    .product-rating {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .rating-stars .star {
      font-size: 1.25rem;
      color: #d1d5db;
    }

    .rating-stars .star.filled {
      color: #fbbf24;
    }

    .rating-text {
      color: #6b7280;
      font-size: 0.875rem;
    }

    .pricing-section {
      background: #f8fafc;
      border-radius: 1rem;
      padding: 1.5rem;
      margin-bottom: 2rem;
    }

    .price-container {
      display: flex;
      align-items: center;
      gap: 1rem;
      flex-wrap: wrap;
      margin-bottom: 0.5rem;
    }

    .original-price {
      color: #6b7280;
      text-decoration: line-through;
      font-size: 1.125rem;
    }

    .current-price {
      font-size: 2rem;
      font-weight: 700;
      color: #111827;
    }

    .discount-amount {
      color: #10b981;
      font-weight: 600;
      background: #d1fae5;
      padding: 0.25rem 0.75rem;
      border-radius: 0.5rem;
      font-size: 0.875rem;
    }

    .installments {
      color: #6b7280;
      font-size: 0.875rem;
    }

    .customization-form {
      margin-bottom: 2rem;
    }

    .customization-group {
      margin-bottom: 2rem;
    }

    .customization-label {
      display: block;
      font-weight: 600;
      color: #374151;
      margin-bottom: 1rem;
      font-size: 1.125rem;
    }

    .option-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }

    .option-card {
      border: 2px solid #e5e7eb;
      border-radius: 0.75rem;
      padding: 1rem;
      cursor: pointer;
      transition: all 0.3s ease;
      background: white;
    }

    .option-card:hover:not(.unavailable) {
      border-color: #ec4899;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(236, 72, 153, 0.15);
    }

    .option-card.selected {
      border-color: #ec4899;
      background: linear-gradient(135deg, #fdf2f8, #fce7f3);
    }

    .option-card.unavailable {
      opacity: 0.5;
      cursor: not-allowed;
      background: #f9fafb;
    }

    .option-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .option-name {
      font-weight: 600;
      color: #111827;
    }

    .option-price {
      color: #10b981;
      font-weight: 600;
      font-size: 0.875rem;
    }

    .quantity-selector {
      display: flex;
      align-items: center;
      gap: 1rem;
      background: #f8fafc;
      border-radius: 0.75rem;
      padding: 0.5rem;
      width: fit-content;
    }

    .quantity-btn {
      width: 3rem;
      height: 3rem;
      border: none;
      border-radius: 0.5rem;
      background: white;
      color: #374151;
      font-size: 1.25rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .quantity-btn:hover:not(:disabled) {
      background: #ec4899;
      color: white;
    }

    .quantity-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .quantity-display {
      font-size: 1.25rem;
      font-weight: 600;
      color: #111827;
      min-width: 2rem;
      text-align: center;
    }

    .special-instructions {
      width: 100%;
      padding: 1rem;
      border: 2px solid #e5e7eb;
      border-radius: 0.75rem;
      font-size: 1rem;
      resize: vertical;
      transition: border-color 0.3s ease;
    }

    .special-instructions:focus {
      outline: none;
      border-color: #ec4899;
    }

    .price-summary {
      background: #f8fafc;
      border-radius: 1rem;
      padding: 1.5rem;
      margin-bottom: 2rem;
    }

    .summary-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.75rem;
      color: #6b7280;
    }

    .summary-row:last-child {
      margin-bottom: 0;
    }

    .total-row {
      border-top: 2px solid #e5e7eb;
      padding-top: 0.75rem;
      margin-top: 0.75rem;
      color: #111827;
      font-weight: 600;
      font-size: 1.125rem;
    }

    .total-price {
      font-size: 1.5rem;
      font-weight: 700;
      color: #ec4899;
    }

    .action-buttons {
      display: grid;
      grid-template-columns: auto 1fr;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .btn--large {
      padding: 1rem 2rem;
      font-size: 1.125rem;
      font-weight: 600;
      height: auto;
    }

    .btn.active {
      background: linear-gradient(135deg, #ec4899, #be185d);
      color: white;
      border-color: #ec4899;
    }

    .delivery-info {
      background: #f0f9ff;
      border-radius: 1rem;
      padding: 1.5rem;
      margin-bottom: 2rem;
    }

    .delivery-item {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .delivery-item:last-child {
      margin-bottom: 0;
    }

    .delivery-icon {
      font-size: 1.5rem;
      flex-shrink: 0;
    }

    .delivery-content strong {
      display: block;
      color: #111827;
      margin-bottom: 0.25rem;
    }

    .delivery-content p {
      color: #6b7280;
      margin: 0;
      font-size: 0.875rem;
    }

    .product-details {
      background: #f8fafc;
      border-radius: 1rem;
      padding: 1.5rem;
    }

    .detail-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5rem 0;
      border-bottom: 1px solid #e5e7eb;
      color: #6b7280;
    }

    .detail-item:last-child {
      border-bottom: none;
    }

    .detail-item strong {
      color: #374151;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .product-info {
        padding: 1.5rem;
      }

      .product-title {
        font-size: 1.75rem;
      }

      .current-price {
        font-size: 1.75rem;
      }

      .option-grid {
        grid-template-columns: 1fr;
      }

      .action-buttons {
        grid-template-columns: 1fr;
      }

      .price-container {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
      }
    }
  `]
})
export class ProductInfoComponent implements OnInit {
  @Input() product: any = {};
  @Input() customization: ProductCustomization = {
    sizes: [],
    flavors: [],
    decorations: [],
    extras: []
  };
  
  @Output() addToCartEvent = new EventEmitter<any>();
  @Output() addToWishlistEvent = new EventEmitter<any>();

  customizationForm: FormGroup;
  selectedSize: ProductOption | null = null;
  selectedFlavor: ProductOption | null = null;
  selectedDecoration: ProductOption | null = null;
  selectedExtras: ProductOption[] = [];
  quantity = 1;
  maxQuantity = 10;
  isAddingToCart = false;
  isInWishlist = false;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.customizationForm = this.fb.group({
      specialInstructions: ['']
    });
  }

  ngOnInit() {
    // Pré-selecionar primeiro tamanho e sabor se disponíveis
    if (this.customization.sizes.length > 0) {
      this.selectSize(this.customization.sizes[0]);
    }
    if (this.customization.flavors.length > 0) {
      this.selectFlavor(this.customization.flavors[0]);
    }
  }

  getStars() {
    return Array(5).fill(false).map((_, i) => i < Math.floor(this.product.rating || 0));
  }

  getCurrentPrice(): number {
    if (this.product.discount > 0 && this.product.originalPrice) {
      return this.product.originalPrice * (1 - this.product.discount / 100);
    }
    return this.product.price || 0;
  }

  getSavings(): number {
    if (this.product.discount > 0 && this.product.originalPrice) {
      return this.product.originalPrice - this.getCurrentPrice();
    }
    return 0;
  }

  getInstallmentPrice(): number {
    return this.getCurrentPrice() / 12;
  }

  getCustomizationTotal(): number {
    let total = 0;
    
    if (this.selectedSize) total += this.selectedSize.price;
    if (this.selectedFlavor) total += this.selectedFlavor.price;
    if (this.selectedDecoration) total += this.selectedDecoration.price;
    
    this.selectedExtras.forEach(extra => {
      total += extra.price;
    });
    
    return total;
  }

  getFinalPrice(): number {
    return (this.getCurrentPrice() + this.getCustomizationTotal()) * this.quantity;
  }

  selectSize(size: ProductOption) {
    if (size.available) {
      this.selectedSize = size;
    }
  }

  selectFlavor(flavor: ProductOption) {
    if (flavor.available) {
      this.selectedFlavor = flavor;
    }
  }

  selectDecoration(decoration: ProductOption) {
    if (decoration.available) {
      this.selectedDecoration = this.selectedDecoration?.id === decoration.id ? null : decoration;
    }
  }

  toggleExtra(extra: ProductOption) {
    if (!extra.available) return;
    
    const index = this.selectedExtras.findIndex(e => e.id === extra.id);
    if (index > -1) {
      this.selectedExtras.splice(index, 1);
    } else {
      this.selectedExtras.push(extra);
    }
  }

  isExtraSelected(extraId: number): boolean {
    return this.selectedExtras.some(extra => extra.id === extraId);
  }

  increaseQuantity() {
    if (this.quantity < this.maxQuantity) {
      this.quantity++;
    }
  }

  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  canAddToCart(): boolean {
    const requiredSize = this.customization.sizes.length > 0 && !this.selectedSize;
    const requiredFlavor = this.customization.flavors.length > 0 && !this.selectedFlavor;
    
    return this.product.available && !requiredSize && !requiredFlavor;
  }

  addToCart() {
    if (!this.canAddToCart()) return;
    
    this.isAddingToCart = true;
    
    const cartItem = {
      product: this.product,
      customization: {
        size: this.selectedSize,
        flavor: this.selectedFlavor,
        decoration: this.selectedDecoration,
        extras: [...this.selectedExtras],
        specialInstructions: this.customizationForm.value.specialInstructions
      },
      quantity: this.quantity,
      totalPrice: this.getFinalPrice()
    };
    
    // Simular adição ao carrinho
    setTimeout(() => {
      this.addToCartEvent.emit(cartItem);
      this.isAddingToCart = false;
    }, 1000);
  }

  addToWishlist() {
    this.isInWishlist = !this.isInWishlist;
    this.addToWishlistEvent.emit({
      product: this.product,
      isAdding: this.isInWishlist
    });
  }
}
