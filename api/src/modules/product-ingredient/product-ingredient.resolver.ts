import {
  Resolver,
  Query,
  Mutation,
  Args,
  ID,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ProductIngredientService } from './product-ingredient.service';
import { ProductIngredient } from './entities/product-ingredient.entity';
import { CreateProductIngredientInput } from './dto/create-product-ingredient.input';
import { UpdateProductIngredientInput } from './dto/update-product-ingredient.input';
import {
  AddIngredientToProductInput,
  RemoveIngredientFromProductInput,
} from './dto/manage-product-ingredients.input';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../decorators';
import { Role } from '../../enums';
import { Product } from '../product/entities/product.entity';
import { Ingredient } from '../ingredient/entities/ingredient.entity';
import { PrismaService } from '../../database/prisma/prisma.service';

@Resolver(() => ProductIngredient)
export class ProductIngredientResolver {
  constructor(
    private readonly productIngredientService: ProductIngredientService,
    private readonly prisma: PrismaService,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Mutation(() => ProductIngredient)
  createProductIngredient(
    @Args('createProductIngredientInput')
    createProductIngredientInput: CreateProductIngredientInput,
  ) {
    return this.productIngredientService.create(createProductIngredientInput);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Query(() => [ProductIngredient], { name: 'productIngredients' })
  findAll() {
    return this.productIngredientService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => ProductIngredient, { name: 'productIngredient' })
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.productIngredientService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [ProductIngredient], { name: 'productIngredientsByProduct' })
  findByProduct(@Args('productId', { type: () => ID }) productId: string) {
    return this.productIngredientService.findByProduct(productId);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [ProductIngredient], { name: 'productIngredientsByIngredient' })
  findByIngredient(
    @Args('ingredientId', { type: () => ID }) ingredientId: string,
  ) {
    return this.productIngredientService.findByIngredient(ingredientId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Mutation(() => ProductIngredient)
  updateProductIngredient(
    @Args('updateProductIngredientInput')
    updateProductIngredientInput: UpdateProductIngredientInput,
  ) {
    return this.productIngredientService.update(
      updateProductIngredientInput.id,
      updateProductIngredientInput,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Mutation(() => ProductIngredient)
  removeProductIngredient(@Args('id', { type: () => ID }) id: string) {
    return this.productIngredientService.remove(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Mutation(() => ProductIngredient)
  removeProductIngredientByRelation(
    @Args('productId', { type: () => ID }) productId: string,
    @Args('ingredientId', { type: () => ID }) ingredientId: string,
  ) {
    return this.productIngredientService.removeByProductAndIngredient(
      productId,
      ingredientId,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Mutation(() => [ProductIngredient])
  addIngredientsToProduct(
    @Args('addIngredientToProductInput')
    addIngredientToProductInput: AddIngredientToProductInput,
  ) {
    return this.productIngredientService.addIngredientsToProduct(
      addIngredientToProductInput,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Mutation(() => ProductIngredient)
  removeIngredientFromProduct(
    @Args('removeIngredientFromProductInput')
    removeIngredientFromProductInput: RemoveIngredientFromProductInput,
  ) {
    return this.productIngredientService.removeIngredientFromProduct(
      removeIngredientFromProductInput,
    );
  }

  // Field Resolvers
  @ResolveField(() => Product)
  async product(@Parent() productIngredient: ProductIngredient) {
    return this.prisma.product.findUnique({
      where: { id: productIngredient.productId },
    });
  }

  @ResolveField(() => Ingredient)
  async ingredient(@Parent() productIngredient: ProductIngredient) {
    return this.prisma.ingredient.findUnique({
      where: { id: productIngredient.ingredientId },
    });
  }
}
