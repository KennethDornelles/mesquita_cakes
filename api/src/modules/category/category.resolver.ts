import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CategoryService } from './category.service';
import { Category } from './entities/category.entity';
import { CreateCategoryInput } from './dto/create-category.input';
import { UpdateCategoryInput } from './dto/update-category.input';
import { Product } from '../product/entities/product.entity';
import { PrismaService } from '../../database/prisma/prisma.service';

@Resolver(() => Category)
export class CategoryResolver {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly prisma: PrismaService,
  ) {}

  @Mutation(() => Category)
  @UseGuards(JwtAuthGuard)
  createCategory(
    @Args('createCategoryInput') createCategoryInput: CreateCategoryInput,
  ) {
    return this.categoryService.create(createCategoryInput);
  }

  @Query(() => [Category], { name: 'categories' })
  findAll() {
    return this.categoryService.findAll();
  }

  @Query(() => [Category], { name: 'activeCategories' })
  findAllActive() {
    return this.categoryService.findAllActive();
  }

  @Query(() => Category, { name: 'category' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.categoryService.findOne(id);
  }

  @Query(() => Category, { name: 'categoryBySlug' })
  findBySlug(@Args('slug', { type: () => String }) slug: string) {
    return this.categoryService.findBySlug(slug);
  }

  @Query(() => [Category], { name: 'searchCategories' })
  searchByName(@Args('searchTerm', { type: () => String }) searchTerm: string) {
    return this.categoryService.searchByName(searchTerm);
  }

  @Mutation(() => Category)
  @UseGuards(JwtAuthGuard)
  updateCategory(
    @Args('updateCategoryInput') updateCategoryInput: UpdateCategoryInput,
  ) {
    return this.categoryService.update(
      updateCategoryInput.id,
      updateCategoryInput,
    );
  }

  @Mutation(() => Category)
  @UseGuards(JwtAuthGuard)
  removeCategory(@Args('id', { type: () => String }) id: string) {
    return this.categoryService.remove(id);
  }

  @Mutation(() => Category)
  @UseGuards(JwtAuthGuard)
  toggleCategoryActive(@Args('id', { type: () => String }) id: string) {
    return this.categoryService.toggleActive(id);
  }

  @ResolveField(() => [Product])
  async products(@Parent() category: Category): Promise<Product[]> {
    const products = await this.prisma.product.findMany({
      where: {
        categoryId: category.id,
      },
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
    });

    return products as any;
  }
}
