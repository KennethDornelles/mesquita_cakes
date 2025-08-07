# Secreta Fornada - Design System (Versão Minimalista)

## 🎯 Visão Geral

Este design system foi **completamente redesenhado** para acompanhar o novo logo minimalista da **Secreta Fornada**. O sistema reflete elegância, sofisticação e artesanalidade através de um approach clean e refinado, com foco na tipografia, espaçamento harmonioso e paleta de cores terrosas inspiradas na nova identidade visual.

## 🎨 Paleta de Cores Renovada

### Cores Principais (Minimalista)

- **Primary (Terracota Elegante)**: Baseado no tom principal do novo logo
  - `$primary-500`: #B8704F (terracota sofisticado)
  - `$primary-400`: #C4825F (tom médio)
  - `$primary-300`: #D0946F (tom claro)
  - `$primary-600`: #A65D42 (tom escuro)
  - `$primary-700`: #8B4A35 (tom mais escuro)

- **Secondary (Creme Artesanal)**: Tom complementar inspirado no logo
  - `$secondary-500`: #F5E6D3 (creme elegante)
  - `$secondary-400`: #F7EBD9 (creme claro)
  - `$secondary-300`: #F9F0DF (creme muito claro)
  - `$secondary-600`: #E8D4BF (creme escuro)

### Cores Neutras Refinadas

- **Neutral Warm**: #F8F6F3 (branco quente)
- **Neutral Light**: #F2F0ED (cinza muito claro)
- **Neutral Medium**: #8B8680 (cinza médio terroso)
- **Neutral Dark**: #4A453F (cinza escuro)
- **Neutral Black**: #2D2926 (quase preto terroso)

### Cores de Apoio Minimalistas

- **Accent Gold**: #D4A574 (dourado sutil)
- **Accent Sage**: #9CAF8B (verde sage)
- **Accent Dust**: #E0D5C7 (poeira rosada)
- **Success**: #7C9885 (verde suave)
- **Warning**: #D4A574 (dourado)
- **Error**: #C17B6B (terracota avermelhado)

### Backgrounds Elegantes

- **Primary Background**: #FEFCFA (branco cremoso)
- **Secondary Background**: #F8F6F3 (branco quente)
- **Accent Background**: #F5E6D3 (creme sutil)

## 📝 Tipografia Minimalista

### Hierarquia Tipográfica Elegante

1. **Primary (Serif Elegante)**: Para títulos principais e logo
   - Uso: Logo, títulos hierárquicos, chamadas principais
   - Font-family: 'Playfair Display', 'Times New Roman', serif
   - Características: Elegante, refinada, alta legibilidade
   - Peso: 400 (Regular), 600 (SemiBold), 700 (Bold)

2. **Secondary (Sans-Serif Clean)**: Para texto corpo e navegação
   - Uso: Body text, navegação, labels, botões
   - Font-family: 'Inter', 'Helvetica Neue', sans-serif
   - Características: Limpa, moderna, excelente legibilidade
   - Peso: 300 (Light), 400 (Regular), 500 (Medium), 600 (SemiBold)

3. **Accent (Script Sutil)**: Para textos especiais (uso moderado)
   - Uso: Assinaturas, destaques especiais, citações
   - Font-family: 'Dancing Script', cursive
   - Características: Script elegante, uso esparso
   - Peso: 400 (Regular), 500 (Medium)

### Escala Tipográfica Harmônica

- **Display**: 4rem (64px) - Títulos principais
- **H1**: 3rem (48px) - Títulos de seção
- **H2**: 2.25rem (36px) - Subtítulos importantes
- **H3**: 1.875rem (30px) - Títulos de componente
- **H4**: 1.5rem (24px) - Subtítulos menores
- **H5**: 1.25rem (20px) - Títulos de card
- **H6**: 1.125rem (18px) - Pequenos títulos
- **Body Large**: 1.125rem (18px) - Texto destacado
- **Body**: 1rem (16px) - Texto padrão
- **Body Small**: 0.875rem (14px) - Texto secundário
- **Caption**: 0.75rem (12px) - Legendas

