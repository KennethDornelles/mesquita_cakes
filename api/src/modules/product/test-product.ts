import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testProductOperations() {
  try {
    console.log('🧪 Testando operações do módulo Product...');

    // Buscar uma categoria existente
    const category = await prisma.category.findFirst();
    if (!category) {
      console.log('❌ Nenhuma categoria encontrada. Execute o seed primeiro.');
      return;
    }

    console.log('✅ Categoria encontrada:', category.name);

    // Criar um produto de teste
    const newProduct = await prisma.product.create({
      data: {
        name: 'Bolo de Chocolate',
        slug: 'bolo-de-chocolate',
        description:
          'Delicioso bolo de chocolate artesanal com cobertura cremosa',
        price: 25.99,
        image: 'https://example.com/bolo-chocolate.jpg',
        images: [
          'https://example.com/bolo-chocolate-1.jpg',
          'https://example.com/bolo-chocolate-2.jpg',
        ],
        stock: 10,
        weight: 0.8,
        calories: 350,
        active: true,
        featured: true,
        categoryId: category.id,
        allergens: ['glúten', 'ovos', 'leite'],
      },
    });

    console.log('✅ Produto criado:', newProduct);

    // Buscar todos os produtos
    const products = await prisma.product.findMany({
      include: {
        category: true,
      },
    });

    console.log(`✅ Total de produtos: ${products.length}`);

    // Buscar produto por slug
    const productBySlug = await prisma.product.findUnique({
      where: { slug: 'bolo-de-chocolate' },
      include: {
        category: true,
      },
    });

    console.log('✅ Produto encontrado por slug:', productBySlug?.name);

    // Atualizar estoque
    const updatedProduct = await prisma.product.update({
      where: { id: newProduct.id },
      data: {
        stock: {
          increment: 5,
        },
      },
    });

    console.log(`✅ Estoque atualizado: ${updatedProduct.stock}`);

    console.log('🎉 Teste do módulo Product concluído com sucesso!');
  } catch (error) {
    console.error('❌ Erro no teste:', error);
  } finally {
    await prisma.$disconnect();
  }
}

void testProductOperations();
