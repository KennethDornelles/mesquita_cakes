import { InputType, Int, Field } from '@nestjs/graphql';
import { IsString, IsInt, Min } from 'class-validator';

@InputType()
export class CreateCartItemInput {
  @Field(() => String, { description: 'Product ID to add to cart' })
  @IsString({ message: 'Product ID must be a string' })
  productId: string;

  @Field(() => Int, { description: 'Quantity to add to cart' })
  @IsInt({ message: 'Quantity must be an integer' })
  @Min(1, { message: 'Quantity must be at least 1' })
  quantity: number;
}
