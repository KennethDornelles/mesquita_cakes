# Secreta Fornada - Guia de Implementação do Design System Minimalista

## 🚀 Nova Implementação

### 1. Estrutura Atualizada dos Arquivos

```
frontend/src/
├── assets/styles/
│   ├── _variables.scss      # Variáveis minimalistas (cores terrosas, espaçamento)
│   ├── _typography.scss     # Sistema tipográfico elegante
│   ├── _colors.scss         # Paleta de cores refinada
│   ├── _spacing.scss        # Sistema de espaçamento harmonioso
│   ├── _components.scss     # Componentes minimalistas
│   ├── _animations.scss     # Animações sutis
│   ├── _utilities.scss      # Classes utilitárias clean
│   └── design-system.scss   # Arquivo principal de importação
├── styles.scss              # Importa o design system
└── app/
    ├── app.component.html   # Exemplo de uso minimalista
    └── app.component.scss   # Estilos clean baseados no design system
```

### 2. Configuração das Fontes

```scss
// assets/styles/_typography.scss
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500;600&family=Dancing+Script:wght@400;500&display=swap');

:root {
  // Famílias tipográficas
  --font-primary: 'Playfair Display', 'Times New Roman', serif;
  --font-secondary: 'Inter', 'Helvetica Neue', sans-serif;
  --font-accent: 'Dancing Script', cursive;
  
  // Escalas tipográficas
  --text-xs: 0.75rem;      // 12px
  --text-sm: 0.875rem;     // 14px  
  --text-base: 1rem;       // 16px
  --text-lg: 1.125rem;     // 18px
  --text-xl: 1.25rem;      // 20px
  --text-2xl: 1.5rem;      // 24px
  --text-3xl: 1.875rem;    // 30px
  --text-4xl: 2.25rem;     // 36px
  --text-5xl: 3rem;        // 48px
  --text-6xl: 4rem;        // 64px
}
```

### 3. Variáveis de Cores Minimalistas

```scss
// assets/styles/_colors.scss
:root {
  // Paleta principal terrosa
  --color-primary-300: #D0946F;
  --color-primary-400: #C4825F;
  --color-primary-500: #B8704F;
  --color-primary-600: #A65D42;
  --color-primary-700: #8B4A35;
  
  // Cores secundárias cremosas
  --color-secondary-300: #F9F0DF;
  --color-secondary-400: #F7EBD9;
  --color-secondary-500: #F5E6D3;
  --color-secondary-600: #E8D4BF;
  
  // Neutros refinados
  --color-neutral-50: #FEFCFA;
  --color-neutral-100: #F8F6F3;
  --color-neutral-200: #F2F0ED;
  --color-neutral-400: #8B8680;
  --color-neutral-600: #4A453F;
  --color-neutral-800: #2D2926;
  
  // Cores funcionais
  --color-success: #7C9885;
  --color-warning: #D4A574;
  --color-error: #C17B6B;
  
  // Backgrounds elegantes
  --bg-primary: var(--color-neutral-50);
  --bg-secondary: var(--color-neutral-100);
  --bg-accent: var(--color-secondary-500);
}
```

### 4. Sistema de Espaçamento

```scss
// assets/styles/_spacing.scss  
:root {
  // Sistema baseado em proporção áurea
  --space-0: 0;
  --space-1: 0.25rem;    // 4px
  --space-2: 0.5rem;     // 8px
  --space-3: 0.75rem;    // 12px
  --space-4: 1rem;       // 16px
  --space-5: 1.25rem;    // 20px
  --space-6: 1.5rem;     // 24px
  --space-8: 2rem;       // 32px
  --space-10: 2.5rem;    // 40px
  --space-12: 3rem;      // 48px
  --space-16: 4rem;      // 64px
  --space-20: 5rem;      // 80px
  --space-24: 6rem;      // 96px
  
  // Espaçamentos especiais
  --container-padding: var(--space-6);
  --section-padding: var(--space-16);
  --card-padding: var(--space-6);
}
```

### 5. Componentes Minimalistas

