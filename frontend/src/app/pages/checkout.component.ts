import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil, Observable } from 'rxjs';
import { CartService, CartItem, CartSummary } from '../services/cart.service';
import { CheckoutService, Address, PaymentMethod, Order } from '../services/checkout.service';
import { AuthService, User } from '../services/auth.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  template: `
    <div class="checkout-page">
      <div class="container">
        <!-- Page Header -->
        <div class="page-header">
          <h1 class="page-title">🛒 Finalizar Pedido</h1>
          
          <!-- Progress Steps -->
          <div class="checkout-progress">
            <div class="progress-step" [class.active]="currentStep >= 1" [class.completed]="currentStep > 1">
              <div class="step-number">1</div>
              <div class="step-label">Identificação</div>
            </div>
            <div class="progress-line" [class.completed]="currentStep > 1"></div>
            <div class="progress-step" [class.active]="currentStep >= 2" [class.completed]="currentStep > 2">
              <div class="step-number">2</div>
              <div class="step-label">Entrega</div>
            </div>
            <div class="progress-line" [class.completed]="currentStep > 2"></div>
            <div class="progress-step" [class.active]="currentStep >= 3" [class.completed]="currentStep > 3">
              <div class="step-number">3</div>
              <div class="step-label">Pagamento</div>
            </div>
            <div class="progress-line" [class.completed]="currentStep > 3"></div>
            <div class="progress-step" [class.active]="currentStep >= 4">
              <div class="step-number">4</div>
              <div class="step-label">Confirmação</div>
            </div>
          </div>
        </div>

        <div class="checkout-layout">
          <!-- Main Content -->
          <div class="checkout-main">
            
            <!-- Step 1: Customer Information -->
            <div *ngIf="currentStep === 1" class="checkout-step">
              <div class="step-header">
                <h2 class="step-title">👤 Suas Informações</h2>
                <p class="step-description">Precisamos de alguns dados para prosseguir com o pedido</p>
              </div>
              
              <form [formGroup]="customerForm" class="checkout-form">
                <div class="form-row">
                  <div class="form-group">
                    <label for="customerName" class="form-label">Nome completo *</label>
                    <input
                      id="customerName"
                      type="text"
                      formControlName="name"
                      class="form-input"
                      placeholder="Seu nome completo">
                    <div *ngIf="customerForm.get('name')?.invalid && customerForm.get('name')?.touched" 
                         class="form-error">
                      Nome é obrigatório
                    </div>
                  </div>
                </div>
                
                <div class="form-row">
                  <div class="form-group">
                    <label for="customerEmail" class="form-label">E-mail *</label>
                    <input
                      id="customerEmail"
                      type="email"
                      formControlName="email"
                      class="form-input"
                      placeholder="seu@email.com">
                    <div *ngIf="customerForm.get('email')?.invalid && customerForm.get('email')?.touched" 
                         class="form-error">
                      E-mail válido é obrigatório
                    </div>
                  </div>
                  
                  <div class="form-group">
                    <label for="customerPhone" class="form-label">Telefone *</label>
                    <input
                      id="customerPhone"
                      type="tel"
                      formControlName="phone"
                      class="form-input"
                      placeholder="(11) 99999-9999">
                    <div *ngIf="customerForm.get('phone')?.invalid && customerForm.get('phone')?.touched" 
                         class="form-error">
                      Telefone é obrigatório
                    </div>
                  </div>
                </div>
                
                <div class="form-actions">
                  <button type="button" class="btn btn--outline" (click)="goBack()">
                    ← Voltar ao Carrinho
                  </button>
                  <button type="button" class="btn btn--sweet" (click)="nextStep()" [disabled]="customerForm.invalid">
                    Continuar →
                  </button>
                </div>
              </form>
            </div>

            <!-- Step 2: Delivery Address -->
            <div *ngIf="currentStep === 2" class="checkout-step">
              <div class="step-header">
                <h2 class="step-title">📍 Endereço de Entrega</h2>
                <p class="step-description">Onde você gostaria de receber seu pedido?</p>
              </div>
              
              <form [formGroup]="addressForm" class="checkout-form">
                <div class="form-row">
                  <div class="form-group">
                    <label for="zipCode" class="form-label">CEP *</label>
                    <div class="input-with-button">
                      <input
                        id="zipCode"
                        type="text"
                        formControlName="zipCode"
                        class="form-input"
                        placeholder="00000-000"
                        (blur)="validateZipCode()"
                        maxlength="9">
                      <button type="button" class="input-btn" (click)="validateZipCode()" [disabled]="isValidatingZip">
                        <span *ngIf="!isValidatingZip">Buscar</span>
                        <span *ngIf="isValidatingZip">...</span>
                      </button>
                    </div>
                    <div *ngIf="addressForm.get('zipCode')?.invalid && addressForm.get('zipCode')?.touched" 
                         class="form-error">
                      CEP válido é obrigatório
                    </div>
                  </div>
                </div>
                
                <div class="form-row">
                  <div class="form-group flex-grow">
                    <label for="street" class="form-label">Rua *</label>
                    <input
                      id="street"
                      type="text"
                      formControlName="street"
                      class="form-input"
                      placeholder="Nome da rua">
                  </div>
                  
                  <div class="form-group">
                    <label for="number" class="form-label">Número *</label>
                    <input
                      id="number"
                      type="text"
                      formControlName="number"
                      class="form-input"
                      placeholder="123">
                  </div>
                </div>
                
                <div class="form-row">
                  <div class="form-group">
                    <label for="complement" class="form-label">Complemento</label>
                    <input
                      id="complement"
                      type="text"
                      formControlName="complement"
                      class="form-input"
                      placeholder="Apto, bloco, etc.">
                  </div>
                  
                  <div class="form-group">
                    <label for="neighborhood" class="form-label">Bairro *</label>
                    <input
                      id="neighborhood"
                      type="text"
                      formControlName="neighborhood"
                      class="form-input"
                      placeholder="Nome do bairro">
                  </div>
                </div>
                
                <div class="form-row">
                  <div class="form-group">
                    <label for="city" class="form-label">Cidade *</label>
                    <input
                      id="city"
                      type="text"
                      formControlName="city"
                      class="form-input"
                      placeholder="Nome da cidade">
                  </div>
                  
                  <div class="form-group">
                    <label for="state" class="form-label">Estado *</label>
                    <select id="state" formControlName="state" class="form-select">
                      <option value="">Selecione</option>
                      <option value="SP">São Paulo</option>
                      <option value="RJ">Rio de Janeiro</option>
                      <option value="MG">Minas Gerais</option>
                      <!-- Adicionar outros estados -->
                    </select>
                  </div>
                </div>
                
                <div class="form-row">
                  <div class="form-group full-width">
                    <label for="reference" class="form-label">Ponto de referência</label>
                    <input
                      id="reference"
                      type="text"
                      formControlName="reference"
                      class="form-input"
                      placeholder="Próximo ao supermercado, em frente à escola, etc.">
                  </div>
                </div>
                
                <!-- Delivery Estimate -->
                <div *ngIf="deliveryEstimate" class="delivery-estimate-box">
                  <div class="estimate-icon">🚚</div>
                  <div class="estimate-content">
                    <div class="estimate-title">Previsão de entrega</div>
                    <div class="estimate-time">{{ deliveryEstimate.estimate }}</div>
                    <div class="estimate-fee" *ngIf="deliveryEstimate.fee > 0">
                      Taxa de entrega: R$ {{ deliveryEstimate.fee.toFixed(2).replace('.', ',') }}
                    </div>
                    <div class="estimate-fee free" *ngIf="deliveryEstimate.fee === 0">
                      Entrega gratuita! 🎉
                    </div>
                  </div>
                </div>
                
                <div class="form-actions">
                  <button type="button" class="btn btn--outline" (click)="previousStep()">
                    ← Voltar
                  </button>
                  <button type="button" class="btn btn--sweet" (click)="nextStep()" [disabled]="addressForm.invalid">
                    Continuar →
                  </button>
                </div>
              </form>
            </div>

            <!-- Step 3: Payment Method -->
            <div *ngIf="currentStep === 3" class="checkout-step">
              <div class="step-header">
                <h2 class="step-title">💳 Forma de Pagamento</h2>
                <p class="step-description">Escolha como você deseja pagar</p>
              </div>
              
              <!-- Payment Methods -->
              <div class="payment-methods">
                <div *ngFor="let method of paymentMethods" 
                     class="payment-method"
                     [class.selected]="selectedPaymentMethod?.id === method.id"
                     (click)="selectPaymentMethod(method)">
                  <div class="method-icon">{{ method.icon }}</div>
                  <div class="method-info">
                    <div class="method-name">{{ method.name }}</div>
                    <div class="method-description">{{ method.description }}</div>
                    <div *ngIf="method.fee !== undefined && method.fee !== 0" class="method-fee">
                      <span *ngIf="method.fee && method.fee > 0">Taxa: {{ (method.fee * 100).toFixed(1) }}%</span>
                      <span *ngIf="method.fee && method.fee < 0" class="discount">Desconto: {{ Math.abs(method.fee * 100).toFixed(0) }}%</span>
                    </div>
                  </div>
                  <div class="method-radio">
                    <div class="radio-button" [class.checked]="selectedPaymentMethod?.id === method.id"></div>
                  </div>
                </div>
              </div>
              
              <!-- Payment Details Forms -->
              <div *ngIf="selectedPaymentMethod" class="payment-details">
                
                <!-- Credit Card Form -->
                <div *ngIf="selectedPaymentMethod.type === 'credit_card'" class="payment-form">
                  <form [formGroup]="creditCardForm">
                    <div class="form-row">
                      <div class="form-group full-width">
                        <label for="cardNumber" class="form-label">Número do cartão *</label>
                        <input
                          id="cardNumber"
                          type="text"
                          formControlName="number"
                          class="form-input"
                          placeholder="0000 0000 0000 0000"
                          maxlength="19"
                          (input)="formatCardNumber($event)">
                        <div *ngIf="cardBrand" class="card-brand">{{ cardBrand }}</div>
                      </div>
                    </div>
                    
                    <div class="form-row">
                      <div class="form-group">
                        <label for="cardName" class="form-label">Nome no cartão *</label>
                        <input
                          id="cardName"
                          type="text"
                          formControlName="name"
                          class="form-input"
                          placeholder="Como está no cartão">
                      </div>
                    </div>
                    
                    <div class="form-row">
                      <div class="form-group">
                        <label for="expiryDate" class="form-label">Validade *</label>
                        <input
                          id="expiryDate"
                          type="text"
                          formControlName="expiry"
                          class="form-input"
                          placeholder="MM/AA"
                          maxlength="5"
                          (input)="formatExpiry($event)">
                      </div>
                      
                      <div class="form-group">
                        <label for="cvv" class="form-label">CVV *</label>
                        <input
                          id="cvv"
                          type="text"
                          formControlName="cvv"
                          class="form-input"
                          placeholder="123"
                          maxlength="4">
                      </div>
                      
                      <div class="form-group">
                        <label for="installments" class="form-label">Parcelas</label>
                        <select id="installments" formControlName="installments" class="form-select">
                          <option *ngFor="let installment of selectedPaymentMethod.installments" [value]="installment">
                            {{ installment }}x de R$ {{ (cartSummary.total / installment).toFixed(2).replace('.', ',') }}
                            <span *ngIf="installment === 1"> à vista</span>
                          </option>
                        </select>
                      </div>
                    </div>
                  </form>
                </div>
                
                <!-- PIX Form -->
                <div *ngIf="selectedPaymentMethod.type === 'pix'" class="payment-form">
                  <div class="pix-info">
                    <div class="pix-icon">📱</div>
                    <div class="pix-content">
                      <h4>Pagamento via PIX</h4>
                      <p>Após confirmar o pedido, você receberá o código PIX para pagamento.</p>
                      <div class="pix-discount">
                        <strong>💰 Desconto de 5% aplicado!</strong>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- Money Form -->
                <div *ngIf="selectedPaymentMethod.type === 'money'" class="payment-form">
                  <form [formGroup]="moneyForm">
                    <div class="form-group">
                      <label class="form-checkbox">
                        <input type="checkbox" formControlName="needsChange">
                        <span class="checkmark"></span>
                        Preciso de troco
                      </label>
                    </div>
                    
                    <div *ngIf="moneyForm.value.needsChange" class="form-group">
                      <label for="changeFor" class="form-label">Troco para quanto?</label>
                      <input
                        id="changeFor"
                        type="number"
                        formControlName="changeFor"
                        class="form-input"
                        placeholder="0,00"
                        min="0"
                        step="0.01">
                    </div>
                  </form>
                </div>
              </div>
              
              <div class="form-actions">
                <button type="button" class="btn btn--outline" (click)="previousStep()">
                  ← Voltar
                </button>
                <button type="button" class="btn btn--sweet" (click)="nextStep()" [disabled]="!isPaymentValid()">
                  Continuar →
                </button>
              </div>
            </div>

            <!-- Step 4: Order Confirmation -->
            <div *ngIf="currentStep === 4" class="checkout-step">
              <div class="step-header">
                <h2 class="step-title">✅ Confirmar Pedido</h2>
                <p class="step-description">Revise todos os dados antes de finalizar</p>
              </div>
              
              <!-- Order Summary -->
              <div class="order-confirmation">
                <!-- Customer Info -->
                <div class="confirmation-section">
                  <h3 class="section-title">👤 Dados do Cliente</h3>
                  <div class="section-content">
                    <p><strong>Nome:</strong> {{ customerForm.value.name }}</p>
                    <p><strong>E-mail:</strong> {{ customerForm.value.email }}</p>
                    <p><strong>Telefone:</strong> {{ customerForm.value.phone }}</p>
                  </div>
                </div>
                
                <!-- Delivery Address -->
                <div class="confirmation-section">
                  <h3 class="section-title">📍 Endereço de Entrega</h3>
                  <div class="section-content">
                    <p>{{ getFullAddress() }}</p>
                    <p *ngIf="addressForm.value.reference">
                      <strong>Referência:</strong> {{ addressForm.value.reference }}
                    </p>
                  </div>
                </div>
                
                <!-- Payment Method -->
                <div class="confirmation-section">
                  <h3 class="section-title">💳 Forma de Pagamento</h3>
                  <div class="section-content">
                    <p>{{ selectedPaymentMethod?.name }}</p>
                    <div *ngIf="selectedPaymentMethod?.type === 'credit_card' && creditCardForm.value.installments > 1">
                      <p>{{ creditCardForm.value.installments }}x de R$ {{ (cartSummary.total / creditCardForm.value.installments).toFixed(2).replace('.', ',') }}</p>
                    </div>
                    <div *ngIf="selectedPaymentMethod?.type === 'money' && moneyForm.value.needsChange">
                      <p>Troco para: R$ {{ moneyForm.value.changeFor?.toFixed(2).replace('.', ',') }}</p>
                    </div>
                  </div>
                </div>
                
                <!-- Order Items -->
                <div class="confirmation-section">
                  <h3 class="section-title">🛒 Itens do Pedido</h3>
                  <div class="order-items">
                    <div *ngFor="let item of cartItems" class="order-item">
                      <div class="item-image">
                        <img [src]="item.productImage" [alt]="item.productName">
                      </div>
                      <div class="item-details">
                        <h4>{{ item.productName }}</h4>
                        <p class="item-customizations" *ngIf="hasCustomizations(item)">
                          <span *ngIf="item.customization.size">{{ item.customization.size.name }}</span>
                          <span *ngIf="item.customization.flavor"> • {{ item.customization.flavor.name }}</span>
                        </p>
                        <p class="item-quantity">Quantidade: {{ item.quantity }}</p>
                      </div>
                      <div class="item-price">
                        R$ {{ item.totalPrice.toFixed(2).replace('.', ',') }}
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- Special Notes -->
                <div class="confirmation-section">
                  <h3 class="section-title">📝 Observações</h3>
                  <textarea
                    [(ngModel)]="orderNotes"
                    class="order-notes"
                    placeholder="Alguma observação especial para o pedido?"
                    rows="3"></textarea>
                </div>
              </div>
              
              <div class="form-actions">
                <button type="button" class="btn btn--outline" (click)="previousStep()">
                  ← Voltar
                </button>
                <button 
                  type="button" 
                  class="btn btn--sweet" 
                  (click)="finalizeOrder()" 
                  [disabled]="isProcessingOrder"
                  [class.loading]="isProcessingOrder">
                  <span *ngIf="!isProcessingOrder">Finalizar Pedido</span>
                  <span *ngIf="isProcessingOrder">Processando...</span>
                </button>
              </div>
            </div>
          </div>
          
          <!-- Order Summary Sidebar -->
          <div class="checkout-sidebar">
            <div class="order-summary">
              <h3 class="summary-title">Resumo do Pedido</h3>
              
              <!-- Items Summary -->
              <div class="summary-items">
                <div *ngFor="let item of cartItems" class="summary-item">
                  <div class="item-info">
                    <span class="item-name">{{ item.productName }}</span>
                    <span class="item-qty">{{ item.quantity }}x</span>
                  </div>
                  <span class="item-total">R$ {{ item.totalPrice.toFixed(2).replace('.', ',') }}</span>
                </div>
              </div>
              
              <div class="summary-divider"></div>
              
              <!-- Totals -->
              <div class="summary-totals">
                <div class="total-row">
                  <span>Subtotal:</span>
                  <span>R$ {{ cartSummary.subtotal.toFixed(2).replace('.', ',') }}</span>
                </div>
                
                <div class="total-row">
                  <span>Entrega:</span>
                  <span [class.free]="cartSummary.deliveryFee === 0">
                    <span *ngIf="cartSummary.deliveryFee === 0">Grátis</span>
                    <span *ngIf="cartSummary.deliveryFee > 0">R$ {{ cartSummary.deliveryFee.toFixed(2).replace('.', ',') }}</span>
                  </span>
                </div>
                
                <div *ngIf="cartSummary.discount > 0" class="total-row discount">
                  <span>Desconto:</span>
                  <span>-R$ {{ cartSummary.discount.toFixed(2).replace('.', ',') }}</span>
                </div>
                
                <div class="summary-divider"></div>
                
                <div class="total-row final">
                  <span>Total:</span>
                  <span>R$ {{ cartSummary.total.toFixed(2).replace('.', ',') }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .checkout-page {
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
      margin: 0 0 2rem 0;
    }

    /* Progress Steps */
    .checkout-progress {
      display: flex;
      align-items: center;
      justify-content: center;
      max-width: 600px;
      margin: 0 auto;
    }

    .progress-step {
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
    }

    .step-number {
      width: 3rem;
      height: 3rem;
      border-radius: 50%;
      background: #e5e7eb;
      color: #6b7280;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      margin-bottom: 0.5rem;
      transition: all 0.3s ease;
    }

    .progress-step.active .step-number {
      background: #ec4899;
      color: white;
    }

    .progress-step.completed .step-number {
      background: #10b981;
      color: white;
    }

    .step-label {
      font-size: 0.875rem;
      color: #6b7280;
      font-weight: 600;
    }

    .progress-step.active .step-label {
      color: #ec4899;
    }

    .progress-line {
      width: 4rem;
      height: 2px;
      background: #e5e7eb;
      margin: 0 1rem;
      transition: all 0.3s ease;
      align-self: flex-start;
      margin-top: 1.5rem;
    }

    .progress-line.completed {
      background: #10b981;
    }

    /* Layout */
    .checkout-layout {
      display: grid;
      grid-template-columns: 1fr 400px;
      gap: 3rem;
      align-items: start;
    }

    .checkout-main {
      background: white;
      border-radius: 1rem;
      padding: 3rem;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    }

    /* Steps */
    .checkout-step {
      animation: fadeIn 0.3s ease-in-out;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .step-header {
      margin-bottom: 2rem;
    }

    .step-title {
      font-size: 1.75rem;
      font-weight: 700;
      color: #111827;
      margin: 0 0 0.5rem 0;
    }

    .step-description {
      color: #6b7280;
      font-size: 1.125rem;
      margin: 0;
    }

    /* Forms */
    .checkout-form {
      max-width: 600px;
    }

    .form-row {
      display: flex;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .form-group {
      flex: 1;
      min-width: 0;
    }

    .form-group.flex-grow {
      flex: 2;
    }

    .form-group.full-width {
      flex: 1 1 100%;
    }

    .form-label {
      display: block;
      font-weight: 600;
      color: #374151;
      margin-bottom: 0.5rem;
    }

    .form-input,
    .form-select {
      width: 100%;
      padding: 0.75rem 1rem;
      border: 1px solid #d1d5db;
      border-radius: 0.5rem;
      font-size: 1rem;
      transition: border-color 0.3s ease;
    }

    .form-input:focus,
    .form-select:focus {
      outline: none;
      border-color: #ec4899;
      box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.1);
    }

    .form-error {
      color: #ef4444;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }

    .input-with-button {
      display: flex;
      gap: 0.5rem;
    }

    .input-btn {
      padding: 0.75rem 1.5rem;
      background: #ec4899;
      color: white;
      border: none;
      border-radius: 0.5rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      white-space: nowrap;
    }

    .input-btn:hover:not(:disabled) {
      background: #be185d;
    }

    .input-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    /* Delivery Estimate */
    .delivery-estimate-box {
      background: #f0f9ff;
      border-radius: 1rem;
      padding: 1.5rem;
      margin: 1.5rem 0;
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .estimate-icon {
      font-size: 2rem;
    }

    .estimate-title {
      font-weight: 600;
      color: #111827;
      margin-bottom: 0.25rem;
    }

    .estimate-time {
      color: #0369a1;
      font-weight: 700;
      margin-bottom: 0.25rem;
    }

    .estimate-fee {
      font-size: 0.875rem;
      color: #6b7280;
    }

    .estimate-fee.free {
      color: #10b981;
      font-weight: 600;
    }

    /* Payment Methods */
    .payment-methods {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .payment-method {
      border: 2px solid #e5e7eb;
      border-radius: 1rem;
      padding: 1.5rem;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .payment-method:hover {
      border-color: #ec4899;
      background: #fdf2f8;
    }

    .payment-method.selected {
      border-color: #ec4899;
      background: #fdf2f8;
    }

    .method-icon {
      font-size: 2rem;
      flex-shrink: 0;
    }

    .method-info {
      flex: 1;
    }

    .method-name {
      font-weight: 600;
      color: #111827;
      margin-bottom: 0.25rem;
    }

    .method-description {
      color: #6b7280;
      font-size: 0.875rem;
      margin-bottom: 0.25rem;
    }

    .method-fee {
      font-size: 0.875rem;
      font-weight: 600;
    }

    .method-fee .discount {
      color: #10b981;
    }

    .method-radio {
      flex-shrink: 0;
    }

    .radio-button {
      width: 1.5rem;
      height: 1.5rem;
      border: 2px solid #d1d5db;
      border-radius: 50%;
      position: relative;
      transition: all 0.3s ease;
    }

    .radio-button.checked {
      border-color: #ec4899;
    }

    .radio-button.checked::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 0.5rem;
      height: 0.5rem;
      background: #ec4899;
      border-radius: 50%;
    }

    /* Payment Forms */
    .payment-details {
      background: #f8fafc;
      border-radius: 1rem;
      padding: 2rem;
      margin-bottom: 2rem;
    }

    .card-brand {
      position: absolute;
      right: 1rem;
      top: 50%;
      transform: translateY(-50%);
      font-size: 0.875rem;
      font-weight: 600;
      color: #6b7280;
    }

    .form-group {
      position: relative;
    }

    .pix-info {
      display: flex;
      align-items: center;
      gap: 1rem;
      text-align: center;
    }

    .pix-icon {
      font-size: 3rem;
      flex-shrink: 0;
    }

    .pix-content h4 {
      margin: 0 0 0.5rem 0;
      color: #111827;
    }

    .pix-content p {
      color: #6b7280;
      margin: 0 0 1rem 0;
    }

    .pix-discount {
      background: #d1fae5;
      color: #065f46;
      padding: 0.75rem;
      border-radius: 0.5rem;
      font-size: 0.875rem;
    }

    .form-checkbox {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      cursor: pointer;
    }

    .form-checkbox input {
      display: none;
    }

    .checkmark {
      width: 1.25rem;
      height: 1.25rem;
      border: 2px solid #d1d5db;
      border-radius: 0.25rem;
      position: relative;
      transition: all 0.3s ease;
    }

    .form-checkbox input:checked + .checkmark {
      background: #ec4899;
      border-color: #ec4899;
    }

    .form-checkbox input:checked + .checkmark::after {
      content: '✓';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: white;
      font-weight: bold;
      font-size: 0.875rem;
    }

    /* Order Confirmation */
    .order-confirmation {
      max-width: 600px;
    }

    .confirmation-section {
      margin-bottom: 2rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid #e5e7eb;
    }

    .confirmation-section:last-child {
      border-bottom: none;
    }

    .section-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: #111827;
      margin: 0 0 1rem 0;
    }

    .section-content p {
      margin: 0 0 0.5rem 0;
      color: #6b7280;
    }

    .section-content p:last-child {
      margin-bottom: 0;
    }

    .order-items {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .order-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background: #f8fafc;
      border-radius: 0.75rem;
    }

    .order-item .item-image {
      width: 60px;
      height: 60px;
      flex-shrink: 0;
    }

    .order-item .item-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 0.5rem;
    }

    .order-item .item-details {
      flex: 1;
    }

    .order-item .item-details h4 {
      margin: 0 0 0.25rem 0;
      font-size: 1rem;
      font-weight: 600;
      color: #111827;
    }

    .item-customizations {
      font-size: 0.875rem;
      color: #6b7280;
      margin: 0 0 0.25rem 0;
    }

    .item-quantity {
      font-size: 0.875rem;
      color: #6b7280;
      margin: 0;
    }

    .order-item .item-price {
      font-weight: 700;
      color: #111827;
    }

    .order-notes {
      width: 100%;
      padding: 1rem;
      border: 1px solid #d1d5db;
      border-radius: 0.75rem;
      font-size: 1rem;
      resize: vertical;
      min-height: 80px;
    }

    .order-notes:focus {
      outline: none;
      border-color: #ec4899;
      box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.1);
    }

    /* Form Actions */
    .form-actions {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
      margin-top: 2rem;
    }

    /* Sidebar */
    .checkout-sidebar {
      position: sticky;
      top: 2rem;
    }

    .order-summary {
      background: white;
      border-radius: 1rem;
      padding: 2rem;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    }

    .summary-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: #111827;
      margin: 0 0 1.5rem 0;
    }

    .summary-items {
      margin-bottom: 1.5rem;
    }

    .summary-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .summary-item:last-child {
      margin-bottom: 0;
    }

    .item-info {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .item-name {
      font-weight: 600;
      color: #111827;
      font-size: 0.875rem;
    }

    .item-qty {
      font-size: 0.75rem;
      color: #6b7280;
    }

    .item-total {
      font-weight: 600;
      color: #111827;
    }

    .summary-divider {
      height: 1px;
      background: #e5e7eb;
      margin: 1.5rem 0;
    }

    .summary-totals {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .total-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #6b7280;
    }

    .total-row.discount {
      color: #10b981;
    }

    .total-row.final {
      font-size: 1.125rem;
      font-weight: 700;
      color: #111827;
      padding-top: 0.75rem;
      border-top: 2px solid #e5e7eb;
    }

    .total-row .free {
      color: #10b981;
      font-weight: 600;
    }

    /* Loading State */
    .btn.loading {
      position: relative;
      color: transparent;
    }

    .btn.loading::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 1rem;
      height: 1rem;
      border: 2px solid #ffffff;
      border-top: 2px solid transparent;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: translate(-50%, -50%) rotate(0deg); }
      100% { transform: translate(-50%, -50%) rotate(360deg); }
    }

    /* Responsive Design */
    @media (max-width: 1024px) {
      .checkout-layout {
        grid-template-columns: 1fr;
        gap: 2rem;
      }

      .checkout-sidebar {
        position: static;
        order: -1;
      }
    }

    @media (max-width: 768px) {
      .checkout-page {
        padding: 1rem 0;
      }

      .page-title {
        font-size: 2rem;
      }

      .checkout-main {
        padding: 2rem;
      }

      .checkout-progress {
        max-width: 100%;
        overflow-x: auto;
      }

      .progress-line {
        width: 2rem;
        margin: 0 0.5rem;
      }

      .form-row {
        flex-direction: column;
        gap: 0.75rem;
      }

      .form-actions {
        flex-direction: column;
      }

      .order-item {
        flex-direction: column;
        text-align: center;
      }
    }
  `]
})
export class CheckoutComponent implements OnInit, OnDestroy {
  Math = Math; // For template access
  currentStep = 1;
  cartItems: CartItem[] = [];
  cartSummary: CartSummary = {
    subtotal: 0,
    deliveryFee: 0,
    discount: 0,
    total: 0,
    itemCount: 0,
    weight: 0
  };
  
  // Forms
  customerForm!: FormGroup;
  addressForm!: FormGroup;
  creditCardForm!: FormGroup;
  moneyForm!: FormGroup;
  
  // Payment
  paymentMethods: PaymentMethod[] = [];
  selectedPaymentMethod: PaymentMethod | null = null;
  cardBrand = '';
  
  // States
  isValidatingZip = false;
  deliveryEstimate: any = null;
  isProcessingOrder = false;
  orderNotes = '';
  
  private destroy$ = new Subject<void>();

  constructor(
    private cartService: CartService,
    private checkoutService: CheckoutService,
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.initializeForms();
  }

  ngOnInit() {
    // Check if cart is empty
    this.cartService.getCartItems()
      .pipe(takeUntil(this.destroy$))
      .subscribe(items => {
        this.cartItems = items;
        if (items.length === 0) {
          this.router.navigate(['/carrinho']);
        }
      });

    this.cartService.getCartSummary()
      .pipe(takeUntil(this.destroy$))
      .subscribe(summary => {
        this.cartSummary = summary;
      });

    // Load payment methods
    this.checkoutService.getPaymentMethods()
      .pipe(takeUntil(this.destroy$))
      .subscribe(methods => {
        this.paymentMethods = methods;
      });

    // Pre-fill customer data if user is logged in
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.customerForm.patchValue({
        name: currentUser.name,
        email: currentUser.email,
        phone: currentUser.phone || ''
      });
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForms() {
    this.customerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.minLength(10)]]
    });

    this.addressForm = this.fb.group({
      zipCode: ['', [Validators.required, Validators.pattern(/^\d{5}-?\d{3}$/)]],
      street: ['', Validators.required],
      number: ['', Validators.required],
      complement: [''],
      neighborhood: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      reference: ['']
    });

    this.creditCardForm = this.fb.group({
      number: ['', [Validators.required, Validators.minLength(13)]],
      name: ['', Validators.required],
      expiry: ['', [Validators.required, Validators.pattern(/^\d{2}\/\d{2}$/)]],
      cvv: ['', [Validators.required, Validators.minLength(3)]],
      installments: [1, Validators.required]
    });

    this.moneyForm = this.fb.group({
      needsChange: [false],
      changeFor: [0]
    });
  }

  // Navigation
  nextStep() {
    if (this.currentStep < 4) {
      this.currentStep++;
    }
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  goBack() {
    this.router.navigate(['/carrinho']);
  }

  // Address validation
  validateZipCode() {
    const zipCode = this.addressForm.get('zipCode')?.value;
    if (!zipCode || zipCode.length < 8) return;

    this.isValidatingZip = true;
    
    this.checkoutService.validateZipCode(zipCode)
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        this.isValidatingZip = false;
        
        if (result.valid) {
          this.addressForm.patchValue({
            street: result.address.street,
            neighborhood: result.address.neighborhood,
            city: result.address.city,
            state: result.address.state
          });
          
          // Calculate delivery fee
          this.checkoutService.calculateDeliveryFee(zipCode, this.cartSummary.weight)
            .pipe(takeUntil(this.destroy$))
            .subscribe(estimate => {
              this.deliveryEstimate = estimate;
            });
        }
      });
  }

  // Payment methods
  selectPaymentMethod(method: PaymentMethod) {
    this.selectedPaymentMethod = method;
  }

  formatCardNumber(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    event.target.value = value;
    this.creditCardForm.patchValue({ number: value });

    // Validate and detect brand
    if (value.replace(/\s/g, '').length >= 6) {
      this.checkoutService.validateCreditCard(value)
        .pipe(takeUntil(this.destroy$))
        .subscribe(result => {
          this.cardBrand = result.brand || '';
        });
    }
  }

  formatExpiry(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    event.target.value = value;
    this.creditCardForm.patchValue({ expiry: value });
  }

  isPaymentValid(): boolean {
    if (!this.selectedPaymentMethod) return false;

    switch (this.selectedPaymentMethod.type) {
      case 'credit_card':
      case 'debit_card':
        return this.creditCardForm.valid;
      case 'money':
        return !this.moneyForm.value.needsChange || this.moneyForm.value.changeFor > this.cartSummary.total;
      case 'pix':
        return true;
      default:
        return false;
    }
  }

  // Order confirmation
  getFullAddress(): string {
    const addr = this.addressForm.value;
    return `${addr.street}, ${addr.number}${addr.complement ? `, ${addr.complement}` : ''} - ${addr.neighborhood}, ${addr.city} - ${addr.state}, ${addr.zipCode}`;
  }

  hasCustomizations(item: CartItem): boolean {
    const { customization } = item;
    return !!(
      customization.size ||
      customization.flavor ||
      customization.decoration ||
      (customization.extras && customization.extras.length > 0)
    );
  }

  // Finalize order
  finalizeOrder() {
    this.isProcessingOrder = true;

    const orderData = {
      items: this.cartItems,
      customer: this.customerForm.value,
      address: this.addressForm.value,
      paymentMethod: this.selectedPaymentMethod,
      paymentDetails: this.getPaymentDetails(),
      summary: this.cartSummary,
      notes: this.orderNotes
    };

    // Process payment first
    this.checkoutService.processPayment(orderData.paymentDetails)
      .pipe(takeUntil(this.destroy$))
      .subscribe(paymentResult => {
        if (paymentResult.success) {
          // Create order
          this.checkoutService.createOrder({
            ...orderData,
            paymentDetails: {
              ...orderData.paymentDetails,
              transactionId: paymentResult.transactionId
            }
          })
          .pipe(takeUntil(this.destroy$))
          .subscribe(order => {
            this.isProcessingOrder = false;
            
            // Clear cart
            this.cartService.clearCart();
            
            // Navigate to success page
            this.router.navigate(['/pedido-confirmado'], {
              queryParams: { orderNumber: order.orderNumber }
            });
          });
        } else {
          this.isProcessingOrder = false;
          alert('Erro no pagamento: ' + paymentResult.error);
        }
      });
  }

  private getPaymentDetails() {
    if (!this.selectedPaymentMethod) return {};

    switch (this.selectedPaymentMethod.type) {
      case 'credit_card':
      case 'debit_card':
        return {
          type: this.selectedPaymentMethod.type,
          cardNumber: this.creditCardForm.value.number.replace(/\s/g, '').slice(-4),
          cardName: this.creditCardForm.value.name,
          installments: this.creditCardForm.value.installments || 1
        };
      case 'money':
        return {
          type: 'money',
          needsChange: this.moneyForm.value.needsChange,
          changeFor: this.moneyForm.value.changeFor
        };
      case 'pix':
        return {
          type: 'pix'
        };
      default:
        return {};
    }
  }
}
