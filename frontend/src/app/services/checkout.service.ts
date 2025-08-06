import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface Address {
  id?: string;
  name: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  reference?: string;
  isDefault?: boolean;
}

export interface PaymentMethod {
  id: string;
  type: 'credit_card' | 'debit_card' | 'pix' | 'money';
  name: string;
  icon: string;
  installments?: number[];
  fee?: number;
  description: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  items: any[];
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  address: Address;
  paymentMethod: PaymentMethod;
  paymentDetails?: any;
  summary: {
    subtotal: number;
    deliveryFee: number;
    discount: number;
    total: number;
  };
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivering' | 'delivered' | 'cancelled';
  estimatedDelivery: Date;
  deliveryEstimate: string;
  pixDetails?: {
    code: string;
    expiresAt: string;
  };
  createdAt: Date;
  notes?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  private checkoutState = new BehaviorSubject<any>({
    step: 1,
    customer: null,
    address: null,
    paymentMethod: null,
    paymentDetails: null
  });

  private readonly paymentMethods: PaymentMethod[] = [
    {
      id: 'credit_card',
      type: 'credit_card',
      name: 'Cartão de Crédito',
      icon: '💳',
      installments: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      fee: 0,
      description: 'Parcelamento em até 12x sem juros'
    },
    {
      id: 'debit_card',
      type: 'debit_card',
      name: 'Cartão de Débito',
      icon: '💳',
      fee: 0,
      description: 'Pagamento à vista com débito automático'
    },
    {
      id: 'pix',
      type: 'pix',
      name: 'PIX',
      icon: '📱',
      fee: -0.05, // 5% de desconto
      description: 'Pagamento instantâneo com 5% de desconto'
    },
    {
      id: 'money',
      type: 'money',
      name: 'Dinheiro',
      icon: '💵',
      fee: 0,
      description: 'Pagamento na entrega (precisa de troco?)'
    }
  ];

  constructor() {}

  // Estado do checkout
  getCheckoutState(): Observable<any> {
    return this.checkoutState.asObservable();
  }

  updateCheckoutState(updates: any): void {
    const currentState = this.checkoutState.value;
    this.checkoutState.next({ ...currentState, ...updates });
  }

  // Validação de CEP
  validateZipCode(zipCode: string): Observable<any> {
    const cleanZipCode = zipCode.replace(/\D/g, '');
    
    if (cleanZipCode.length !== 8) {
      return of({ valid: false, error: 'CEP deve ter 8 dígitos' });
    }

    // Simular chamada para API ViaCEP
    return of({
      valid: true,
      address: {
        street: 'Rua das Flores',
        neighborhood: 'Centro',
        city: 'São Paulo',
        state: 'SP',
        zipCode: cleanZipCode
      }
    }).pipe(delay(1000));
  }

  // Métodos de pagamento
  getPaymentMethods(): Observable<PaymentMethod[]> {
    return of(this.paymentMethods);
  }

  // Cálculo de taxa de entrega baseado no CEP
  calculateDeliveryFee(zipCode: string, weight: number): Observable<{ fee: number; estimate: string }> {
    const cleanZipCode = zipCode.replace(/\D/g, '');
    
    // Simular cálculo baseado na região
    let fee = 0;
    let estimate = '';
    
    if (cleanZipCode.startsWith('01') || cleanZipCode.startsWith('02')) {
      // São Paulo capital - entrega gratuita
      fee = 0;
      estimate = '1-2 horas';
    } else if (cleanZipCode.startsWith('0')) {
      // Grande São Paulo
      fee = weight > 2 ? 12.99 : 8.99;
      estimate = '2-4 horas';
    } else {
      // Outras regiões
      fee = weight > 2 ? 19.99 : 14.99;
      estimate = '1-2 dias úteis';
    }
    
    return of({ fee, estimate }).pipe(delay(500));
  }

  // Validação de cartão de crédito
  validateCreditCard(cardNumber: string): Observable<{ valid: boolean; brand?: string; error?: string }> {
    const cleanNumber = cardNumber.replace(/\D/g, '');
    
    if (cleanNumber.length < 13 || cleanNumber.length > 19) {
      return of({ valid: false, error: 'Número do cartão inválido' });
    }

    // Detectar bandeira do cartão
    let brand = '';
    if (cleanNumber.startsWith('4')) {
      brand = 'Visa';
    } else if (cleanNumber.startsWith('5') || cleanNumber.startsWith('2')) {
      brand = 'Mastercard';
    } else if (cleanNumber.startsWith('3')) {
      brand = 'American Express';
    } else {
      brand = 'Outro';
    }

    // Simular validação
    return of({ valid: true, brand }).pipe(delay(800));
  }

  // Processamento do pagamento
  processPayment(paymentData: any): Observable<{ success: boolean; transactionId?: string; error?: string }> {
    // Simular processamento do pagamento
    return of({
      success: true,
      transactionId: 'TXN_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
    }).pipe(delay(2000));
  }

