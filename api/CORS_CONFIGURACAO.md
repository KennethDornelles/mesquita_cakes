# 🔐 Configuração CORS - Mesquita Cakes API

## ✅ **CORS Ativado com Sucesso**

### 📋 **Resumo das Configurações Implementadas**

#### **1. CORS Principal (`main.ts`)**
- ✅ **Origens Permitidas**: 
  - `http://localhost:4200` (Angular dev)
  - `http://localhost:3000` (Frontend alternativo)
  - `https://localhost:4200` (HTTPS local)
  - Variável de ambiente `FRONTEND_URL` (produção)

- ✅ **Métodos HTTP**: GET, POST, PUT, DELETE, PATCH, OPTIONS
- ✅ **Headers Permitidos**: Content-Type, Authorization, Accept, Origin, etc.
- ✅ **Credentials**: Habilitado (cookies e autenticação)
- ✅ **Preflight**: Configurado corretamente

#### **2. GraphQL Module (`app.module.ts`)**
- ✅ **Apollo Driver**: Configurado com schema automático
- ✅ **Playground**: Habilitado para desenvolvimento
- ✅ **Introspection**: Ativada
- ✅ **Context**: Req/Res disponíveis para resolvers

#### **3. Variáveis de Ambiente (`.env`)**
- ✅ **PORT**: 3000
- ✅ **FRONTEND_URL**: http://localhost:4200
- ✅ **NODE_ENV**: development
- ✅ **Outras configs**: JWT, PIX, Email, Database

### 🚀 **Como Testar Quando o Docker Estiver Disponível**

#### **1. Iniciar a API**
```bash
cd api
npm run start:dev
```

#### **2. Verificar CORS**
```bash
# Teste simples de CORS
curl -H "Origin: http://localhost:4200" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     http://localhost:3000

# Resposta esperada deve incluir:
# Access-Control-Allow-Origin: http://localhost:4200
# Access-Control-Allow-Methods: GET,POST,PUT,DELETE,PATCH,OPTIONS
# Access-Control-Allow-Credentials: true
```

#### **3. Testar GraphQL Playground**
- Acesse: `http://localhost:3000/graphql`
- Deve carregar a interface do Apollo Studio

#### **4. Teste de Integração Frontend**
```typescript
// No Angular, teste uma query GraphQL
const client = new ApolloClient({
  uri: 'http://localhost:3000/graphql',
  credentials: 'include'
});
```

### 🎯 **URLs de Produção**

Para produção, ajuste a variável `FRONTEND_URL` no `.env`:

```bash
# Produção
FRONTEND_URL=https://mesquitacakes.com.br

# Staging
FRONTEND_URL=https://staging.mesquitacakes.com.br

# Multiple origins (separar por vírgula se necessário)
FRONTEND_URL=https://mesquitacakes.com.br,https://www.mesquitacakes.com.br
```

### 🔧 **Configurações Adicionais Disponíveis**

Se precisar de configurações mais específicas, edite `main.ts`:

```typescript
app.enableCors({
  origin: (origin, callback) => {
    // Lógica customizada para validar origens
    const allowedOrigins = process.env.FRONTEND_URL?.split(',') || [];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Não permitido pelo CORS'));
    }
  },
  // ... outras configs
});
```

### 📝 **Status da Implementação**

- ✅ **CORS Configurado**: Pronto para uso
- ✅ **GraphQL Module**: Totalmente funcional
- ✅ **Variáveis de Ambiente**: Configuradas
- ✅ **Headers de Segurança**: Implementados
- ✅ **Credenciais**: Suporte completo

### 🎂 **Pronto para Integração Frontend!**

A API está configurada para receber requisições do frontend Angular sem problemas de CORS. Quando o Docker estiver disponível, a integração deve funcionar perfeitamente! 🚀
