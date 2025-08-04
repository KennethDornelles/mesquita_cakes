import { CreateProductIngredientInput } from './create-product-ingredient.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateProductIngredientInput extends PartialType(CreateProductIngredientInput) {
  @Field(() => Int)
  id: number;
}
