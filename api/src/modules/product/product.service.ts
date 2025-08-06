import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { Product } from './entities/product.entity';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class ProductService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async create(
    createProductInput: CreateProductInput,
    userId?: string,
  ): Promise<Product> {
    const product = await this.prisma.product.create({
      data: createProductInput,
      include: {
        category: true,
      },
    });

    // Log de auditoria para criação de produto
    if (userId) {
      this.auditService.logCreate(userId, 'product', product.id, {
        productName: product.name,
        category: product.categoryId,
        price: product.price,
      });
    }

    return this.mapPrismaProductToGraphQLProduct(product);
  }

  async findAll(): Promise<Product[]> {
    const products = await this.prisma.product.findMany({
      include: {
        category: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return products.map((product) =>
      this.mapPrismaProductToGraphQLProduct(product),
    );
  }

  async findOne(id: string): Promise<Product | null> {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });

    return product ? this.mapPrismaProductToGraphQLProduct(product) : null;
  }

  async findBySlug(slug: string): Promise<Product | null> {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
      },
    });

    return product ? this.mapPrismaProductToGraphQLProduct(product) : null;
  }

  async findByCategory(categoryId: string): Promise<Product[]> {
    const products = await this.prisma.product.findMany({
      where: { categoryId },
      include: {
        category: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return products.map((product) =>
      this.mapPrismaProductToGraphQLProduct(product),
    );
  }

  async findFeatured(): Promise<Product[]> {
    const products = await this.prisma.product.findMany({
      where: { featured: true, active: true },
      include: {
        category: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return products.map((product) =>
      this.mapPrismaProductToGraphQLProduct(product),
    );
  }

  async update(
    id: string,
    updateProductInput: UpdateProductInput,
  ): Promise<Product> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _, ...updateData } = updateProductInput;

    try {
      const product = await this.prisma.product.update({
        where: { id },
        data: updateData,
        include: {
          category: true,
        },
      });

      return this.mapPrismaProductToGraphQLProduct(product);
    } catch {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
  }

  async remove(id: string): Promise<Product> {
    try {
      const product = await this.prisma.product.delete({
        where: { id },
        include: {
          category: true,
        },
      });

      return this.mapPrismaProductToGraphQLProduct(product);
    } catch {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
  }

  async updateStock(id: string, quantity: number): Promise<Product> {
    try {
      const product = await this.prisma.product.update({
        where: { id },
        data: {
          stock: {
            increment: quantity,
          },
        },
        include: {
          category: true,
        },
      });

      return this.mapPrismaProductToGraphQLProduct(product);
    } catch {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
  }

  private mapPrismaProductToGraphQLProduct(prismaProduct: any): Product {
    return {
      ...prismaProduct,
      price: parseFloat(prismaProduct.price),
      weight: prismaProduct.weight ? parseFloat(prismaProduct.weight) : null,
    };
  }
}
