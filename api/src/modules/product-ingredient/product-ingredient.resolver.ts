import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ProductIngredientService } from './product-ingredient.service';
import { ProductIngredient } from './entities/product-ingredient.entity';
import { CreateProductIngredientInput } from './dto/create-product-ingredient.input';
import { UpdateProductIngredientInput } from './dto/update-product-ingredient.input';

@Resolver(() => ProductIngredient)
export class ProductIngredientResolver {
  constructor(private readonly productIngredientService: ProductIngredientService) {}

  @Mutation(() => ProductIngredient)
  createProductIngredient(@Args('createProductIngredientInput') createProductIngredientInput: CreateProductIngredientInput) {
    return this.productIngredientService.create(createProductIngredientInput);
  }

  @Query(() => [ProductIngredient], { name: 'productIngredient' })
  findAll() {
    return this.productIngredientService.findAll();
  }

  @Query(() => ProductIngredient, { name: 'productIngredient' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.productIngredientService.findOne(id);
  }

  @Mutation(() => ProductIngredient)
  updateProductIngredient(@Args('updateProductIngredientInput') updateProductIngredientInput: UpdateProductIngredientInput) {
    return this.productIngredientService.update(updateProductIngredientInput.id, updateProductIngredientInput);
  }

  @Mutation(() => ProductIngredient)
  removeProductIngredient(@Args('id', { type: () => Int }) id: number) {
    return this.productIngredientService.remove(id);
  }
}
