# Logo da Secreta Fornada - Guia de Implementação

## 🎨 Nova Identidade Visual

A nova logo da **Secreta Fornada** representa uma evolução elegante para um estilo minimalista e sofisticado, refletindo a qualidade artesanal da confeitaria através de:

- **Paleta terrosa refinada** em tons de terracota e creme
- **Tipografia elegante** com serifa clássica
- **Ícone minimalista** de bolo em suporte (cake stand)
- **Layout harmonioso** com espaçamento generoso

## 📁 Localização e Formatos

### Arquivo Principal
- **Localização**: `frontend/public/logo.jpg`
- **Uso**: Logo principal da aplicação web

### Especificações Recomendadas

#### Para Web (Principal)
- **Formato**: JPG ou PNG
- **Dimensões**: 400x400px (proporção quadrada)
- **Resolução**: 150 DPI mínimo
- **Tamanho**: Máximo 200KB (otimizado)
- **Background**: Transparente (PNG) ou branco clean (JPG)

#### Variações Sugeridas
- **Logo horizontal**: Para headers e rodapés
- **Logo vertical**: Para cartões de visita e materiais impressos  
- **Ícone isolado**: Para favicons e redes sociais
- **Versão monocromática**: Para impressões em uma cor

## 🔄 Como Substituir

### 1. Preparar o Arquivo
```bash
# Otimizar imagem (exemplo com ImageMagick)
convert nova-logo.png -resize 400x400 -quality 85 logo.jpg
```

### 2. Substituir no Projeto
```bash
# Navegar para a pasta
cd frontend/public/

# Fazer backup da logo atual
mv logo.jpg logo-backup.jpg

# Copiar nova logo
cp /caminho/para/nova-logo.jpg ./logo.jpg
```

### 3. Verificar Implementação
A logo é utilizada automaticamente em:
- Header da aplicação
- Meta tags Open Graph  
- PWA manifest
- Materiais de marketing

## 🎯 Diretrizes de Uso

### Espaçamento Mínimo
- **Todas as direções**: 1x altura do ícone de bolo
- **Background**: Sempre garantir contraste adequado

### Tamanhos Mínimos
- **Digital**: 120px de altura mínima
- **Impressão**: 25mm de altura mínima
- **Favicon**: 32x32px (ícone isolado)

### Cores Aprovadas

#### Versão Colorida (Principal)
- **Terracota**: #B8704F
- **Creme**: #F5E6D3  
- **Texto**: #2D2926

#### Versão Monocromática
- **Sobre fundo claro**: #2D2926 (cinza escuro)
- **Sobre fundo escuro**: #F8F6F3 (branco quente)

### O que NÃO fazer
❌ Alterar proporções ou cores
❌ Adicionar efeitos ou filtros
❌ Usar sobre fundos que prejudiquem a legibilidade
❌ Comprimir excessivamente a ponto de perder qualidade
❌ Usar versões pixelizadas ou de baixa resolução

## 📱 Adaptações Responsivas

### Mobile (< 768px)
- Logo pode ser reduzida para 80% do tamanho
- Considerar versão horizontal em headers compactos

### Desktop (> 1024px)  
- Logo em tamanho padrão
- Pode ser acompanhada do tagline "Confeitaria Artesanal"

## 🔧 Implementação Técnica

### HTML
```html
<div class="logo">
  <img src="/logo.jpg" alt="Secreta Fornada - Confeitaria Artesanal" class="logo__image">
  <span class="logo__text">Secreta Fornada</span>
</div>
```

### CSS
```scss
.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  
  &__image {
    width: 48px;
    height: 48px;
    object-fit: contain;
  }
  
  &__text {
    font-family: 'Playfair Display', serif;
    font-weight: 600;
    font-size: 1.25rem;
    color: var(--color-primary-600);
  }
}
```

## 🎨 Integração com Design System

A nova logo é perfeitamente integrada ao design system minimalista:

- **Cores** extraídas diretamente da paleta principal
- **Tipografia** alinhada com a hierarquia elegante
- **Espaçamento** seguindo o sistema harmonioso
- **Estilo** condizente com a abordagem clean e sofisticada

## 📊 Checklist de Implementação

- [ ] Logo otimizada e salva em `frontend/public/logo.jpg`
- [ ] Testada em diferentes tamanhos e dispositivos
- [ ] Verificada legibilidade sobre diferentes backgrounds
- [ ] Atualizada em todas as referências do projeto
- [ ] Geradas variações necessárias (horizontal, monocromática)
- [ ] Documentada versão anterior para referência
- [ ] Testada performance e tempo de carregamento

---

A nova identidade visual da **Secreta Fornada** eleva a percepção da marca, transmitindo profissionalismo, qualidade artesanal e elegância discreta - valores fundamentais para uma confeitaria premium. ✨
