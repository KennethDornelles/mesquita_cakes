import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { 
    path: 'home', 
    loadComponent: () => import('./pages/home.component').then(m => m.HomeComponent)
  },
  { 
    path: 'cardapio', 
    loadComponent: () => import('./pages/catalog.component').then(m => m.CatalogComponent)
  },
  { 
    path: 'produto/:id', 
    loadComponent: () => import('./pages/product-detail-enhanced.component').then(m => m.ProductDetailEnhancedComponent)
  },
  { 
    path: 'auth', 
    loadComponent: () => import('./pages/auth.component').then(m => m.AuthComponent)
  },
  { 
    path: 'login', 
    redirectTo: '/auth',
    pathMatch: 'full'
  },
  { 
    path: 'registro', 
    redirectTo: '/auth',
    pathMatch: 'full'
  },
  { 
    path: 'carrinho', 
    loadComponent: () => import('./pages/cart.component').then(m => m.CartComponent)
  },
  { 
    path: 'checkout', 
    loadComponent: () => import('./pages/checkout.component').then(m => m.CheckoutComponent)
  },
  { 
    path: 'pedido-confirmado', 
    loadComponent: () => import('./pages/order-confirmation.component').then(m => m.OrderConfirmationComponent)
  },
  { path: '**', redirectTo: '/home' }
];
