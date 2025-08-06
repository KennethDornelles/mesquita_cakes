# Mesquita Cakes - Design System

## 🎂 Visão Geral

Este design system foi criado baseado na identidade visual da **Mesquita Cakes**, capturando a essência doce, acolhedora e artesanal da marca. O sistema utiliza uma paleta de cores inspirada nos tons pastéis da imagem de referência, tipografia amigável e componentes que transmitem a delicadeza e qualidade dos produtos.

## 🎨 Paleta de Cores

### Cores Principais

- **Primary (Rosa)**: Baseada na cor do bolo na logo
  - `$primary-500`: #ec4899 (cor principal)
  - `$primary-100`: #fce7f3 (tons claros)
  - `$primary-700`: #be185d (tons escuros)

- **Secondary (Verde Menta)**: Baseada na fita da logo
  - `$secondary-500`: #14b8a6 (cor principal)
  - `$secondary-100`: #ccfbf1 (tons claros)
  - `$secondary-700`: #0f766e (tons escuros)

### Cores de Apoio

- **Accent Cream**: #fef7ed (cor do creme)
- **Accent Strawberry**: #ff6b9d (cor do morango)
- **Accent Macaron**: #ff8cc8 (cor dos macarons)
- **Accent Heart**: #ff69b4 (cor dos corações)

### Cores Neutras

- Escala completa de cinzas de 50 a 900
- Base para textos, backgrounds e bordas

## 📝 Tipografia

### Famílias de Fonte

1. **Primary (Fredoka One)**: Para títulos e logo
   - Uso: Headings, logo, elementos de destaque
   - Característica: Amigável, arredondada, divertida

2. **Secondary (Quicksand)**: Para texto geral
   - Uso: Body text, navegação, labels
   - Característica: Limpa, legível, moderna

3. **Accent (Dancing Script)**: Para textos especiais
   - Uso: Citações, textos decorativos
   - Característica: Elegante, manuscrita, artesanal

### Tamanhos

- **XS**: 12px
- **SM**: 14px
- **Base**: 16px
- **LG**: 18px
- **XL**: 20px
- **2XL**: 24px
- **3XL**: 30px
- **4XL**: 36px
- **5XL**: 48px
- **6XL**: 60px

## 🧩 Componentes

### Botões

```scss
// Botão primário
<button class="btn btn--primary">Comprar Agora</button>

// Botão secundário
<button class="btn btn--secondary">Ver Mais</button>

// Botão especial "doce"
<button class="btn btn--sweet">Adicionar ao Carrinho</button>

// Botão temático bolo
<button class="btn btn--cake">Ver Cardápio</button>
```

### Cards

```scss
// Card produto
<div class="card card--product card--hover">
  <img src="..." class="card__image" alt="...">
  <div class="card__header">
    <h3 class="card__title">Nome do Bolo</h3>
  </div>
  <div class="card__body">
    <p class="card__description">Descrição do produto...</p>
    <div class="card__price">R$ 89,90</div>
  </div>
</div>

// Card doce
<div class="card card--sweet">
  <!-- conteúdo -->
</div>
```

### Formulários

```scss
<div class="form-group">
  <label class="form-group__label">Nome</label>
  <input type="text" class="form-group__input" placeholder="Seu nome">
  <div class="form-group__help">Digite seu nome completo</div>
</div>
```

### Badges

```scss
<span class="badge badge--sweet">Novo</span>
<span class="badge badge--primary">Popular</span>
<span class="badge badge--success">Disponível</span>
```

### Navegação

```scss
<nav class="navbar">
  <div class="navbar__container">
    <div class="logo">
      <img src="..." class="logo__image" alt="Mesquita Cakes">
      <span class="logo__text">Mesquita Cakes</span>
    </div>
    <div class="navbar__nav">
      <a href="#" class="navbar__link navbar__link--active">Home</a>
      <a href="#" class="navbar__link">Cardápio</a>
      <a href="#" class="navbar__link">Sobre</a>
      <a href="#" class="navbar__link">Contato</a>
    </div>
  </div>
</nav>
```

## 🎭 Animações

### Classes de Animação

- `.animate-sweet-bounce`: Animação suave de bounce
- `.animate-heart-beat`: Pulsação de coração
- `.animate-cake-rotate`: Rotação lenta (para ícones)
- `.animate-sparkle`: Efeito de brilho
- `.animate-fade-in`: Entrada suave
- `.hover-lift`: Elevação no hover
- `.hover-glow`: Brilho no hover

### Exemplo de Uso

