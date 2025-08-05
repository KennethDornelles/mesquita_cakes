# Mesquita Cakes - Guia de Implementação do Design System

## 🚀 Como Implementar

### 1. Estrutura dos Arquivos Criados

```
frontend/src/
├── assets/styles/
│   ├── _variables.scss      # Variáveis (cores, espaçamentos, tipografia)
│   ├── _mixins.scss         # Mixins reutilizáveis
│   ├── _animations.scss     # Animações e transições
│   ├── _components.scss     # Componentes pré-construídos
│   └── design-system.scss   # Arquivo principal
├── styles.scss              # Importa o design system
└── app/
    ├── app.component.html   # Exemplo de uso completo
    └── app.component.scss   # Limpo, usando apenas o design system
```

### 2. Configuração Inicial

O design system já está configurado! Para verificar se está funcionando:

1. **Certifique-se de que o arquivo `styles.scss` está importando corretamente:**
   ```scss
   @import 'assets/styles/design-system';
   ```

2. **Execute a aplicação:**
   ```bash
   cd frontend
   npm start
   ```

3. **Verifique se as fontes estão carregando** (Google Fonts já configuradas)

### 3. Usando as Classes Utilitárias

#### Botões
```html
<!-- Botão primário -->
<button class="btn btn--primary">Comprar Agora</button>

<!-- Botão especial "doce" com animação -->
<button class="btn btn--sweet hover-glow">Adicionar ao Carrinho ✨</button>

<!-- Botão tema bolo -->
<button class="btn btn--cake btn--lg">Ver Cardápio 🎂</button>
```

#### Cards de Produto
```html
<div class="card card--product card--hover animate-fade-in">
  <div class="bg-gradient-sweet h-48 flex-center text-6xl">🍓</div>
  <div class="card__header">
    <h3 class="card__title">Bolo de Morango</h3>
    <span class="badge badge--sweet">Popular</span>
  </div>
  <div class="card__body">
    <p class="card__description">Delicioso bolo com morangos frescos</p>
    <div class="flex flex--between">
      <div class="card__price">R$ 89,90</div>
      <button class="btn btn--primary btn--sm">Comprar</button>
    </div>
  </div>
</div>
```

#### Layout Responsivo
```html
<!-- Grid responsivo -->
<div class="grid grid--3">
  <div class="card">Item 1</div>
  <div class="card">Item 2</div>
  <div class="card">Item 3</div>
</div>

<!-- Container centralizado -->
<div class="container">
  <div class="section">
    <!-- Conteúdo -->
  </div>
</div>
```

### 4. Usando Mixins em Componentes Angular

#### Arquivo `.scss` do componente:
```scss
.meu-componente {
  @include card-sweet;
  @include button-primary;
  
  &__titulo {
    @include heading-style('lg');
  }
  
  &__texto {
    @include body-text('base');
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

// Cores de apoio
$accent-cream: #fef7ed
$accent-strawberry: #ff6b9d
$accent-macaron: #ff8cc8
```

### Classes Utilitárias
```html
<div class="bg-primary text-white">Fundo rosa</div>
<div class="bg-secondary text-white">Fundo verde menta</div>
<div class="bg-gradient-sweet">Gradiente doce</div>
<div class="text-primary">Texto rosa</div>
```

## 📱 Responsividade

O sistema inclui classes responsivas automáticas:

```html
<!-- Grid que se adapta automaticamente -->
<div class="grid grid--3"> <!-- 3 colunas no desktop -->
  <!-- 2 colunas no tablet, 1 no mobile -->
</div>

<!-- Visibilidade condicional -->
<div class="hidden-mobile">Só aparece no desktop</div>
<div class="hidden-desktop">Só aparece no mobile</div>
```

## 🚨 Dicas Importantes

1. **Sempre use as classes do design system** ao invés de criar CSS customizado
2. **Combine classes** para criar layouts complexos: `class="flex flex--between flex--align-center gap-4"`
3. **Use animações com moderação** para não sobrecarregar a interface
4. **Teste em diferentes tamanhos de tela** - o sistema é totalmente responsivo
5. **Mantenha a consistência** usando sempre os mesmos padrões

## 🔧 Customização

Para personalizar cores ou espaçamentos, edite apenas o arquivo `_variables.scss`:

```scss
// Exemplo: mudança da cor primária
$primary-500: #sua-nova-cor;

// Exemplo: novo espaçamento
$spacing-custom: 2.5rem;
```

## 📚 Exemplos Prontos

O arquivo `app.component.html` contém uma página completa com:
- Header com navegação
- Hero section com animações
- Grid de produtos
- Seção sobre com backgrounds temáticos
- Depoimentos
- Footer

Use como referência para criar suas próprias páginas! 🎂✨