```scss
// assets/styles/_components.scss

// Botões elegantes
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-3) var(--space-6);
  border-radius: 0.375rem; // 6px
  font-family: var(--font-secondary);
  font-weight: 500;
  font-size: var(--text-base);
  line-height: 1.5;
  text-decoration: none;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(184, 112, 79, 0.1);
  }
  
  // Variações
  &--primary {
    background-color: var(--color-primary-500);
    color: white;
    
    &:hover {
      background-color: var(--color-primary-600);
      transform: translateY(-1px);
    }
  }
  
  &--secondary {
    background-color: var(--color-secondary-500);
    color: var(--color-primary-700);
    
    &:hover {
      background-color: var(--color-secondary-600);
    }
  }
  
  &--text {
    background-color: transparent;
    color: var(--color-primary-600);
    padding: var(--space-2) var(--space-4);
    
    &:hover {
      background-color: var(--color-primary-50);
      color: var(--color-primary-700);
    }
  }
  
  &--outline {
    background-color: transparent;
    color: var(--color-primary-600);
    border-color: var(--color-primary-300);
    
    &:hover {
      background-color: var(--color-primary-500);
      color: white;
    }
  }
  
  // Tamanhos
  &--sm {
    padding: var(--space-2) var(--space-4);
    font-size: var(--text-sm);
  }
  
  &--lg {
    padding: var(--space-4) var(--space-8);
    font-size: var(--text-lg);
  }
}

// Cards minimalistas
.card {
  background: white;
  border-radius: 0.75rem; // 12px
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: all 0.2s ease;
  
  &--minimal {
    padding: 0;
  }
  
  &--hover {
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    }
  }
  
  &__image-container {
    position: relative;
    overflow: hidden;
  }
  
  &__image {
    width: 100%;
    height: 200px;
    object-fit: cover;
    transition: transform 0.3s ease;
  }
  
  &__content {
    padding: var(--space-6);
  }
  
  &__title {
    font-family: var(--font-primary);
    font-size: var(--text-xl);
    font-weight: 600;
    color: var(--color-neutral-800);
    margin: 0 0 var(--space-3) 0;
    line-height: 1.3;
  }
  
  &__description {
    font-family: var(--font-secondary);
    font-size: var(--text-base);
    color: var(--color-neutral-600);
    line-height: 1.6;
    margin: 0 0 var(--space-4) 0;
  }
  
  &__footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  &__price {
    font-family: var(--font-primary);
    font-size: var(--text-lg);
    font-weight: 600;
    color: var(--color-primary-600);
  }
}

// Formulários refinados
.form-group {
  margin-bottom: var(--space-6);
}

.form-label {
  display: block;
  font-family: var(--font-secondary);
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--color-neutral-700);
  margin-bottom: var(--space-2);
}

.form-input,
.form-textarea {
  width: 100%;
  padding: var(--space-3) var(--space-4);
  font-family: var(--font-secondary);
  font-size: var(--text-base);
  color: var(--color-neutral-800);
  background-color: white;
  border: 1px solid var(--color-neutral-200);
  border-radius: 0.375rem;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: var(--color-primary-500);
    box-shadow: 0 0 0 3px rgba(184, 112, 79, 0.1);
  }
  
  &::placeholder {
    color: var(--color-neutral-400);
    opacity: 1;
  }
}

.form-textarea {
  resize: vertical;
  min-height: 120px;
}

.form-hint {
  font-family: var(--font-secondary);
  font-size: var(--text-sm);
  color: var(--color-neutral-500);
  margin-top: var(--space-1);
}
```
  }
}
```

### 5. Animações e Interações

#### Classes de Animação
```html
<!-- Animações de entrada -->
<div class="animate-fade-in">Aparece suavemente</div>
<div class="animate-slide-in-up">Sobe do bottom</div>
<div class="animate-sweet-bounce">Bounce doce</div>

<!-- Animações de hover -->
<div class="hover-lift">Eleva no hover</div>
<div class="hover-glow">Brilha no hover</div>

<!-- Animações contínuas -->
<div class="animate-heart-beat">❤️</div>
<div class="animate-sparkle">✨</div>
<div class="animate-cake-rotate">🎂</div>
```

#### Animação em grupo (stagger)
```html
<div class="stagger-children">
  <div class="card">1</div> <!-- aparece primeiro -->
  <div class="card">2</div> <!-- aparece 100ms depois -->
  <div class="card">3</div> <!-- aparece 200ms depois -->
</div>
```

### 6. Backgrounds Temáticos

```html
<!-- Fundo com bolinhas (como na logo) -->
<section class="dots-bg">
  <div class="container">
    <!-- Conteúdo -->
  </div>
