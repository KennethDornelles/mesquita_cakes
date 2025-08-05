import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-product-card',
  template: `
    <div class="card card--product card--hover" [class.animate-fade-in]="animate">
      <div class="card__image-container" [style.background]="imageBackground">
        <div class="card__image-content">{{ emoji }}</div>
      </div>
      
      <div class="card__header">
        <div class="flex flex--between flex--align-center">
          <h3 class="card__title">{{ name }}</h3>
          <span class="badge" [ngClass]="badgeClass" *ngIf="badge">{{ badge }}</span>
        </div>
      </div>
      
      <div class="card__body">
        <p class="card__description">{{ description }}</p>
        
        <div class="flex flex--between flex--align-center mt-4">
          <div class="card__price">{{ price | currency:'BRL':'symbol':'1.2-2' }}</div>
          
          <button 
            class="btn btn--primary btn--sm hover-lift"
            (click)="onAddToCart()"
            [disabled]="!available">
            {{ available ? 'Comprar 🛒' : 'Indisponível' }}
          </button>
        </div>
        
        <!-- Rating -->
        <div class="flex flex--align-center gap-2 mt-3" *ngIf="rating">
          <div class="flex">
            <span *ngFor="let star of getStars(rating)" class="text-yellow-400">⭐</span>
          </div>
          <span class="text-sm text-neutral">({{ reviewCount }} avaliações)</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card__image-container {
      height: 12rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 1rem 1rem 0 0;
    }
    
    .card__image-content {
      font-size: 4rem;
      animation: var(--animate-sweet-bounce, none);
    }
    
    .card:hover .card__image-content {
      transform: scale(1.1);
      transition: transform 0.2s ease-out;
    }
  `]
})
export class ProductCardComponent {
  @Input() name: string = '';
  @Input() description: string = '';
  @Input() price: number = 0;
  @Input() emoji: string = '🎂';
  @Input() imageBackground: string = 'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)';
  @Input() badge: string = '';
  @Input() badgeClass: string = 'badge--primary';
  @Input() available: boolean = true;
  @Input() rating: number = 0;
  @Input() reviewCount: number = 0;
  @Input() animate: boolean = false;

  onAddToCart() {
    if (this.available) {
      // Implementar lógica do carrinho
      console.log(`Adicionando ${this.name} ao carrinho`);
    }
  }

  getStars(rating: number): number[] {
    return Array(Math.floor(rating)).fill(0);
  }
}
