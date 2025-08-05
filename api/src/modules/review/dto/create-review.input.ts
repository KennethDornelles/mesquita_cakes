import { InputType, Int, Field } from '@nestjs/graphql';
import { IsInt, IsOptional, IsString, Min, Max, Length } from 'class-validator';

@InputType()
export class CreateReviewInput {
  @Field(() => Int, { description: 'Rating from 1 to 5' })
  @IsInt({ message: 'Rating must be an integer' })
  @Min(1, { message: 'Rating must be at least 1' })
  @Max(5, { message: 'Rating must be at most 5' })
  rating: number;

  @Field(() => String, { nullable: true, description: 'Optional comment' })
  @IsOptional()
  @IsString({ message: 'Comment must be a string' })
  @Length(1, 1000, { message: 'Comment must be between 1 and 1000 characters' })
  comment?: string;

  @Field(() => String, { description: 'Product ID to review' })
  @IsString({ message: 'Product ID must be a string' })
  productId: string;
}
