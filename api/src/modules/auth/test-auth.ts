import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function testAuthOperations() {
  try {
    console.log('🔐 Testando operações de autenticação...');

    // Criar um usuário de teste para login
    const testUser = await prisma.user.upsert({
      where: { email: 'test@mesquitacakes.com' },
      update: {},
      create: {
        email: 'test@mesquitacakes.com',
        name: 'Usuário Teste',
        password: await bcrypt.hash('123456', 10),
        role: 'CUSTOMER',
      },
    });

    console.log('✅ Usuário de teste criado/atualizado:', testUser.email);

    // Verificar hash de senha
    const isValidPassword = await bcrypt.compare('123456', testUser.password);
    console.log('✅ Validação de senha:', isValidPassword ? 'OK' : 'FALHOU');

    // Buscar usuários por role
    const admins = await prisma.user.findMany({
      where: { role: 'ADMIN' },
      select: { id: true, email: true, name: true, role: true },
    });

    const customers = await prisma.user.findMany({
      where: { role: 'CUSTOMER' },
      select: { id: true, email: true, name: true, role: true },
    });

    console.log(`✅ Administradores: ${admins.length}`);
    console.log(`✅ Clientes: ${customers.length}`);

    console.log('🎉 Teste de autenticação concluído com sucesso!');
  } catch (error) {
    console.error('❌ Erro no teste de autenticação:', error);
  } finally {
    await prisma.$disconnect();
  }
}

void testAuthOperations();
