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
    path: 'produto/:slug', 
    loadComponent: () => import('./pages/product-detail.component').then(m => m.ProductDetailComponent)
  },
  { path: '**', redirectTo: '/home' }
];
