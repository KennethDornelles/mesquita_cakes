import { InputType, Field, ID, Float } from '@nestjs/graphql';
import { IsOptional, IsPositive, IsInt, Min } from 'class-validator';

@InputType()
export class UpdateOrderItemInput {
  @Field(() => ID)
  id: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1)
  quantity?: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsPositive()
  price?: number;
}