```scss
<div class="card card--product hover-lift animate-fade-in">
  <img src="..." class="animate-sweet-bounce">
  <h3 class="sweet-text">Bolo Especial 🎂</h3>
</div>
```

## 📐 Layout

### Grid System

```scss
<!-- Grid responsivo -->
<div class="grid grid--3">
  <div class="card">Item 1</div>
  <div class="card">Item 2</div>
  <div class="card">Item 3</div>
</div>

<!-- Grid auto-fit -->
<div class="grid grid--auto">
  <!-- Itens se ajustam automaticamente -->
</div>
```

### Flexbox

```scss
<div class="flex flex--between flex--align-center">
  <div>Esquerda</div>
  <div>Direita</div>
</div>
```

### Containers

```scss
<div class="container">
  <!-- Largura máxima 1200px -->
</div>

<div class="container-sm">
  <!-- Largura máxima 768px -->
</div>
```

## 🎯 Padrões Especiais

### Background com Padrões

```scss
<!-- Fundo com bolinhas (como na logo) -->
<div class="dots-bg">
  <!-- Conteúdo -->
</div>

<!-- Fundo com corações -->
<div class="hearts-bg">
  <!-- Conteúdo -->
</div>
```

### Borda Especial "Bolo"

```scss
<div class="sweet-border">
  <!-- Adiciona borda temática com emoji de bolo -->
</div>
```

### Texto Especial

```scss
<h2 class="sweet-text">Nossos Bolos Especiais ✨</h2>
<p class="font-accent text-lg">Feitos com amor e carinho 💖</p>
```

## 🎪 Exemplos de Combinações

### Hero Section

```scss
<section class="section dots-bg">
  <div class="container text-center">
    <h1 class="font-primary text-6xl text-primary animate-fade-in">
      Mesquita Cakes 🎂
    </h1>
    <p class="text-xl text-neutral mb-8 animate-slide-in-up">
      Bolos artesanais feitos com amor
    </p>
    <button class="btn btn--sweet btn--lg hover-glow">
      Ver Cardápio ✨
    </button>
  </div>
</section>
```

### Seção de Produtos

```scss
<section class="section bg-cream">
  <div class="container">
    <h2 class="text-center sweet-text mb-12">
      Nossos Bolos Especiais 🎂
    </h2>
    <div class="grid grid--3 stagger-children">
      <div class="card card--product card--hover">
        <!-- Produto 1 -->
      </div>
      <div class="card card--product card--hover">
        <!-- Produto 2 -->
      </div>
      <div class="card card--product card--hover">
        <!-- Produto 3 -->
      </div>
    </div>
  </div>
</section>
```

## 📱 Responsividade

O design system inclui breakpoints responsivos:

- **XS**: 480px (mobile)
- **SM**: 640px (tablet pequeno)
- **MD**: 768px (tablet)
- **LG**: 1024px (desktop)
- **XL**: 1280px (desktop grande)
- **2XL**: 1536px (desktop extra)

### Mixins Responsivos

```scss
@include mobile-up {
  // Estilos para mobile e acima
}

@include tablet-up {
  // Estilos para tablet e acima
}

@include desktop-up {
  // Estilos para desktop e acima
}
```

## 🛠️ Como Usar

1. **Importe o design system** no seu arquivo principal:
   ```scss
   @import 'assets/styles/design-system';
   ```

2. **Use as classes utilitárias** diretamente no HTML:
   ```html
   <div class="card card--sweet p-6 mb-4">
     <h3 class="font-primary text-2xl text-primary mb-3">Título</h3>
     <p class="text-neutral mb-4">Conteúdo...</p>
     <button class="btn btn--primary hover-lift">Ação</button>
   </div>
   ```

3. **Use os mixins** em seus componentes customizados:
   ```scss
   .meu-componente {
     @include card-sweet;
     @include button-primary;
   }
   ```

## 🎨 Personalização

Para personalizar cores ou espaçamentos, edite as variáveis em `_variables.scss`:

```scss
// Personalizar cor primária
$primary-500: #your-color;

// Personalizar espaçamentos
$spacing-custom: 2.5rem;
```

## 📚 Arquivos do Sistema

- `_variables.scss`: Todas as variáveis (cores, espaçamentos, tipografia)
- `_mixins.scss`: Mixins reutilizáveis
- `_animations.scss`: Animações e transições
- `_components.scss`: Componentes pré-construídos
- `design-system.scss`: Arquivo principal que importa tudo

Este design system captura perfeitamente a personalidade doce e acolhedora da Mesquita Cakes, proporcionando uma base sólida para desenvolver interfaces consistentes e encantadoras! 🎂✨
