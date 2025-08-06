import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { 
    path: 'home', 
    loadComponent: () => import('./pages/home.component').then(m => m.HomeComponent)
  },
  { 
    path: 'test-cep', 
    loadComponent: () => import('./components/cep-test.component').then(m => m.CepTestComponent)
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
  // Customer Area Routes
  { 
    path: 'perfil', 
    loadComponent: () => import('./pages/profile.component').then(m => m.ProfileComponent)
  },
  { 
    path: 'meus-pedidos', 
    loadComponent: () => import('./pages/order-history.component').then(m => m.OrderHistoryComponent)
  },
  // Information Pages
  { 
    path: 'contato', 
    loadComponent: () => import('./pages/contact.component').then(m => m.ContactComponent)
  },
  { 
    path: 'sobre', 
    loadComponent: () => import('./pages/about.component').then(m => m.AboutComponent)
  },
  { path: '**', redirectTo: '/home' }
];
