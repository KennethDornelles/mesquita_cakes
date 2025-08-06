import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { CartService, CartItem, CartSummary } from '../services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="cart-page">
      <div class="container">
        <!-- Page Header -->
        <div class="page-header">
          <h1 class="page-title">🛒 Carrinho de Compras</h1>
          <p class="page-subtitle" *ngIf="cartItems.length > 0">
            {{ cartSummary.itemCount }} {{ cartSummary.itemCount === 1 ? 'item' : 'itens' }} no seu carrinho
          </p>
        </div>

        <div class="cart-layout" *ngIf="cartItems.length > 0">
          <!-- Cart Items -->
          <div class="cart-items-section">
            <div class="cart-items">
              <div *ngFor="let item of cartItems; trackBy: trackByItemId" class="cart-item">
                <div class="item-image">
                  <img [src]="item.productImage" [alt]="item.productName" loading="lazy">
                  <span class="item-category">{{ item.productCategory }}</span>
                </div>
                
                <div class="item-details">
                  <h3 class="item-name">{{ item.productName }}</h3>
                  
                  <!-- Customizations -->
                  <div class="item-customizations" *ngIf="hasCustomizations(item)">
                    <div *ngIf="item.customization.size" class="customization-item">
                      <strong>Tamanho:</strong> {{ item.customization.size.name }}
                      <span *ngIf="item.customization.size.price > 0" class="customization-price">
                        (+R$ {{ item.customization.size.price.toFixed(2).replace('.', ',') }})
                      </span>
                    </div>
                    
                    <div *ngIf="item.customization.flavor" class="customization-item">
                      <strong>Sabor:</strong> {{ item.customization.flavor.name }}
                      <span *ngIf="item.customization.flavor.price > 0" class="customization-price">
                        (+R$ {{ item.customization.flavor.price.toFixed(2).replace('.', ',') }})
                      </span>
                    </div>
                    
                    <div *ngIf="item.customization.decoration" class="customization-item">
                      <strong>Decoração:</strong> {{ item.customization.decoration.name }}
                      <span *ngIf="item.customization.decoration.price > 0" class="customization-price">
                        (+R$ {{ item.customization.decoration.price.toFixed(2).replace('.', ',') }})
                      </span>
                    </div>
                    
                    <div *ngIf="item.customization.extras && item.customization.extras.length > 0" 
                         class="customization-item">
                      <strong>Extras:</strong>
                      <span *ngFor="let extra of item.customization.extras; let last = last">
                        {{ extra.name }}
                        <span class="customization-price">(+R$ {{ extra.price.toFixed(2).replace('.', ',') }})</span>
                        <span *ngIf="!last">, </span>
                      </span>
                    </div>
                    
                    <div *ngIf="item.customization.specialInstructions" class="customization-item special-instructions">
                      <strong>Instruções especiais:</strong>
                      <span class="instructions-text">{{ item.customization.specialInstructions }}</span>
                    </div>
                  </div>
                  
                  <!-- Price per unit -->
                  <div class="item-unit-price">
                    R$ {{ item.unitPrice.toFixed(2).replace('.', ',') }} por unidade
                  </div>
                </div>
                
                <div class="item-actions">
                  <!-- Quantity Controls -->
                  <div class="quantity-controls">
                    <button 
                      class="quantity-btn quantity-btn--decrease"
                      (click)="decreaseQuantity(item)"
                      [disabled]="item.quantity <= 1">
                      -
                    </button>
                    <span class="quantity-display">{{ item.quantity }}</span>
                    <button 
                      class="quantity-btn quantity-btn--increase"
                      (click)="increaseQuantity(item)"
                      [disabled]="item.quantity >= 20">
                      +
                    </button>
                  </div>
                  
                  <!-- Item Total Price -->
                  <div class="item-total-price">
                    <span class="price-label">Total:</span>
                    <span class="price-value">R$ {{ item.totalPrice.toFixed(2).replace('.', ',') }}</span>
                  </div>
                  
                  <!-- Remove Button -->
                  <button 
                    class="remove-btn"
                    (click)="removeItem(item)"
                    title="Remover item">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            
            <!-- Promo Code Section -->
            <div class="promo-code-section">
              <form [formGroup]="promoForm" (ngSubmit)="applyPromoCode()" class="promo-form">
                <div class="promo-input-group">
                  <input
                    type="text"
                    formControlName="code"
                    placeholder="Código promocional"
                    class="promo-input"
                    [class.error]="promoError">
                  <button 
                    type="submit" 
                    class="promo-btn"
                    [disabled]="promoForm.invalid || isApplyingPromo">
                    <span *ngIf="!isApplyingPromo">Aplicar</span>
                    <span *ngIf="isApplyingPromo">Aplicando...</span>
                  </button>
                </div>
                
                <div *ngIf="promoError" class="promo-error">
                  {{ promoError }}
                </div>
                
                <div *ngIf="promoSuccess" class="promo-success">
                  {{ promoSuccess }}
                </div>
              </form>
              
              <!-- Available Promo Codes Hint -->
              <div class="promo-hints">
                <button class="promo-hint-btn" (click)="togglePromoHints()">
                  <span *ngIf="!showPromoHints">Ver códigos disponíveis</span>
                  <span *ngIf="showPromoHints">Ocultar códigos</span>
                </button>
                
                <div *ngIf="showPromoHints" class="promo-hints-list">
                  <div class="promo-hint-item">
                    <strong>BEMVINDO10:</strong> 10% de desconto para novos clientes (pedido mín. R$ 50)
                  </div>
                  <div class="promo-hint-item">
                    <strong>FRETEGRATIS:</strong> Frete grátis acima de R$ 30
                  </div>
                  <div class="promo-hint-item">
                    <strong>ANIVERSARIO20:</strong> 20% de desconto especial (pedido mín. R$ 100)
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Cart Summary -->
          <div class="cart-summary-section">
            <div class="cart-summary">
              <h3 class="summary-title">Resumo do Pedido</h3>
              
              <div class="summary-row">
                <span class="summary-label">Subtotal ({{ cartSummary.itemCount }} {{ cartSummary.itemCount === 1 ? 'item' : 'itens' }}):</span>
                <span class="summary-value">R$ {{ cartSummary.subtotal.toFixed(2).replace('.', ',') }}</span>
              </div>
              
              <div class="summary-row">
                <span class="summary-label">Entrega:</span>
                <span class="summary-value" [class.free-shipping]="cartSummary.deliveryFee === 0">
                  <span *ngIf="cartSummary.deliveryFee === 0">Grátis</span>
                  <span *ngIf="cartSummary.deliveryFee > 0">R$ {{ cartSummary.deliveryFee.toFixed(2).replace('.', ',') }}</span>
                </span>
              </div>
              
              <div *ngIf="cartSummary.discount > 0" class="summary-row discount-row">
                <span class="summary-label">Desconto:</span>
                <span class="summary-value discount-value">-R$ {{ cartSummary.discount.toFixed(2).replace('.', ',') }}</span>
              </div>
              
              <div class="summary-divider"></div>
              
              <div class="summary-row total-row">
                <span class="summary-label">Total:</span>
                <span class="summary-value total-value">R$ {{ cartSummary.total.toFixed(2).replace('.', ',') }}</span>
              </div>
              
              <!-- Free Shipping Progress -->
              <div *ngIf="cartSummary.deliveryFee > 0 && cartSummary.subtotal < 80" class="free-shipping-progress">
                <div class="progress-text">
                  Adicione mais R$ {{ (80 - cartSummary.subtotal).toFixed(2).replace('.', ',') }} para ganhar frete grátis!
                </div>
                <div class="progress-bar">
                  <div class="progress-fill" [style.width.%]="(cartSummary.subtotal / 80) * 100"></div>
                </div>
              </div>
              
              <!-- Delivery Estimate -->
              <div class="delivery-estimate">
                <div class="estimate-title">📦 Prazo de entrega</div>
                <div class="estimate-time">{{ deliveryEstimate.min }}-{{ deliveryEstimate.max }} horas úteis</div>
                <div class="estimate-type">{{ deliveryEstimate.type }}</div>
              </div>
              
              <!-- Action Buttons -->
              <div class="summary-actions">
                <button class="btn btn--outline" (click)="continueShopping()">
                  ← Continuar Comprando
                </button>
                <button class="btn btn--sweet" (click)="proceedToCheckout()">
                  Finalizar Pedido →
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Empty Cart State -->
        <div *ngIf="cartItems.length === 0" class="empty-cart">
          <div class="empty-cart-content">
            <div class="empty-cart-icon">🛒</div>
            <h2 class="empty-cart-title">Seu carrinho está vazio</h2>
            <p class="empty-cart-text">
              Que tal explorar nossos deliciosos produtos e adicionar alguns ao seu carrinho?
            </p>
            <button class="btn btn--sweet" (click)="continueShopping()">
              Ver Produtos
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .cart-page {
      background: #f8fafc;
      min-height: 100vh;
      padding: 2rem 0;
    }

    .page-header {
      text-align: center;
      margin-bottom: 3rem;
    }

    .page-title {
      font-size: 2.5rem;
      font-weight: 700;
      color: #111827;
      margin: 0 0 0.5rem 0;
    }

    .page-subtitle {
      color: #6b7280;
      font-size: 1.125rem;
      margin: 0;
    }

    .cart-layout {
      display: grid;
      grid-template-columns: 1fr 400px;
      gap: 3rem;
      align-items: start;
    }

    /* Cart Items */
    .cart-items-section {
      background: white;
      border-radius: 1rem;
      padding: 2rem;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    }

    .cart-items {
      display: flex;
      flex-direction: column;
      gap: 2rem;
      margin-bottom: 2rem;
    }

    .cart-item {
      display: grid;
      grid-template-columns: 120px 1fr auto;
      gap: 1.5rem;
      padding: 1.5rem;
      border: 1px solid #e5e7eb;
      border-radius: 1rem;
      transition: all 0.3s ease;
    }

    .cart-item:hover {
      border-color: #ec4899;
      box-shadow: 0 4px 12px rgba(236, 72, 153, 0.1);
    }

    .item-image {
      position: relative;
    }

    .item-image img {
      width: 100%;
      aspect-ratio: 1;
      object-fit: cover;
      border-radius: 0.75rem;
    }

    .item-category {
      position: absolute;
      bottom: -8px;
      left: 50%;
      transform: translateX(-50%);
      background: #ec4899;
      color: white;
      padding: 0.25rem 0.75rem;
      border-radius: 1rem;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .item-details {
      min-width: 0;
    }

    .item-name {
      font-size: 1.25rem;
      font-weight: 600;
      color: #111827;
      margin: 0 0 1rem 0;
      line-height: 1.4;
    }

    .item-customizations {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    .customization-item {
      font-size: 0.875rem;
      color: #6b7280;
    }

    .customization-item strong {
      color: #374151;
    }

    .customization-price {
      color: #10b981;
      font-weight: 600;
      margin-left: 0.5rem;
    }

    .special-instructions {
      background: #f0f9ff;
      padding: 0.75rem;
      border-radius: 0.5rem;
      border-left: 3px solid #0ea5e9;
    }

    .instructions-text {
      font-style: italic;
      display: block;
      margin-top: 0.25rem;
    }

    .item-unit-price {
      color: #6b7280;
      font-size: 0.875rem;
    }

    .item-actions {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }

    .quantity-controls {
      display: flex;
      align-items: center;
      background: #f8fafc;
      border-radius: 0.75rem;
      padding: 0.25rem;
    }

    .quantity-btn {
      width: 2.5rem;
      height: 2.5rem;
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
      transform: scale(1.05);
    }

    .quantity-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .quantity-display {
      font-size: 1.125rem;
      font-weight: 600;
      color: #111827;
      min-width: 3rem;
      text-align: center;
    }

    .item-total-price {
      text-align: center;
    }

    .price-label {
      display: block;
      font-size: 0.875rem;
      color: #6b7280;
      margin-bottom: 0.25rem;
    }

    .price-value {
      font-size: 1.25rem;
      font-weight: 700;
      color: #111827;
    }

    .remove-btn {
      width: 2.5rem;
      height: 2.5rem;
      border: none;
      border-radius: 50%;
      background: #fef2f2;
      color: #ef4444;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .remove-btn:hover {
      background: #ef4444;
      color: white;
      transform: scale(1.1);
    }

    /* Promo Code Section */
    .promo-code-section {
      border-top: 1px solid #e5e7eb;
      padding-top: 2rem;
    }

    .promo-form {
      margin-bottom: 1rem;
    }

    .promo-input-group {
      display: flex;
      gap: 1rem;
    }

    .promo-input {
      flex: 1;
      padding: 0.75rem 1rem;
      border: 1px solid #d1d5db;
      border-radius: 0.5rem;
      font-size: 1rem;
      transition: border-color 0.3s ease;
    }

    .promo-input:focus {
      outline: none;
      border-color: #ec4899;
      box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.1);
    }

    .promo-input.error {
      border-color: #ef4444;
    }

    .promo-btn {
      padding: 0.75rem 1.5rem;
      background: #ec4899;
      color: white;
      border: none;
      border-radius: 0.5rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .promo-btn:hover:not(:disabled) {
      background: #be185d;
      transform: translateY(-1px);
    }

    .promo-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .promo-error {
      color: #ef4444;
      font-size: 0.875rem;
      margin-top: 0.5rem;
    }

    .promo-success {
      color: #10b981;
      font-size: 0.875rem;
      margin-top: 0.5rem;
      font-weight: 600;
    }

    .promo-hints {
      margin-top: 1rem;
    }

    .promo-hint-btn {
      background: none;
      border: none;
      color: #6b7280;
      font-size: 0.875rem;
      cursor: pointer;
      text-decoration: underline;
    }

    .promo-hint-btn:hover {
      color: #ec4899;
    }

    .promo-hints-list {
      margin-top: 0.75rem;
      background: #f8fafc;
      border-radius: 0.5rem;
      padding: 1rem;
    }

    .promo-hint-item {
      font-size: 0.875rem;
      color: #6b7280;
      margin-bottom: 0.5rem;
    }

    .promo-hint-item:last-child {
      margin-bottom: 0;
    }

    /* Cart Summary */
    .cart-summary {
      background: white;
      border-radius: 1rem;
      padding: 2rem;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      position: sticky;
      top: 2rem;
    }

    .summary-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: #111827;
      margin: 0 0 1.5rem 0;
    }

    .summary-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .summary-label {
      color: #6b7280;
      font-size: 0.875rem;
    }

    .summary-value {
      font-weight: 600;
      color: #111827;
    }

    .free-shipping {
      color: #10b981 !important;
      font-weight: 700;
    }

    .discount-row {
      color: #10b981;
    }

    .discount-value {
      color: #10b981 !important;
      font-weight: 700;
    }

    .summary-divider {
      height: 1px;
      background: #e5e7eb;
      margin: 1.5rem 0;
    }

    .total-row {
      margin-bottom: 2rem;
    }

    .total-row .summary-label {
      font-size: 1.125rem;
      font-weight: 600;
      color: #111827;
    }

    .total-value {
      font-size: 1.5rem;
      font-weight: 700;
      color: #ec4899;
    }

    .free-shipping-progress {
      background: #f0f9ff;
      border-radius: 0.75rem;
      padding: 1rem;
      margin-bottom: 1.5rem;
    }

    .progress-text {
      font-size: 0.875rem;
      color: #0369a1;
      margin-bottom: 0.75rem;
      text-align: center;
      font-weight: 600;
    }

    .progress-bar {
      height: 8px;
      background: #e0f2fe;
      border-radius: 4px;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #0ea5e9, #0284c7);
      transition: width 0.3s ease;
    }

    .delivery-estimate {
      background: #f8fafc;
      border-radius: 0.75rem;
      padding: 1rem;
      margin-bottom: 2rem;
      text-align: center;
    }

    .estimate-title {
      font-size: 0.875rem;
      color: #6b7280;
      margin-bottom: 0.5rem;
    }

    .estimate-time {
      font-size: 1.125rem;
      font-weight: 700;
      color: #111827;
      margin-bottom: 0.25rem;
    }

    .estimate-type {
      font-size: 0.875rem;
      color: #ec4899;
      font-weight: 600;
    }

    .summary-actions {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    /* Empty Cart */
    .empty-cart {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 60vh;
    }

    .empty-cart-content {
      text-align: center;
      background: white;
      border-radius: 1rem;
      padding: 3rem;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      max-width: 500px;
    }

    .empty-cart-icon {
      font-size: 5rem;
      margin-bottom: 1.5rem;
    }

    .empty-cart-title {
      font-size: 1.75rem;
      font-weight: 700;
      color: #111827;
      margin: 0 0 1rem 0;
    }

    .empty-cart-text {
      color: #6b7280;
      font-size: 1.125rem;
      line-height: 1.6;
      margin: 0 0 2rem 0;
    }

    /* Responsive Design */
    @media (max-width: 1024px) {
      .cart-layout {
        grid-template-columns: 1fr;
        gap: 2rem;
      }

      .cart-summary {
        position: static;
      }
    }

    @media (max-width: 768px) {
      .cart-page {
        padding: 1rem 0;
      }

      .page-title {
        font-size: 2rem;
      }

      .cart-items-section,
      .cart-summary {
        padding: 1.5rem;
      }

      .cart-item {
        grid-template-columns: 80px 1fr;
        gap: 1rem;
      }

      .item-actions {
        grid-column: 1 / -1;
        flex-direction: row;
        justify-content: space-between;
        margin-top: 1rem;
      }

      .promo-input-group {
        flex-direction: column;
      }

      .summary-actions {
        gap: 0.75rem;
      }
    }

    @media (max-width: 480px) {
      .cart-item {
        grid-template-columns: 1fr;
        text-align: center;
      }

      .item-image {
        max-width: 120px;
        margin: 0 auto;
      }
    }
  `]
})
export class CartComponent implements OnInit, OnDestroy {
  cartItems: CartItem[] = [];
  cartSummary: CartSummary = {
    subtotal: 0,
    deliveryFee: 0,
    discount: 0,
    total: 0,
    itemCount: 0,
    weight: 0
  };
  
  promoForm: FormGroup;
  promoError = '';
  promoSuccess = '';
  isApplyingPromo = false;
  showPromoHints = false;
  
  deliveryEstimate = { min: 2, max: 3, type: 'Entrega padrão' };
  
  private destroy$ = new Subject<void>();

  constructor(
    private cartService: CartService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.promoForm = this.fb.group({
      code: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  ngOnInit() {
    // Subscribe to cart updates
    this.cartService.getCartItems()
      .pipe(takeUntil(this.destroy$))
      .subscribe(items => {
        this.cartItems = items;
      });

    this.cartService.getCartSummary()
      .pipe(takeUntil(this.destroy$))
      .subscribe(summary => {
        this.cartSummary = summary;
        this.deliveryEstimate = this.cartService.getDeliveryEstimate();
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  trackByItemId(index: number, item: CartItem): string {
    return item.id;
  }

  hasCustomizations(item: CartItem): boolean {
    const { customization } = item;
    return !!(
      customization.size ||
      customization.flavor ||
      customization.decoration ||
      (customization.extras && customization.extras.length > 0) ||
      customization.specialInstructions
    );
  }

  increaseQuantity(item: CartItem): void {
    this.cartService.updateItemQuantity(item.id, item.quantity + 1);
  }

  decreaseQuantity(item: CartItem): void {
    this.cartService.updateItemQuantity(item.id, item.quantity - 1);
  }

  removeItem(item: CartItem): void {
    if (confirm(`Tem certeza que deseja remover "${item.productName}" do carrinho?`)) {
      this.cartService.removeItem(item.id);
    }
  }

  applyPromoCode(): void {
    if (this.promoForm.invalid) return;
    
    this.isApplyingPromo = true;
    this.promoError = '';
    this.promoSuccess = '';
    
    const code = this.promoForm.value.code.trim().toUpperCase();
    
    // Simular delay de verificação
    setTimeout(() => {
      const result = this.cartService.applyPromoCode(code);
      
      if (result.success) {
        this.promoSuccess = result.message;
        this.promoForm.reset();
      } else {
        this.promoError = result.message;
      }
      
      this.isApplyingPromo = false;
    }, 1000);
  }

  togglePromoHints(): void {
    this.showPromoHints = !this.showPromoHints;
  }

  continueShopping(): void {
    this.router.navigate(['/cardapio']);
  }

  proceedToCheckout(): void {
    this.router.navigate(['/checkout']);
  }
}
