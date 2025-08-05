import { InputType, Field, PartialType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { CreateReviewInput } from './create-review.input';

@InputType()
export class UpdateReviewInput extends PartialType(CreateReviewInput) {
  @Field(() => String)
  @IsString({ message: 'ID must be a string' })
  id: string;
}
