import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';
import { CreateProductIngredientInput } from './dto/create-product-ingredient.input';
import { UpdateProductIngredientInput } from './dto/update-product-ingredient.input';
import {
  AddIngredientToProductInput,
  RemoveIngredientFromProductInput,
} from './dto/manage-product-ingredients.input';
import { ProductIngredient } from './entities/product-ingredient.entity';

@Injectable()
export class ProductIngredientService {
  constructor(private prisma: PrismaService) {}

  async create(
    createProductIngredientInput: CreateProductIngredientInput,
  ): Promise<ProductIngredient> {
    const { productId, ingredientId } = createProductIngredientInput;

    // Verificar se o produto existe
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    // Verificar se o ingrediente existe
    const ingredient = await this.prisma.ingredient.findUnique({
      where: { id: ingredientId },
    });

    if (!ingredient) {
      throw new NotFoundException(
        `Ingredient with ID ${ingredientId} not found`,
      );
    }

    // Verificar se a relação já existe
    const existingRelation = await this.prisma.productIngredient.findFirst({
      where: {
        productId,
        ingredientId,
      },
    });

    if (existingRelation) {
      throw new ConflictException(
        `Product ${product.name} already has ingredient ${ingredient.name}`,
      );
    }

    const productIngredient = await this.prisma.productIngredient.create({
      data: {
        productId,
        ingredientId,
      },
      include: {
        product: true,
        ingredient: true,
      },
    });

    return this.mapPrismaToProductIngredient(productIngredient);
  }

  async findAll(): Promise<ProductIngredient[]> {
    const productIngredients = await this.prisma.productIngredient.findMany({
      include: {
        product: true,
        ingredient: true,
      },
    });

    return productIngredients.map((pi) =>
      this.mapPrismaToProductIngredient(pi),
    );
  }

  async findOne(id: string): Promise<ProductIngredient> {
    const productIngredient = await this.prisma.productIngredient.findUnique({
      where: { id },
      include: {
        product: true,
        ingredient: true,
      },
    });

    if (!productIngredient) {
      throw new NotFoundException(`ProductIngredient with ID ${id} not found`);
    }

    return this.mapPrismaToProductIngredient(productIngredient);
  }

  async findByProduct(productId: string): Promise<ProductIngredient[]> {
    const productIngredients = await this.prisma.productIngredient.findMany({
      where: { productId },
      include: {
        product: true,
        ingredient: true,
      },
    });

    return productIngredients.map((pi) =>
      this.mapPrismaToProductIngredient(pi),
    );
  }

  async findByIngredient(ingredientId: string): Promise<ProductIngredient[]> {
    const productIngredients = await this.prisma.productIngredient.findMany({
      where: { ingredientId },
      include: {
        product: true,
        ingredient: true,
      },
    });

    return productIngredients.map((pi) =>
      this.mapPrismaToProductIngredient(pi),
    );
  }

  async update(
    id: string,
    updateProductIngredientInput: UpdateProductIngredientInput,
  ): Promise<ProductIngredient> {
    const existingProductIngredient =
      await this.prisma.productIngredient.findUnique({
        where: { id },
      });

    if (!existingProductIngredient) {
      throw new NotFoundException(`ProductIngredient with ID ${id} not found`);
    }

    const { productId, ingredientId } = updateProductIngredientInput;

    // Se está alterando produto ou ingrediente, verificar se existe
    if (productId && productId !== existingProductIngredient.productId) {
      const product = await this.prisma.product.findUnique({
        where: { id: productId },
      });

      if (!product) {
        throw new NotFoundException(`Product with ID ${productId} not found`);
      }
    }

    if (
      ingredientId &&
      ingredientId !== existingProductIngredient.ingredientId
    ) {
      const ingredient = await this.prisma.ingredient.findUnique({
        where: { id: ingredientId },
      });

      if (!ingredient) {
        throw new NotFoundException(
          `Ingredient with ID ${ingredientId} not found`,
        );
      }
    }

    // Verificar se a nova combinação já existe (se aplicável)
    if (productId || ingredientId) {
      const newProductId = productId || existingProductIngredient.productId;
      const newIngredientId =
        ingredientId || existingProductIngredient.ingredientId;

      const existingRelation = await this.prisma.productIngredient.findFirst({
        where: {
          productId: newProductId,
          ingredientId: newIngredientId,
          id: { not: id },
        },
      });

      if (existingRelation) {
        throw new ConflictException(
          `Product and ingredient combination already exists`,
        );
      }
    }

    const productIngredient = await this.prisma.productIngredient.update({
      where: { id },
      data: {
        productId,
        ingredientId,
      },
      include: {
        product: true,
        ingredient: true,
      },
    });

    return this.mapPrismaToProductIngredient(productIngredient);
  }

