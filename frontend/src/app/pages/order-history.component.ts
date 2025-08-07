import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { UserService, UserOrder } from '../services/user.service';
import { AuthService } from '../services/auth.service';

interface OrderFilter {
  status: string;
  dateRange: string;
  search: string;
}

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="order-history-page">
      <div class="container">
        <!-- Page Header -->
        <div class="page-header">
          <div class="header-content">
            <h1 class="page-title">📋 Meus Pedidos</h1>
            <p class="page-subtitle">Acompanhe seus pedidos e histórico de compras</p>
          </div>
          <button class="btn btn--sweet" (click)="goToProducts()">
            + Fazer Novo Pedido
          </button>
        </div>
    
        <!-- Filters -->
        <div class="filters-section">
          <div class="filter-group">
            <label class="filter-label">Status:</label>
            <select
              class="filter-select"
              [(ngModel)]="filters.status"
              (change)="applyFilters()">
              <option value="">Todos</option>
              <option value="confirmed">Confirmado</option>
              <option value="preparing">Preparando</option>
              <option value="ready">Pronto</option>
              <option value="delivering">Saiu para entrega</option>
              <option value="delivered">Entregue</option>
              <option value="cancelled">Cancelado</option>
            </select>
          </div>
    
          <div class="filter-group">
            <label class="filter-label">Período:</label>
            <select
              class="filter-select"
              [(ngModel)]="filters.dateRange"
              (change)="applyFilters()">
              <option value="">Todos</option>
              <option value="last7days">Últimos 7 dias</option>
              <option value="last30days">Últimos 30 dias</option>
              <option value="last3months">Últimos 3 meses</option>
              <option value="thisYear">Este ano</option>
            </select>
          </div>
    
          <div class="filter-group search-group">
            <label class="filter-label">Buscar:</label>
            <input
              type="text"
              class="filter-input"
              placeholder="Buscar por produto ou número do pedido"
              [(ngModel)]="filters.search"
              (input)="applyFilters()">
          </div>
        </div>
    
        <!-- Orders List -->
        <div class="orders-section">
          @if (isLoading) {
            <div class="loading-state">
              <div class="spinner"></div>
              <p>Carregando pedidos...</p>
            </div>
          }
    
          @if (!isLoading && filteredOrders.length === 0) {
            <div class="empty-state">
              <div class="empty-icon">📦</div>
              <h3>Nenhum pedido encontrado</h3>
              @if (hasActiveFilters()) {
                <p>
                  Tente ajustar os filtros para encontrar seus pedidos
                </p>
              }
              @if (!hasActiveFilters()) {
                <p>
                  Você ainda não fez nenhum pedido. Que tal fazer o primeiro?
                </p>
              }
              <button class="btn btn--sweet" (click)="goToProducts()">
                Explorar Produtos
              </button>
            </div>
          }
    
          @if (!isLoading && filteredOrders.length > 0) {
            <div class="orders-list">
              @for (order of filteredOrders; track order) {
                <div class="order-card">
                  <!-- Order Header -->
                  <div class="order-header">
                    <div class="order-info">
                      <h3 class="order-title">Pedido #{{ order.id.substring(0, 8) }}</h3>
                      <p class="order-date">{{ formatDate(order.createdAt) }}</p>
                    </div>
                    <div class="order-status">
                      <span class="status-badge" [ngClass]="'status--' + order.status">
                        {{ getStatusLabel(order.status) }}
                      </span>
                    </div>
                  </div>
                  <!-- Order Summary -->
                  <div class="order-summary">
                    <div class="order-details">
                      <div class="detail-item">
                        <span class="detail-label">Total:</span>
                        <span class="detail-value total-price">
                          R$ {{ order.summary.total.toFixed(2).replace('.', ',') }}
                        </span>
                      </div>
                      <div class="detail-item">
                        <span class="detail-label">Itens:</span>
                        <span class="detail-value">{{ order.items.length }} item(s)</span>
                      </div>
                      <div class="detail-item">
                        <span class="detail-label">Pagamento:</span>
                        <span class="detail-value">{{ getPaymentLabel(order.paymentMethod.type) }}</span>
                      </div>
                      @if (order.deliveryAddress) {
                        <div class="detail-item">
                          <span class="detail-label">Entrega:</span>
                          <span class="detail-value">
                            {{ order.deliveryAddress.neighborhood }}, {{ order.deliveryAddress.city }}
                          </span>
                        </div>
                      }
                    </div>
                  </div>
                  <!-- Order Items -->
                  <div class="order-items">
                    <div class="items-header">
                      <h4>Itens do pedido</h4>
                      <button
                        class="toggle-items"
                        (click)="toggleOrderItems(order.id)"
                        [class.expanded]="expandedOrders.has(order.id)">
                        {{ expandedOrders.has(order.id) ? 'Ocultar' : 'Ver' }} itens
                        <span class="toggle-icon">
                          {{ expandedOrders.has(order.id) ? '▲' : '▼' }}
                        </span>
                      </button>
                    </div>
                    @if (expandedOrders.has(order.id)) {
                      <div class="items-list">
                        @for (item of order.items; track item) {
                          <div class="order-item">
                            <div class="item-image">
                              <img [src]="item.product.imageUrl" [alt]="item.product.name">
                            </div>
                            <div class="item-details">
                              <h5>{{ item.product.name }}</h5>
                              @if (item.customizations.length > 0) {
                                <p class="item-customizations">
                                  <strong>Personalizações:</strong>
                                  @for (custom of item.customizations; track custom; let last = $last) {
                                    <span>
                                      {{ custom.name }}{{ !last ? ', ' : '' }}
                                    </span>
                                  }
                                </p>
                              }
                              <div class="item-price-qty">
                                <span>{{ item.quantity }}x R$ {{ item.unitPrice.toFixed(2).replace('.', ',') }}</span>
                                <span class="item-total">
                                  R$ {{ (item.quantity * item.unitPrice).toFixed(2).replace('.', ',') }}
                                </span>
                              </div>
                            </div>
                          </div>
                        }
                      </div>
                    }
                  </div>
                  <!-- Order Actions -->
                  <div class="order-actions">
                    <button
                      class="btn btn--outline btn--sm"
                      (click)="viewOrderDetails(order)">
                      Ver Detalhes
                    </button>
                    @if (canReorder(order)) {
                      <button
                        class="btn btn--sweet btn--sm"
                        (click)="reorderItems(order)">
                        Pedir Novamente
                      </button>
                    }
                    @if (canCancel(order)) {
                      <button
                        class="btn btn--danger btn--sm"
                        (click)="cancelOrder(order)">
                        Cancelar
                      </button>
                    }
                    @if (canRate(order)) {
                      <button
                        class="btn btn--outline btn--sm"
                        (click)="rateOrder(order)">
                        Avaliar
                      </button>
                    }
                  </div>
                  <!-- Order Tracking -->
                  @if (shouldShowTracking(order)) {
                    <div class="order-tracking">
                      <h4>Status do pedido</h4>
                      <div class="tracking-timeline">
                        @for (step of getTrackingSteps(order); track step) {
                          <div
                            class="tracking-step"
                            [class.completed]="step.completed"
                            [class.active]="step.active">
                            <div class="step-indicator">
                              <span class="step-icon">{{ step.icon }}</span>
                            </div>
                            <div class="step-content">
                              <h5>{{ step.title }}</h5>
                              <p>{{ step.description }}</p>
                              @if (step.timestamp) {
                                <small>{{ formatDateTime(step.timestamp) }}</small>
                              }
                            </div>
                          </div>
                        }
                      </div>
                    </div>
                  }
                </div>
              }
            </div>
          }
    
          <!-- Load More -->
          @if (hasMoreOrders && !isLoading) {
            <div class="load-more-section">
              <button class="btn btn--outline" (click)="loadMoreOrders()">
                Carregar Mais Pedidos
              </button>
            </div>
          }
        </div>
      </div>
    </div>
    `,
  styles: [`
    .order-history-page {
      background: #f8fafc;
      min-height: 100vh;
      padding: 2rem 0;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 2px solid #e5e7eb;
    }

    .header-content h1 {
      font-size: 2.5rem;
      font-weight: 700;
      color: #111827;
      margin: 0 0 0.5rem 0;
    }

    .header-content p {
      color: #6b7280;
      font-size: 1.125rem;
      margin: 0;
    }

    /* Filters */
    .filters-section {
      background: white;
      border-radius: 1rem;
      padding: 1.5rem;
      margin-bottom: 2rem;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      display: flex;
      gap: 2rem;
      flex-wrap: wrap;
      align-items: end;
    }

    .filter-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      min-width: 200px;
    }

    .search-group {
      flex: 1;
      min-width: 300px;
    }

    .filter-label {
      font-weight: 600;
      color: #374151;
      font-size: 0.875rem;
    }

    .filter-select,
    .filter-input {
      padding: 0.75rem 1rem;
      border: 1px solid #d1d5db;
      border-radius: 0.5rem;
      font-size: 1rem;
      transition: border-color 0.3s ease;
    }

    .filter-select:focus,
    .filter-input:focus {
      outline: none;
      border-color: #ec4899;
      box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.1);
    }

    /* Orders */
    .orders-section {
      min-height: 400px;
    }

    .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 4rem;
      color: #6b7280;
    }

    .spinner {
      width: 2rem;
      height: 2rem;
      border: 3px solid #f3f4f6;
      border-top: 3px solid #ec4899;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 1rem;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .empty-state {
      text-align: center;
      padding: 4rem;
      color: #6b7280;
    }

    .empty-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }

    .empty-state h3 {
      margin: 0 0 0.5rem 0;
      color: #111827;
      font-size: 1.5rem;
    }

    .empty-state p {
      margin: 0 0 2rem 0;
      font-size: 1.125rem;
    }

    .orders-list {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .order-card {
      background: white;
      border-radius: 1.5rem;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      overflow: hidden;
      transition: all 0.3s ease;
    }

    .order-card:hover {
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
      transform: translateY(-2px);
    }

    .order-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 2rem 2rem 1rem 2rem;
      border-bottom: 1px solid #f3f4f6;
    }

    .order-title {
      font-size: 1.25rem;
      font-weight: 700;
      color: #111827;
      margin: 0 0 0.25rem 0;
    }

    .order-date {
      color: #6b7280;
      margin: 0;
      font-size: 0.875rem;
    }

    .status-badge {
      padding: 0.5rem 1rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .status--confirmed { background: #dbeafe; color: #1e40af; }
    .status--preparing { background: #fef3c7; color: #92400e; }
    .status--ready { background: #d1fae5; color: #065f46; }
    .status--delivering { background: #e0e7ff; color: #3730a3; }
    .status--delivered { background: #dcfce7; color: #166534; }
    .status--cancelled { background: #fee2e2; color: #991b1b; }

    .order-summary {
      padding: 1rem 2rem;
    }

    .order-details {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }

    .detail-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .detail-label {
      color: #6b7280;
      font-size: 0.875rem;
    }

    .detail-value {
      font-weight: 600;
      color: #111827;
    }

    .total-price {
      color: #ec4899;
      font-size: 1.125rem;
    }

    .order-items {
      border-top: 1px solid #f3f4f6;
    }

    .items-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 2rem;
      background: #f9fafb;
    }

    .items-header h4 {
      margin: 0;
      font-size: 1rem;
      font-weight: 600;
      color: #111827;
    }

    .toggle-items {
      background: none;
      border: none;
      color: #ec4899;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
    }

    .toggle-icon {
      transition: transform 0.3s ease;
    }

    .toggle-items.expanded .toggle-icon {
      transform: rotate(180deg);
    }

    .items-list {
      padding: 1rem 2rem 2rem 2rem;
    }

    .order-item {
      display: flex;
      gap: 1rem;
      padding: 1rem 0;
      border-bottom: 1px solid #f3f4f6;
    }

    .order-item:last-child {
      border-bottom: none;
    }

    .item-image {
      width: 4rem;
      height: 4rem;
      border-radius: 0.5rem;
      overflow: hidden;
      flex-shrink: 0;
    }

    .item-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .item-details {
      flex: 1;
      min-width: 0;
    }

    .item-details h5 {
      margin: 0 0 0.25rem 0;
      font-weight: 600;
      color: #111827;
    }

    .item-customizations {
      margin: 0 0 0.5rem 0;
      font-size: 0.875rem;
      color: #6b7280;
    }

    .item-price-qty {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.875rem;
    }

    .item-total {
      font-weight: 600;
      color: #111827;
    }

    .order-actions {
      display: flex;
      gap: 1rem;
      padding: 1rem 2rem 2rem 2rem;
      border-top: 1px solid #f3f4f6;
      flex-wrap: wrap;
    }

    /* Order Tracking */
    .order-tracking {
      padding: 2rem;
      border-top: 1px solid #f3f4f6;
      background: #f9fafb;
    }

    .order-tracking h4 {
      margin: 0 0 1.5rem 0;
      font-weight: 600;
      color: #111827;
    }

    .tracking-timeline {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .tracking-step {
      display: flex;
      gap: 1rem;
      align-items: start;
      opacity: 0.5;
      transition: opacity 0.3s ease;
    }

    .tracking-step.completed,
    .tracking-step.active {
      opacity: 1;
    }

    .step-indicator {
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 50%;
      background: #e5e7eb;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: background 0.3s ease;
    }

    .tracking-step.completed .step-indicator {
      background: #10b981;
      color: white;
    }

    .tracking-step.active .step-indicator {
      background: #ec4899;
      color: white;
    }

    .step-content {
      flex: 1;
      padding-top: 0.25rem;
    }

    .step-content h5 {
      margin: 0 0 0.25rem 0;
      font-weight: 600;
      color: #111827;
    }

    .step-content p {
      margin: 0 0 0.25rem 0;
      color: #6b7280;
      font-size: 0.875rem;
    }

    .step-content small {
      color: #9ca3af;
      font-size: 0.75rem;
    }

    .load-more-section {
      text-align: center;
      margin-top: 3rem;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .order-history-page {
        padding: 1rem 0;
      }

      .page-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }

      .header-content h1 {
        font-size: 2rem;
      }

      .filters-section {
        flex-direction: column;
        gap: 1rem;
      }

      .filter-group,
      .search-group {
        min-width: 0;
      }

      .order-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
        padding: 1.5rem 1.5rem 1rem 1.5rem;
      }

      .order-summary,
      .items-list,
      .order-actions,
      .order-tracking {
        padding-left: 1.5rem;
        padding-right: 1.5rem;
      }

      .order-details {
        grid-template-columns: 1fr;
        gap: 0.5rem;
      }

      .order-actions {
        flex-direction: column;
      }

      .items-header {
        padding: 1rem 1.5rem;
      }

      .tracking-timeline {
        gap: 1.5rem;
      }
    }
  `]
})
export class OrderHistoryComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  orders: UserOrder[] = [];
  filteredOrders: UserOrder[] = [];
  expandedOrders = new Set<string>();
  
  filters: OrderFilter = {
    status: '',
    dateRange: '',
    search: ''
  };

  isLoading = true;
  hasMoreOrders = false;
  currentPage = 1;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadOrders();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadOrders() {
    this.isLoading = true;
    
    this.userService.getUserOrders()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (orders) => {
          this.orders = orders;
          this.applyFilters();
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
          alert('Erro ao carregar pedidos.');
        }
      });
  }

  loadMoreOrders() {
    // Implementation for pagination
    this.currentPage++;
    // Load more orders logic here
  }

  applyFilters() {
    let filtered = [...this.orders];

    // Filter by status
    if (this.filters.status) {
      filtered = filtered.filter(order => order.status === this.filters.status);
    }

    // Filter by date range
    if (this.filters.dateRange) {
      const now = new Date();
      let startDate: Date;

      switch (this.filters.dateRange) {
        case 'last7days':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'last30days':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case 'last3months':
          startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        case 'thisYear':
          startDate = new Date(now.getFullYear(), 0, 1);
          break;
        default:
          startDate = new Date(0);
      }

      filtered = filtered.filter(order => order.createdAt >= startDate);
    }

    // Filter by search
    if (this.filters.search) {
      const search = this.filters.search.toLowerCase();
      filtered = filtered.filter(order => 
        order.id.toLowerCase().includes(search) ||
        order.items.some((item: any) => 
          item.product.name.toLowerCase().includes(search)
        )
      );
    }

    this.filteredOrders = filtered.sort((a, b) => 
      b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  hasActiveFilters(): boolean {
    return !!(this.filters.status || this.filters.dateRange || this.filters.search);
  }

  toggleOrderItems(orderId: string) {
    if (this.expandedOrders.has(orderId)) {
      this.expandedOrders.delete(orderId);
    } else {
      this.expandedOrders.add(orderId);
    }
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }

  formatDateTime(date: Date): string {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'confirmed': 'Confirmado',
      'preparing': 'Preparando',
      'ready': 'Pronto',
      'delivering': 'Saiu para entrega',
      'delivered': 'Entregue',
      'cancelled': 'Cancelado'
    };
    return labels[status] || status;
  }

  getPaymentLabel(method: string): string {
    const labels: { [key: string]: string } = {
      'pix': 'PIX',
      'credit_card': 'Cartão de Crédito',
      'debit_card': 'Cartão de Débito',
      'cash': 'Dinheiro'
    };
    return labels[method] || method;
  }

  canReorder(order: UserOrder): boolean {
    return order.status === 'delivered';
  }

  canCancel(order: UserOrder): boolean {
    return ['confirmed', 'preparing'].includes(order.status);
  }

  canRate(order: UserOrder): boolean {
    return order.status === 'delivered' && !order.hasReview;
  }

  shouldShowTracking(order: UserOrder): boolean {
    return ['confirmed', 'preparing', 'ready', 'delivering'].includes(order.status);
  }

  getTrackingSteps(order: UserOrder) {
    const steps = [
      {
        id: 'confirmed',
        title: 'Pedido Confirmado',
        description: 'Seu pedido foi confirmado e está sendo processado',
        icon: '✓',
        completed: true,
        active: false,
        timestamp: order.createdAt
      },
      {
        id: 'preparing',
        title: 'Preparando',
        description: 'Estamos preparando seus deliciosos doces',
        icon: '👨‍🍳',
        completed: ['preparing', 'ready', 'delivering', 'delivered'].includes(order.status),
        active: order.status === 'preparing',
        timestamp: order.status === 'preparing' ? new Date() : undefined
      },
      {
        id: 'ready',
        title: 'Pronto',
        description: 'Seu pedido está pronto e será enviado em breve',
        icon: '🎂',
        completed: ['ready', 'delivering', 'delivered'].includes(order.status),
        active: order.status === 'ready',
        timestamp: order.status === 'ready' ? new Date() : undefined
      },
      {
        id: 'delivering',
        title: 'Saiu para Entrega',
        description: 'Seu pedido está a caminho',
        icon: '🚚',
        completed: ['delivering', 'delivered'].includes(order.status),
        active: order.status === 'delivering',
        timestamp: order.status === 'delivering' ? new Date() : undefined
      },
      {
        id: 'delivered',
        title: 'Entregue',
        description: 'Seu pedido foi entregue com sucesso',
        icon: '🏠',
        completed: order.status === 'delivered',
        active: order.status === 'delivered',
        timestamp: order.status === 'delivered' ? new Date() : undefined
      }
    ];

    return steps;
  }

  viewOrderDetails(order: UserOrder) {
    // Navigate to order details page
    this.router.navigate(['/orders', order.id]);
  }

  reorderItems(order: UserOrder) {
    // Add all order items to cart
    alert('Itens adicionados ao carrinho!');
    this.router.navigate(['/cart']);
  }

  cancelOrder(order: UserOrder) {
    const reason = prompt('Motivo do cancelamento (opcional):') || 'Cancelado pelo cliente';
    if (reason && confirm('Tem certeza que deseja cancelar este pedido?')) {
      this.userService.cancelOrder(order.id, reason)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            alert('Pedido cancelado com sucesso!');
            this.loadOrders();
          },
          error: () => {
            alert('Erro ao cancelar pedido.');
          }
        });
    }
  }

  rateOrder(order: UserOrder) {
    // Navigate to rating page
    this.router.navigate(['/orders', order.id, 'rate']);
  }

  goToProducts() {
    this.router.navigate(['/products']);
  }
}
