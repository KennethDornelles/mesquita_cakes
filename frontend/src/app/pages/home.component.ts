import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService, Product, Category } from '../services/product.service';
import { CartService } from '../services/cart.service';
import { HeroSectionComponent } from '../components/hero-section.component';
import { CategoryGridComponent } from '../components/category-grid.component';
import { FeaturedProductsComponent } from '../components/featured-products.component';
import { AboutSectionComponent } from '../components/about-section.component';
import { TestimonialsComponent } from '../components/testimonials.component';
import { CallToActionComponent } from '../components/call-to-action.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeroSectionComponent,
    CategoryGridComponent,
    FeaturedProductsComponent,
    AboutSectionComponent,
    TestimonialsComponent,
    CallToActionComponent
  ],
  template: `
    <div class="home-page">
      <!-- Hero Section -->
      <app-hero-section
        (viewMenuClick)="navigateToMenu()"
        (contactClick)="openWhatsApp()">
      </app-hero-section>
      
      <!-- Categories Section -->
      <app-category-grid
        [categories]="categories"
        (categoryClick)="onCategoryClick($event)"
        (viewAllClick)="scrollToProducts()">
      </app-category-grid>
      
      <!-- Featured Products Section -->
      <div id="produtos" #productsSection>
        <app-featured-products
          [products]="featuredProducts"
          title="Produtos em Destaque"
          subtitle="Os sabores mais amados pelos nossos clientes"
          [showViewMore]="true"
          (addToCart)="onAddToCart($event)"
          (viewMoreClick)="navigateToMenu()">
        </app-featured-products>
      </div>
      
      <!-- Popular Products Section -->
      <app-featured-products
        [products]="popularProducts"
        title="Mais Populares"
        subtitle="Os queridinhos da casa que fazem sucesso sempre"
        [showViewMore]="false"
        (addToCart)="onAddToCart($event)">
      </app-featured-products>
      
      <!-- About Section -->
      <app-about-section></app-about-section>
      
      <!-- Testimonials Section -->
      <app-testimonials></app-testimonials>
      
      <!-- Call to Action Section -->
      <app-call-to-action></app-call-to-action>
    </div>
  `,
  styles: [`
    .home-page {
      min-height: 100vh;
    }

    /* Smooth scroll behavior */
    html {
      scroll-behavior: smooth;
    }

    /* Loading states */
    .loading {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 200px;
    }

    .loading-spinner {
      width: 40px;
      height: 40px;
      border: 3px solid #f3f4f6;
      border-top: 3px solid #ec4899;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    /* Section spacing adjustments */
    app-hero-section {
      display: block;
    }

    app-category-grid {
      display: block;
    }

    app-featured-products {
      display: block;
    }

    app-about-section {
      display: block;
    }

    app-testimonials {
      display: block;
    }

    app-call-to-action {
      display: block;
    }
  `]
})
export class HomeComponent implements OnInit {
  categories: Category[] = [];
  featuredProducts: Product[] = [];
  popularProducts: Product[] = [];
  loading = false;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadData();
  }

  private loadData() {
    this.loading = true;
    
    // Load categories
    this.productService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });

    // Load featured products
    this.productService.getFeaturedProducts().subscribe({
      next: (products) => {
        console.log('🔥 Featured products loaded:', products);
        this.featuredProducts = products;
      },
      error: (error) => {
        console.error('Error loading featured products:', error);
      }
    });

    // Load popular products
    this.productService.getPopularProducts().subscribe({
      next: (products: Product[]) => {
        console.log('🔥 Popular products loaded:', products);
        this.popularProducts = products;
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading popular products:', error);
        this.loading = false;
      }
    });
  }

  onCategoryClick(category: Category) {
    console.log('Category clicked:', category);
    // TODO: Navigate to category page or filter products
    // Example: this.router.navigate(['/categoria', category.slug]);
    this.scrollToProducts();
  }

  onAddToCart(product: Product) {
    console.log('🔥 Home - Adding to cart:', product);
    
    // Criar item do carrinho com customização básica
    const cartItem = {
      productId: product.id,
      productName: product.name,
      productImage: product.image,
      productCategory: product.category,
      basePrice: product.price,
      quantity: 1,
      customization: {
        // Customização básica - pode ser expandida futuramente
        specialInstructions: ''
      }
    };
    
    // Adicionar ao carrinho usando o CartService
    this.cartService.addItem(cartItem);
    
    // Mostrar feedback visual
    this.showAddToCartFeedback(product.name);
  }

  private showAddToCartFeedback(productName: string) {
    // Simple feedback - in a real app, you'd use a toast/snackbar service
    const message = `${productName} adicionado ao carrinho! 🛒`;
    
    // Create temporary notification
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #10b981;
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 0.5rem;
      box-shadow: 0 10px 25px rgba(0,0,0,0.1);
      z-index: 1000;
      font-weight: 500;
      animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }

  scrollToProducts() {
    console.log('🔥 Scroll to products clicked!');
    const element = document.getElementById('produtos');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  navigateToMenu() {
    console.log('🔥 Navigate to menu clicked!');
    this.router.navigate(['/cardapio']);
  }

  openWhatsApp() {
    console.log('🔥 WhatsApp home button clicked!');
    const message = encodeURIComponent('Olá! Gostaria de conhecer mais sobre os bolos da Mesquita Cakes 🎂');
    const whatsappUrl = `https://wa.me/5511999999999?text=${message}`;
    window.open(whatsappUrl, '_blank');
  }
}
