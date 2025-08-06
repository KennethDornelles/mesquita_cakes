import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface CartItem {
  id: string;
  productId: number;
  productName: string;
  productImage: string;
  productCategory: string;
  basePrice: number;
  quantity: number;
  customization: {
    size?: { id: number; name: string; price: number };
    flavor?: { id: number; name: string; price: number };
    decoration?: { id: number; name: string; price: number };
    extras?: { id: number; name: string; price: number }[];
    specialInstructions?: string;
  };
  unitPrice: number;
  totalPrice: number;
  addedAt: Date;
}

export interface CartSummary {
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  itemCount: number;
  weight: number;
}

export interface PromoCode {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrderValue: number;
  maxDiscount?: number;
  expiresAt?: Date;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: CartItem[] = [];
  private cartSubject = new BehaviorSubject<CartItem[]>([]);
  private cartSummarySubject = new BehaviorSubject<CartSummary>(this.calculateSummary());
  
  // Configurações de entrega
  private readonly deliveryConfig = {
    freeShippingThreshold: 80,
    standardDeliveryFee: 8.99,
    expressDeliveryFee: 15.99,
    weightThreshold: 2 // kg
  };

  // Códigos promocionais disponíveis
  private readonly promoCodes: PromoCode[] = [
    {
      code: 'BEMVINDO10',
      type: 'percentage',
      value: 10,
      minOrderValue: 50,
      maxDiscount: 20,
      description: 'Desconto de 10% para novos clientes'
    },
    {
      code: 'FRETEGRATIS',
      type: 'fixed',
      value: 8.99,
      minOrderValue: 30,
      description: 'Frete grátis acima de R$ 30'
    },
    {
      code: 'ANIVERSARIO20',
      type: 'percentage',
      value: 20,
      minOrderValue: 100,
      maxDiscount: 50,
      expiresAt: new Date('2025-12-31'),
      description: 'Desconto especial de aniversário'
    }
  ];

  constructor() {
    this.loadCartFromStorage();
  }

  // Observables
  getCartItems(): Observable<CartItem[]> {
    return this.cartSubject.asObservable();
  }

  getCartSummary(): Observable<CartSummary> {
    return this.cartSummarySubject.asObservable();
  }

  // Gerenciamento de itens
  addItem(item: Omit<CartItem, 'id' | 'unitPrice' | 'totalPrice' | 'addedAt'>): void {
    const unitPrice = this.calculateUnitPrice(item);
    const totalPrice = unitPrice * item.quantity;
    
    const cartItem: CartItem = {
      ...item,
      id: this.generateItemId(),
      unitPrice,
      totalPrice,
      addedAt: new Date()
    };

    // Verificar se já existe item similar
    const existingItemIndex = this.findSimilarItem(cartItem);
    
    if (existingItemIndex !== -1) {
      this.cartItems[existingItemIndex].quantity += item.quantity;
      this.cartItems[existingItemIndex].totalPrice = 
        this.cartItems[existingItemIndex].unitPrice * this.cartItems[existingItemIndex].quantity;
    } else {
      this.cartItems.push(cartItem);
    }

    this.updateCart();
  }

  updateItemQuantity(itemId: string, quantity: number): void {
    const itemIndex = this.cartItems.findIndex(item => item.id === itemId);
    
    if (itemIndex !== -1) {
      if (quantity <= 0) {
        this.removeItem(itemId);
      } else {
        this.cartItems[itemIndex].quantity = quantity;
        this.cartItems[itemIndex].totalPrice = 
          this.cartItems[itemIndex].unitPrice * quantity;
        this.updateCart();
      }
    }
  }

  removeItem(itemId: string): void {
    this.cartItems = this.cartItems.filter(item => item.id !== itemId);
    this.updateCart();
  }

  clearCart(): void {
    this.cartItems = [];
    this.updateCart();
  }

  // Códigos promocionais
  validatePromoCode(code: string): PromoCode | null {
    const promoCode = this.promoCodes.find(promo => 
      promo.code.toLowerCase() === code.toLowerCase()
    );

    if (!promoCode) return null;

    // Verificar expiração
    if (promoCode.expiresAt && promoCode.expiresAt < new Date()) {
      return null;
    }

    // Verificar valor mínimo do pedido
    const summary = this.calculateSummary();
    if (summary.subtotal < promoCode.minOrderValue) {
      return null;
    }

    return promoCode;
  }

