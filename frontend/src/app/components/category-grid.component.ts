import { Component, Input, Output, EventEmitter } from '@angular/core';

import { Category } from '../services/product.service';

@Component({
  selector: 'app-category-grid',
  standalone: true,
  imports: [],
  template: `
    <section class="categories-section section bg-cream">
      <div class="container">
        <div class="section-header text-center mb-12">
          <h2 class="sweet-text text-4xl mb-4">
            Nossas Especialidades 🍰
          </h2>
          <p class="text-lg text-neutral max-w-2xl mx-auto">
            Descubra nossos sabores únicos e escolha sua categoria favorita
          </p>
        </div>
        
        <div class="categories-grid grid grid--4 gap-6">
          @for (category of categories; track category.id) {
            <div 
              class="category-card card card--sweet card--hover cursor-pointer"
              (click)="onCategoryClick(category)">
              
              <div class="category-icon">
                <span class="emoji">{{ getCategoryEmoji(category.name) }}</span>
              </div>
              
              <div class="category-content">
                <h3 class="category-title">{{ category.name }}</h3>
                <p class="category-description">{{ category.description }}</p>
              </div>
              
              <div class="category-arrow">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="m9 18 6-6-6-6"/>
                </svg>
              </div>
            </div>
          }
        </div>
        
        <div class="section-cta text-center mt-12">
          <button 
            class="btn btn--primary btn--lg hover-lift"
            (click)="onViewAllClick()">
            Ver Todos os Produtos 👀
          </button>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .categories-section {
      background: linear-gradient(135deg, #fef7ed 0%, #ecfdf5 100%);
    }

    .section-header h2 {
      background: linear-gradient(135deg, #ec4899 0%, #14b8a6 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .categories-grid {
      margin-bottom: 3rem;
    }

    .category-card {
      padding: 2rem;
      text-align: center;
      background: white;
      border-radius: 1.5rem;
      border: 2px solid transparent;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }

    .category-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(236, 72, 153, 0.1), transparent);
      transition: left 0.5s ease;
    }

    .category-card:hover::before {
      left: 100%;
    }

    .category-card:hover {
      border-color: #ec4899;
      transform: translateY(-8px);
      box-shadow: 0 20px 40px rgba(236, 72, 153, 0.15);
    }

    .category-icon {
      margin-bottom: 1.5rem;
    }

    .category-icon .emoji {
      font-size: 4rem;
      display: inline-block;
      transition: transform 0.3s ease;
    }

    .category-card:hover .emoji {
      transform: scale(1.1) rotate(5deg);
    }

    .category-title {
      font-family: 'Quicksand', sans-serif;
      font-size: 1.5rem;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 0.75rem;
    }

    .category-description {
      color: #6b7280;
      font-size: 0.875rem;
      line-height: 1.5;
      margin-bottom: 1.5rem;
    }

    .category-arrow {
      color: #ec4899;
      transition: transform 0.3s ease;
    }

    .category-card:hover .category-arrow {
      transform: translateX(4px);
    }

    .section-cta {
      padding-top: 2rem;
      border-top: 1px solid rgba(107, 114, 128, 0.1);
    }

    /* Responsive */
    @media (max-width: 1024px) {
      .categories-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 640px) {
      .categories-grid {
        grid-template-columns: 1fr;
      }
      
      .category-card {
        padding: 1.5rem;
      }

      .category-icon .emoji {
        font-size: 3rem;
      }
    }
  `]
})
export class CategoryGridComponent {
  @Input() categories: Category[] = [];
  @Output() categoryClick = new EventEmitter<Category>();
  @Output() viewAllClick = new EventEmitter<void>();

  getCategoryEmoji(categoryName: string): string {
    const emojis = {
      'Bolos': '🎂',
      'Tortas': '🍰', 
      'Doces': '🧁',
      'Salgados': '🥙',
      'Bebidas': '🥤'
    };
    return emojis[categoryName as keyof typeof emojis] || '🍰';
  }

  onCategoryClick(category: Category) {
    console.log('🔥 Category clicked:', category);
    this.categoryClick.emit(category);
  }

  onViewAllClick() {
    console.log('🔥 View all products clicked!');
    this.viewAllClick.emit();
  }
}
