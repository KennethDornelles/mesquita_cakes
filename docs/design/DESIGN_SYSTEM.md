# 🎨 Design System — Secreta Fornada

Este documento define os fundamentos visuais e os componentes da identidade "Secreta Fornada", garantindo consistência, elegância e uma experiência de usuário coesa.

## Visão Geral

A identidade visual é **minimalista, elegante e artesanal**, utilizando uma paleta de cores quentes e tipografia refinada para evocar uma sensação de qualidade e cuidado.

---

## 1. Paleta de Cores

As cores são organizadas em primárias, secundárias, neutras e de apoio para criar uma hierarquia visual clara.

| Categoria | Nome do Token (SCSS) | Cor (HEX) | Preview |
| :--- | :--- | :--- | :--- |
| **Primária** | `$primary-500` | `#b8704f` | <img width="30" height="30" style="background-color:#b8704f; border-radius: 4px;"> |
| | `$primary-600` | `#a65d42` | <img width="30" height="30" style="background-color:#a65d42; border-radius: 4px;"> |
| **Secundária** | `$secondary-500` | `#f5e6d3` | <img width="30" height="30" style="background-color:#f5e6d3; border-radius: 4px;"> |
| | `$secondary-600` | `#e8d4bf` | <img width="30" height="30" style="background-color:#e8d4bf; border-radius: 4px;"> |
| **Neutra** | `$neutral-black` | `#2d2926` | <img width="30" height="30" style="background-color:#2d2926; border-radius: 4px;"> |
| | `$neutral-dark` | `#4a453f` | <img width="30" height="30" style="background-color:#4a453f; border-radius: 4px;"> |
| | `$neutral-medium` | `#8b8680` | <img width="30" height="30" style="background-color:#8b8680; border-radius: 4px;"> |
| | `$neutral-light` | `#f2f0ed` | <img width="30" height="30" style="background-color:#f2f0ed; border-radius: 4px;"> |
| **Apoio** | `$success` | `#7c9885` | <img width="30" height="30" style="background-color:#7c9885; border-radius: 4px;"> |
| | `$warning` | `#d4a574` | <img width="30" height="30" style="background-color:#d4a574; border-radius: 4px;"> |
| | `$error` | `#c17b6b` | <img width="30" height="30" style="background-color:#c17b6b; border-radius: 4px;"> |
| **Background** | `$bg-primary` | `#fefcfa` | <img width="30" height="30" style="background-color:#fefcfa; border: 1px solid #eee; border-radius: 4px;"> |
| | `$bg-secondary` | `#f8f6f3` | <img width="30" height="30" style="background-color:#f8f6f3; border: 1px solid #eee; border-radius: 4px;"> |

---

## 2. Tipografia

A tipografia combina a elegância da `Playfair Display` para títulos com a legibilidade da `Inter` para o corpo do texto.

### Famílias de Fonte
- **Primária (Títulos):** `Playfair Display`, serif (`$font-primary`)
- **Secundária (Corpo):** `Inter`, sans-serif (`$font-secondary`)
- **Destaque (Acento):** `Dancing Script`, cursive (`$font-accent`)

### Escala Tipográfica

| Classe CSS | Tamanho (rem) | Tamanho (px) | Uso |
| :--- | :--- | :--- | :--- |
| `.display` | `4rem` | `64px` | Títulos de grande impacto |
| `.h1` | `3rem` | `48px` | Título Principal (H1) |
| `.h2` | `2.25rem` | `36px` | Título de Seção (H2) |
| `.h3` | `1.875rem` | `30px` | Subtítulo (H3) |
| `.h4` | `1.5rem` | `24px` | Título Menor (H4) |
| `.h5` | `1.25rem` | `20px` | Título de Card (H5) |
| `.h6` | `1.125rem` | `18px` | Título Pequeno (H6) |
| `.body-large`| `1.125rem` | `18px` | Corpo de texto grande |
| `.body` | `1rem` | `16px` | Corpo de texto padrão |
| `.body-small`| `0.875rem` | `14px` | Texto de apoio, legendas |
| `.caption` | `0.75rem` | `12px` | Legendas pequenas |

---

## 3. Espaçamento

O sistema de espaçamento é baseado em um grid de **4px**. Todos os paddings, margins e gaps devem usar esses tokens para manter a consistência.

| Token (SCSS) | Valor (rem) | Valor (px) |
| :--- | :--- | :--- |
| `$spacing-1` | `0.25rem` | `4px` |
| `$spacing-2` | `0.5rem` | `8px` |
| `$spacing-4` | `1rem` | `16px` |
| `$spacing-6` | `1.5rem` | `24px` |
| `$spacing-8` | `2rem` | `32px` |
| `$spacing-12`| `3rem` | `48px` |
| `$spacing-16`| `4rem` | `64px` |

---

## 4. Padrões Visuais

### Bordas
- **Pequena:** `4px` (`$border-radius-sm`)
- **Padrão:** `6px` (`$border-radius`)
- **Grande:** `12px` (`$border-radius-lg`)

### Sombras (Elevação)
- **Pequena (`$shadow-sm`):** Usada em hovers sutis.
- **Média (`$shadow-md`):** Padrão para cards e elementos elevados.
- **Grande (`$shadow-lg`):** Usada para destacar elementos em foco ou em hover.

### Transições
- **Rápida:** `0.15s ease` (`$transition-fast`)
- **Padrão:** `0.2s ease` (`$transition-base`)
- **Lenta:** `0.3s ease` (`$transition-slow`)

---

## 5. Componentes

Os estilos base para os componentes principais foram definidos para refletir a identidade visual.

- **Botões:** Variações para `primary`, `secondary`, `outline` e `text`.
- **Cards:** Estrutura base com sombra, bordas arredondadas e efeito de `hover`.

Para exemplos de uso, consulte a Documentação de Implementação e os Exemplos de Componentes.