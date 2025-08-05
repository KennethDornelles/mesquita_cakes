import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';
import { CreateCategoryInput } from './dto/create-category.input';
import { UpdateCategoryInput } from './dto/update-category.input';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async create(createCategoryInput: CreateCategoryInput): Promise<Category> {
    const {
      name,
      slug,
      description,
      image,
      active = true,
    } = createCategoryInput;

    // Verificar se já existe uma categoria com o mesmo nome ou slug
    const existingCategory = await this.prisma.category.findFirst({
      where: {
        OR: [{ name }, { slug }],
      },
    });

    if (existingCategory) {
      if (existingCategory.name === name) {
        throw new ConflictException(
          `Category with name "${name}" already exists`,
        );
      }
      if (existingCategory.slug === slug) {
        throw new ConflictException(
          `Category with slug "${slug}" already exists`,
        );
      }
    }

    const category = await this.prisma.category.create({
      data: {
        name,
        slug,
        description,
        image,
        active,
      },
      include: {
        products: {
          include: {
            category: true,
            ingredients: {
              include: {
                ingredient: true,
              },
            },
            reviews: {
              include: {
                user: true,
              },
            },
            orderItems: true,
          },
        },
      },
    });

    return this.mapPrismaToCategory(category);
  }

  async findAll(): Promise<Category[]> {
    const categories = await this.prisma.category.findMany({
      include: {
        products: {
          include: {
            category: true,
            ingredients: {
              include: {
                ingredient: true,
              },
            },
            reviews: {
              include: {
                user: true,
              },
            },
            orderItems: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    return categories.map((category) => this.mapPrismaToCategory(category));
  }

  async findAllActive(): Promise<Category[]> {
    const categories = await this.prisma.category.findMany({
      where: { active: true },
      include: {
        products: {
          where: { active: true },
          include: {
            category: true,
            ingredients: {
              include: {
                ingredient: true,
              },
            },
            reviews: {
              include: {
                user: true,
              },
            },
            orderItems: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    return categories.map((category) => this.mapPrismaToCategory(category));
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        products: {
          include: {
            category: true,
            ingredients: {
              include: {
                ingredient: true,
              },
            },
            reviews: {
              include: {
                user: true,
              },
            },
            orderItems: true,
          },
        },
      },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return this.mapPrismaToCategory(category);
  }

  async findBySlug(slug: string): Promise<Category> {
    const category = await this.prisma.category.findUnique({
      where: { slug },
      include: {
        products: {
          where: { active: true },
          include: {
            category: true,
            ingredients: {
              include: {
                ingredient: true,
              },
            },
            reviews: {
              include: {
                user: true,
              },
            },
            orderItems: true,
          },
        },
      },
    });

    if (!category) {
      throw new NotFoundException(`Category with slug "${slug}" not found`);
    }

    return this.mapPrismaToCategory(category);
  }

  async searchByName(searchTerm: string): Promise<Category[]> {
    const categories = await this.prisma.category.findMany({
      where: {
        name: {
          contains: searchTerm,
          mode: 'insensitive',
        },
        active: true,
      },
      include: {
        products: {
          where: { active: true },
          include: {
            category: true,
            ingredients: {
              include: {
                ingredient: true,
              },
            },
            reviews: {
              include: {
                user: true,
              },
            },
            orderItems: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    return categories.map((category) => this.mapPrismaToCategory(category));
  }

  async update(
    id: string,
    updateCategoryInput: UpdateCategoryInput,
  ): Promise<Category> {
    const existingCategory = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    const { name, slug, description, image, active } = updateCategoryInput;

    // Se está alterando nome ou slug, verificar se já existe outro com esses valores
    if (name || slug) {
      const conflictingCategory = await this.prisma.category.findFirst({
        where: {
          AND: [
            { id: { not: id } },
            {
              OR: [...(name ? [{ name }] : []), ...(slug ? [{ slug }] : [])],
            },
          ],
        },
      });

      if (conflictingCategory) {
        if (conflictingCategory.name === name) {
          throw new ConflictException(
            `Category with name "${name}" already exists`,
          );
        }
        if (conflictingCategory.slug === slug) {
          throw new ConflictException(
            `Category with slug "${slug}" already exists`,
          );
        }
      }
    }

    const category = await this.prisma.category.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(slug && { slug }),
        ...(description !== undefined && { description }),
        ...(image !== undefined && { image }),
        ...(active !== undefined && { active }),
      },
      include: {
        products: {
          include: {
            category: true,
            ingredients: {
              include: {
                ingredient: true,
              },
            },
            reviews: {
              include: {
                user: true,
              },
            },
            orderItems: true,
          },
        },
      },
    });

    return this.mapPrismaToCategory(category);
  }

  async remove(id: string): Promise<Category> {
    const existingCategory = await this.prisma.category.findUnique({
      where: { id },
      include: {
        products: true,
      },
    });

    if (!existingCategory) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    // Verificar se há produtos associados
    if (existingCategory.products.length > 0) {
      throw new ConflictException(
        `Cannot delete category "${existingCategory.name}" because it has ${existingCategory.products.length} product(s) associated`,
      );
    }

    const category = await this.prisma.category.delete({
      where: { id },
      include: {
        products: {
          include: {
            category: true,
            ingredients: {
              include: {
                ingredient: true,
              },
            },
            reviews: {
              include: {
                user: true,
              },
            },
            orderItems: true,
          },
        },
      },
    });

    return this.mapPrismaToCategory(category);
  }

  async toggleActive(id: string): Promise<Category> {
    const existingCategory = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    const category = await this.prisma.category.update({
      where: { id },
      data: {
        active: !existingCategory.active,
      },
      include: {
        products: {
          include: {
            category: true,
            ingredients: {
              include: {
                ingredient: true,
              },
            },
            reviews: {
              include: {
                user: true,
              },
            },
            orderItems: true,
          },
        },
      },
    });

    return this.mapPrismaToCategory(category);
  }

  private mapPrismaToCategory(prismaCategory: any): Category {
    return {
      id: prismaCategory.id,
      name: prismaCategory.name,
      slug: prismaCategory.slug,
      description: prismaCategory.description,
      image: prismaCategory.image,
      active: prismaCategory.active,
      createdAt: prismaCategory.createdAt,
      updatedAt: prismaCategory.updatedAt,
      products: prismaCategory.products || [],
    };
  }
}
