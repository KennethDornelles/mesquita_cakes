# Mesquita Cakes - Exemplos de Componentes Angular

## 🎂 Exemplo de Componente usando o Design System

### Componente de Card de Produto (TypeScript)

```typescript
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
```

### Como usar o componente:

```html
<!-- No template do componente pai -->
<app-product-card
  name="Bolo de Morango"
  description="Delicioso bolo com morangos frescos e chantilly"
  [price]="89.90"
  emoji="🍓"
  imageBackground="linear-gradient(135deg, #ff6b9d 0%, #ff8cc8 100%)"
  badge="Popular"
  badgeClass="badge--sweet"
  [available]="true"
  [rating]="5"
  [reviewCount]="23"
  [animate]="true">
</app-product-card>
```

## 🛠️ Como criar componentes usando o Design System

### 1. Sempre importe as classes no HTML do componente

```html
<!-- Use as classes do design system diretamente -->
<div class="card card--sweet">
  <button class="btn btn--primary hover-lift">Ação</button>
</div>
```

### 2. Use variáveis SCSS nos estilos do componente

```scss
// No arquivo .scss do componente
@import 'assets/styles/variables';
@import 'assets/styles/mixins';

.meu-elemento {
  @include button-primary;
  color: $primary-600;
  padding: $spacing-4;
}
```

### 3. Exemplo de componente de Modal

```typescript
@Component({
  selector: 'app-modal',
  template: `
    <div class="modal" *ngIf="isOpen" (click)="onBackdropClick($event)">
      <div class="modal__backdrop"></div>
      <div class="modal__content">
        <div class="modal__header">
          <h3 class="modal__title">{{ title }}</h3>
          <button class="modal__close" (click)="close()">×</button>
        </div>
        <div class="modal__body">
          <ng-content></ng-content>
        </div>
        <div class="modal__footer" *ngIf="showFooter">
          <button class="btn btn--outline" (click)="close()">Cancelar</button>
          <button class="btn btn--primary" (click)="confirm()">Confirmar</button>
        </div>
      </div>
    </div>
  `
})
export class ModalComponent {
  @Input() title: string = '';
  @Input() isOpen: boolean = false;
  @Input() showFooter: boolean = true;
  
  close() {
    this.isOpen = false;
  }
  
  confirm() {
    // Lógica de confirmação
    this.close();
  }
  
  onBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.close();
    }
  }
}
```

### 4. Exemplo de uso de animações

```typescript
@Component({
  selector: 'app-cake-animation',
  template: `
    <div class="text-center">
      <div class="animate-cake-rotate text-6xl mb-4">🎂</div>
      <h2 class="sweet-text animate-fade-in">Preparando seu bolo...</h2>
      <div class="animate-sparkle">✨</div>
    </div>
  `
})
export class CakeAnimationComponent {}
```

## 📝 Dicas para Desenvolvimento

### 1. Estrutura recomendada para componentes

```
src/app/
├── components/
│   ├── shared/          # Componentes reutilizáveis
│   │   ├── button/
│   │   ├── card/
│   │   └── modal/
│   └── pages/           # Componentes de página
│       ├── home/
│       ├── menu/
│       └── contact/
└── services/
```

### 2. Sempre teste a responsividade

```html
<!-- Classes responsivas automáticas -->
<div class="grid grid--3">  <!-- 3 cols desktop, 2 tablet, 1 mobile -->
  <div class="card">...</div>
</div>
```

### 3. Use as variáveis de espaçamento

```scss
// ✅ Correto
.meu-elemento {
  padding: $spacing-4;  // 16px
  margin: $spacing-6;   // 24px
}

// ❌ Evite valores hardcoded
.meu-elemento {
  padding: 16px;
  margin: 24px;
}
```

### 4. Mantenha consistência com as cores

```scss
// ✅ Use as variáveis do design system
.destaque {
  background-color: $primary-500;
  border-color: $primary-300;
}

// ❌ Evite cores hardcoded
.destaque {
  background-color: #ec4899;
  border-color: #f9a8d4;
}
```

## 🎨 Exemplos de Layouts Completos

### Página de Produto

```html
<div class="container">
  <div class="section">
    <div class="grid grid--2 gap-8">
      <!-- Imagem do produto -->
      <div class="card card--sweet">
        <div class="bg-gradient-sweet h-96 flex-center text-8xl">🎂</div>
      </div>
      
      <!-- Detalhes do produto -->
      <div>
        <h1 class="font-primary text-4xl text-primary mb-4">
          Bolo Especial de Morango
        </h1>
        <p class="text-lg text-neutral mb-6">
          Nosso bolo mais especial, feito com morangos frescos...
        </p>
        
        <div class="flex flex--align-center gap-4 mb-6">
          <span class="badge badge--sweet">Popular</span>
          <div class="flex">
            <span class="text-yellow-400">⭐⭐⭐⭐⭐</span>
            <span class="text-sm text-neutral ml-2">(47 avaliações)</span>
          </div>
        </div>
        
        <div class="text-3xl font-bold text-primary mb-6">R$ 89,90</div>
        
        <div class="flex gap-4">
          <button class="btn btn--sweet btn--lg hover-glow">
            Adicionar ao Carrinho 🛒
          </button>
          <button class="btn btn--outline btn--lg">
            Ver Mais Detalhes
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
```

Este guia fornece tudo que você precisa para criar componentes consistentes usando o Design System da Mesquita Cakes! 🎂✨