</section>

<!-- Fundo com corações -->
<section class="hearts-bg">
  <div class="container">
    <!-- Conteúdo -->
  </div>
</section>
```

### 7. Tipografia Especial

```html
<!-- Texto com estilo manuscrito -->
<h2 class="sweet-text">Nossos Bolos Especiais ✨</h2>

<!-- Diferentes famílias de fonte -->
<h1 class="font-primary">Título Principal</h1>
<p class="font-secondary">Texto normal</p>
<p class="font-accent">Texto elegante</p>
```

### 8. Formulários

```html
<div class="form-group">
  <label class="form-group__label">Nome</label>
  <input type="text" class="form-group__input" placeholder="Seu nome">
  <div class="form-group__help">Digite seu nome completo</div>
</div>

<div class="form-group">
  <label class="form-group__label">Mensagem</label>
  <textarea class="form-group__textarea" placeholder="Sua mensagem"></textarea>
</div>
```

### 9. Navegação

```html
<nav class="navbar">
  <div class="navbar__container">
    <div class="logo">
      <div class="logo__image">🎂</div>
      <span class="logo__text">Mesquita Cakes</span>
    </div>
    <div class="navbar__nav">
      <a href="#" class="navbar__link navbar__link--active">Home</a>
      <a href="#" class="navbar__link">Cardápio</a>
    </div>
  </div>
</nav>
```

### 10. Alertas e Notificações

```html
<!-- Alerta de sucesso -->
<div class="alert alert--success">
  <div class="alert__content">
    <div class="alert__icon"></div>
    <div class="alert__text">Pedido realizado com sucesso!</div>
  </div>
</div>

<!-- Badge informativos -->
<span class="badge badge--sweet">Novo</span>
<span class="badge badge--success">Disponível</span>
```

### 11. Loading States

```html
<!-- Loading simples -->
<div class="loading">
  <div class="loading__spinner"></div>
  <div class="loading__text">Carregando...</div>
</div>

<!-- Loading temático -->
<div class="loading loading--cake">
  <div class="loading__icon">🎂</div>
  <div class="loading__text">Preparando algo especial...</div>
</div>
```

## 🎨 Paleta de Cores Disponível

### Variáveis SCSS
```scss
// Cores primárias (rosa)
$primary-500: #ec4899
$primary-100: #fce7f3 (claro)
$primary-700: #be185d (escuro)

// Cores secundárias (verde menta)
$secondary-500: #14b8a6
$secondary-100: #ccfbf1 (claro)
$secondary-700: #0f766e (escuro)

## 🎯 Exemplos de Uso Minimalista

### 1. Layout Principal da Aplicação

```html
<!-- app.component.html -->
<div class="app-layout">
  <!-- Header elegante -->
  <header class="header">
    <div class="container">
      <div class="flex flex--between">
        <div class="flex gap-3">
          <img src="/logo.jpg" alt="Secreta Fornada" class="w-12 h-12">
          <div>
            <h1 class="font-serif text-xl font-semibold text-primary">Secreta Fornada</h1>
            <p class="text-sm text-muted">Confeitaria Artesanal</p>
          </div>
        </div>
        
        <nav class="flex gap-8">
          <a href="#" class="text-neutral hover:text-primary transition-colors">Início</a>
          <a href="#" class="text-neutral hover:text-primary transition-colors">Produtos</a>
          <a href="#" class="text-neutral hover:text-primary transition-colors">Sobre</a>
          <a href="#" class="text-neutral hover:text-primary transition-colors">Contato</a>
        </nav>
      </div>
    </div>
  </header>
  
  <!-- Main content -->
  <main class="main">
    <router-outlet></router-outlet>
  </main>
  
  <!-- Footer minimalista -->
  <footer class="footer bg-neutral-100 py-12">
    <div class="container text-center">
      <p class="text-muted">&copy; 2025 Secreta Fornada. Todos os direitos reservados.</p>
    </div>
  </footer>
</div>
```

### 2. Hero Section Elegante

