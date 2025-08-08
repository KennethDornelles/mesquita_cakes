# 🛠️ Guia de Implementação do Design System

Este documento descreve como integrar e utilizar o Design System "Secreta Fornada" no projeto Angular.

## 1. Estrutura de Arquivos SCSS

A base de estilos está localizada em `frontend/src/assets/styles/` e é dividida nos seguintes arquivos:

- `_colors.scss`: Define a paleta de cores completa.
- `_typography.scss`: Define as fontes, pesos e a escala tipográfica base.
- `_variables.scss`: Contém todos os tokens de design (espaçamento, bordas, sombras, etc.).
- `_components.scss`: Contém os estilos base para componentes globais como `.btn` e `.card`.
- `design-system.scss`: É o ponto de entrada que importa e encaminha (`@forward`) todos os outros módulos.

## 2. Integração no Angular

Para que os estilos sejam aplicados globalmente, o Design System é importado no arquivo principal de estilos do Angular.

**`frontend/src/styles.scss`**
```scss
/*
  Arquivo de Estilos Globais do Angular
  --------------------------------------
  Importe aqui o seu Design System para que ele seja aplicado em toda a aplicação.
*/
@use 'assets/styles/design-system';

// Outros estilos globais podem ser adicionados aqui.
```

Este arquivo, por sua vez, já está configurado no `angular.json` para ser incluído no build da aplicação.

## 3. Como Usar os Estilos

Existem duas maneiras principais de aplicar os estilos do Design System nos componentes.

### a) Usando Classes Globais

Para elementos comuns como botões e cards, utilize as classes CSS predefinidas diretamente no seu HTML. Isso garante consistência e reduz a duplicação de código.

**Exemplo:**
```html
<div class="card hover-lift">
  <div class="card__content">
    <h3 class="h5 text-serif">Título do Card</h3>
    <p class="body-small">Descrição do card.</p>
    <button class="btn btn--primary">Ação</button>
  </div>
</div>
```

### b) Usando Variáveis SCSS nos Componentes

Para estilizações específicas de um componente, você pode importar o Design System e usar suas variáveis (tokens). Isso é útil para manter a consistência em espaçamentos, cores, fontes, etc.

**`meu-componente.component.scss`**
```scss
// Importa o design system com um alias (ds) para facilitar o uso.
@use 'assets/styles/design-system' as ds;

.meu-componente-customizado {
  // Acessando variáveis de cor e espaçamento
  background-color: ds.$secondary-500;
  padding: ds.$spacing-6;
  border-radius: ds.$border-radius-lg;
  font-family: ds.$font-secondary;
}
```