  applyPromoCode(code: string): { success: boolean; message: string; discount?: number } {
    const promoCode = this.validatePromoCode(code);
    
    if (!promoCode) {
      return {
        success: false,
        message: 'Código promocional inválido ou expirado'
      };
    }

    const summary = this.calculateSummary();
    
    if (summary.subtotal < promoCode.minOrderValue) {
      return {
        success: false,
        message: `Valor mínimo do pedido deve ser R$ ${promoCode.minOrderValue.toFixed(2)}`
      };
    }

    let discount = 0;
    
    if (promoCode.type === 'percentage') {
      discount = summary.subtotal * (promoCode.value / 100);
      if (promoCode.maxDiscount) {
        discount = Math.min(discount, promoCode.maxDiscount);
      }
    } else {
      discount = promoCode.value;
    }

    return {
      success: true,
      message: `Código aplicado com sucesso! Desconto de R$ ${discount.toFixed(2)}`,
      discount
    };
  }

  // Cálculos
  private calculateUnitPrice(item: Omit<CartItem, 'id' | 'unitPrice' | 'totalPrice' | 'addedAt'>): number {
    let price = item.basePrice;
    
    if (item.customization.size) {
      price += item.customization.size.price;
    }
    
    if (item.customization.flavor) {
      price += item.customization.flavor.price;
    }
    
    if (item.customization.decoration) {
      price += item.customization.decoration.price;
    }
    
    if (item.customization.extras) {
      item.customization.extras.forEach(extra => {
        price += extra.price;
      });
    }
    
    return price;
  }

  private calculateSummary(): CartSummary {
    const subtotal = this.cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
    const itemCount = this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const weight = this.cartItems.reduce((sum, item) => sum + (item.quantity * 0.5), 0); // Assumindo 0.5kg por item
    
    let deliveryFee = 0;
    if (subtotal > 0) {
      if (subtotal >= this.deliveryConfig.freeShippingThreshold) {
        deliveryFee = 0;
      } else if (weight > this.deliveryConfig.weightThreshold) {
        deliveryFee = this.deliveryConfig.expressDeliveryFee;
      } else {
        deliveryFee = this.deliveryConfig.standardDeliveryFee;
      }
    }
    
    const discount = 0; // Será calculado quando aplicar cupom
    const total = subtotal + deliveryFee - discount;
    
    return {
      subtotal,
      deliveryFee,
      discount,
      total,
      itemCount,
      weight
    };
  }

  // Utilidades
  private findSimilarItem(newItem: CartItem): number {
    return this.cartItems.findIndex(item => 
      item.productId === newItem.productId &&
      this.compareCustomizations(item.customization, newItem.customization)
    );
  }

  private compareCustomizations(custom1: any, custom2: any): boolean {
    return JSON.stringify(custom1) === JSON.stringify(custom2);
  }

  private generateItemId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  private updateCart(): void {
    this.cartSubject.next([...this.cartItems]);
    this.cartSummarySubject.next(this.calculateSummary());
    this.saveCartToStorage();
  }

  // Persistência
  private saveCartToStorage(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('mesquita_cart', JSON.stringify(this.cartItems));
    }
  }

  private loadCartFromStorage(): void {
    if (typeof localStorage !== 'undefined') {
      const savedCart = localStorage.getItem('mesquita_cart');
      if (savedCart) {
        try {
          this.cartItems = JSON.parse(savedCart).map((item: any) => ({
            ...item,
            addedAt: new Date(item.addedAt)
          }));
          this.updateCart();
        } catch (error) {
          console.error('Erro ao carregar carrinho do localStorage:', error);
          this.cartItems = [];
        }
      }
    }
  }

  // Métodos auxiliares para checkout
  getCartItemsSnapshot(): CartItem[] {
    return [...this.cartItems];
  }

  getCartSummarySnapshot(): CartSummary {
    return this.calculateSummary();
  }

  // Estimativa de tempo de entrega
  getDeliveryEstimate(postalCode?: string): { min: number; max: number; type: string } {
    const summary = this.calculateSummary();
    
    // Simulação baseada no peso e localização
    if (postalCode?.startsWith('01') || postalCode?.startsWith('02')) {
      // São Paulo capital - entrega mais rápida
      return summary.weight > 2 
        ? { min: 2, max: 4, type: 'Entrega expressa' }
        : { min: 1, max: 2, type: 'Entrega rápida' };
    } else {
      // Outras regiões
      return summary.weight > 2
        ? { min: 3, max: 5, type: 'Entrega expressa' }
        : { min: 2, max: 3, type: 'Entrega padrão' };
    }
  }
}
