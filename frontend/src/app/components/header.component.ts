import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService, User } from '../services/auth.service';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="header">
      <nav class="navbar">
        <div class="container">
          <div class="navbar-content">
            
            <!-- Logo -->
            <div class="navbar-brand">
              <a routerLink="/home" class="logo-link">
                <div class="logo">
                  <span class="logo-emoji">🎂</span>
                  <span class="logo-text">Mesquita Cakes</span>
                </div>
              </a>
            </div>
            
            <!-- Navigation Menu -->
            <nav class="navbar-menu" [class.active]="menuOpen">
              <a routerLink="/home" class="nav-link" routerLinkActive="active" (click)="closeMenu()">Home</a>
              <a routerLink="/cardapio" class="nav-link" routerLinkActive="active" (click)="closeMenu()">Cardápio</a>
              <a href="#sobre" class="nav-link" (click)="closeMenu()">Sobre</a>
              <a href="#contato" class="nav-link" (click)="closeMenu()">Contato</a>
            </nav>
            
            <!-- Action Buttons -->
            <div class="navbar-actions">
              <!-- User Menu (when logged in) -->
              <div *ngIf="currentUser" class="user-menu">
                <button class="user-btn" (click)="toggleUserMenu()">
                  <div class="user-avatar">
                    <span>{{ getUserInitials(currentUser.name) }}</span>
                  </div>
                  <span class="user-name">{{ currentUser.name.split(' ')[0] }}</span>
                  <svg class="dropdown-icon" [class.open]="userMenuOpen" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7 10l5 5 5-5z"/>
                  </svg>
                </button>
                
                <!-- User Dropdown -->
                <div class="user-dropdown" [class.active]="userMenuOpen">
                  <div class="user-info">
                    <div class="user-avatar-large">
                      <span>{{ getUserInitials(currentUser.name) }}</span>
                    </div>
                    <div class="user-details">
                      <h4>{{ currentUser.name }}</h4>
                      <p>{{ currentUser.email }}</p>
                      <span class="user-role" [class.admin]="currentUser.role === 'ADMIN'">
                        {{ currentUser.role === 'ADMIN' ? 'Administrador' : 'Cliente' }}
                      </span>
                    </div>
                  </div>
                  <div class="dropdown-divider"></div>
                  <div class="dropdown-menu">
                    <button class="dropdown-item" (click)="goToProfile()">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                      </svg>
                      Meu Perfil
                    </button>
                    <button class="dropdown-item" (click)="goToOrders()">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                      </svg>
                      Meus Pedidos
                    </button>
                    <button *ngIf="currentUser.role === 'ADMIN'" class="dropdown-item" (click)="goToAdmin()">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
                      </svg>
                      Painel Admin
                    </button>
                  </div>
                  <div class="dropdown-divider"></div>
                  <button class="dropdown-item logout-btn" (click)="logout()">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.59L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
                    </svg>
                    Sair
                  </button>
                </div>
              </div>
              
              <!-- Login Button (when not logged in) -->
              <button *ngIf="!currentUser" class="login-btn btn btn--outline btn--sm" (click)="goToLogin()">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11 7L9.6 8.4l2.6 2.6H2v2h10.2l-2.6 2.6L11 17l5-5-5-5zm9 12h-8v2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-8v2h8v12z"/>
                </svg>
                Entrar
              </button>
              
              <!-- Cart Button -->
              <button class="cart-btn" (click)="toggleCart()">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="m1 1 4 4 6.38 12h8.62l2-8h-13"></path>
                </svg>
                <span class="cart-count" *ngIf="cartItemCount > 0">{{ cartItemCount }}</span>
              </button>
              
              <!-- WhatsApp Button -->
              <button class="whatsapp-btn btn btn--sweet btn--sm" (click)="openWhatsApp()">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
                Pedidos
              </button>
              
              <!-- Mobile Menu Toggle -->
              <button class="menu-toggle" (click)="toggleMenu()" aria-label="Toggle menu">
                <span class="hamburger-line" [class.active]="menuOpen"></span>
                <span class="hamburger-line" [class.active]="menuOpen"></span>
                <span class="hamburger-line" [class.active]="menuOpen"></span>
              </button>
            </div>
            
          </div>
        </div>
      </nav>
      
      <!-- Mobile Menu Overlay -->
      <div class="mobile-overlay" [class.active]="menuOpen" (click)="closeMenu()"></div>
      
      <!-- User Menu Overlay -->
      <div class="user-overlay" [class.active]="userMenuOpen" (click)="closeUserMenu()"></div>
    </header>
  `,
  styles: [`
    .header {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border-bottom: 1px solid rgba(236, 72, 153, 0.1);
      transition: all 0.3s ease;
    }

    .navbar {
      padding: 1rem 0;
    }

    .navbar-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 2rem;
    }

    .navbar-brand {
      flex-shrink: 0;
    }

    .logo-link {
      text-decoration: none;
      color: inherit;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .logo-emoji {
      font-size: 2rem;
      filter: drop-shadow(0 2px 4px rgba(236, 72, 153, 0.3));
    }

    .logo-text {
      font-family: 'Fredoka One', cursive;
      font-size: 1.5rem;
      color: #ec4899;
      text-shadow: 1px 1px 2px rgba(236, 72, 153, 0.1);
    }

    .navbar-menu {
      display: flex;
      align-items: center;
      gap: 2rem;
      margin-left: auto;
      margin-right: auto;
    }

    .nav-link {
      color: #374151;
      text-decoration: none;
      font-weight: 500;
      padding: 0.5rem 1rem;
      border-radius: 0.5rem;
      transition: all 0.3s ease;
      position: relative;
    }

    .nav-link:hover,
    .nav-link.active {
      color: #ec4899;
      background: rgba(236, 72, 153, 0.1);
    }

    .nav-link.active::after {
      content: '';
      position: absolute;
      bottom: -0.5rem;
      left: 50%;
      transform: translateX(-50%);
      width: 6px;
      height: 6px;
      background: #ec4899;
      border-radius: 50%;
    }

    .navbar-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
      flex-shrink: 0;
    }

    .cart-btn {
      position: relative;
      background: none;
      border: none;
      color: #6b7280;
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 0.5rem;
      transition: all 0.3s ease;
    }

    .cart-btn:hover {
      color: #ec4899;
      background: rgba(236, 72, 153, 0.1);
    }

    .cart-count {
      position: absolute;
      top: 0;
      right: 0;
      background: #ef4444;
      color: white;
      font-size: 0.75rem;
      font-weight: 600;
      padding: 0.125rem 0.375rem;
      border-radius: 0.75rem;
      min-width: 1.25rem;
      height: 1.25rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .whatsapp-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
    }

    .whatsapp-btn svg {
      width: 16px;
      height: 16px;
    }

    .menu-toggle {
      display: none;
      flex-direction: column;
      background: none;
      border: none;
      cursor: pointer;
      padding: 0.5rem;
      gap: 0.25rem;
    }

    .hamburger-line {
      width: 20px;
      height: 2px;
      background: #374151;
      transition: all 0.3s ease;
      transform-origin: center;
    }

    .hamburger-line.active:nth-child(1) {
      transform: rotate(45deg) translate(6px, 6px);
    }

    .hamburger-line.active:nth-child(2) {
      opacity: 0;
    }

    .hamburger-line.active:nth-child(3) {
      transform: rotate(-45deg) translate(6px, -6px);
    }

    .mobile-overlay {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: 999;
    }

    /* Mobile Responsive */
    @media (max-width: 768px) {
      .navbar-menu {
        position: fixed;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        flex-direction: column;
        padding: 2rem 1rem;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        transform: translateY(-100%);
        transition: transform 0.3s ease;
        pointer-events: none;
        opacity: 0;
      }

      .navbar-menu.active {
        transform: translateY(0);
        pointer-events: all;
        opacity: 1;
      }

      .mobile-overlay.active {
        display: block;
      }

      .menu-toggle {
        display: flex;
      }

      .whatsapp-btn {
        display: none;
      }

      .nav-link {
        padding: 1rem;
        width: 100%;
        text-align: center;
        border-radius: 0.75rem;
      }

      .navbar-content {
        gap: 1rem;
      }
    }

    @media (max-width: 480px) {
      .logo-text {
        font-size: 1.25rem;
      }

      .logo-emoji {
        font-size: 1.75rem;
      }

      .navbar {
        padding: 0.75rem 0;
      }
    }

    /* Scroll effect */
    .header.scrolled {
      background: rgba(255, 255, 255, 0.98);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }

    /* User Authentication Styles */
    .login-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
    }

    .user-menu {
      position: relative;
    }

    .user-btn {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 0.75rem;
      padding: 0.5rem 1rem;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .user-btn:hover {
      border-color: #ec4899;
      box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.1);
    }

    .user-avatar {
      width: 2rem;
      height: 2rem;
      background: linear-gradient(135deg, #ec4899, #be185d);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .user-name {
      font-weight: 600;
      color: #374151;
      font-size: 0.875rem;
    }

    .dropdown-icon {
      transition: transform 0.2s ease;
      color: #6b7280;
    }

    .dropdown-icon.open {
      transform: rotate(180deg);
    }

    .user-dropdown {
      position: absolute;
      top: 100%;
      right: 0;
      margin-top: 0.5rem;
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 1rem;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
      min-width: 280px;
      z-index: 1000;
      opacity: 0;
      visibility: hidden;
      transform: translateY(-10px);
      transition: all 0.2s ease;
    }

    .user-dropdown.active {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }

    .user-info {
      padding: 1.5rem;
      display: flex;
      gap: 1rem;
    }

    .user-avatar-large {
      width: 3rem;
      height: 3rem;
      background: linear-gradient(135deg, #ec4899, #be185d);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 1rem;
      font-weight: 600;
      flex-shrink: 0;
    }

    .user-details h4 {
      margin: 0 0 0.25rem 0;
      font-weight: 600;
      color: #111827;
      font-size: 1rem;
    }

    .user-details p {
      margin: 0 0 0.5rem 0;
      color: #6b7280;
      font-size: 0.875rem;
    }

    .user-role {
      background: #f3f4f6;
      color: #374151;
      padding: 0.25rem 0.75rem;
      border-radius: 1rem;
      font-size: 0.75rem;
      font-weight: 500;
    }

    .user-role.admin {
      background: #fef3c7;
      color: #92400e;
    }

    .dropdown-divider {
      height: 1px;
      background: #e5e7eb;
      margin: 0 1rem;
    }

    .dropdown-menu {
      padding: 0.75rem 0;
    }

    .dropdown-item {
      width: 100%;
      background: none;
      border: none;
      padding: 0.75rem 1.5rem;
      text-align: left;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      color: #374151;
      font-size: 0.875rem;
      transition: background-color 0.2s ease;
    }

    .dropdown-item:hover {
      background: #f9fafb;
    }

    .dropdown-item svg {
      color: #6b7280;
      width: 1.25rem;
      height: 1.25rem;
    }

    .logout-btn {
      color: #dc2626;
    }

    .logout-btn:hover {
      background: #fef2f2;
    }

    .logout-btn svg {
      color: #dc2626;
    }

    .user-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: transparent;
      z-index: 999;
      display: none;
    }

    .user-overlay.active {
      display: block;
    }

    /* Mobile Adjustments for User Menu */
    @media (max-width: 768px) {
      .user-btn {
        padding: 0.5rem;
        gap: 0.5rem;
      }

      .user-name {
        display: none;
      }

      .user-dropdown {
        right: -1rem;
        min-width: 260px;
      }

      .login-btn {
        padding: 0.5rem;
        gap: 0.25rem;
      }

      .login-btn span {
        display: none;
      }
    }
  `]
})
export class HeaderComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  menuOpen = false;
  userMenuOpen = false;
  cartItemCount = 0;
  currentUser: User | null = null;

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.currentUser = user;
      });

    // Subscribe to cart changes
    this.cartService.getCartSummary()
      .pipe(takeUntil(this.destroy$))
      .subscribe(summary => {
        this.cartItemCount = summary.itemCount;
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getUserInitials(name: string): string {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
    
    // Prevent body scroll when menu is open
    if (this.menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  closeMenu() {
    this.menuOpen = false;
    document.body.style.overflow = '';
  }

  toggleUserMenu() {
    this.userMenuOpen = !this.userMenuOpen;
  }

  closeUserMenu() {
    this.userMenuOpen = false;
  }

  goToLogin() {
    this.router.navigate(['/auth']);
  }

  goToProfile() {
    this.closeUserMenu();
    this.router.navigate(['/perfil']);
  }

  goToOrders() {
    this.closeUserMenu();
    this.router.navigate(['/pedidos']);
  }

  goToAdmin() {
    this.closeUserMenu();
    this.router.navigate(['/admin']);
  }

  logout() {
    this.closeUserMenu();
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/home']);
    });
  }

  toggleCart() {
    this.router.navigate(['/carrinho']);
  }

  openWhatsApp() {
    const message = encodeURIComponent('Olá! Gostaria de fazer um pedido na Mesquita Cakes 🎂');
    const whatsappUrl = `https://wa.me/5511999999999?text=${message}`;
    window.open(whatsappUrl, '_blank');
  }
}