### Características Minimalistas

- **Line Height**: 1.5-1.6 (texto corpo), 1.2-1.3 (títulos)
- **Letter Spacing**: 
  - Títulos: -0.025em (mais apertado)
  - Body: 0 (natural)
  - All Caps: 0.1em (mais espaçado)
- **Font Weight**: Uso sutil - evitar extremos
- **Color Hierarchy**: Usar opacity para hierarquia (100%, 80%, 60%)

## 🎯 Espaçamento e Layout

### Sistema de Espaçamento Harmonioso

Baseado na proporção áurea para criar ritmo visual elegante:

- **0**: 0
- **1**: 0.25rem (4px)
- **2**: 0.5rem (8px)
- **3**: 0.75rem (12px)
- **4**: 1rem (16px)
- **5**: 1.25rem (20px)
- **6**: 1.5rem (24px)
- **8**: 2rem (32px)
- **10**: 2.5rem (40px)
- **12**: 3rem (48px)
- **16**: 4rem (64px)
- **20**: 5rem (80px)
- **24**: 6rem (96px)

### Grid Minimalista

- **Container Max-Width**: 1200px
- **Gutter**: 24px (desktop), 16px (mobile)
- **Columns**: 12 colunas flexíveis
- **Breakpoints**:
  - SM: 640px
  - MD: 768px
  - LG: 1024px
  - XL: 1280px

## 🧩 Componentes Renovados

### Botões Minimalistas

```scss
// Botão primário elegante
<button class="btn btn--primary">Explorar</button>

// Botão secundário sutil
<button class="btn btn--secondary">Saiba Mais</button>

// Botão texto minimalista
<button class="btn btn--text">Ver Detalhes</button>

// Botão outline refinado
<button class="btn btn--outline">Adicionar</button>
```

**Características dos Botões:**
- Bordas arredondadas: 6px
- Padding: 12px 24px (médio), 16px 32px (grande)
- Transição suave: 0.2s ease
- Foco sutil com box-shadow
- Hover com opacity e elevação mínima

### Cards Elegantes

```scss
// Card produto minimalista
<div class="card card--minimal">
  <div class="card__image-container">
    <img src="..." class="card__image" alt="...">
  </div>
  <div class="card__content">
    <h3 class="card__title">Nome do Produto</h3>
    <p class="card__description">Descrição concisa e elegante</p>
    <div class="card__footer">
      <span class="card__price">R$ 89,90</span>
      <button class="btn btn--text btn--sm">Ver mais</button>
    </div>
  </div>
</div>

// Card destaque premium
<div class="card card--featured">
  <div class="card__badge">Destaque</div>
  <!-- conteúdo -->
</div>
```

**Características dos Cards:**
- Shadow sutil: 0 2px 8px rgba(0,0,0,0.08)
- Border radius: 12px
- Padding interno harmonioso
- Hover com elevação suave
- Tipografia hierárquica clara

### Formulários Refinados

```scss
<div class="form-group">
  <label class="form-label">Nome completo</label>
  <input type="text" class="form-input" placeholder="Digite seu nome">
  <span class="form-hint">Informe seu nome completo</span>
</div>

<div class="form-group">
  <label class="form-label">Mensagem</label>
  <textarea class="form-textarea" placeholder="Sua mensagem..."></textarea>
</div>
```

**Características dos Formulários:**
- Border sutil: 1px solid neutral-light
- Focus state com border colorida
- Padding generoso: 12px 16px
- Placeholder com opacity reduzida
- Erro/sucesso com cores suaves

### Badges e Tags

```scss
<span class="badge badge--primary">Novo</span>
<span class="badge badge--success">Disponível</span>
<span class="badge badge--neutral">Artesanal</span>
```

