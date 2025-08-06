import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CheckoutService, Order } from '../services/checkout.service';

@Component({
  selector: 'app-order-confirmation',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="confirmation-page">
      <div class="container">
        <div class="confirmation-content">
          
          <!-- Success Animation -->
          <div class="success-animation">
            <div class="checkmark-circle">
              <div class="checkmark">✓</div>
            </div>
          </div>
          
          <!-- Header -->
          <div class="confirmation-header">
            <h1 class="confirmation-title">🎉 Pedido Confirmado!</h1>
            <p class="confirmation-subtitle">
              Seu pedido foi realizado com sucesso e já está sendo preparado com muito carinho.
            </p>
          </div>
          
          <!-- Order Details -->
          <div *ngIf="order" class="order-details">
            <div class="order-card">
              <div class="order-header">
                <div class="order-number">
                  <span class="label">Número do Pedido</span>
                  <span class="number">#{{ order.orderNumber }}</span>
                </div>
                <div class="order-status">
                  <span class="status-badge" [class]="'status-' + order.status">
                    {{ getStatusText(order.status) }}
                  </span>
                </div>
              </div>
              
              <!-- Delivery Info -->
              <div class="delivery-info">
                <div class="info-section">
                  <div class="info-icon">🕒</div>
                  <div class="info-content">
                    <div class="info-title">Previsão de Entrega</div>
                    <div class="info-value">{{ order.deliveryEstimate }}</div>
                  </div>
                </div>
                
                <div class="info-section">
                  <div class="info-icon">📍</div>
                  <div class="info-content">
                    <div class="info-title">Endereço de Entrega</div>
                    <div class="info-value">{{ getDeliveryAddress() }}</div>
                  </div>
                </div>
                
                <div class="info-section">
                  <div class="info-icon">💳</div>
                  <div class="info-content">
                    <div class="info-title">Forma de Pagamento</div>
                    <div class="info-value">{{ getPaymentMethodText() }}</div>
                  </div>
                </div>
                
                <div class="info-section">
                  <div class="info-icon">💰</div>
                  <div class="info-content">
                    <div class="info-title">Total do Pedido</div>
                    <div class="info-value total-price">R$ {{ order.summary.total.toFixed(2).replace('.', ',') }}</div>
                  </div>
                </div>
              </div>
              
              <!-- PIX Payment Details -->
              <div *ngIf="order.paymentMethod?.type === 'pix' && order.pixDetails" class="pix-payment">
                <div class="pix-header">
                  <h3>💳 Pagamento via PIX</h3>
                  <p>Use o código abaixo para realizar o pagamento:</p>
                </div>
                
                <div class="pix-code">
                  <div class="pix-qr">
                    <div class="qr-placeholder">
                      📱 QR Code
                    </div>
                  </div>
                  
                  <div class="pix-details">
                    <div class="pix-info">
                      <label>Código PIX:</label>
                      <div class="code-container">
                        <input type="text" [value]="order.pixDetails.code" readonly class="pix-code-input">
                        <button class="copy-btn" (click)="copyPixCode()">Copiar</button>
                      </div>
                    </div>
                    
                    <div class="pix-info">
                      <label>Valor:</label>
                      <span class="pix-amount">R$ {{ order.summary.total.toFixed(2).replace('.', ',') }}</span>
                    </div>
                    
                    <div class="pix-info">
                      <label>Vencimento:</label>
                      <span class="pix-expiry">{{ order.pixDetails.expiresAt }}</span>
                    </div>
                  </div>
                </div>
                
                <div class="pix-instructions">
                  <h4>Como pagar:</h4>
                  <ol>
                    <li>Abra o app do seu banco</li>
                    <li>Escaneie o QR Code ou copie e cole o código PIX</li>
                    <li>Confirme o pagamento</li>
                    <li>Pronto! Seu pedido será confirmado automaticamente</li>
                  </ol>
                </div>
              </div>
              
              <!-- Order Items -->
              <div class="order-items">
                <h3 class="items-title">Itens do Pedido</h3>
                <div class="items-list">
                  <div *ngFor="let item of order.items" class="order-item">
                    <div class="item-image">
                      <img [src]="item.productImage" [alt]="item.productName">
                    </div>
                    <div class="item-details">
                      <h4>{{ item.productName }}</h4>
                      <p class="item-customizations" *ngIf="hasCustomizations(item)">
                        <span *ngIf="item.customization.size">{{ item.customization.size.name }}</span>
                        <span *ngIf="item.customization.flavor"> • {{ item.customization.flavor.name }}</span>
                        <span *ngIf="item.customization.decoration"> • {{ item.customization.decoration.name }}</span>
                      </p>
                      <p class="item-quantity">Quantidade: {{ item.quantity }}</p>
                    </div>
                    <div class="item-price">
                      R$ {{ item.totalPrice.toFixed(2).replace('.', ',') }}
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Order Summary -->
              <div class="order-summary">
                <div class="summary-row">
                  <span>Subtotal:</span>
                  <span>R$ {{ order.summary.subtotal.toFixed(2).replace('.', ',') }}</span>
                </div>
                
                <div class="summary-row">
                  <span>Entrega:</span>
                  <span [class.free]="order.summary.deliveryFee === 0">
                    <span *ngIf="order.summary.deliveryFee === 0">Grátis</span>
                    <span *ngIf="order.summary.deliveryFee > 0">R$ {{ order.summary.deliveryFee.toFixed(2).replace('.', ',') }}</span>
                  </span>
                </div>
                
                <div *ngIf="order.summary.discount > 0" class="summary-row discount">
                  <span>Desconto:</span>
                  <span>-R$ {{ order.summary.discount.toFixed(2).replace('.', ',') }}</span>
                </div>
                
                <div class="summary-divider"></div>
                
                <div class="summary-row total">
                  <span>Total:</span>
                  <span>R$ {{ order.summary.total.toFixed(2).replace('.', ',') }}</span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Loading State -->
          <div *ngIf="!order && !error" class="loading-state">
            <div class="loading-spinner"></div>
            <p>Carregando detalhes do pedido...</p>
          </div>
          
          <!-- Error State -->
          <div *ngIf="error" class="error-state">
            <div class="error-icon">❌</div>
            <h3>Ops! Algo deu errado</h3>
            <p>{{ error }}</p>
            <button class="btn btn--outline" (click)="goHome()">
              Voltar ao Início
            </button>
          </div>
          
          <!-- Actions -->
          <div *ngIf="order" class="confirmation-actions">
            <button class="btn btn--sweet" (click)="trackOrder()">
              📦 Acompanhar Pedido
            </button>
            <button class="btn btn--outline" (click)="goHome()">
              🏠 Voltar ao Início
            </button>
            <button class="btn btn--outline" (click)="orderAgain()">
              🔄 Pedir Novamente
            </button>
          </div>
          
          <!-- Contact Info -->
          <div class="contact-info">
            <h3>Dúvidas sobre seu pedido?</h3>
            <p>Entre em contato conosco:</p>
            <div class="contact-methods">
              <a href="https://wa.me/5511999999999" class="contact-btn whatsapp">
                📱 WhatsApp
              </a>
              <a href="tel:+5511999999999" class="contact-btn phone">
                📞 Telefone
              </a>
              <a href="mailto:contato@mesquitacakes.com.br" class="contact-btn email">
                ✉️ E-mail
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .confirmation-page {
      background: linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%);
      min-height: 100vh;
      padding: 2rem 0;
    }

    .confirmation-content {
      max-width: 800px;
      margin: 0 auto;
      text-align: center;
    }

    /* Success Animation */
    .success-animation {
      margin-bottom: 2rem;
    }

    .checkmark-circle {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      margin: 0 auto 2rem auto;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: scaleIn 0.6s ease-out;
      box-shadow: 0 8px 32px rgba(16, 185, 129, 0.3);
    }

    .checkmark {
      color: white;
      font-size: 3rem;
      font-weight: bold;
      animation: checkmarkAppear 0.8s ease-out 0.3s both;
    }

    @keyframes scaleIn {
      0% { transform: scale(0); }
      50% { transform: scale(1.1); }
      100% { transform: scale(1); }
    }

    @keyframes checkmarkAppear {
      0% { opacity: 0; transform: scale(0); }
      100% { opacity: 1; transform: scale(1); }
    }

    /* Header */
    .confirmation-header {
      margin-bottom: 3rem;
    }

    .confirmation-title {
      font-size: 3rem;
      font-weight: 700;
      color: #111827;
      margin: 0 0 1rem 0;
      background: linear-gradient(135deg, #ec4899 0%, #be185d 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .confirmation-subtitle {
      font-size: 1.25rem;
      color: #6b7280;
      margin: 0;
      line-height: 1.6;
    }

    /* Order Details */
    .order-details {
      text-align: left;
      margin-bottom: 3rem;
    }

    .order-card {
      background: white;
      border-radius: 1.5rem;
      padding: 3rem;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
      border: 1px solid #f3f4f6;
    }

    .order-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      padding-bottom: 1.5rem;
      border-bottom: 2px solid #f3f4f6;
    }

    .order-number .label {
      display: block;
      font-size: 0.875rem;
      color: #6b7280;
      margin-bottom: 0.25rem;
      font-weight: 600;
    }

    .order-number .number {
      font-size: 1.5rem;
      font-weight: 700;
      color: #111827;
      font-family: 'Courier New', monospace;
    }

    .status-badge {
      padding: 0.5rem 1rem;
      border-radius: 9999px;
      font-size: 0.875rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .status-pending {
      background: #fef3c7;
      color: #92400e;
    }

    .status-confirmed {
      background: #d1fae5;
      color: #065f46;
    }

    .status-preparing {
      background: #dbeafe;
      color: #1e40af;
    }

    .status-ready {
      background: #e0e7ff;
      color: #5b21b6;
    }

    .status-delivered {
      background: #d1fae5;
      color: #065f46;
    }

    /* Delivery Info */
    .delivery-info {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .info-section {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      padding: 1.5rem;
      background: #f8fafc;
      border-radius: 1rem;
      border: 1px solid #e2e8f0;
    }

    .info-icon {
      font-size: 1.5rem;
      flex-shrink: 0;
      margin-top: 0.25rem;
    }

    .info-title {
      font-size: 0.875rem;
      color: #6b7280;
      font-weight: 600;
      margin-bottom: 0.25rem;
    }

    .info-value {
      color: #111827;
      font-weight: 600;
      line-height: 1.4;
    }

    .total-price {
      font-size: 1.25rem;
      color: #ec4899;
    }

    /* PIX Payment */
    .pix-payment {
      background: #f0f9ff;
      border-radius: 1rem;
      padding: 2rem;
      margin: 2rem 0;
      border: 2px solid #0ea5e9;
    }

    .pix-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .pix-header h3 {
      color: #0369a1;
      margin: 0 0 0.5rem 0;
    }

    .pix-header p {
      color: #6b7280;
      margin: 0;
    }

    .pix-code {
      display: grid;
      grid-template-columns: 200px 1fr;
      gap: 2rem;
      align-items: center;
      margin-bottom: 2rem;
    }

    .pix-qr {
      display: flex;
      justify-content: center;
    }

    .qr-placeholder {
      width: 180px;
      height: 180px;
      background: white;
      border: 2px dashed #0ea5e9;
      border-radius: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1rem;
      color: #6b7280;
      font-weight: 600;
    }

    .pix-details {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .pix-info {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .pix-info label {
      font-size: 0.875rem;
      color: #6b7280;
      font-weight: 600;
    }

    .code-container {
      display: flex;
      gap: 0.5rem;
    }

    .pix-code-input {
      flex: 1;
      padding: 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 0.5rem;
      font-family: 'Courier New', monospace;
      font-size: 0.875rem;
      background: white;
    }

    .copy-btn {
      padding: 0.75rem 1.5rem;
      background: #0ea5e9;
      color: white;
      border: none;
      border-radius: 0.5rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      white-space: nowrap;
    }

    .copy-btn:hover {
      background: #0284c7;
    }

    .pix-amount,
    .pix-expiry {
      font-weight: 600;
      color: #111827;
    }

    .pix-instructions {
      background: white;
      border-radius: 0.75rem;
      padding: 1.5rem;
    }

    .pix-instructions h4 {
      color: #111827;
      margin: 0 0 1rem 0;
    }

    .pix-instructions ol {
      margin: 0;
      padding-left: 1.5rem;
      color: #6b7280;
    }

    .pix-instructions li {
      margin-bottom: 0.5rem;
    }

    /* Order Items */
    .order-items {
      margin: 2rem 0;
    }

    .items-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: #111827;
      margin: 0 0 1.5rem 0;
    }

    .items-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .order-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1.5rem;
      background: #f8fafc;
      border-radius: 1rem;
      border: 1px solid #e2e8f0;
    }

    .order-item .item-image {
      width: 80px;
      height: 80px;
      flex-shrink: 0;
    }

    .order-item .item-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 0.75rem;
    }

    .order-item .item-details {
      flex: 1;
    }

    .order-item .item-details h4 {
      margin: 0 0 0.5rem 0;
      font-size: 1.125rem;
      font-weight: 600;
      color: #111827;
    }

    .item-customizations {
      font-size: 0.875rem;
      color: #6b7280;
      margin: 0 0 0.5rem 0;
    }

    .item-quantity {
      font-size: 0.875rem;
      color: #6b7280;
      margin: 0;
    }

    .order-item .item-price {
      font-size: 1.125rem;
      font-weight: 700;
      color: #111827;
    }

    /* Order Summary */
    .order-summary {
      background: #f8fafc;
      border-radius: 1rem;
      padding: 1.5rem;
      margin-top: 2rem;
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

    .summary-row.discount {
      color: #10b981;
    }

    .summary-row.total {
      font-size: 1.25rem;
      font-weight: 700;
      color: #111827;
      padding-top: 0.75rem;
      border-top: 2px solid #e5e7eb;
    }

    .summary-row .free {
      color: #10b981;
      font-weight: 600;
    }

    .summary-divider {
      height: 1px;
      background: #e5e7eb;
      margin: 1rem 0;
    }

    /* States */
    .loading-state,
    .error-state {
      text-align: center;
      padding: 3rem;
    }

    .loading-spinner {
      width: 3rem;
      height: 3rem;
      border: 4px solid #f3f4f6;
      border-top: 4px solid #ec4899;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 1rem auto;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .error-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }

    .error-state h3 {
      color: #111827;
      margin: 0 0 1rem 0;
    }

    .error-state p {
      color: #6b7280;
      margin: 0 0 2rem 0;
    }

    /* Actions */
    .confirmation-actions {
      display: flex;
      justify-content: center;
      gap: 1rem;
      margin-bottom: 3rem;
      flex-wrap: wrap;
    }

    /* Contact Info */
    .contact-info {
      background: white;
      border-radius: 1.5rem;
      padding: 2rem;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      text-align: center;
    }

    .contact-info h3 {
      color: #111827;
      margin: 0 0 0.5rem 0;
    }

    .contact-info p {
      color: #6b7280;
      margin: 0 0 1.5rem 0;
    }

    .contact-methods {
      display: flex;
      justify-content: center;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .contact-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      border-radius: 0.75rem;
      text-decoration: none;
      font-weight: 600;
      font-size: 0.875rem;
      transition: all 0.3s ease;
    }

    .contact-btn.whatsapp {
      background: #10b981;
      color: white;
    }

    .contact-btn.whatsapp:hover {
      background: #059669;
    }

    .contact-btn.phone {
      background: #3b82f6;
      color: white;
    }

    .contact-btn.phone:hover {
      background: #2563eb;
    }

    .contact-btn.email {
      background: #6b7280;
      color: white;
    }

    .contact-btn.email:hover {
      background: #4b5563;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .confirmation-page {
        padding: 1rem 0;
      }

      .confirmation-title {
        font-size: 2rem;
      }

      .order-card {
        padding: 2rem;
      }

      .order-header {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
      }

      .delivery-info {
        grid-template-columns: 1fr;
      }

      .pix-code {
        grid-template-columns: 1fr;
        text-align: center;
      }

      .confirmation-actions {
        flex-direction: column;
        align-items: center;
      }

      .contact-methods {
        flex-direction: column;
      }

      .order-item {
        flex-direction: column;
        text-align: center;
      }
    }
  `]
})
export class OrderConfirmationComponent implements OnInit {
  order: Order | null = null;
  error: string | null = null;
  orderNumber: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private checkoutService: CheckoutService
  ) {}

  ngOnInit() {
    this.orderNumber = this.route.snapshot.queryParams['orderNumber'];
    
    if (this.orderNumber) {
      this.loadOrder();
    } else {
      this.error = 'Número do pedido não encontrado.';
    }
  }

  private loadOrder() {
    if (!this.orderNumber) return;

    this.checkoutService.getOrder(this.orderNumber).subscribe({
      next: (order: Order) => {
        this.order = order;
      },
      error: (err: any) => {
        console.error('Erro ao carregar pedido:', err);
        this.error = 'Não foi possível carregar os detalhes do pedido.';
      }
    });
  }

  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      'pending': 'Aguardando Pagamento',
      'confirmed': 'Confirmado',
      'preparing': 'Preparando',
      'ready': 'Pronto',
      'delivered': 'Entregue'
    };
    return statusMap[status] || status;
  }

  getDeliveryAddress(): string {
    if (!this.order?.address) return '';
    
    const addr = this.order.address;
    return `${addr.street}, ${addr.number}${addr.complement ? `, ${addr.complement}` : ''} - ${addr.neighborhood}, ${addr.city} - ${addr.state}`;
  }

  getPaymentMethodText(): string {
    if (!this.order?.paymentMethod) return '';
    
    const method = this.order.paymentMethod;
    switch (method.type) {
      case 'credit_card':
        return `Cartão de Crédito (**** ${this.order.paymentDetails?.cardNumber})`;
      case 'debit_card':
        return `Cartão de Débito (**** ${this.order.paymentDetails?.cardNumber})`;
      case 'pix':
        return 'PIX';
      case 'money':
        return 'Dinheiro';
      default:
        return method.name;
    }
  }

  hasCustomizations(item: any): boolean {
    const { customization } = item;
    return !!(
      customization?.size ||
      customization?.flavor ||
      customization?.decoration ||
      (customization?.extras && customization.extras.length > 0)
    );
  }

  copyPixCode() {
    if (this.order?.pixDetails?.code) {
      navigator.clipboard.writeText(this.order.pixDetails.code).then(() => {
        // Show success feedback
        alert('Código PIX copiado para a área de transferência!');
      });
    }
  }

  trackOrder() {
    if (this.orderNumber) {
      this.router.navigate(['/pedidos', this.orderNumber]);
    }
  }

  goHome() {
    this.router.navigate(['/']);
  }

  orderAgain() {
    // Add items back to cart and redirect to cart
    if (this.order?.items) {
      // Implementation would depend on cart service
      this.router.navigate(['/cardapio']);
    }
  }
}
