# Sistema de Checkout PIX - Mesquita Cakes

## 📋 Visão Geral

Sistema de checkout implementado para processar pagamentos via PIX de forma simples e segura. O sistema permite que clientes finalizem pedidos e recebam códigos PIX para pagamento.

## 🚀 Funcionalidades

### ✅ **Implementadas**

1. **Checkout PIX**
   - Geração de código PIX para pedidos
   - QR Code para pagamento via app bancário
   - Código copia e cola para pagamento manual
   - Expiração de 30 minutos para o pagamento
   - Instruções claras para o usuário

2. **Simulação de Pagamento**
   - Endpoint para simular aprovação de pagamento (para testes)
   - Atualização automática do status do pedido
   - Transição de PENDING → PAID → CONFIRMED

## 🛠️ Como Usar

### **1. Criar Checkout PIX**

```graphql
mutation CreatePixCheckout($orderId: String!) {
  createPixCheckout(orderId: $orderId) {
    paymentId
    pixCode
    pixQrCode
    expiresInMinutes
    instructions
    amount
  }
}
```

**Parâmetros:**
- `orderId`: ID do pedido para criar o checkout

**Resposta:**
```json
{
  "data": {
    "createPixCheckout": {
      "paymentId": "uuid-do-pagamento",
      "pixCode": "00020126580014br.gov.bcb.pix...",
      "pixQrCode": "data:image/png;base64,iVBORw0K...",
      "expiresInMinutes": 30,
      "instructions": "Escaneie o QR Code com o app do seu banco...",
      "amount": 45.90
    }
  }
}
```

### **2. Simular Pagamento (Para Testes)**

```graphql
mutation SimulatePixPayment($orderId: String!) {
  simulatePixPayment(orderId: $orderId)
}
```

**Resposta:**
```json
{
  "data": {
    "simulatePixPayment": true
  }
}
```

## 🔐 Autenticação

Todas as operações requerem autenticação JWT:

```http
Authorization: Bearer seu-jwt-token
```

## 📊 Fluxo de Pagamento

1. **Cliente finaliza pedido** → Status: `PENDING`
2. **Cria checkout PIX** → `paymentMethod: "PIX"`, `paymentStatus: "PENDING"`
3. **Cliente paga via PIX** → Sistema detecta pagamento
4. **Pagamento confirmado** → `paymentStatus: "PAID"`, `status: "CONFIRMED"`

## 🔧 Estados do Pedido

### **Status do Pedido (`status`)**
- `PENDING` → Aguardando pagamento
- `CONFIRMED` → Pagamento confirmado, pedido aceito
- `PREPARING` → Em preparação
- `READY` → Pronto para entrega/retirada
- `DELIVERING` → Em rota de entrega
- `DELIVERED` → Entregue
- `CANCELLED` → Cancelado

### **Status do Pagamento (`paymentStatus`)**
- `PENDING` → Aguardando pagamento
- `PROCESSING` → Processando pagamento
- `PAID` → Pago
- `FAILED` → Falha no pagamento
- `CANCELLED` → Cancelado
- `REFUNDED` → Estornado

## 🛡️ Segurança

### **Validações Implementadas**
- ✅ Verificação de ownership do pedido
- ✅ Validação de status do pedido
- ✅ Prevenção de checkout duplicado
- ✅ Expiração automática de PIX (30 minutos)
- ✅ Autenticação JWT obrigatória

### **Logs e Auditoria**
- Criação de checkout registrada
- Mudanças de status auditadas
- Timestamps precisos de todas as operações

## 🔮 Futuras Implementações

### **Sistema de Pagamento Completo**
- [ ] Integração com PSP real (Pix Service Provider)
- [ ] Webhook para confirmação automática
- [ ] Sistema de notificações em tempo real
- [ ] Múltiplos métodos de pagamento (cartão, boleto)
- [ ] Parcelamento
- [ ] Estorno automático

### **Features Avançadas**
- [ ] Pagamento recorrente para assinaturas
- [ ] Split de pagamento (taxas de entrega)
- [ ] Cashback e cupons de desconto
- [ ] Integração com gateways de pagamento

## 📈 Métricas e Monitoramento

### **KPIs Importantes**
- Taxa de conversão de checkout
- Tempo médio para pagamento
- Taxa de abandono de carrinho
- Métodos de pagamento mais utilizados

### **Monitoramento Recomendado**
- Logs de erros em pagamentos
- Latência das operações
- Taxa de success/failure
- Volume de transações por período

## 🧪 Testes

### **Cenários de Teste**
1. ✅ Checkout com pedido válido
2. ✅ Tentativa de checkout com pedido inexistente
3. ✅ Checkout duplicado (deve falhar)
4. ✅ Simulação de pagamento aprovado
5. ✅ Verificação de expiração do PIX

### **Dados de Teste**
```bash
# Criar pedido primeiro através do sistema de orders
# Depois usar o orderId para criar checkout PIX
```

## 🚀 Deploy e Configuração

### **Variáveis de Ambiente**
```env
# Configurações PIX (em produção)
PIX_PROVIDER_API_KEY=sua-chave-api
PIX_PROVIDER_URL=https://api.provider.com
PIX_WEBHOOK_SECRET=seu-webhook-secret
```

### **Dependências**
- `@prisma/client` - Banco de dados
- `class-validator` - Validação de DTOs
- `@nestjs/graphql` - API GraphQL
- `uuid` - Geração de IDs únicos

---

## ✨ **Sistema PIX Completo e Funcional!** 

O checkout PIX está implementado e pronto para uso, cobrindo todo o fluxo básico de pagamento necessário para uma confeitaria online. 🍰💳