**Características:**
- Tamanho pequeno e discreto
- Cores suaves da paleta
- Border radius: 100px (pill shape)
- Typography pequena mas legível

### Navegação Elegante

```scss
<nav class="navbar navbar--minimal">
  <div class="navbar__container">
    <div class="navbar__brand">
      <img src="logo.jpg" class="navbar__logo" alt="Secreta Fornada">
      <span class="navbar__title">Secreta Fornada</span>
    </div>
    <ul class="navbar__nav">
      <li><a href="#" class="navbar__link navbar__link--active">Início</a></li>
      <li><a href="#" class="navbar__link">Produtos</a></li>
      <li><a href="#" class="navbar__link">Sobre</a></li>
      <li><a href="#" class="navbar__link">Contato</a></li>
    </ul>
  </div>
</nav>
```

**Características da Navegação:**
- Layout clean e espaçoso
- Logo integrado harmoniosamente
- Links com hover sutil
- Indicador de página ativa discreto
- Responsivo com hamburger elegante

## 🎭 Animações Sofisticadas

### Animações Sutis e Refinadas

- `.animate-fade-in`: Entrada suave com opacity
- `.animate-slide-up`: Deslizar de baixo para cima
- `.animate-scale-in`: Aparecer com escala suave
- `.hover-lift`: Elevação mínima no hover (2px)
- `.hover-glow`: Brilho sutil no hover
- `.transition-all`: Transição suave para todas propriedades

### Princípios das Animações

- **Duration**: 0.2s para micro-interações, 0.3s para transições maiores
- **Easing**: ease-out para entrada, ease-in para saída
- **Subtle**: Animações discretas que melhoram a UX
- **Performance**: Usar transform e opacity quando possível

```scss
// Exemplo de uso
<div class="card hover-lift animate-fade-in">
  <img class="transition-all" src="...">
  <h3 class="animate-slide-up">Título</h3>
</div>
```

## 📐 Layout e Grid

### Sistema de Grid Flexível

```scss
<!-- Grid responsivo minimalista -->
<div class="grid grid--2 grid--md-3 grid--lg-4">
  <div class="grid__item">Item 1</div>
  <div class="grid__item">Item 2</div>
  <div class="grid__item">Item 3</div>
</div>

<!-- Grid com gaps personalizados -->
<div class="grid grid--3 gap-6">
  <!-- Itens com espaçamento de 24px -->
</div>
```

### Containers Harmoniosos

```scss
<div class="container">
  <!-- Max-width: 1200px, padding responsivo -->
</div>

<div class="container-narrow">
  <!-- Max-width: 800px, para conteúdo de leitura -->
</div>

<div class="container-wide">
  <!-- Max-width: 1400px, para galerias -->
</div>
```

### Flexbox Utilitários

```scss
<div class="flex flex--between flex--center">
  <div>Esquerda</div>
  <div>Direita</div>
</div>

<div class="flex flex--column flex--center gap-4">
  <!-- Layout vertical centralizado -->
</div>
```

## � Padrões Visuais Minimalistas

### Shadows e Elevações

```scss
<!-- Elevação sutil -->
<div class="shadow-sm">
  <!-- box-shadow: 0 1px 3px rgba(0,0,0,0.1) -->
</div>

<!-- Elevação média -->
<div class="shadow-md">
  <!-- box-shadow: 0 4px 12px rgba(0,0,0,0.1) -->
</div>

<!-- Elevação destacada -->
<div class="shadow-lg">
  <!-- box-shadow: 0 8px 24px rgba(0,0,0,0.12) -->
</div>
```

### Borders Elegantes

```scss
<!-- Border sutil -->
<div class="border border--light">
  <!-- border: 1px solid neutral-light -->
</div>

<!-- Border colorida -->
<div class="border border--primary">
  <!-- border: 1px solid primary-500 -->
</div>
```

### Backgrounds e Texturas

