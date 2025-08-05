import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateProductIngredientInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  productId: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  ingredientId: string;
}
