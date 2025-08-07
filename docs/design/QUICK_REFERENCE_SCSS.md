# 🎨 Quick Reference - Design System Minimalista

## 📋 Uso Rápido dos Arquivos SCSS

### 1. 🎨 Cores Principais
```scss
// Terracota (Principal)
background-color: $primary-500; // #B8704F
color: $primary-600;           // #A5634A

// Creme (Secundária)  
background-color: $secondary-500; // #F5E6D3
color: $secondary-600;           // #E8D4BD

// Neutros Terrosos
color: $text-primary;    // #3C2415 (texto principal)
color: $text-muted;      // #8B7355 (texto secundário)
background: $bg-primary; // #FEFCFA (fundo principal)
```

### 2. 📝 Tipografia
```scss
// Títulos Elegantes (Playfair Display)
font-family: $font-primary;
font-weight: $font-weight-semibold; // 600

// Texto Corpo (Inter)
font-family: $font-secondary;
font-weight: $font-weight-normal; // 400

// Accent (Dancing Script - uso seletivo)
font-family: $font-accent;
font-weight: $font-weight-medium; // 500
```

### 3. 📐 Espaçamentos
```scss
// Sistema baseado em múltiplos de 4px
padding: $spacing-2;  // 8px
padding: $spacing-4;  // 16px
padding: $spacing-6;  // 24px
padding: $spacing-8;  // 32px
margin: $spacing-12;  // 48px
```

### 4. 🎯 Botões Prontos
```html
<!-- Botão Principal -->
<button class="btn btn--primary">Comprar</button>

<!-- Botão Secundário -->
<button class="btn btn--secondary">Ver Detalhes</button>

<!-- Botão Outline -->
<button class="btn btn--outline">Cancelar</button>

<!-- Botão com ícone -->
<button class="btn btn--primary btn--with-icon">
  <i class="icon-cart"></i>
  Adicionar ao Carrinho
</button>
```

### 5. 📦 Cards Elegantes
```html
<!-- Card Simples -->
<div class="card">
  <div class="card__content">
    <h3>Título do Card</h3>
    <p>Conteúdo do card...</p>
  </div>
</div>

<!-- Card com Imagem -->
<div class="card card--with-image">
  <img src="..." class="card__image" alt="...">
  <div class="card__content">
    <h3>Bolo de Chocolate</h3>
    <p class="card__price">R$ 45,00</p>
  </div>
</div>

<!-- Card Elevado -->
<div class="card card--elevated">
  <div class="card__header">
    <h4>Produto em Destaque</h4>
  </div>
  <div class="card__content">
    <p>Descrição do produto...</p>
  </div>
  <div class="card__footer">
    <button class="btn btn--primary btn--small">Comprar</button>
  </div>
</div>
```

### 6. 📝 Formulários Minimalistas
```html
<!-- Input Elegante -->
<div class="form-group">
  <label class="form-label">Nome Completo</label>
  <input type="text" class="form-input" placeholder="Digite seu nome">
</div>

<!-- Select Estilizado -->
<div class="form-group">
  <label class="form-label">Sabor do Bolo</label>
  <select class="form-select">
    <option>Chocolate</option>
    <option>Morango</option>
    <option>Baunilha</option>
  </select>
</div>

<!-- Textarea -->
<div class="form-group">
  <label class="form-label">Observações</label>
  <textarea class="form-textarea" rows="4" 
            placeholder="Alguma observação especial?"></textarea>
</div>
```

### 7. 🏗️ Layout Responsivo
```html
<!-- Container Principal -->
<div class="container">
  <!-- Conteúdo centralizado -->
</div>

<!-- Grid Responsivo -->
<div class="container">
  <div class="grid grid--3 grid--responsive">
    <div class="card">Produto 1</div>
    <div class="card">Produto 2</div>
    <div class="card">Produto 3</div>
  </div>
</div>

<!-- Flexbox Utilities -->
<div class="flex flex--center flex--gap-4">
  <button class="btn btn--secondary">Voltar</button>
  <button class="btn btn--primary">Continuar</button>
</div>
```

### 8. 🎭 Classes Utilitárias
```html
<!-- Texto -->
<h2 class="text-primary text-center">Título Centralizado</h2>
<p class="text-muted text-small">Texto secundário pequeno</p>

<!-- Espaçamento -->
<div class="mb-6">Margem bottom 24px</div>
<div class="p-4">Padding 16px em todos os lados</div>

<!-- Cores de Fundo -->
<div class="bg-secondary-light p-4">Fundo creme claro</div>

<!-- Visibilidade Responsiva -->
<div class="hidden-mobile">Oculto no mobile</div>
<div class="show-mobile">Visível apenas no mobile</div>
```

### 9. ✨ Animações Sutis
```html
<!-- Hover Elegante -->
<div class="card hover-lift">
  <!-- Card com hover que eleva suavemente -->
</div>

<!-- Fade In -->
<div class="fade-in">
  <!-- Conteúdo que aparece suavemente -->
</div>

<!-- Slide Up -->
<div class="slide-up">
  <!-- Conteúdo que desliza para cima -->
</div>
```

### 10. 🏷️ Logo e Branding
```html
<!-- Logo Principal -->
<div class="logo">
  <img src="logo.svg" alt="Secreta Fornada" class="logo__image">
  <div class="logo__text">Secreta Fornada</div>
</div>

<!-- Logo Pequeno -->
<div class="logo logo--small">
  <img src="logo.svg" alt="Secreta Fornada" class="logo__image">
  <div class="logo__text">Secreta Fornada</div>
</div>
```

## 🎯 Exemplos de Componentes Completos

### Produto Card
```html
<div class="card card--product hover-lift">
  <img src="bolo-chocolate.jpg" class="card__image" alt="Bolo de Chocolate">
  <div class="card__content">
    <h3 class="card__title">Bolo de Chocolate Belga</h3>
    <p class="card__description text-muted">
      Delicioso bolo com cobertura de chocolate belga artesanal
    </p>
    <div class="card__price-section">
      <span class="card__price text-primary font-semibold">R$ 85,00</span>
      <span class="card__price-old text-muted">R$ 95,00</span>
    </div>
  </div>
  <div class="card__footer">
    <button class="btn btn--primary btn--full-width">
      Adicionar ao Carrinho
    </button>
  </div>
</div>
```

### Seção Hero
```html
<section class="hero bg-secondary-light">
  <div class="container">
    <div class="hero__content text-center">
      <h1 class="hero__title">Bem-vindos à Secreta Fornada</h1>
      <p class="hero__subtitle text-muted">
        Doces artesanais feitos com amor e ingredientes selecionados
      </p>
      <div class="hero__actions mt-8">
        <button class="btn btn--primary btn--large mr-4">Ver Catálogo</button>
        <button class="btn btn--outline btn--large">Fazer Pedido</button>
      </div>
    </div>
  </div>
</section>
```

## 📱 Breakpoints
- **xs**: 480px (celular pequeno)
- **sm**: 768px (celular/tablet)
- **md**: 1024px (tablet/desktop pequeno)
- **lg**: 1280px (desktop)
- **xl**: 1536px (desktop grande)

## 🚀 Dica de Performance
Importe apenas os módulos necessários:
```scss
// Importar tudo
@use 'assets/styles/design-system';

// OU importar módulos específicos
@use 'assets/styles/variables' as *;
@use 'assets/styles/components' as *;
```
