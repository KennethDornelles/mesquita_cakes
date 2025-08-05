import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsArray } from 'class-validator';

@InputType()
export class AddIngredientToProductInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  productId: string;

  @Field(() => [String])
  @IsArray()
  @IsString({ each: true })
  ingredientIds: string[];
}

@InputType()
export class RemoveIngredientFromProductInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  productId: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  ingredientId: string;
}
