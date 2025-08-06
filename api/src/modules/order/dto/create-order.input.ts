import { InputType, Field, Float } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsDateString,
  IsArray,
  ValidateNested,
  IsPositive,
  IsInt,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

@InputType()
export class CreateOrderItemForOrderInput {
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

@InputType()
export class CreateOrderInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  addressId: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  paymentMethod: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  notes?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  deliveryDate?: string;

  @Field(() => [CreateOrderItemForOrderInput])
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemForOrderInput)
  items: CreateOrderItemForOrderInput[];
}
