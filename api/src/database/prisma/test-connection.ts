import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log('🔗 Testando conexão com o banco de dados...');

    // Testar conexão
    await prisma.$connect();
    console.log('✅ Conexão estabelecida com sucesso!');

    // Contar registros nas tabelas principais
    const userCount = await prisma.user.count();
    const categoryCount = await prisma.category.count();
    const productCount = await prisma.product.count();

    console.log('\n📊 Estado do banco de dados:');
    console.log(`- Usuários: ${userCount}`);
    console.log(`- Categorias: ${categoryCount}`);
    console.log(`- Produtos: ${productCount}`);

    // Listar algumas categorias
    if (categoryCount > 0) {
      const categories = await prisma.category.findMany({
        take: 3,
        select: { name: true, slug: true, active: true },
      });
      console.log('\n📂 Categorias:');
      categories.forEach((cat) => {
        console.log(
          `  - ${cat.name} (${cat.slug}) - ${cat.active ? 'Ativa' : 'Inativa'}`,
        );
      });
    }

    // Listar alguns usuários (sem senha)
    if (userCount > 0) {
      const users = await prisma.user.findMany({
        take: 3,
        select: { name: true, email: true, role: true },
      });
      console.log('\n👥 Usuários:');
      users.forEach((user) => {
        console.log(`  - ${user.name} (${user.email}) - ${user.role}`);
      });
    }

    console.log('\n✅ Teste concluído com sucesso!');
  } catch (error) {
    console.error('❌ Erro na conexão:', error);
  } finally {
    await prisma.$disconnect();
  }
}

void testConnection();
