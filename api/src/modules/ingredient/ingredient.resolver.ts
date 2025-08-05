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
import { IngredientService } from './ingredient.service';
import { Ingredient } from './entities/ingredient.entity';
import { CreateIngredientInput } from './dto/create-ingredient.input';
import { UpdateIngredientInput } from './dto/update-ingredient.input';
import { ProductIngredient } from '../product-ingredient/entities/product-ingredient.entity';
import { PrismaService } from '../../database/prisma/prisma.service';

@Resolver(() => Ingredient)
export class IngredientResolver {
  constructor(
    private readonly ingredientService: IngredientService,
    private readonly prisma: PrismaService,
  ) {}

  @Mutation(() => Ingredient)
  @UseGuards(JwtAuthGuard)
  createIngredient(
    @Args('createIngredientInput') createIngredientInput: CreateIngredientInput,
  ) {
    return this.ingredientService.create(createIngredientInput);
  }

  @Query(() => [Ingredient], { name: 'ingredients' })
  findAll() {
    return this.ingredientService.findAll();
  }

  @Query(() => Ingredient, { name: 'ingredient' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.ingredientService.findOne(id);
  }

  @Query(() => Ingredient, { name: 'ingredientByName', nullable: true })
  findByName(@Args('name', { type: () => String }) name: string) {
    return this.ingredientService.findByName(name);
  }

  @Query(() => [Ingredient], { name: 'searchIngredients' })
  searchByName(@Args('searchTerm', { type: () => String }) searchTerm: string) {
    return this.ingredientService.searchByName(searchTerm);
  }

  @Mutation(() => Ingredient)
  @UseGuards(JwtAuthGuard)
  updateIngredient(
    @Args('updateIngredientInput') updateIngredientInput: UpdateIngredientInput,
  ) {
    return this.ingredientService.update(
      updateIngredientInput.id,
      updateIngredientInput,
    );
  }

  @Mutation(() => Ingredient)
  @UseGuards(JwtAuthGuard)
  removeIngredient(@Args('id', { type: () => String }) id: string) {
    return this.ingredientService.remove(id);
  }

  @ResolveField(() => [ProductIngredient])
  async products(
    @Parent() ingredient: Ingredient,
  ): Promise<ProductIngredient[]> {
    const productIngredients = await this.prisma.productIngredient.findMany({
      where: {
        ingredientId: ingredient.id,
      },
      include: {
        product: true,
        ingredient: true,
      },
    });

    return productIngredients.map((pi) => ({
      id: pi.id,
      productId: pi.productId,
      ingredientId: pi.ingredientId,
      product: pi.product,
      ingredient: pi.ingredient,
    }));
  }
}
