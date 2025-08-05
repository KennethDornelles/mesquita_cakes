import { InputType, Field, Int } from '@nestjs/graphql';
import { IsString, IsInt, Min } from 'class-validator';

@InputType()
export class UpdateCartItemInput {
  @Field(() => String)
  @IsString({ message: 'ID must be a string' })
  id: string;

  @Field(() => Int, { description: 'New quantity for cart item' })
  @IsInt({ message: 'Quantity must be an integer' })
  @Min(1, { message: 'Quantity must be at least 1' })
  quantity: number;
}
