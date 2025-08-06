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
  { path: '**', redirectTo: '/home' }
];
