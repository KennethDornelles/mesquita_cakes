import { InputType, Field, ID } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

@InputType()
export class UpdateProductIngredientInput {
  @Field(() => ID)
  id: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  productId?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  ingredientId?: string;
}
