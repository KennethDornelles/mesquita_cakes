# Logo da Mesquita Cakes

## Instruções para atualização da logo

### Localização
O arquivo da logo principal deve estar em: `frontend/public/logo.jpg`

### Especificações recomendadas
- **Formato**: JPG ou PNG
- **Dimensões**: 200x200px (quadrado) ou proporção similar
- **Tamanho do arquivo**: Máximo 500KB para otimização web
- **Qualidade**: Alta resolução, mas otimizada para web

### Como substituir a logo

1. **Salve sua logo** com o nome exato `logo.jpg` 
2. **Coloque o arquivo** na pasta `frontend/public/`
3. **Substitua o arquivo existente**

### Onde a logo é utilizada

A logo é referenciada nos seguintes locais:

1. **Header da aplicação** (`header.component.ts`)
   - Caminho: `logo.jpg`
   - Usado como logo principal na navegação

2. **Meta tags Open Graph** (`index.html`)
   - Caminho: `logo.jpg`
   - Usado para compartilhamento em redes sociais

3. **PWA Icons** (`manifest.webmanifest`)
   - Mantém os ícones específicos para diferentes tamanhos
   - A logo principal complementa esses ícones

### Dicas importantes

- **Mantenha a identidade visual**: Use a imagem anexada como referência
- **Otimize para web**: Comprima a imagem sem perder qualidade
- **Teste em diferentes telas**: Verifique se fica boa em mobile e desktop
- **Background transparente**: Se usar PNG, considere fundo transparente

### Arquivo atual
O arquivo atual é um placeholder. Substitua pela logo real da Mesquita Cakes conforme a imagem fornecida.
