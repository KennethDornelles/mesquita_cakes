import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService, LoginRequest } from '../services/auth.service';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
      
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
            placeholder="seu@email.com"
            autocomplete="email">
        </div>
        <div *ngIf="emailControl?.invalid && emailControl?.touched" class="error-message">
          <span *ngIf="emailControl?.errors?.['required']">E-mail é obrigatório</span>
          <span *ngIf="emailControl?.errors?.['email']">E-mail inválido</span>
        </div>
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
            placeholder="Sua senha"
            autocomplete="current-password">
          <button
            type="button"
            class="password-toggle"
            (click)="togglePassword()"
            title="{{ showPassword ? 'Ocultar senha' : 'Mostrar senha' }}">
            <svg *ngIf="!showPassword" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
            </svg>
            <svg *ngIf="showPassword" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
            </svg>
          </button>
        </div>
        <div *ngIf="passwordControl?.invalid && passwordControl?.touched" class="error-message">
          <span *ngIf="passwordControl?.errors?.['required']">Senha é obrigatória</span>
          <span *ngIf="passwordControl?.errors?.['minlength']">Senha deve ter pelo menos 6 caracteres</span>
        </div>
      </div>

      <!-- Remember Me and Forgot Password -->
      <div class="form-options">
        <label class="checkbox-label">
          <input type="checkbox" formControlName="rememberMe" class="checkbox">
          <span class="checkbox-text">Lembrar de mim</span>
        </label>
        <button type="button" class="forgot-password-btn" (click)="onForgotPassword()">
          Esqueci minha senha
        </button>
      </div>

      <!-- Submit Button -->
      <button 
        type="submit" 
        class="submit-btn"
        [disabled]="loginForm.invalid || isLoading"
        [class.loading]="isLoading">
        <span *ngIf="!isLoading">Entrar</span>
        <span *ngIf="isLoading" class="loading-content">
          <svg class="loading-spinner" width="20" height="20" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-dasharray="32" stroke-dashoffset="32">
              <animate attributeName="stroke-dasharray" dur="2s" values="0 32;16 16;0 32;0 32" repeatCount="indefinite"/>
              <animate attributeName="stroke-dashoffset" dur="2s" values="0;-16;-32;-32" repeatCount="indefinite"/>
            </circle>
          </svg>
          Entrando...
        </span>
      </button>

      <!-- Error Message -->
      <div *ngIf="errorMessage" class="form-error">
        {{ errorMessage }}
      </div>

      <!-- Demo Credentials -->
      <div class="demo-credentials">
        <p class="demo-title">🎯 Contas de demonstração:</p>
        <div class="demo-accounts">
          <button type="button" class="demo-btn" (click)="fillDemoUser()">
            <strong>Cliente:</strong> joao&#64;email.com / 123456
          </button>
          <button type="button" class="demo-btn" (click)="fillDemoAdmin()">
            <strong>Admin:</strong> admin&#64;mesquitacakes.com / admin123
          </button>
        </div>
      </div>

      <!-- Register Link -->
      <div class="switch-mode">
        <p>Não tem uma conta? 
          <button type="button" class="switch-btn" (click)="onSwitchToRegister()">
            Criar conta
          </button>
        </p>
      </div>
    </form>

    <!-- Forgot Password Modal -->
    <div *ngIf="showForgotModal" class="modal-overlay" (click)="closeForgotModal()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h3>Recuperar Senha</h3>
          <button class="modal-close" (click)="closeForgotModal()">×</button>
        </div>
        <form [formGroup]="forgotForm" (ngSubmit)="onSubmitForgot()" class="forgot-form">
          <p class="modal-description">
            Digite seu e-mail e enviaremos um link para redefinir sua senha.
          </p>
          <div class="form-group">
            <label for="forgotEmail" class="form-label">E-mail</label>
            <input
              id="forgotEmail"
              type="email"
              formControlName="email"
              class="form-input"
              placeholder="seu@email.com">
          </div>
          <div class="modal-actions">
            <button type="button" class="btn btn--secondary" (click)="closeForgotModal()">
              Cancelar
            </button>
            <button type="submit" class="btn btn--primary" [disabled]="forgotForm.invalid || isForgotLoading">
              {{ isForgotLoading ? 'Enviando...' : 'Enviar Link' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .login-form {
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

    .form-options {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
      font-size: 0.875rem;
    }

    .checkbox {
      width: 1rem;
      height: 1rem;
      accent-color: #ec4899;
    }

    .checkbox-text {
      color: #374151;
    }

    .forgot-password-btn {
      background: none;
      border: none;
      color: #ec4899;
      font-size: 0.875rem;
      cursor: pointer;
      text-decoration: none;
      padding: 0;
    }

    .forgot-password-btn:hover {
      text-decoration: underline;
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

    .demo-credentials {
      background: #f0f9ff;
      border: 1px solid #bae6fd;
      border-radius: 0.5rem;
      padding: 1rem;
      margin-top: 0.5rem;
    }

    .demo-title {
      font-size: 0.875rem;
      font-weight: 600;
      color: #0369a1;
      margin: 0 0 0.75rem 0;
    }

    .demo-accounts {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .demo-btn {
      background: white;
      border: 1px solid #bae6fd;
      border-radius: 0.375rem;
      padding: 0.5rem 0.75rem;
      font-size: 0.75rem;
      color: #0369a1;
      cursor: pointer;
      text-align: left;
      transition: all 0.2s ease;
    }

    .demo-btn:hover {
      background: #f0f9ff;
      border-color: #0ea5e9;
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
      max-width: 400px;
      width: 90%;
      max-height: 90vh;
      overflow-y: auto;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem 1.5rem 0 1.5rem;
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

    .forgot-form {
      padding: 1.5rem;
    }

    .modal-description {
      color: #6b7280;
      font-size: 0.875rem;
      margin: 0 0 1.5rem 0;
      line-height: 1.5;
    }

    .modal-actions {
      display: flex;
      gap: 0.75rem;
      margin-top: 1.5rem;
    }

    .btn {
      flex: 1;
      padding: 0.75rem 1rem;
      border-radius: 0.5rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      border: none;
    }

    .btn--secondary {
      background: #f3f4f6;
      color: #374151;
    }

    .btn--secondary:hover {
      background: #e5e7eb;
    }

    .btn--primary {
      background: linear-gradient(135deg, #ec4899, #be185d);
      color: white;
    }

    .btn--primary:hover:not(:disabled) {
      background: linear-gradient(135deg, #be185d, #9d174d);
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    /* Responsive Design */
    @media (max-width: 640px) {
      .form-options {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.75rem;
      }

      .demo-accounts {
        gap: 0.375rem;
      }

      .demo-btn {
        font-size: 0.6875rem;
        padding: 0.375rem 0.5rem;
      }

      .modal-actions {
        flex-direction: column;
      }
    }
  `]
})
export class LoginFormComponent {
  @Output() loginSuccess = new EventEmitter<void>();
  @Output() switchToRegister = new EventEmitter<void>();

  loginForm: FormGroup;
  forgotForm: FormGroup;
  showPassword = false;
  showForgotModal = false;
  isLoading = false;
  isForgotLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });

    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  get emailControl() { return this.loginForm.get('email'); }
  get passwordControl() { return this.loginForm.get('password'); }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  fillDemoUser(): void {
    this.loginForm.patchValue({
      email: 'joao@email.com',
      password: '123456'
    });
  }

  fillDemoAdmin(): void {
    this.loginForm.patchValue({
      email: 'admin@mesquitacakes.com',
      password: 'admin123'
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const loginData: LoginRequest = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password
      };

      this.authService.login(loginData).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.loginSuccess.emit();
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.message || 'Erro ao fazer login. Tente novamente.';
        }
      });
    }
  }

  onForgotPassword(): void {
    this.showForgotModal = true;
  }

  closeForgotModal(): void {
    this.showForgotModal = false;
    this.forgotForm.reset();
  }

  onSubmitForgot(): void {
    if (this.forgotForm.valid) {
      this.isForgotLoading = true;
      
      this.authService.forgotPassword(this.forgotForm.value.email).subscribe({
        next: () => {
          this.isForgotLoading = false;
          alert('Link de recuperação enviado para seu e-mail!');
          this.closeForgotModal();
        },
        error: (error) => {
          this.isForgotLoading = false;
          alert(error.message || 'Erro ao enviar e-mail de recuperação.');
        }
      });
    }
  }

  onSwitchToRegister(): void {
    this.switchToRegister.emit();
  }
}
