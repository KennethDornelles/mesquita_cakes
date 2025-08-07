import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { AuthService, RegisterRequest } from '../services/auth.service';

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="register-form">
    
      <!-- Name Field -->
      <div class="form-group">
        <label for="name" class="form-label">Nome completo</label>
        <div class="input-wrapper">
          <svg class="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
          <input
            id="name"
            type="text"
            formControlName="name"
            class="form-input"
            [class.error]="nameControl?.invalid && nameControl?.touched"
            placeholder="Seu nome completo"
            autocomplete="name">
        </div>
        @if (nameControl?.invalid && nameControl?.touched) {
          <div class="error-message">
            @if (nameControl?.errors?.['required']) {
              <span>Nome é obrigatório</span>
            }
            @if (nameControl?.errors?.['minlength']) {
              <span>Nome deve ter pelo menos 2 caracteres</span>
            }
          </div>
        }
      </div>
    
      <!-- Email Field -->
      <div class="form-group">
        <label for="email" class="form-label">E-mail</label>
        <div class="input-wrapper">
          <svg class="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
          </svg>
          <input
            id="email"
            type="email"
            formControlName="email"
            class="form-input"
            [class.error]="emailControl?.invalid && emailControl?.touched"
            placeholder="seu&#64;email.com"
            autocomplete="email">
        </div>
        @if (emailControl?.invalid && emailControl?.touched) {
          <div class="error-message">
            @if (emailControl?.errors?.['required']) {
              <span>E-mail é obrigatório</span>
            }
            @if (emailControl?.errors?.['email']) {
              <span>E-mail inválido</span>
            }
          </div>
        }
      </div>
    
      <!-- Phone Field -->
      <div class="form-group">
        <label for="phone" class="form-label">Telefone</label>
        <div class="input-wrapper">
          <svg class="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
          </svg>
          <input
            id="phone"
            type="tel"
            formControlName="phone"
            class="form-input"
            [class.error]="phoneControl?.invalid && phoneControl?.touched"
            placeholder="(11) 99999-9999"
            autocomplete="tel"
            (input)="formatPhone($event)">
        </div>
        @if (phoneControl?.invalid && phoneControl?.touched) {
          <div class="error-message">
            @if (phoneControl?.errors?.['required']) {
              <span>Telefone é obrigatório</span>
            }
            @if (phoneControl?.errors?.['pattern']) {
              <span>Telefone inválido</span>
            }
          </div>
        }
      </div>
    
      <!-- Password Field -->
      <div class="form-group">
        <label for="password" class="form-label">Senha</label>
        <div class="input-wrapper">
          <svg class="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18,8h-1V6c0-2.76-2.24-5-5-5S7,3.24,7,6v2H6c-1.1,0-2,0.9-2,2v10c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2V10C20,8.9,19.1,8,18,8z M12,17c-1.1,0-2-0.9-2-2s0.9-2,2-2s2,0.9,2,2S13.1,17,12,17z M15.1,8H8.9V6c0-1.71,1.39-3.1,3.1-3.1s3.1,1.39,3.1,3.1V8z"/>
          </svg>
          <input
            id="password"
            [type]="showPassword ? 'text' : 'password'"
            formControlName="password"
            class="form-input"
            [class.error]="passwordControl?.invalid && passwordControl?.touched"
            placeholder="Crie uma senha"
            autocomplete="new-password">
          <button
            type="button"
            class="password-toggle"
            (click)="togglePassword()"
            title="{{ showPassword ? 'Ocultar senha' : 'Mostrar senha' }}">
            @if (!showPassword) {
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
              </svg>
            }
            @if (showPassword) {
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
              </svg>
            }
          </button>
        </div>
        @if (passwordControl?.invalid && passwordControl?.touched) {
          <div class="error-message">
            @if (passwordControl?.errors?.['required']) {
              <span>Senha é obrigatória</span>
            }
            @if (passwordControl?.errors?.['minlength']) {
              <span>Senha deve ter pelo menos 6 caracteres</span>
            }
            @if (passwordControl?.errors?.['pattern']) {
              <span>Senha deve conter pelo menos uma letra e um número</span>
            }
          </div>
        }
    
        <!-- Password Strength Indicator -->
        @if (passwordControl?.value) {
          <div class="password-strength">
            <div class="strength-label">Força da senha:</div>
            <div class="strength-bar">
              <div class="strength-fill" [ngClass]="getPasswordStrengthClass()"></div>
            </div>
            <div class="strength-text">{{ getPasswordStrengthText() }}</div>
          </div>
        }
      </div>
    
      <!-- Confirm Password Field -->
      <div class="form-group">
        <label for="confirmPassword" class="form-label">Confirmar senha</label>
        <div class="input-wrapper">
          <svg class="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18,8h-1V6c0-2.76-2.24-5-5-5S7,3.24,7,6v2H6c-1.1,0-2,0.9-2,2v10c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2V10C20,8.9,19.1,8,18,8z M12,17c-1.1,0-2-0.9-2-2s0.9-2,2-2s2,0.9,2,2S13.1,17,12,17z M15.1,8H8.9V6c0-1.71,1.39-3.1,3.1-3.1s3.1,1.39,3.1,3.1V8z"/>
          </svg>
          <input
            id="confirmPassword"
            [type]="showConfirmPassword ? 'text' : 'password'"
            formControlName="confirmPassword"
            class="form-input"
            [class.error]="confirmPasswordControl?.invalid && confirmPasswordControl?.touched"
            placeholder="Confirme sua senha"
            autocomplete="new-password">
          <button
            type="button"
            class="password-toggle"
            (click)="toggleConfirmPassword()"
            title="{{ showConfirmPassword ? 'Ocultar senha' : 'Mostrar senha' }}">
            @if (!showConfirmPassword) {
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
              </svg>
            }
            @if (showConfirmPassword) {
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
              </svg>
            }
          </button>
        </div>
        @if (confirmPasswordControl?.invalid && confirmPasswordControl?.touched) {
          <div class="error-message">
            @if (confirmPasswordControl?.errors?.['required']) {
              <span>Confirmação de senha é obrigatória</span>
            }
            @if (confirmPasswordControl?.errors?.['passwordMismatch']) {
              <span>Senhas não coincidem</span>
            }
          </div>
        }
      </div>
    
      <!-- Terms and Conditions -->
      <div class="form-group">
        <label class="checkbox-label">
          <input type="checkbox" formControlName="acceptTerms" class="checkbox">
          <span class="checkbox-text">
            Li e aceito os
            <button type="button" class="terms-link" (click)="showTermsModal = true">
              Termos de Uso
            </button>
            e a
            <button type="button" class="terms-link" (click)="showPrivacyModal = true">
              Política de Privacidade
            </button>
          </span>
        </label>
        @if (acceptTermsControl?.invalid && acceptTermsControl?.touched) {
          <div class="error-message">
            @if (acceptTermsControl?.errors?.['required']) {
              <span>Você deve aceitar os termos para continuar</span>
            }
          </div>
        }
      </div>
    
      <!-- Marketing Consent -->
      <div class="form-group">
        <label class="checkbox-label">
          <input type="checkbox" formControlName="acceptMarketing" class="checkbox">
          <span class="checkbox-text">
            Desejo receber ofertas especiais e novidades por e-mail (opcional)
          </span>
        </label>
      </div>
    
      <!-- Submit Button -->
      <button
        type="submit"
        class="submit-btn"
        [disabled]="registerForm.invalid || isLoading"
        [class.loading]="isLoading">
        @if (!isLoading) {
          <span>Criar Conta</span>
        }
        @if (isLoading) {
          <span class="loading-content">
            <svg class="loading-spinner" width="20" height="20" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-dasharray="32" stroke-dashoffset="32">
                <animate attributeName="stroke-dasharray" dur="2s" values="0 32;16 16;0 32;0 32" repeatCount="indefinite"/>
                <animate attributeName="stroke-dashoffset" dur="2s" values="0;-16;-32;-32" repeatCount="indefinite"/>
              </circle>
            </svg>
            Criando conta...
          </span>
        }
      </button>
    
      <!-- Error Message -->
      @if (errorMessage) {
        <div class="form-error">
          {{ errorMessage }}
        </div>
      }
    
      <!-- Login Link -->
      <div class="switch-mode">
        <p>Já tem uma conta?
          <button type="button" class="switch-btn" (click)="onSwitchToLogin()">
            Fazer login
          </button>
        </p>
      </div>
    </form>
    
    <!-- Terms Modal -->
    @if (showTermsModal) {
      <div class="modal-overlay" (click)="showTermsModal = false">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>Termos de Uso</h3>
            <button class="modal-close" (click)="showTermsModal = false">×</button>
          </div>
          <div class="modal-body">
            <div class="terms-content">
              <h4>1. Aceitação dos Termos</h4>
              <p>Ao utilizar nossos serviços, você concorda com estes termos de uso.</p>
              <h4>2. Uso do Serviço</h4>
              <p>Nosso serviço é destinado para pedidos de bolos e doces. Você deve usar o serviço apenas para fins legais.</p>
              <h4>3. Conta do Usuário</h4>
              <p>Você é responsável por manter a segurança de sua conta e senha. Notifique-nos imediatamente sobre qualquer uso não autorizado.</p>
              <h4>4. Pedidos e Pagamentos</h4>
              <p>Todos os pedidos estão sujeitos à disponibilidade. Os preços podem variar sem aviso prévio.</p>
              <h4>5. Política de Cancelamento</h4>
              <p>Cancelamentos devem ser feitos com pelo menos 24 horas de antecedência.</p>
              <h4>6. Limitação de Responsabilidade</h4>
              <p>Nossa responsabilidade é limitada ao valor do produto adquirido.</p>
            </div>
          </div>
        </div>
      </div>
    }
    
    <!-- Privacy Modal -->
    @if (showPrivacyModal) {
      <div class="modal-overlay" (click)="showPrivacyModal = false">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>Política de Privacidade</h3>
            <button class="modal-close" (click)="showPrivacyModal = false">×</button>
          </div>
          <div class="modal-body">
            <div class="terms-content">
              <h4>1. Coleta de Informações</h4>
              <p>Coletamos informações quando você se registra, faz um pedido ou interage com nosso site.</p>
              <h4>2. Uso das Informações</h4>
              <p>Suas informações são usadas para processar pedidos, melhorar nossos serviços e comunicações.</p>
              <h4>3. Compartilhamento de Dados</h4>
              <p>Não vendemos, trocamos ou transferimos suas informações pessoais para terceiros sem seu consentimento.</p>
              <h4>4. Segurança</h4>
              <p>Implementamos medidas de segurança para proteger suas informações pessoais.</p>
              <h4>5. Cookies</h4>
              <p>Utilizamos cookies para melhorar sua experiência e analisar o tráfego do site.</p>
              <h4>6. Seus Direitos</h4>
              <p>Você pode acessar, atualizar ou excluir suas informações pessoais a qualquer momento.</p>
            </div>
          </div>
        </div>
      </div>
    }
    `,
  styles: [`
    .register-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .form-label {
      font-weight: 600;
      color: #374151;
      font-size: 0.875rem;
    }

    .input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }

    .input-icon {
      position: absolute;
      left: 1rem;
      color: #6b7280;
      z-index: 2;
    }

    .form-input {
      width: 100%;
      padding: 0.75rem 1rem 0.75rem 3rem;
      border: 1px solid #d1d5db;
      border-radius: 0.5rem;
      font-size: 1rem;
      transition: all 0.2s ease;
      background: white;
    }

    .form-input:focus {
      outline: none;
      border-color: #ec4899;
      box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.1);
    }

    .form-input.error {
      border-color: #ef4444;
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }

    .password-toggle {
      position: absolute;
      right: 1rem;
      background: none;
      border: none;
      color: #6b7280;
      cursor: pointer;
      z-index: 2;
      padding: 0.25rem;
      border-radius: 0.25rem;
      transition: color 0.2s ease;
    }

    .password-toggle:hover {
      color: #374151;
    }

    .error-message {
      color: #ef4444;
      font-size: 0.75rem;
      margin-top: 0.25rem;
    }

    .password-strength {
      margin-top: 0.5rem;
    }

    .strength-label {
      font-size: 0.75rem;
      color: #6b7280;
      margin-bottom: 0.25rem;
    }

    .strength-bar {
      height: 4px;
      background: #e5e7eb;
      border-radius: 2px;
      overflow: hidden;
    }

    .strength-fill {
      height: 100%;
      transition: all 0.3s ease;
      border-radius: 2px;
    }

    .strength-fill.weak {
      width: 25%;
      background: #ef4444;
    }

    .strength-fill.fair {
      width: 50%;
      background: #f59e0b;
    }

    .strength-fill.good {
      width: 75%;
      background: #10b981;
    }

    .strength-fill.strong {
      width: 100%;
      background: #059669;
    }

    .strength-text {
      font-size: 0.75rem;
      margin-top: 0.25rem;
      font-weight: 500;
    }

    .strength-text.weak { color: #ef4444; }
    .strength-text.fair { color: #f59e0b; }
    .strength-text.good { color: #10b981; }
    .strength-text.strong { color: #059669; }

    .checkbox-label {
      display: flex;
      align-items: flex-start;
      gap: 0.5rem;
      cursor: pointer;
      font-size: 0.875rem;
      line-height: 1.5;
    }

    .checkbox {
      width: 1rem;
      height: 1rem;
      accent-color: #ec4899;
      margin-top: 0.125rem;
      flex-shrink: 0;
    }

    .checkbox-text {
      color: #374151;
    }

    .terms-link {
      background: none;
      border: none;
      color: #ec4899;
      cursor: pointer;
      text-decoration: underline;
      padding: 0;
      font-size: inherit;
    }

    .terms-link:hover {
      color: #be185d;
    }

    .submit-btn {
      width: 100%;
      padding: 0.875rem 1.5rem;
      background: linear-gradient(135deg, #ec4899, #be185d);
      color: white;
      border: none;
      border-radius: 0.5rem;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }

    .submit-btn:hover:not(:disabled) {
      background: linear-gradient(135deg, #be185d, #9d174d);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(236, 72, 153, 0.4);
    }

    .submit-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }

    .loading-content {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .loading-spinner {
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .form-error {
      background: #fef2f2;
      border: 1px solid #fecaca;
      color: #dc2626;
      padding: 0.75rem;
      border-radius: 0.5rem;
      font-size: 0.875rem;
      text-align: center;
    }

    .switch-mode {
      text-align: center;
      margin-top: 1rem;
    }

    .switch-mode p {
      margin: 0;
      color: #6b7280;
      font-size: 0.875rem;
    }

    .switch-btn {
      background: none;
      border: none;
      color: #ec4899;
      font-weight: 600;
      cursor: pointer;
      padding: 0;
      margin-left: 0.25rem;
    }

    .switch-btn:hover {
      text-decoration: underline;
    }

    /* Modal Styles */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal-content {
      background: white;
      border-radius: 1rem;
      max-width: 600px;
      width: 90%;
      max-height: 90vh;
      overflow-y: auto;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem 1.5rem 0 1.5rem;
      border-bottom: 1px solid #e5e7eb;
    }

    .modal-header h3 {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 700;
      color: #111827;
    }

    .modal-close {
      background: none;
      border: none;
      font-size: 1.5rem;
      color: #6b7280;
      cursor: pointer;
      width: 2rem;
      height: 2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 0.25rem;
    }

    .modal-close:hover {
      background: #f3f4f6;
      color: #374151;
    }

    .modal-body {
      padding: 1.5rem;
    }

    .terms-content {
      line-height: 1.6;
    }

    .terms-content h4 {
      color: #111827;
      font-weight: 600;
      margin: 1.5rem 0 0.5rem 0;
    }

    .terms-content h4:first-child {
      margin-top: 0;
    }

    .terms-content p {
      color: #6b7280;
      margin: 0 0 1rem 0;
    }

    /* Responsive Design */
    @media (max-width: 640px) {
      .checkbox-label {
        align-items: flex-start;
      }

      .modal-content {
        max-width: 95%;
        margin: 1rem;
      }

      .modal-header {
        padding: 1rem 1rem 0 1rem;
      }

      .modal-body {
        padding: 1rem;
      }
    }
  `]
})
export class RegisterFormComponent {
  @Output() registerSuccess = new EventEmitter<void>();
  @Output() switchToLogin = new EventEmitter<void>();

  registerForm: FormGroup;
  showPassword = false;
  showConfirmPassword = false;
  showTermsModal = false;
  showPrivacyModal = false;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\(\d{2}\) \d{4,5}-\d{4}$/)]],
      password: ['', [
        Validators.required, 
        Validators.minLength(6),
        Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)/)
      ]],
      confirmPassword: ['', [Validators.required]],
      acceptTerms: [false, [Validators.requiredTrue]],
      acceptMarketing: [false]
    }, { validators: this.passwordMatchValidator });
  }

  get nameControl() { return this.registerForm.get('name'); }
  get emailControl() { return this.registerForm.get('email'); }
  get phoneControl() { return this.registerForm.get('phone'); }
  get passwordControl() { return this.registerForm.get('password'); }
  get confirmPasswordControl() { return this.registerForm.get('confirmPassword'); }
  get acceptTermsControl() { return this.registerForm.get('acceptTerms'); }

  passwordMatchValidator(control: AbstractControl): { [key: string]: any } | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    if (password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      const errors = confirmPassword.errors;
      if (errors) {
        delete errors['passwordMismatch'];
        if (Object.keys(errors).length === 0) {
          confirmPassword.setErrors(null);
        }
      }
      return null;
    }
  }

  formatPhone(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    
    if (value.length <= 11) {
      if (value.length <= 10) {
        value = value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
      } else {
        value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
      }
      this.registerForm.patchValue({ phone: value });
    }
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  getPasswordStrengthClass(): string {
    const password = this.passwordControl?.value || '';
    const strength = this.calculatePasswordStrength(password);
    
    if (strength >= 80) return 'strong';
    if (strength >= 60) return 'good';
    if (strength >= 40) return 'fair';
    return 'weak';
  }

  getPasswordStrengthText(): string {
    const password = this.passwordControl?.value || '';
    const strength = this.calculatePasswordStrength(password);
    
    if (strength >= 80) return 'Muito forte';
    if (strength >= 60) return 'Forte';
    if (strength >= 40) return 'Regular';
    return 'Fraca';
  }

  private calculatePasswordStrength(password: string): number {
    let strength = 0;
    
    if (password.length >= 6) strength += 20;
    if (password.length >= 8) strength += 10;
    if (/[a-z]/.test(password)) strength += 20;
    if (/[A-Z]/.test(password)) strength += 20;
    if (/\d/.test(password)) strength += 20;
    if (/[^A-Za-z\d]/.test(password)) strength += 10;
    
    return strength;
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const registerData: RegisterRequest = {
        name: this.registerForm.value.name,
        email: this.registerForm.value.email,
        phone: this.registerForm.value.phone,
        password: this.registerForm.value.password,
        acceptMarketing: this.registerForm.value.acceptMarketing
      };

      this.authService.register(registerData).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.registerSuccess.emit();
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.message || 'Erro ao criar conta. Tente novamente.';
        }
      });
    }
  }

  onSwitchToLogin(): void {
    this.switchToLogin.emit();
  }
}
