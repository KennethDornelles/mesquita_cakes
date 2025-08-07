import { Component, OnInit, OnDestroy } from '@angular/core';

import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { UserService, UserProfile, Address } from '../services/user.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule],
  template: `
    <div class="profile-page">
      <div class="container">
        <!-- Page Header -->
        <div class="page-header">
          <h1 class="page-title">👤 Meu Perfil</h1>
          <p class="page-subtitle">Gerencie suas informações pessoais e preferências</p>
        </div>
    
        <div class="profile-layout">
          <!-- Sidebar Navigation -->
          <div class="profile-sidebar">
            <div class="profile-nav">
              @for (tab of tabs; track tab) {
                <button
                  class="nav-item"
                  [class.active]="activeTab === tab.id"
                  (click)="setActiveTab(tab.id)">
                  <span class="nav-icon">{{ tab.icon }}</span>
                  <span class="nav-label">{{ tab.label }}</span>
                </button>
              }
            </div>
    
            <!-- User Summary -->
            @if (userProfile) {
              <div class="user-summary">
                <div class="user-avatar">
                  <span>{{ getUserInitials(userProfile.name) }}</span>
                </div>
                <div class="user-info">
                  <h3>{{ userProfile.name }}</h3>
                  <p>{{ userProfile.email }}</p>
                  <div class="loyalty-points">
                    <span class="points-icon">🏆</span>
                    <span>{{ userProfile.statistics.loyaltyPoints }} pontos</span>
                  </div>
                </div>
              </div>
            }
          </div>
    
          <!-- Main Content -->
          <div class="profile-content">
    
            <!-- Personal Information Tab -->
            @if (activeTab === 'personal') {
              <div class="tab-content">
                <div class="section-header">
                  <h2>📝 Informações Pessoais</h2>
                  <p>Mantenha seus dados sempre atualizados</p>
                </div>
                <form [formGroup]="personalForm" (ngSubmit)="updatePersonalInfo()" class="profile-form">
                  <div class="form-row">
                    <div class="form-group">
                      <label for="name" class="form-label">Nome completo *</label>
                      <input
                        id="name"
                        type="text"
                        formControlName="name"
                        class="form-input"
                        placeholder="Seu nome completo">
                      @if (personalForm.get('name')?.invalid && personalForm.get('name')?.touched) {
                        <div
                          class="form-error">
                          Nome é obrigatório
                        </div>
                      }
                    </div>
                  </div>
                  <div class="form-row">
                    <div class="form-group">
                      <label for="email" class="form-label">E-mail *</label>
                      <input
                        id="email"
                        type="email"
                        formControlName="email"
                        class="form-input"
                        placeholder="seu@email.com">
                      @if (personalForm.get('email')?.invalid && personalForm.get('email')?.touched) {
                        <div
                          class="form-error">
                          E-mail válido é obrigatório
                        </div>
                      }
                    </div>
                    <div class="form-group">
                      <label for="phone" class="form-label">Telefone *</label>
                      <input
                        id="phone"
                        type="tel"
                        formControlName="phone"
                        class="form-input"
                        placeholder="(11) 99999-9999">
                      @if (personalForm.get('phone')?.invalid && personalForm.get('phone')?.touched) {
                        <div
                          class="form-error">
                          Telefone é obrigatório
                        </div>
                      }
                    </div>
                  </div>
                  <div class="form-row">
                    <div class="form-group">
                      <label for="birthDate" class="form-label">Data de nascimento</label>
                      <input
                        id="birthDate"
                        type="date"
                        formControlName="birthDate"
                        class="form-input">
                    </div>
                  </div>
                  <div class="form-actions">
                    <button
                      type="submit"
                      class="btn btn--sweet"
                      [disabled]="personalForm.invalid || isUpdatingPersonal"
                      [class.loading]="isUpdatingPersonal">
                      @if (!isUpdatingPersonal) {
                        <span>Salvar Alterações</span>
                      }
                      @if (isUpdatingPersonal) {
                        <span>Salvando...</span>
                      }
                    </button>
                  </div>
                </form>
              </div>
            }
    
            <!-- Addresses Tab -->
            @if (activeTab === 'addresses') {
              <div class="tab-content">
                <div class="section-header">
                  <h2>📍 Meus Endereços</h2>
                  <p>Gerencie seus endereços de entrega</p>
                  <button class="btn btn--sweet btn--sm" (click)="openAddressModal()">
                    + Novo Endereço
                  </button>
                </div>
                <div class="addresses-list">
                  @for (address of addresses; track address) {
                    <div class="address-card">
                      <div class="address-header">
                        <h3>{{ address.name }}</h3>
                        <div class="address-badges">
                          @if (address.isDefault) {
                            <span class="badge badge--primary">Padrão</span>
                          }
                        </div>
                      </div>
                      <div class="address-content">
                        <p class="address-text">
                          {{ address.street }}, {{ address.number }}
                          @if (address.complement) {
                            <span>, {{ address.complement }}</span>
                          }
                        </p>
                        <p class="address-text">
                          {{ address.neighborhood }}, {{ address.city }} - {{ address.state }}
                        </p>
                        <p class="address-text">CEP: {{ address.zipCode }}</p>
                        @if (address.reference) {
                          <p class="address-reference">
                            <strong>Referência:</strong> {{ address.reference }}
                          </p>
                        }
                      </div>
                      <div class="address-actions">
                        @if (!address.isDefault) {
                          <button
                            class="btn btn--outline btn--sm"
                            (click)="setDefaultAddress(address.id)">
                            Definir como Padrão
                          </button>
                        }
                        <button class="btn btn--outline btn--sm" (click)="editAddress(address)">
                          Editar
                        </button>
                        <button class="btn btn--danger btn--sm" (click)="deleteAddress(address.id)">
                          Excluir
                        </button>
                      </div>
                    </div>
                  }
                  @if (addresses.length === 0) {
                    <div class="empty-state">
                      <div class="empty-icon">📍</div>
                      <h3>Nenhum endereço cadastrado</h3>
                      <p>Adicione um endereço para facilitar seus pedidos</p>
                      <button class="btn btn--sweet" (click)="openAddressModal()">
                        Adicionar Primeiro Endereço
                      </button>
                    </div>
                  }
                </div>
              </div>
            }
    
            <!-- Security Tab -->
            @if (activeTab === 'security') {
              <div class="tab-content">
                <div class="section-header">
                  <h2>🔒 Segurança</h2>
                  <p>Gerencie a segurança da sua conta</p>
                </div>
                <form [formGroup]="passwordForm" (ngSubmit)="changePassword()" class="profile-form">
                  <div class="form-row">
                    <div class="form-group">
                      <label for="currentPassword" class="form-label">Senha atual *</label>
                      <input
                        id="currentPassword"
                        type="password"
                        formControlName="currentPassword"
                        class="form-input"
                        placeholder="Digite sua senha atual">
                      @if (passwordForm.get('currentPassword')?.invalid && passwordForm.get('currentPassword')?.touched) {
                        <div
                          class="form-error">
                          Senha atual é obrigatória
                        </div>
                      }
                    </div>
                  </div>
                  <div class="form-row">
                    <div class="form-group">
                      <label for="newPassword" class="form-label">Nova senha *</label>
                      <input
                        id="newPassword"
                        type="password"
                        formControlName="newPassword"
                        class="form-input"
                        placeholder="Digite a nova senha">
                      @if (passwordForm.get('newPassword')?.invalid && passwordForm.get('newPassword')?.touched) {
                        <div
                          class="form-error">
                          Nova senha deve ter pelo menos 6 caracteres
                        </div>
                      }
                    </div>
                    <div class="form-group">
                      <label for="confirmPassword" class="form-label">Confirmar nova senha *</label>
                      <input
                        id="confirmPassword"
                        type="password"
                        formControlName="confirmPassword"
                        class="form-input"
                        placeholder="Confirme a nova senha">
                      @if (passwordForm.get('confirmPassword')?.invalid && passwordForm.get('confirmPassword')?.touched) {
                        <div
                          class="form-error">
                          Senhas não coincidem
                        </div>
                      }
                    </div>
                  </div>
                  <div class="form-actions">
                    <button
                      type="submit"
                      class="btn btn--sweet"
                      [disabled]="passwordForm.invalid || isChangingPassword"
                      [class.loading]="isChangingPassword">
                      @if (!isChangingPassword) {
                        <span>Alterar Senha</span>
                      }
                      @if (isChangingPassword) {
                        <span>Alterando...</span>
                      }
                    </button>
                  </div>
                </form>
              </div>
            }
    
            <!-- Preferences Tab -->
            @if (activeTab === 'preferences') {
              <div class="tab-content">
                <div class="section-header">
                  <h2>⚙️ Preferências</h2>
                  <p>Configure suas preferências de notificação</p>
                </div>
                <div class="preferences-form">
                  <div class="preference-item">
                    <div class="preference-info">
                      <h3>Notificações push</h3>
                      <p>Receba notificações sobre o status dos seus pedidos</p>
                    </div>
                    <label class="toggle-switch">
                      <input
                        type="checkbox"
                        [(ngModel)]="preferences.notifications"
                        (change)="updatePreferences()">
                      <span class="toggle-slider"></span>
                    </label>
                  </div>
                  <div class="preference-item">
                    <div class="preference-info">
                      <h3>Newsletter</h3>
                      <p>Receba novidades e promoções por e-mail</p>
                    </div>
                    <label class="toggle-switch">
                      <input
                        type="checkbox"
                        [(ngModel)]="preferences.newsletter"
                        (change)="updatePreferences()">
                      <span class="toggle-slider"></span>
                    </label>
                  </div>
                  <div class="preference-item">
                    <div class="preference-info">
                      <h3>SMS</h3>
                      <p>Receba atualizações por SMS</p>
                    </div>
                    <label class="toggle-switch">
                      <input
                        type="checkbox"
                        [(ngModel)]="preferences.smsUpdates"
                        (change)="updatePreferences()">
                      <span class="toggle-slider"></span>
                    </label>
                  </div>
                </div>
              </div>
            }
    
            <!-- Statistics Tab -->
            @if (activeTab === 'statistics') {
              <div class="tab-content">
                <div class="section-header">
                  <h2>📊 Estatísticas</h2>
                  <p>Veja um resumo da sua atividade</p>
                </div>
                @if (userProfile) {
                  <div class="statistics-grid">
                    <div class="stat-card">
                      <div class="stat-icon">🛒</div>
                      <div class="stat-content">
                        <h3>{{ userProfile.statistics.totalOrders }}</h3>
                        <p>Pedidos realizados</p>
                      </div>
                    </div>
                    <div class="stat-card">
                      <div class="stat-icon">💰</div>
                      <div class="stat-content">
                        <h3>R$ {{ userProfile.statistics.totalSpent.toFixed(2).replace('.', ',') }}</h3>
                        <p>Total gasto</p>
                      </div>
                    </div>
                    <div class="stat-card">
                      <div class="stat-icon">🏆</div>
                      <div class="stat-content">
                        <h3>{{ userProfile.statistics.loyaltyPoints }}</h3>
                        <p>Pontos de fidelidade</p>
                      </div>
                    </div>
                    <div class="stat-card">
                      <div class="stat-icon">❤️</div>
                      <div class="stat-content">
                        <h3>{{ userProfile.statistics.favoriteProducts.length }}</h3>
                        <p>Produtos favoritos</p>
                      </div>
                    </div>
                  </div>
                }
              </div>
            }
          </div>
        </div>
    
        <!-- Address Modal -->
        <div class="modal-overlay" [class.active]="showAddressModal" (click)="closeAddressModal()">
          <div class="modal-content" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h3>{{ editingAddress ? 'Editar' : 'Novo' }} Endereço</h3>
              <button class="modal-close" (click)="closeAddressModal()">×</button>
            </div>
    
            <form [formGroup]="addressForm" (ngSubmit)="saveAddress()" class="modal-form">
              <div class="form-row">
                <div class="form-group">
                  <label for="addressName" class="form-label">Nome do endereço *</label>
                  <input
                    id="addressName"
                    type="text"
                    formControlName="name"
                    class="form-input"
                    placeholder="Ex: Casa, Trabalho">
                </div>
              </div>
    
              <div class="form-row">
                <div class="form-group">
                  <label for="addressZipCode" class="form-label">CEP *</label>
                  <input
                    id="addressZipCode"
                    type="text"
                    formControlName="zipCode"
                    class="form-input"
                    placeholder="00000-000"
                    (blur)="searchZipCode()">
                </div>
              </div>
    
              <div class="form-row">
                <div class="form-group flex-grow">
                  <label for="addressStreet" class="form-label">Rua *</label>
                  <input
                    id="addressStreet"
                    type="text"
                    formControlName="street"
                    class="form-input"
                    placeholder="Nome da rua">
                </div>
    
                <div class="form-group">
                  <label for="addressNumber" class="form-label">Número *</label>
                  <input
                    id="addressNumber"
                    type="text"
                    formControlName="number"
                    class="form-input"
                    placeholder="123">
                </div>
              </div>
    
              <div class="form-row">
                <div class="form-group">
                  <label for="addressComplement" class="form-label">Complemento</label>
                  <input
                    id="addressComplement"
                    type="text"
                    formControlName="complement"
                    class="form-input"
                    placeholder="Apto, bloco, etc.">
                </div>
    
                <div class="form-group">
                  <label for="addressNeighborhood" class="form-label">Bairro *</label>
                  <input
                    id="addressNeighborhood"
                    type="text"
                    formControlName="neighborhood"
                    class="form-input"
                    placeholder="Nome do bairro">
                </div>
              </div>
    
              <div class="form-row">
                <div class="form-group">
                  <label for="addressCity" class="form-label">Cidade *</label>
                  <input
                    id="addressCity"
                    type="text"
                    formControlName="city"
                    class="form-input"
                    placeholder="Nome da cidade">
                </div>
    
                <div class="form-group">
                  <label for="addressState" class="form-label">Estado *</label>
                  <select id="addressState" formControlName="state" class="form-select">
                    <option value="">Selecione</option>
                    <option value="SP">São Paulo</option>
                    <option value="RJ">Rio de Janeiro</option>
                    <option value="MG">Minas Gerais</option>
                  </select>
                </div>
              </div>
    
              <div class="form-row">
                <div class="form-group full-width">
                  <label for="addressReference" class="form-label">Ponto de referência</label>
                  <input
                    id="addressReference"
                    type="text"
                    formControlName="reference"
                    class="form-input"
                    placeholder="Próximo ao supermercado, etc.">
                </div>
              </div>
    
              <div class="form-row">
                <div class="form-group full-width">
                  <label class="form-checkbox">
                    <input type="checkbox" formControlName="isDefault">
                    <span class="checkmark"></span>
                    Definir como endereço padrão
                  </label>
                </div>
              </div>
    
              <div class="modal-actions">
                <button type="button" class="btn btn--outline" (click)="closeAddressModal()">
                  Cancelar
                </button>
                <button
                  type="submit"
                  class="btn btn--sweet"
                  [disabled]="addressForm.invalid || isSavingAddress"
                  [class.loading]="isSavingAddress">
                  @if (!isSavingAddress) {
                    <span>{{ editingAddress ? 'Salvar' : 'Adicionar' }}</span>
                  }
                  @if (isSavingAddress) {
                    <span>Salvando...</span>
                  }
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    `,
  styles: [`
    .profile-page {
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

    .profile-layout {
      display: grid;
      grid-template-columns: 300px 1fr;
      gap: 3rem;
      align-items: start;
    }

    .profile-sidebar {
      background: white;
      border-radius: 1.5rem;
      padding: 2rem;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      position: sticky;
      top: 2rem;
    }

    .profile-nav {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-bottom: 2rem;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background: none;
      border: none;
      border-radius: 0.75rem;
      cursor: pointer;
      transition: all 0.3s ease;
      text-align: left;
      width: 100%;
    }

    .nav-item:hover {
      background: #f8fafc;
    }

    .nav-item.active {
      background: linear-gradient(135deg, #ec4899 0%, #be185d 100%);
      color: white;
    }

    .nav-icon {
      font-size: 1.25rem;
      flex-shrink: 0;
    }

    .nav-label {
      font-weight: 600;
      font-size: 0.875rem;
    }

    .user-summary {
      border-top: 1px solid #e5e7eb;
      padding-top: 2rem;
      text-align: center;
    }

    .user-avatar {
      width: 4rem;
      height: 4rem;
      background: linear-gradient(135deg, #ec4899, #be185d);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 1.5rem;
      font-weight: 600;
      margin: 0 auto 1rem auto;
    }

    .user-info h3 {
      margin: 0 0 0.25rem 0;
      font-weight: 600;
      color: #111827;
    }

    .user-info p {
      margin: 0 0 1rem 0;
      color: #6b7280;
      font-size: 0.875rem;
    }

    .loyalty-points {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      background: #fef3c7;
      color: #92400e;
      padding: 0.5rem 1rem;
      border-radius: 1rem;
      font-size: 0.875rem;
      font-weight: 600;
    }

    .profile-content {
      background: white;
      border-radius: 1.5rem;
      padding: 3rem;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 2px solid #f3f4f6;
    }

    .section-header h2 {
      font-size: 1.5rem;
      font-weight: 700;
      color: #111827;
      margin: 0;
    }

    .section-header p {
      color: #6b7280;
      margin: 0.25rem 0 0 0;
    }

    .profile-form {
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

    .form-actions {
      margin-top: 2rem;
    }

    /* Addresses */
    .addresses-list {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .address-card {
      border: 1px solid #e5e7eb;
      border-radius: 1rem;
      padding: 1.5rem;
      transition: all 0.3s ease;
    }

    .address-card:hover {
      border-color: #ec4899;
      box-shadow: 0 4px 20px rgba(236, 72, 153, 0.1);
    }

    .address-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .address-header h3 {
      margin: 0;
      font-weight: 600;
      color: #111827;
    }

    .address-badges {
      display: flex;
      gap: 0.5rem;
    }

    .badge {
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .badge--primary {
      background: #dbeafe;
      color: #1e40af;
    }

    .address-text {
      margin: 0 0 0.25rem 0;
      color: #6b7280;
    }

    .address-reference {
      margin: 0.5rem 0 0 0;
      color: #6b7280;
      font-size: 0.875rem;
    }

    .address-actions {
      display: flex;
      gap: 0.75rem;
      margin-top: 1rem;
      flex-wrap: wrap;
    }

    .empty-state {
      text-align: center;
      padding: 3rem;
      color: #6b7280;
    }

    .empty-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }

    .empty-state h3 {
      margin: 0 0 0.5rem 0;
      color: #111827;
    }

    .empty-state p {
      margin: 0 0 2rem 0;
    }

    /* Preferences */
    .preferences-form {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .preference-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem;
      border: 1px solid #e5e7eb;
      border-radius: 1rem;
    }

    .preference-info h3 {
      margin: 0 0 0.25rem 0;
      font-weight: 600;
      color: #111827;
    }

    .preference-info p {
      margin: 0;
      color: #6b7280;
      font-size: 0.875rem;
    }

    .toggle-switch {
      position: relative;
      display: inline-block;
      width: 60px;
      height: 34px;
    }

    .toggle-switch input {
      opacity: 0;
      width: 0;
      height: 0;
    }

    .toggle-slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #ccc;
      transition: .4s;
      border-radius: 34px;
    }

    .toggle-slider:before {
      position: absolute;
      content: "";
      height: 26px;
      width: 26px;
      left: 4px;
      bottom: 4px;
      background-color: white;
      transition: .4s;
      border-radius: 50%;
    }

    input:checked + .toggle-slider {
      background-color: #ec4899;
    }

    input:checked + .toggle-slider:before {
      transform: translateX(26px);
    }

    /* Statistics */
    .statistics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
    }

    .stat-card {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 2rem;
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
      border-radius: 1rem;
      border: 1px solid #e2e8f0;
    }

    .stat-icon {
      font-size: 2.5rem;
      flex-shrink: 0;
    }

    .stat-content h3 {
      margin: 0 0 0.25rem 0;
      font-size: 1.5rem;
      font-weight: 700;
      color: #111827;
    }

    .stat-content p {
      margin: 0;
      color: #6b7280;
      font-size: 0.875rem;
    }

    /* Modal */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
    }

    .modal-overlay.active {
      opacity: 1;
      visibility: visible;
    }

    .modal-content {
      background: white;
      border-radius: 1.5rem;
      padding: 0;
      max-width: 600px;
      width: 90%;
      max-height: 90vh;
      overflow-y: auto;
      transform: scale(0.9);
      transition: transform 0.3s ease;
    }

    .modal-overlay.active .modal-content {
      transform: scale(1);
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 2rem 2rem 1rem 2rem;
      border-bottom: 1px solid #e5e7eb;
    }

    .modal-header h3 {
      margin: 0;
      font-weight: 700;
      color: #111827;
    }

    .modal-close {
      background: none;
      border: none;
      font-size: 2rem;
      color: #6b7280;
      cursor: pointer;
      padding: 0;
      width: 2rem;
      height: 2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 0.5rem;
      transition: all 0.3s ease;
    }

    .modal-close:hover {
      background: #f3f4f6;
      color: #111827;
    }

    .modal-form {
      padding: 2rem;
    }

    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 2rem;
    }

    /* Form Checkbox */
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
      .profile-layout {
        grid-template-columns: 1fr;
        gap: 2rem;
      }

      .profile-sidebar {
        position: static;
        order: -1;
      }

      .profile-nav {
        flex-direction: row;
        overflow-x: auto;
        gap: 1rem;
        padding-bottom: 0.5rem;
      }

      .nav-item {
        white-space: nowrap;
        min-width: auto;
      }
    }

    @media (max-width: 768px) {
      .profile-page {
        padding: 1rem 0;
      }

      .page-title {
        font-size: 2rem;
      }

      .profile-content {
        padding: 2rem;
      }

      .section-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }

      .form-row {
        flex-direction: column;
        gap: 0.75rem;
      }

      .address-actions {
        flex-direction: column;
      }

      .statistics-grid {
        grid-template-columns: 1fr;
      }

      .modal-content {
        width: 95%;
        margin: 1rem;
      }

      .modal-actions {
        flex-direction: column;
      }
    }
  `]
})
export class ProfileComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  userProfile: UserProfile | null = null;
  addresses: Address[] = [];
  activeTab = 'personal';
  
  // Forms
  personalForm!: FormGroup;
  passwordForm!: FormGroup;
  addressForm!: FormGroup;
  
  // Preferences
  preferences = {
    notifications: true,
    newsletter: true,
    smsUpdates: false
  };
  
  // States
  isUpdatingPersonal = false;
  isChangingPassword = false;
  isSavingAddress = false;
  showAddressModal = false;
  editingAddress: Address | null = null;

  tabs = [
    { id: 'personal', label: 'Informações Pessoais', icon: '📝' },
    { id: 'addresses', label: 'Endereços', icon: '📍' },
    { id: 'security', label: 'Segurança', icon: '🔒' },
    { id: 'preferences', label: 'Preferências', icon: '⚙️' },
    { id: 'statistics', label: 'Estatísticas', icon: '📊' }
  ];

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.initializeForms();
  }

  ngOnInit() {
    // Load user profile
    this.userService.getUserProfile()
      .pipe(takeUntil(this.destroy$))
      .subscribe(profile => {
        if (profile) {
          this.userProfile = profile;
          this.updatePersonalForm(profile);
          this.preferences = profile.preferences;
        }
      });

    // Load addresses
    this.userService.getAddresses()
      .pipe(takeUntil(this.destroy$))
      .subscribe(addresses => {
        this.addresses = addresses;
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForms() {
    this.personalForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.minLength(10)]],
      birthDate: ['']
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });

    this.addressForm = this.fb.group({
      name: ['', Validators.required],
      zipCode: ['', [Validators.required, Validators.pattern(/^\d{5}-?\d{3}$/)]],
      street: ['', Validators.required],
      number: ['', Validators.required],
      complement: [''],
      neighborhood: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      reference: [''],
      isDefault: [false]
    });
  }

  private passwordMatchValidator(group: FormGroup) {
    const newPassword = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { mismatch: true };
  }

  private updatePersonalForm(profile: UserProfile) {
    this.personalForm.patchValue({
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
      birthDate: profile.birthDate ? profile.birthDate.toISOString().split('T')[0] : ''
    });
  }

  getUserInitials(name: string): string {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  setActiveTab(tabId: string) {
    this.activeTab = tabId;
  }

  // Personal Info
  updatePersonalInfo() {
    if (this.personalForm.invalid) return;

    this.isUpdatingPersonal = true;
    const formData = this.personalForm.value;
    
    const updates: Partial<UserProfile> = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      birthDate: formData.birthDate ? new Date(formData.birthDate) : undefined
    };

    this.userService.updateProfile(updates)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.isUpdatingPersonal = false;
          alert('Perfil atualizado com sucesso!');
        },
        error: () => {
          this.isUpdatingPersonal = false;
          alert('Erro ao atualizar perfil. Tente novamente.');
        }
      });
  }

  // Password
  changePassword() {
    if (this.passwordForm.invalid) return;

    this.isChangingPassword = true;
    const { currentPassword, newPassword } = this.passwordForm.value;

    this.userService.changePassword(currentPassword, newPassword)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.isChangingPassword = false;
          this.passwordForm.reset();
          alert('Senha alterada com sucesso!');
        },
        error: () => {
          this.isChangingPassword = false;
          alert('Erro ao alterar senha. Verifique sua senha atual.');
        }
      });
  }

  // Addresses
  openAddressModal() {
    this.editingAddress = null;
    this.addressForm.reset();
    this.showAddressModal = true;
  }

  editAddress(address: Address) {
    this.editingAddress = address;
    this.addressForm.patchValue(address);
    this.showAddressModal = true;
  }

  closeAddressModal() {
    this.showAddressModal = false;
    this.editingAddress = null;
    this.addressForm.reset();
  }

  saveAddress() {
    if (this.addressForm.invalid) return;

    this.isSavingAddress = true;
    const formData = this.addressForm.value;

    const operation = this.editingAddress
      ? this.userService.updateAddress(this.editingAddress.id, formData)
      : this.userService.addAddress(formData);

    operation
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.isSavingAddress = false;
          this.closeAddressModal();
          this.loadAddresses();
          alert(`Endereço ${this.editingAddress ? 'atualizado' : 'adicionado'} com sucesso!`);
        },
        error: () => {
          this.isSavingAddress = false;
          alert('Erro ao salvar endereço. Tente novamente.');
        }
      });
  }

  setDefaultAddress(id: string) {
    this.userService.setDefaultAddress(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.loadAddresses();
          alert('Endereço padrão definido com sucesso!');
        },
        error: () => {
          alert('Erro ao definir endereço padrão.');
        }
      });
  }

  deleteAddress(id: string) {
    if (confirm('Tem certeza que deseja excluir este endereço?')) {
      this.userService.deleteAddress(id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.loadAddresses();
            alert('Endereço excluído com sucesso!');
          },
          error: () => {
            alert('Erro ao excluir endereço.');
          }
        });
    }
  }

  searchZipCode() {
    // Implementation for ZIP code search
    // This would integrate with a CEP API
  }

  // Preferences
  updatePreferences() {
    this.userService.updatePreferences(this.preferences)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          // Preferences updated
        },
        error: () => {
          alert('Erro ao atualizar preferências.');
        }
      });
  }

  private loadAddresses() {
    this.userService.getAddresses()
      .pipe(takeUntil(this.destroy$))
      .subscribe(addresses => {
        this.addresses = addresses;
      });
  }
}
