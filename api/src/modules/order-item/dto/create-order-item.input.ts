import { InputType, Field, Float } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsPositive, IsInt, Min } from 'class-validator';

@InputType()
export class CreateOrderItemInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  orderId: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  productId: string;

  @Field()
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  quantity: number;

  @Field(() => Float)
  @IsNotEmpty()
  @IsPositive()
  price: number;
}
