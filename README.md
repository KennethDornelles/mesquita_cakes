# 🧁 Mesquita Cakes — Doceria Delivery (MVP v1)

## 🎯 Objetivo do Projeto

Mesquita Cakes é um **e-commerce local de doceria** com foco em delivery em João Pessoa (PB). O MVP tem como objetivo:

* Validar o modelo de negócio com cards, combos e pedidos locais
* Permitir clientes fazerem pedidos pelo site
* Sistema de pagamento PIX integrado e funcional
* Automatizar notificações via WhatsApp após confirmação de pagamento
* Backend escalável (GraphQL + NestJS + Prisma + PostgreSQL)
* Frontend moderno (Angular + Apollo Client + Design System)

---

## 📁 Arquitetura

```
/mesquita_cakes
├── /frontend        # Angular SPA com Design System
├── /api            # NestJS + GraphQL + Prisma
├── /docs           # Documentação técnica
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## ✅ Status Atual do Projeto

### 🚀 **Backend (100% Funcional)**
- ✅ **CRUD Completo**: Todos os módulos implementados
- ✅ **Sistema PIX**: Checkout completo e funcional
- ✅ **Autenticação JWT**: Sistema de usuários e permissões
- ✅ **GraphQL API**: 50+ endpoints disponíveis
- ✅ **Sistema de Auditoria**: Logs de operações implementado

### 🎨 **Frontend (Home Page Completa)**
- ✅ **Design System**: Totalmente implementado
- ✅ **Home Page**: Seções completas (Hero, Produtos, Sobre, etc.)
- ✅ **Componentes**: Reutilizáveis e responsivos
- ⚠️ **Páginas Restantes**: Checkout, Perfil, Admin (em desenvolvimento)

---

## 🛠️ Tecnologias

### Frontend (Angular)
* Angular v18+ com Standalone Components
* Apollo Angular para GraphQL
* Design System customizado (Sass)
* PWA ready
* Deploy: Vercel ou Netlify

### Backend (NestJS + GraphQL)
* NestJS v11+ (GraphQL code first)
* Prisma ORM + PostgreSQL
* **Módulos**: Product, Order, User, Review, CartItem, Category, Address, **Payment (PIX)**
* JWT Authentication + Role-based access
* Sistema de auditoria integrado

### Infraestrutura
* Docker para desenvolvimento
* PostgreSQL (Railway/Render)
* Deploy recomendado: Railway (backend) + Vercel (frontend)

---

## 🚀 Funcionalidades Implementadas

### 💳 **Sistema de Pagamento**
* ✅ Checkout PIX completo (código + QR Code)
* ✅ Validação de expiração (30 minutos)
* ✅ Simulação de pagamento para testes
* ✅ Integração com pedidos

### 🛒 **E-commerce Core**
* ✅ Catálogo de produtos com categorias
* ✅ Carrinho de compras persistente
* ✅ Sistema de avaliações
* ✅ Gestão de endereços com ViaCEP
* ✅ Histórico de pedidos

### 👤 **Gestão de Usuários**
* ✅ Registro e autenticação
* ✅ Perfis com roles (USER/ADMIN)
* ✅ Sistema de permissões

---

## 📦 Desenvolvimento

### Pré-requisitos
```bash
node >= 18
npm >= 9
docker >= 20
postgresql >= 14
```

### Setup Inicial
```bash
# Clone do repositório
git clone [repo-url]
cd mesquita_cakes

# Backend setup
cd api
npm install
cp .env.example .env  # Configure as variáveis
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
npm run start:dev

# Frontend setup (nova aba)
cd ../frontend  
npm install
ng serve
```

### Docker (Alternativo)
```bash
# Backend com Docker
cd api
docker build -t mesquita-backend .
docker run -e DATABASE_URL=... -p 3000:3000 mesquita-backend