```scss
<!-- Background com gradiente sutil -->
<div class="bg-gradient-warm">
  <!-- Gradiente suave em tons terrosos -->
</div>

<!-- Background de seção -->
<section class="section section--alternate">
  <!-- Background alternativo para separação -->
</section>
```

## � Exemplos de Implementação

### Hero Section Minimalista

```scss
<section class="hero">
  <div class="container">
    <div class="hero__content">
      <h1 class="hero__title">Secreta Fornada</h1>
      <p class="hero__subtitle">Confeitaria Artesanal</p>
      <p class="hero__description">
        Criamos experiências únicas através de sabores autênticos
        e ingredientes selecionados com carinho.
      </p>
      <div class="hero__actions">
        <button class="btn btn--primary btn--lg">Ver Produtos</button>
        <button class="btn btn--text btn--lg">Nossa História</button>
      </div>
    </div>
  </div>
</section>
```

### Seção de Produtos Elegante

```scss
<section class="section">
  <div class="container">
    <header class="section__header">
      <h2 class="section__title">Nossos Produtos</h2>
      <p class="section__description">
        Cada criação é única, feita com ingredientes selecionados
        e técnicas tradicionais de confeitaria.
      </p>
    </header>
    
    <div class="grid grid--2 grid--lg-3 gap-8">
      <div class="card card--minimal hover-lift">
        <div class="card__image-container">
          <img src="bolo-chocolate.jpg" class="card__image" alt="Bolo de Chocolate">
        </div>
        <div class="card__content">
          <h3 class="card__title">Bolo Artesanal</h3>
          <p class="card__description">
            Chocolate belga com massa aerada e recheio cremoso.
          </p>
          <div class="card__footer">
            <span class="card__price">R$ 89,90</span>
            <button class="btn btn--text">Ver detalhes</button>
          </div>
        </div>
      </div>
      <!-- Mais produtos... -->
    </div>
  </div>
</section>
```

### Footer Minimalista

```scss
<footer class="footer">
  <div class="container">
    <div class="footer__content">
      <div class="footer__brand">
        <img src="logo.jpg" class="footer__logo" alt="Secreta Fornada">
        <p class="footer__tagline">Confeitaria Artesanal</p>
      </div>
      
      <div class="footer__links">
        <div class="footer__column">
          <h4 class="footer__title">Navegação</h4>
          <ul class="footer__list">
            <li><a href="#" class="footer__link">Início</a></li>
            <li><a href="#" class="footer__link">Produtos</a></li>
            <li><a href="#" class="footer__link">Sobre</a></li>
            <li><a href="#" class="footer__link">Contato</a></li>
          </ul>
        </div>
        
        <div class="footer__column">
          <h4 class="footer__title">Contato</h4>
          <ul class="footer__list">
            <li class="footer__item">(11) 99999-9999</li>
            <li class="footer__item">contato@secretafornada.com.br</li>
          </ul>
        </div>
      </div>
    </div>
    
    <div class="footer__bottom">
      <p class="footer__copy">
        © 2025 Secreta Fornada. Todos os direitos reservados.
      </p>
    </div>
  </div>
</footer>
```

## 📱 Responsividade Refinada

O design system é mobile-first com breakpoints harmoniosos:

- **SM**: 640px (tablets pequenos)
- **MD**: 768px (tablets)
- **LG**: 1024px (desktops)
- **XL**: 1280px (desktops grandes)

### Padrões Responsivos

```scss
// Typography responsiva
.section__title {
  @apply text-2xl sm:text-3xl lg:text-4xl;
}

// Layout responsivo
.grid--responsive {
  @apply grid-cols-1 sm:grid-cols-2 lg:grid-cols-3;
}

// Espaçamento responsivo
.section {
  @apply py-12 sm:py-16 lg:py-24;
}
```

## 🛠️ Implementação

### 1. Importação das Fontes

```scss
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500;600&family=Dancing+Script:wght@400;500&display=swap');
```

