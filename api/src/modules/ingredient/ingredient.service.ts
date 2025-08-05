import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';
import { CreateIngredientInput } from './dto/create-ingredient.input';
import { UpdateIngredientInput } from './dto/update-ingredient.input';
import { Ingredient } from './entities/ingredient.entity';

@Injectable()
export class IngredientService {
  constructor(private prisma: PrismaService) {}

  async create(
    createIngredientInput: CreateIngredientInput,
  ): Promise<Ingredient> {
    const { name } = createIngredientInput;

    // Verificar se já existe um ingrediente com o mesmo nome
    const existingIngredient = await this.prisma.ingredient.findUnique({
      where: { name },
    });

    if (existingIngredient) {
      throw new ConflictException(
        `Ingredient with name "${name}" already exists`,
      );
    }

    const ingredient = await this.prisma.ingredient.create({
      data: { name },
      include: {
        products: {
          include: {
            product: true,
          },
        },
      },
    });

    return this.mapPrismaToIngredient(ingredient);
  }

  async findAll(): Promise<Ingredient[]> {
    const ingredients = await this.prisma.ingredient.findMany({
      include: {
        products: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    return ingredients.map((ingredient) =>
      this.mapPrismaToIngredient(ingredient),
    );
  }

  async findOne(id: string): Promise<Ingredient> {
    const ingredient = await this.prisma.ingredient.findUnique({
      where: { id },
      include: {
        products: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!ingredient) {
      throw new NotFoundException(`Ingredient with ID ${id} not found`);
    }

    return this.mapPrismaToIngredient(ingredient);
  }

  async findByName(name: string): Promise<Ingredient | null> {
    const ingredient = await this.prisma.ingredient.findUnique({
      where: { name },
      include: {
        products: {
          include: {
            product: true,
          },
        },
      },
    });

    return ingredient ? this.mapPrismaToIngredient(ingredient) : null;
  }

  async searchByName(searchTerm: string): Promise<Ingredient[]> {
    const ingredients = await this.prisma.ingredient.findMany({
      where: {
        name: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      },
      include: {
        products: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    return ingredients.map((ingredient) =>
      this.mapPrismaToIngredient(ingredient),
    );
  }

  async update(
    id: string,
    updateIngredientInput: UpdateIngredientInput,
  ): Promise<Ingredient> {
    const existingIngredient = await this.prisma.ingredient.findUnique({
      where: { id },
    });

    if (!existingIngredient) {
      throw new NotFoundException(`Ingredient with ID ${id} not found`);
    }

    const { name } = updateIngredientInput;

    // Se está alterando o nome, verificar se já existe outro com esse nome
    if (name && name !== existingIngredient.name) {
      const conflictingIngredient = await this.prisma.ingredient.findUnique({
        where: { name },
      });

      if (conflictingIngredient) {
        throw new ConflictException(
          `Ingredient with name "${name}" already exists`,
        );
      }
    }

    const ingredient = await this.prisma.ingredient.update({
      where: { id },
      data: { name },
      include: {
        products: {
          include: {
            product: true,
          },
        },
      },
    });

    return this.mapPrismaToIngredient(ingredient);
  }

  async remove(id: string): Promise<Ingredient> {
    const existingIngredient = await this.prisma.ingredient.findUnique({
      where: { id },
      include: {
        products: true,
      },
    });

    if (!existingIngredient) {
      throw new NotFoundException(`Ingredient with ID ${id} not found`);
    }

    // Verificar se há produtos associados
    if (existingIngredient.products.length > 0) {
      throw new ConflictException(
        `Cannot delete ingredient "${existingIngredient.name}" because it is associated with ${existingIngredient.products.length} product(s)`,
      );
    }

    const ingredient = await this.prisma.ingredient.delete({
      where: { id },
      include: {
        products: {
          include: {
            product: true,
          },
        },
      },
    });

    return this.mapPrismaToIngredient(ingredient);
  }

  private mapPrismaToIngredient(prismaIngredient: any): Ingredient {
    return {
      id: prismaIngredient.id,
      name: prismaIngredient.name,
      products: prismaIngredient.products || [],
    };
  }
}