```html
<section class="hero py-24 text-center">
  <div class="container-narrow">
    <h1 class="font-serif text-5xl font-bold text-primary mb-6 animate-fade-in">
      Criações Artesanais
    </h1>
    <p class="text-xl text-neutral mb-8 animate-fade-in">
      Cada produto é uma obra de arte culinária, feita com ingredientes 
      selecionados e técnicas tradicionais de confeitaria.
    </p>
    <div class="flex flex--center gap-4">
      <button class="btn btn--primary btn--lg">Ver Produtos</button>
      <button class="btn btn--text btn--lg">Nossa História</button>
    </div>
  </div>
</section>
```

### 3. Grid de Produtos Refinado

```html
<section class="section py-16">
  <div class="container">
    <header class="text-center mb-12">
      <h2 class="font-serif text-4xl font-bold text-primary mb-4">
        Nossos Produtos
      </h2>
      <p class="text-lg text-neutral max-w-2xl mx-auto">
        Sabores únicos criados com paixão e dedicação artesanal
      </p>
    </header>
    
    <div class="grid grid--responsive gap-8">
      <!-- Card de produto -->
      <article class="card card--minimal hover-lift">
        <div class="card__image-container">
          <img src="produto.jpg" alt="Bolo Artesanal" class="card__image">
        </div>
        <div class="card__content">
          <h3 class="card__title">Bolo Signature</h3>
          <p class="card__description">
            Nossa receita especial com chocolate belga e frutas da estação.
          </p>
          <div class="card__footer">
            <span class="card__price">R$ 89,90</span>
            <button class="btn btn--text">Ver detalhes</button>
          </div>
        </div>
      </article>
      
      <!-- Mais produtos... -->
    </div>
  </div>
</section>
```

## � Responsividade Integrada

### Classes Responsivas Automáticas

```scss
// O sistema já inclui responsividade automática
.grid--responsive {
  // Mobile: 1 coluna
  grid-template-columns: 1fr;
  
  // Tablet: 2 colunas  
  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  // Desktop: 3 colunas
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
}

// Espaçamentos responsivos
.section {
  padding: var(--space-12) 0; // Mobile
  
  @media (min-width: 768px) {
    padding: var(--space-16) 0; // Tablet+
  }
  
  @media (min-width: 1024px) {
    padding: var(--space-24) 0; // Desktop
  }
}
```

## 🛠️ Configuração Final

### 1. Importar no styles.scss principal

```scss
// frontend/src/styles.scss
@import 'assets/styles/design-system';

// Reset básico
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: var(--font-secondary);
  font-size: var(--text-base);
  line-height: 1.6;
  color: var(--color-neutral-800);
  background-color: var(--bg-primary);
}

// Classes de layout globais
.section {
  padding: var(--section-padding) 0;
}

.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main {
  flex: 1;
}
```

### 2. Componente Angular Exemplo

```typescript
// product-card.component.ts
@Component({
  selector: 'app-product-card',
  template: `
    <article class="card card--minimal hover-lift animate-fade-in">
      <div class="card__image-container">
        <img 
          [src]="product.image" 
          [alt]="product.name" 
          class="card__image"
          loading="lazy">
      </div>
      
      <div class="card__content">
        <h3 class="card__title">{{ product.name }}</h3>
        <p class="card__description">{{ product.description }}</p>
        
        <div class="card__footer">
          <span class="card__price">
            {{ product.price | currency:'BRL':'symbol':'1.2-2' }}
          </span>
          <button 
            class="btn btn--text" 
            (click)="onViewDetails()">
            Ver detalhes
          </button>
        </div>
      </div>
    </article>
  `,
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent {
  @Input() product!: Product;
  
  onViewDetails() {
    // Navegação ou modal
  }
}
```

## 🎨 Personalização Avançada

### Variáveis CSS Customizáveis

```scss
// Para personalizar em um componente específico:
.hero-especial {
  --color-primary-500: #A65D42; // Cor mais escura para este componente
  --space-16: 5rem; // Espaçamento maior
  
  background: linear-gradient(
    135deg, 
    var(--color-primary-500) 0%, 
    var(--color-secondary-500) 100%
  );
}
```

## � Performance e Otimização

### Carregamento de Fontes

```html
<!-- index.html -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
```

### Lazy Loading de Imagens

```html
<img 
  src="produto.jpg" 
  alt="Produto" 
  class="card__image"
  loading="lazy"
  decoding="async">
```

---

Este design system minimalista fornece uma base sólida e elegante para a **Secreta Fornada**, refletindo qualidade artesanal e sofisticação através de um approach clean e refinado. ✨