### 2. Uso das Classes Utilitárias

```html
<div class="container py-12">
  <div class="grid grid--2 gap-8">
    <div class="card card--minimal shadow-md">
      <h3 class="text-xl font-semibold text-primary-600 mb-3">Título</h3>
      <p class="text-neutral-medium mb-4">Descrição elegante...</p>
      <button class="btn btn--primary">Ação Principal</button>
    </div>
  </div>
</div>
```

### 3. Customização de Componentes

```scss
.meu-componente {
  @apply bg-primary-50 border border-primary-200 rounded-lg p-6;
  
  &__titulo {
    @apply font-serif text-2xl text-primary-700 mb-4;
  }
  
  &__texto {
    @apply text-neutral-medium leading-relaxed;
  }
}
```

## 📚 Arquivos do Sistema

### Estrutura Atualizada

```
frontend/src/assets/styles/
├── _variables.scss          # Variáveis do design minimalista
├── _typography.scss         # Sistema tipográfico elegante
├── _colors.scss            # Paleta de cores terrosas
├── _spacing.scss           # Sistema de espaçamento harmonioso
├── _components.scss        # Componentes minimalistas
├── _animations.scss        # Animações sutis
├── _utilities.scss         # Classes utilitárias
└── design-system.scss      # Arquivo principal de importação
```

### Variáveis Principais

```scss
// Cores principais
:root {
  --color-primary-500: #B8704F;
  --color-primary-400: #C4825F;
  --color-primary-300: #D0946F;
  --color-secondary-500: #F5E6D3;
  --color-neutral-warm: #F8F6F3;
  --color-neutral-dark: #2D2926;
  
  // Tipografia
  --font-primary: 'Playfair Display', serif;
  --font-secondary: 'Inter', sans-serif;
  --font-accent: 'Dancing Script', cursive;
  
  // Espaçamento
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  --spacing-2xl: 3rem;
  
  // Shadows
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.1);
  --shadow-md: 0 4px 12px rgba(0,0,0,0.1);
  --shadow-lg: 0 8px 24px rgba(0,0,0,0.12);
  
  // Transições
  --transition-fast: 0.15s ease;
  --transition-base: 0.2s ease;
  --transition-slow: 0.3s ease;
}
```

## 🎨 Princípios do Design Minimalista

### 1. **Menos é Mais**
- Uso comedido de elementos visuais
- Foco na funcionalidade e usabilidade
- Eliminação de ruídos visuais desnecessários

### 2. **Hierarquia Clara**
- Tipografia com contraste adequado
- Uso de espaçamento para criar ritmo
- Cores com propósito e significado

### 3. **Elegância Discreta**
- Animações sutis e refinadas
- Transições suaves entre estados
- Detalhes que elevam a experiência sem chamar atenção

### 4. **Consistência Visual**
- Padrões repetíveis em todos componentes
- Sistema de cores e tipografia coerente
- Espaçamento harmonioso e previsível

### 5. **Acessibilidade Natural**
- Contraste adequado por padrão
- Tamanhos de fonte legíveis
- Áreas de clique apropriadas

## 🚀 Próximos Passos

### 1. **Atualização da Logo**
- Substituir `frontend/public/logo.jpg` pela nova logo
- Ajustar tamanhos e variações conforme necessário

### 2. **Implementação dos Estilos**
- Criar arquivos SCSS com as novas variáveis
- Implementar componentes minimalistas
- Testar responsividade em diferentes dispositivos

### 3. **Migração Gradual**
- Aplicar novo design system página por página
- Manter consistência durante a transição
- Documentar mudanças e padrões

---

Este design system minimalista captura perfeitamente a elegância e sofisticação do novo logo da **Secreta Fornada**, criando uma base sólida para uma interface refinada, profissional e memorável. A abordagem clean e terrosa reflete a qualidade artesanal da confeitaria, estabelecendo confiança e desejo nos visitantes. ✨
