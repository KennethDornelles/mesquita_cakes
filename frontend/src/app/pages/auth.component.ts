import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { LoginFormComponent, RegisterFormComponent } from '../components';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [LoginFormComponent, RegisterFormComponent],
  template: `
    <div class="auth-page">
      <!-- Background Pattern -->
      <div class="auth-background">
        <div class="pattern-overlay"></div>
      </div>
    
      <!-- Main Content -->
      <div class="auth-container">
        <div class="auth-card">
          <!-- Logo and Header -->
          <div class="auth-header">
            <div class="logo">
              <span class="logo-emoji">🎂</span>
              <span class="logo-text">Mesquita Cakes</span>
            </div>
            <h1 class="auth-title">{{ isLoginMode ? 'Fazer Login' : 'Criar Conta' }}</h1>
            <p class="auth-subtitle">
              {{ isLoginMode
              ? 'Entre na sua conta para fazer pedidos'
              : 'Crie sua conta e desfrute dos nossos doces' }}
            </p>
          </div>
    
          <!-- Tab Navigation -->
          <div class="auth-tabs">
            <button
              class="tab-button"
              [class.active]="isLoginMode"
              (click)="switchToLogin()">
              Entrar
            </button>
            <button
              class="tab-button"
              [class.active]="!isLoginMode"
              (click)="switchToRegister()">
              Registrar
            </button>
          </div>
    
          <!-- Form Content -->
          <div class="auth-form-container">
            @if (isLoginMode) {
              <app-login-form
                (loginSuccess)="onAuthSuccess()"
                (switchToRegister)="switchToRegister()">
              </app-login-form>
            }
    
            @if (!isLoginMode) {
              <app-register-form
                (registerSuccess)="onAuthSuccess()"
                (switchToLogin)="switchToLogin()">
              </app-register-form>
            }
          </div>
    
          <!-- Social Login -->
          @if (false) {
            <div class="social-login">
              <div class="divider">
                <span>ou</span>
              </div>
              <div class="social-buttons">
                <button class="social-btn social-btn--google">
                  <svg width="20" height="20" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continuar com Google
                </button>
                <button class="social-btn social-btn--facebook">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Continuar com Facebook
                </button>
              </div>
            </div>
          }
    
          <!-- Footer -->
          <div class="auth-footer">
            <p class="footer-text">
              Ao {{ isLoginMode ? 'fazer login' : 'criar uma conta' }}, você concorda com nossos
              <a href="#" class="footer-link">Termos de Uso</a> e
              <a href="#" class="footer-link">Política de Privacidade</a>
            </p>
          </div>
        </div>
    
        <!-- Side Content -->
        <div class="auth-side-content">
          <div class="side-content-inner">
            <h2 class="side-title">Desfrute dos melhores doces artesanais</h2>
            <p class="side-description">
              Na Mesquita Cakes, cada doce é feito com amor e ingredientes selecionados.
              Crie sua conta e tenha acesso a promoções exclusivas, histórico de pedidos
              e muito mais!
            </p>
    
            <div class="features-list">
              <div class="feature-item">
                <span class="feature-icon">🎂</span>
                <span class="feature-text">Doces artesanais fresquinhos</span>
              </div>
              <div class="feature-item">
                <span class="feature-icon">🚚</span>
                <span class="feature-text">Entrega rápida e segura</span>
              </div>
              <div class="feature-item">
                <span class="feature-icon">⭐</span>
                <span class="feature-text">Avaliação 5 estrelas</span>
              </div>
              <div class="feature-item">
                <span class="feature-icon">💝</span>
                <span class="feature-text">Promoções exclusivas</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    `,
  styles: [`
    .auth-page {
      min-height: 100vh;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #fef7ed 0%, #fed7aa 100%);
    }

    .auth-background {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-image: 
        radial-gradient(circle at 20% 50%, rgba(236, 72, 153, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(168, 85, 247, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 40% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%);
    }

    .pattern-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ec4899' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    }

    .auth-container {
      position: relative;
      z-index: 1;
      display: grid;
      grid-template-columns: 1fr 1fr;
      max-width: 1200px;
      width: 100%;
      min-height: 600px;
      background: white;
      border-radius: 2rem;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      overflow: hidden;
    }

    .auth-card {
      padding: 3rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .auth-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .logo {
      display: inline-flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1.5rem;
    }

    .logo-emoji {
      font-size: 2.5rem;
    }

    .logo-text {
      font-size: 1.5rem;
      font-weight: 700;
      color: #111827;
    }

    .auth-title {
      font-size: 2rem;
      font-weight: 700;
      color: #111827;
      margin: 0 0 0.5rem 0;
    }

    .auth-subtitle {
      color: #6b7280;
      font-size: 1rem;
      margin: 0;
    }

    .auth-tabs {
      display: flex;
      background: #f3f4f6;
      border-radius: 0.75rem;
      padding: 0.25rem;
      margin-bottom: 2rem;
    }

    .tab-button {
      flex: 1;
      padding: 0.75rem 1rem;
      border: none;
      background: transparent;
      border-radius: 0.5rem;
      font-weight: 600;
      color: #6b7280;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .tab-button.active {
      background: white;
      color: #ec4899;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .tab-button:hover:not(.active) {
      color: #374151;
    }

    .auth-form-container {
      flex: 1;
    }

    .social-login {
      margin-top: 2rem;
    }

    .divider {
      position: relative;
      text-align: center;
      margin: 1.5rem 0;
    }

    .divider::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      height: 1px;
      background: #e5e7eb;
    }

    .divider span {
      background: white;
      padding: 0 1rem;
      color: #6b7280;
      font-size: 0.875rem;
    }

    .social-buttons {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .social-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      padding: 0.75rem 1rem;
      border: 1px solid #e5e7eb;
      border-radius: 0.5rem;
      background: white;
      color: #374151;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .social-btn:hover {
      background: #f9fafb;
      border-color: #d1d5db;
    }

    .auth-footer {
      margin-top: 2rem;
      text-align: center;
    }

    .footer-text {
      font-size: 0.75rem;
      color: #6b7280;
      line-height: 1.5;
      margin: 0;
    }

    .footer-link {
      color: #ec4899;
      text-decoration: none;
    }

    .footer-link:hover {
      text-decoration: underline;
    }

    /* Side Content */
    .auth-side-content {
      background: linear-gradient(135deg, #ec4899 0%, #be185d 100%);
      padding: 3rem;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .side-content-inner {
      max-width: 400px;
    }

    .side-title {
      font-size: 2.25rem;
      font-weight: 700;
      line-height: 1.2;
      margin: 0 0 1.5rem 0;
    }

    .side-description {
      font-size: 1.125rem;
      line-height: 1.6;
      opacity: 0.9;
      margin: 0 0 2.5rem 0;
    }

    .features-list {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .feature-item {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .feature-icon {
      font-size: 1.5rem;
      flex-shrink: 0;
    }

    .feature-text {
      font-size: 1rem;
      font-weight: 500;
    }

    /* Responsive Design */
    @media (max-width: 1024px) {
      .auth-container {
        grid-template-columns: 1fr;
        max-width: 500px;
        margin: 1rem;
      }

      .auth-side-content {
        display: none;
      }

      .auth-card {
        padding: 2rem;
      }
    }

    @media (max-width: 640px) {
      .auth-card {
        padding: 1.5rem;
      }

      .auth-title {
        font-size: 1.75rem;
      }

      .logo-text {
        font-size: 1.25rem;
      }

      .social-buttons {
        gap: 0.5rem;
      }

      .social-btn {
        padding: 0.625rem 0.75rem;
        font-size: 0.875rem;
      }
    }
  `]
})
export class AuthComponent implements OnInit, OnDestroy {
  isLoginMode = true;
  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    // Se já estiver logado, redirecionar
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        if (user) {
          this.router.navigate(['/home']);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  switchToLogin(): void {
    this.isLoginMode = true;
  }

  switchToRegister(): void {
    this.isLoginMode = false;
  }

  onAuthSuccess(): void {
    // Navegar para a página anterior ou home
    let returnUrl = '/home';
    if (isPlatformBrowser(this.platformId)) {
      returnUrl = localStorage.getItem('returnUrl') || '/home';
      localStorage.removeItem('returnUrl');
    }
    this.router.navigate([returnUrl]);
  }
}