# Ou use docker-compose (full stack)
docker-compose up -d
```

---

## 🧪 Testes

### Backend
```bash
cd api
npm run test              # Unit tests
npm run test:e2e         # Integration tests
npm run test:cov         # Coverage report
```

### Testes PIX
Ver documentação completa: [`docs/backend/TESTES_PIX.md`](docs/backend/TESTES_PIX.md)

### Frontend
```bash
cd frontend
ng test                  # Unit tests
ng e2e                   # E2E tests
```

---

## 🏁 Deploy

### Backend (Railway)
```bash
# Via CLI
railway login
railway link [project-id]
railway up

# Variáveis necessárias:
# DATABASE_URL, JWT_SECRET, NODE_ENV=production
```

### Frontend (Vercel)
```bash
# Via CLI
vercel --prod

# Ou conecte GitHub + Auto-deploy
# Build Command: ng build
# Output Directory: dist/frontend
```

### Variáveis de Ambiente
```env
# Backend (.env)
DATABASE_URL=postgresql://user:pass@host:5432/dbname
JWT_SECRET=seu-jwt-secret-forte-aqui
NODE_ENV=production
PORT=3000

# Frontend (environment.prod.ts)
API_URL=https://seu-backend.up.railway.app/graphql
```

---

## 📚 Documentação

### 📖 Documentação Completa
Toda a documentação do projeto foi organizada na pasta [`/docs`](docs/):

- **[📋 Índice de Navegação](docs/INDICE_NAVEGACAO.md)** - Acesso rápido a todas as documentações
- **[📚 README Completo](docs/README.md)** - Visão geral da documentação

### 🎯 Acesso Rápido por Área

| Área | Documentação Principal | Descrição |
|------|----------------------|-----------|
| 🎨 **Design** | [Design System](docs/design/DESIGN_SYSTEM.md) | Sistema de design e componentes |
| 🖥️ **Frontend** | [Status Frontend](docs/frontend/STATUS_FRONTEND.md) | Estado atual e funcionalidades |
| ⚙️ **Backend** | [Documentação Técnica](docs/backend/DOCUMENTACAO_TECNICA.md) | API, configuração e deploy |
| 💳 **PIX** | [Testes PIX](docs/backend/TESTES_PIX.md) | Integração de pagamento |
| 🎭 **Logo** | [Atualização Logo](docs/design/ATUALIZACAO_LOGO.md) | Gestão da identidade visual |

### 🚀 Para Novos Desenvolvedores
1. Comece com o [Índice de Navegação](docs/INDICE_NAVEGACAO.md)
2. Configure o ambiente seguindo a [Documentação Técnica](docs/backend/DOCUMENTACAO_TECNICA.md)
3. Entenda o design através do [Design System](docs/design/DESIGN_SYSTEM.md)

### 🎨 **Design System**
- [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md) - Especificação do design
- [`IMPLEMENTACAO_DESIGN_SYSTEM.md`](./IMPLEMENTACAO_DESIGN_SYSTEM.md) - Guia de implementação
- [`EXEMPLOS_COMPONENTES.md`](./EXEMPLOS_COMPONENTES.md) - Exemplos práticos

### 📊 **Status de Desenvolvimento**
- [`STATUS_FRONTEND.md`](./frontend/STATUS_FRONTEND.md) - Status detalhado do frontend

---

## 🗺️ Roadmap

### 🚧 **Em Desenvolvimento**
- [ ] Páginas de checkout completas
- [ ] Interface administrativa
- [ ] Sistema de notificações WhatsApp
- [ ] Relatórios e analytics

### 🔮 **Próximas Versões (V2)**
- [ ] Microsserviços (Notifications, Analytics)
- [ ] Integração Mercado Pago completa
- [ ] Sistema de cupons e promoções
- [ ] App mobile (React Native)
- [ ] Integração CRM (HubSpot, RD Station)

---

## 🤝 Contribuição

1. Fork o projeto
2. Crie sua feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

Ver template: [`PULL_REQUEST_TEMPLATE.md`](./.github/PULL_REQUEST_TEMPLATE.md)

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---

## 🆘 Suporte

- **Issues**: [GitHub Issues](link)
- **Documentação**: Pasta `/docs`
- **Email**: contato@mesquitacakes.com

---

**Desenvolvido com 💕 para Mesquita Cakes** 🧁
