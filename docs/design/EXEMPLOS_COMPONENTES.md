# 🧩 Exemplos de Componentes

Esta seção mostra exemplos práticos de como construir componentes Angular utilizando o Design System "Secreta Fornada".

---

## Componente: Card de Produto (`ProductCardComponent`)

Este é um exemplo de um card de produto reutilizável que consome as classes e variáveis do Design System.

### 1. Template (`product-card.component.html`)

O HTML utiliza as classes globais `.card`, `.hover-lift`, `.h5`, `.btn`, etc., para uma estrutura limpa e semântica.

```html
<div class="card hover-lift" *ngIf="product">
  <img [src]="product.image" [alt]="product.name" class="card__image" />

  <div class="card__content">
    <h3 class="h5 text-serif">{{ product.name }}</h3>
    <p class="body-small text-neutral-medium card__description">
      {{ product.description }}
    </p>

    <div class="card__footer">
      <span class="h4 text-primary">{{ product.price | currency:'BRL' }}</span>
      <button class="btn btn--primary">Adicionar</button>
    </div>
  </div>
</div>
```

### 2. Estilos (`product-card.component.scss`)

O SCSS do componente é mínimo. Ele importa o Design System para usar variáveis em classes de utilidade específicas, como `text-primary`. A maior parte do estilo já vem das classes globais.

```scss
@use 'assets/styles/design-system' as ds;

.text-primary {
  color: ds.$primary-600;
}
```

### 3. Lógica (`product-card.component.ts`)

A lógica do componente é padrão, recebendo os dados do produto via `@Input`.

```typescript
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCardComponent {
  @Input() product: any; // Substituir 'any' por uma interface de Produto
}
```