  async remove(id: string): Promise<ProductIngredient> {
    const existingProductIngredient =
      await this.prisma.productIngredient.findUnique({
        where: { id },
        include: {
          product: true,
          ingredient: true,
        },
      });

    if (!existingProductIngredient) {
      throw new NotFoundException(`ProductIngredient with ID ${id} not found`);
    }

    const productIngredient = await this.prisma.productIngredient.delete({
      where: { id },
      include: {
        product: true,
        ingredient: true,
      },
    });

    return this.mapPrismaToProductIngredient(productIngredient);
  }

  async removeByProductAndIngredient(
    productId: string,
    ingredientId: string,
  ): Promise<ProductIngredient> {
    const existingProductIngredient =
      await this.prisma.productIngredient.findFirst({
        where: {
          productId,
          ingredientId,
        },
        include: {
          product: true,
          ingredient: true,
        },
      });

    if (!existingProductIngredient) {
      throw new NotFoundException(
        `ProductIngredient relation between product ${productId} and ingredient ${ingredientId} not found`,
      );
    }

    const productIngredient = await this.prisma.productIngredient.delete({
      where: { id: existingProductIngredient.id },
      include: {
        product: true,
        ingredient: true,
      },
    });

    return this.mapPrismaToProductIngredient(productIngredient);
  }

  async addIngredientsToProduct(
    addIngredientToProductInput: AddIngredientToProductInput,
  ): Promise<ProductIngredient[]> {
    const { productId, ingredientIds } = addIngredientToProductInput;

    // Verificar se o produto existe
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    const results: ProductIngredient[] = [];

    for (const ingredientId of ingredientIds) {
      // Verificar se o ingrediente existe
      const ingredient = await this.prisma.ingredient.findUnique({
        where: { id: ingredientId },
      });

      if (!ingredient) {
        throw new NotFoundException(
          `Ingredient with ID ${ingredientId} not found`,
        );
      }

      // Verificar se a relação já existe
      const existingRelation = await this.prisma.productIngredient.findFirst({
        where: {
          productId,
          ingredientId,
        },
      });

      if (!existingRelation) {
        const productIngredient = await this.prisma.productIngredient.create({
          data: {
            productId,
            ingredientId,
          },
          include: {
            product: true,
            ingredient: true,
          },
        });

        results.push(this.mapPrismaToProductIngredient(productIngredient));
      }
    }

    return results;
  }

  async removeIngredientFromProduct(
    removeIngredientFromProductInput: RemoveIngredientFromProductInput,
  ): Promise<ProductIngredient> {
    const { productId, ingredientId } = removeIngredientFromProductInput;

    return this.removeByProductAndIngredient(productId, ingredientId);
  }

  private mapPrismaToProductIngredient(
    prismaProductIngredient: any,
  ): ProductIngredient {
    return {
      id: prismaProductIngredient.id,
      productId: prismaProductIngredient.productId,
      ingredientId: prismaProductIngredient.ingredientId,
      product: prismaProductIngredient.product,
      ingredient: prismaProductIngredient.ingredient,
    };
  }
}
