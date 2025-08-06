# 🧪 Testes do Sistema PIX - Mesquita Cakes

## 📋 Queries e Mutations GraphQL

### **1. Autenticação (Pré-requisito)**

```graphql
# 1.1 Fazer login para obter token JWT
mutation Login {
  login(email: "usuario@email.com", password: "senha123") {
    accessToken
    user {
      id
      email
      name
      role
    }
  }
}

# 1.2 Registrar novo usuário
mutation Register {
  register(data: {
    email: "novo@email.com"
    password: "senha123"
    name: "João Silva"
    phone: "(11) 99999-9999"
    role: USER
  }) {
    accessToken
    user {
      id
      email
      name
    }
  }
}
```

### **2. Criar Pedido (Para Testar PIX)**

```graphql
# 2.1 Adicionar produtos ao carrinho
mutation AddToCart {
  createCartItem(data: {
    productId: "id-do-produto"
    quantity: 2
    observacoes: "Sem glúten"
  }) {
    id
    quantity
    totalPrice
    product {
      name
      price
    }
  }
}

# 2.2 Criar pedido a partir do carrinho
mutation CreateOrder {
  createOrder(data: {
    addressId: "id-do-endereco"
    observacoes: "Entregar pela manhã"
    deliveryDate: "2025-08-10"
  }) {
    id
    status
    paymentStatus
    paymentMethod
    totalAmount
    items {
      id
      quantity
      unitPrice
      totalPrice
      product {
        name
      }
    }
  }
}
```

### **3. Sistema PIX - Checkout**

```graphql
# 3.1 Criar checkout PIX ⭐ PRINCIPAL
mutation CreatePixCheckout {
  createPixCheckout(orderId: "uuid-do-pedido") {
    paymentId
    pixCode
    pixQrCode
    expiresInMinutes
    instructions
    amount
  }
}

# Exemplo de resposta:
# {
#   "data": {
#     "createPixCheckout": {
#       "paymentId": "cm5ixxx-xxxx-xxxx-xxxx-xxxxxxxxxx",
#       "pixCode": "00020126580014br.gov.bcb.pix2582br.gov.bcb.pix/bcd5...4f4e86802045490041234567890635204527753039865406145.905802BR5913MESQUITA CAKES6008BRASILIA622605...62410509123456789630423D1",
#       "pixQrCode": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
#       "expiresInMinutes": 30,
#       "instructions": "Escaneie o QR Code com o app do seu banco ou copie e cole o código PIX.",
#       "amount": 145.90
#     }
#   }
# }
```

### **4. Simulação de Pagamento (Para Testes)**

```graphql
# 4.1 Simular pagamento aprovado
mutation SimulatePayment {
  simulatePixPayment(orderId: "uuid-do-pedido")
}

# 4.2 Verificar status do pedido após pagamento
query GetOrder {
  order(id: "uuid-do-pedido") {
    id
    status
    paymentStatus
    paymentMethod
    pixCode
    pixQrCode
    pixExpiresAt
    totalAmount
    createdAt
    updatedAt
  }
}
```

### **5. Consultas para Monitoramento**

```graphql
# 5.1 Listar pedidos por status de pagamento
query GetPendingOrders {
  orders(filter: { paymentStatus: PENDING }) {
    id
    status
    paymentStatus
    paymentMethod
    totalAmount
    pixExpiresAt
    user {
      name
      email
    }
  }
}

# 5.2 Relatório de pagamentos
query PaymentReport {
  orders(filter: { paymentStatus: PAID }) {
    id
    totalAmount
    paymentMethod
    paymentStatus
    createdAt
    user {
      name
    }
  }
}
```

## 🔧 **Headers de Autenticação**

Para todas as mutations e queries (exceto login/register):

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## 🧪 **Cenários de Teste**

### **Teste 1: Fluxo Completo de Checkout PIX**
1. ✅ Fazer login
2. ✅ Criar pedido
3. ✅ Gerar checkout PIX
4. ✅ Simular pagamento
5. ✅ Verificar status atualizado

### **Teste 2: Validações de Segurança**
1. ✅ Tentar checkout sem autenticação (deve falhar)
2. ✅ Tentar checkout de pedido de outro usuário (deve falhar)
3. ✅ Tentar checkout duplicado (deve falhar)
4. ✅ Tentar simular pagamento inexistente (deve falhar)

### **Teste 3: Estados do Sistema**
1. ✅ Pedido PENDING → PIX gerado
2. ✅ Pagamento simulado → Status PAID
3. ✅ Pedido confirmado → Status CONFIRMED
4. ✅ Expiração de PIX (30 minutos)

## 📊 **Dados de Exemplo**

### **Produtos para Teste:**
```json
{
  "name": "Bolo de Chocolate",
  "price": 45.90,
  "category": "Bolos",
  "ingredients": ["Chocolate", "Farinha", "Ovos"]
}
```

### **Endereço para Teste:**
```json
{
  "cep": "01001-000",
  "street": "Praça da Sé",
  "number": "1",
  "city": "São Paulo",
  "state": "SP"
}
```

## 🚀 **URL do GraphQL Playground**

```
http://localhost:3000/graphql
```

## ✅ **Checklist de Funcionalidades**

- [x] Autenticação JWT
- [x] Criação de pedidos
- [x] Geração de código PIX
- [x] QR Code para pagamento
- [x] Simulação de pagamento
- [x] Atualização de status
- [x] Validações de segurança
- [x] Expiração de PIX
- [x] Logs de auditoria

---

## 🎉 **Sistema PIX 100% Funcional!**

O checkout PIX está implementado e testado, pronto para processar pagamentos em uma confeitaria online brasileira! 🍰💳