  // Criação do pedido
  createOrder(orderData: any): Observable<Order> {
    const order: Order = {
      id: this.generateOrderId(),
      orderNumber: this.generateOrderNumber(),
      items: orderData.items,
      customer: orderData.customer,
      address: orderData.address,
      paymentMethod: orderData.paymentMethod,
      paymentDetails: orderData.paymentDetails,
      summary: orderData.summary,
      status: 'pending',
      estimatedDelivery: this.calculateEstimatedDelivery(orderData.address.zipCode),
      deliveryEstimate: '30-45 minutos',
      pixDetails: orderData.paymentMethod?.type === 'pix' ? {
        code: this.generatePixCode(),
        expiresAt: this.formatDateTime(new Date(Date.now() + 30 * 60 * 1000)) // 30 minutes
      } : undefined,
      createdAt: new Date(),
      notes: orderData.notes
    };

    // Simular criação do pedido
    return of(order).pipe(delay(1500));
  }

  // Buscar pedido por número
  getOrder(orderNumber: string): Observable<Order> {
    // Simulate API call to get order by number
    // In real implementation, this would fetch from API
    return of({
      id: 'order-' + orderNumber,
      orderNumber: orderNumber,
      items: [],
      customer: {
        name: 'Cliente de Exemplo',
        email: 'cliente@exemplo.com',
        phone: '(11) 99999-9999'
      },
      address: {
        name: 'Casa',
        zipCode: '01234-567',
        street: 'Rua das Flores',
        number: '123',
        complement: 'Apto 45',
        neighborhood: 'Centro',
        city: 'São Paulo',
        state: 'SP',
        reference: 'Próximo ao mercado'
      },
      paymentMethod: {
        id: 'pix',
        type: 'pix' as 'pix',
        name: 'PIX',
        icon: '📱',
        description: 'Pagamento instantâneo'
      },
      paymentDetails: {},
      summary: {
        subtotal: 50.00,
        deliveryFee: 0,
        discount: 2.50,
        total: 47.50
      },
      status: 'confirmed' as 'confirmed',
      estimatedDelivery: new Date(Date.now() + 24 * 60 * 60 * 1000),
      deliveryEstimate: '30-45 minutos',
      pixDetails: {
        code: '00020126580014BR.GOV.BCB.PIX0136123e4567-e12b-12d1-a456-426614174000520400005303986540547.505802BR5913Mesquita Cakes6008SAO PAULO62070503***63041D3D',
        expiresAt: this.formatDateTime(new Date(Date.now() + 30 * 60 * 1000))
      },
      createdAt: new Date(),
      notes: ''
    }).pipe(
      delay(500)
    );
  }

  // Geração de IDs e números
  private generateOrderId(): string {
    return 'ORDER_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  private generateOrderNumber(): string {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substr(2, 3).toUpperCase();
    return `MC${timestamp}${random}`;
  }

  private calculateEstimatedDelivery(zipCode: string): Date {
    const now = new Date();
    const cleanZipCode = zipCode.replace(/\D/g, '');
    
    // Calcular baseado na região
    let hoursToAdd = 2; // padrão
    
    if (cleanZipCode.startsWith('01') || cleanZipCode.startsWith('02')) {
      hoursToAdd = 2; // São Paulo capital
    } else if (cleanZipCode.startsWith('0')) {
      hoursToAdd = 4; // Grande São Paulo
    } else {
      hoursToAdd = 24; // Outras regiões
    }
    
    return new Date(now.getTime() + (hoursToAdd * 60 * 60 * 1000));
  }

  // Histórico de pedidos
  getOrderHistory(): Observable<Order[]> {
    // Simular histórico de pedidos
    const mockOrders: Order[] = [
      {
        id: 'ORDER_1',
        orderNumber: 'MC123456ABC',
        items: [],
        customer: { name: 'Cliente Teste', email: 'teste@email.com', phone: '11999999999' },
        address: {} as Address,
        paymentMethod: this.paymentMethods[0],
        summary: { subtotal: 45.90, deliveryFee: 0, discount: 0, total: 45.90 },
        status: 'delivered' as 'delivered',
        estimatedDelivery: new Date(),
        deliveryEstimate: '30-45 minutos',
        createdAt: new Date(Date.now() - 86400000), // 1 dia atrás
        notes: 'Pedido entregue com sucesso'
      }
    ];

    return of(mockOrders);
  }

  // Rastreamento do pedido
  trackOrder(orderNumber: string): Observable<any> {
    // Simular status de rastreamento
    const trackingData = {
      orderNumber,
      status: 'preparing',
      steps: [
        { title: 'Pedido Confirmado', completed: true, timestamp: new Date(Date.now() - 3600000) },
        { title: 'Preparando', completed: true, timestamp: new Date(Date.now() - 1800000) },
        { title: 'Pronto para Entrega', completed: false, timestamp: null },
        { title: 'Saiu para Entrega', completed: false, timestamp: null },
        { title: 'Entregue', completed: false, timestamp: null }
      ],
      estimatedDelivery: new Date(Date.now() + 3600000), // 1 hora
      location: 'Cozinha Mesquita Cakes'
    };

    return of(trackingData).pipe(delay(1000));
  }

  // Reset do estado do checkout
  resetCheckout(): void {
    this.checkoutState.next({
      step: 1,
      customer: null,
      address: null,
      paymentMethod: null,
      paymentDetails: null
    });
  }

  // Métodos auxiliares
  private generatePixCode(): string {
    // Simular código PIX (na implementação real, viria da API do banco)
    return '00020126580014BR.GOV.BCB.PIX0136123e4567-e12b-12d1-a456-426614174000520400005303986540547.505802BR5913Mesquita Cakes6008SAO PAULO62070503***63041D3D';
  }

  private formatDateTime(date: Date): string {
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
