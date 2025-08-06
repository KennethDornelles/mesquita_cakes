# Mesquita Cakes - Frontend 🎂

Aplicação Angular para a confeitaria **Mesquita Cakes**, oferecendo uma experiência completa de e-commerce com design system personalizado e integração com backend GraphQL.

## 🚀 Tecnologias

- **Angular 19.2.15** - Framework principal
- **TypeScript** - Linguagem de programação
- **SCSS** - Pré-processador CSS com design system customizado
- **Angular Material** - Componentes UI
- **RxJS** - Programação reativa
- **Angular SSR** - Server-Side Rendering
- **PWA** - Progressive Web App

## 🎨 Design System

O projeto implementa um design system completo inspirado na identidade visual da confeitaria:

### Paleta de Cores
- **Primary**: #ec4899 (Rosa) - Baseada na cor do bolo da logo
- **Secondary**: #14b8a6 (Verde Menta) - Baseada na fita da logo
- **Accent Cream**: #fef7ed - Cor do creme
- **Accent Strawberry**: #ff6b9d - Cor do morango

### Tipografias
- **Fredoka One** - Títulos e logo (amigável, arredondada)
- **Quicksand** - Texto geral (limpa, legível)
- **Dancing Script** - Textos especiais (elegante, manuscrita)

### Componentes
- Cards de produtos com animações
- Botões temáticos ("doce", "cake", etc.)
- Badges e badges especiais
- Sistema de grid responsivo
- Animações CSS customizadas

## 📱 Páginas e Componentes Implementados

### ✅ Página Home Completa
A página home foi totalmente desenvolvida com todas as seções:

#### 🎯 Hero Section
- Título principal com animações
- Call-to-action para menu e contato
- Estatísticas da empresa
- Elementos flutuantes animados

#### 🏷️ Categories Grid
- Grid responsivo de categorias
- Hover effects e animações
- Cards interativos com emojis

#### ⭐ Featured Products
- Produtos em destaque
- Cards com ratings e preços
- Badges de "Novo" e "Popular"
- Botões de compra interativos

#### 👥 About Section
- História da empresa
- Features em destaque
- Elementos visuais animados
- Background gradiente temático

#### 💬 Testimonials
- Depoimentos de clientes
- Sistema de avaliações
- Estatísticas de satisfação
- Layout responsivo

#### 📞 Call to Action
- Seção de conversão final
- Botões para WhatsApp
- Garantias e benefícios
- Elementos decorativos flutuantes

### 🧩 Componentes de Layout

#### Header/Navbar
- Logo animado
- Menu responsivo
- Botão de carrinho com contador
- Integração WhatsApp
- Menu mobile com overlay

#### Footer
- Links organizados por categoria
- Newsletter signup
- Informações de contato
- Redes sociais
- Seção legal e garantias

### 📊 Services Implementados

#### ProductService
- Interface para produtos e categorias
- Dados mockados para demonstração
- Métodos para busca e filtragem
- Integração com componentes

## 🛠️ Comandos de Desenvolvimento

### Servidor de desenvolvimento
```bash
ng serve
```
Acesse `http://localhost:4200/`

### Build de produção
```bash
ng build
```
Arquivos gerados em `dist/`

### Testes unitários
```bash
ng test
```

### SSR (Server-Side Rendering)
```bash
npm run serve:ssr:frontend
```

## 📁 Estrutura do Projeto

```
src/app/
├── components/           # Componentes reutilizáveis
│   ├── header.component.ts
│   ├── footer.component.ts
│   ├── hero-section.component.ts
│   ├── category-grid.component.ts
│   ├── featured-products.component.ts
│   ├── about-section.component.ts
│   ├── testimonials.component.ts
│   ├── call-to-action.component.ts
│   └── product-card.component.ts
├── pages/                # Páginas principais
│   └── home.component.ts
├── services/            # Serviços
│   └── product.service.ts
└── assets/
    └── styles/          # Design System
        ├── design-system.scss
        ├── _variables.scss
        ├── _mixins.scss
        ├── _animations.scss
        └── _components.scss
```

## 🎯 Funcionalidades Implementadas

### ✅ Catálogo de Produtos
- Exibição de produtos por categoria
- Sistema de rating com estrelas
- Preços formatados em Real (BRL)
- Status de disponibilidade
- Badges de "Novo" e "Popular"

### ✅ Interações do Usuário
- Adicionar ao carrinho (com feedback visual)
- Navegação entre seções
- Integração WhatsApp para pedidos
- Scroll suave entre seções
- Menu mobile responsivo

### ✅ Responsividade
- Design totalmente responsivo
- Breakpoints otimizados:
  - Mobile: < 640px
  - Tablet: 640px - 1024px
  - Desktop: > 1024px
- Grid system adaptativo
- Tipografia responsiva

### ✅ Performance
- Lazy loading de componentes
- Animações otimizadas com CSS
- Imagens responsivas
- Compression de assets
- SSR para SEO

## 🚀 Próximos Passos

### 🔄 Integração com Backend
- [ ] Configurar Apollo GraphQL Client
- [ ] Implementar AuthService
- [ ] Conectar ProductService com API real
- [ ] Sistema de carrinho funcional
- [ ] Checkout PIX integration

### 📄 Páginas Adicionais
- [ ] Página de catálogo completo
- [ ] Página de detalhes do produto
- [ ] Página de checkout
- [ ] Área do cliente
- [ ] Página de contato

### 🛒 E-commerce Features
- [ ] Carrinho de compras funcional
- [ ] Sistema de favoritos
- [ ] Busca e filtros avançados
- [ ] Sistema de cupons
- [ ] Histórico de pedidos

## 🎨 Customização

Para personalizar cores, espaçamentos ou componentes, edite os arquivos em `src/assets/styles/`:

```scss
// _variables.scss
$primary-500: #your-color;
$spacing-custom: 2.5rem;

// Usar no componente
.meu-elemento {
  @include button-primary;
  color: $primary-600;
}
```

## 📱 PWA Features

O projeto está configurado como PWA com:
- Service Worker para cache
- Manifest.json configurado
- Ícones para todas as plataformas
- Offline support (parcial)

## 🎯 Status do Desenvolvimento

### Frontend: ~85% Completo
- ✅ **Design System**: 100%
- ✅ **Página Home**: 100%
- ✅ **Componentes Base**: 90%
- ✅ **Layout Responsivo**: 100%
- ✅ **Animations**: 100%
- ⚠️ **Integração Backend**: 0%
- ⚠️ **Carrinho**: 20%
- ⚠️ **Autenticação**: 0%

### Estimativa para MVP Completo
- **2-3 semanas** para integração completa com backend
- **1 semana** para sistema de carrinho
- **1 semana** para checkout PIX
- **1 semana** para área do cliente

---

## 📞 Suporte

Para dúvidas sobre o desenvolvimento:
- Verificar documentação do Angular: https://angular.dev
- Design System: Ver `DESIGN_SYSTEM.md`
- Componentes: Ver `EXEMPLOS_COMPONENTES.md`

**✨ A Mesquita Cakes agora tem uma home page linda e funcional! 🍰💖**
