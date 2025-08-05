import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Criar categoria exemplo
  const category = await prisma.category.upsert({
    where: { slug: 'bolos' },
    update: {},
    create: {
      name: 'Bolos',
      slug: 'bolos',
      description: 'Deliciosos bolos artesanais',
      active: true,
    },
  });

  console.log('✅ Categoria criada:', category);

  // Criar usuário admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@mesquitacakes.com' },
    update: {},
    create: {
      email: 'admin@mesquitacakes.com',
      name: 'Administrador',
      password: '$2b$10$fH/9bWzWJ8j8EXAMPLE.HASH', // senha: admin123
      role: 'ADMIN',
    },
  });

  console.log('✅ Usuário admin criado:', admin);

  console.log('🎉 Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
