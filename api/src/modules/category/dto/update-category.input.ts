import { InputType, Field, PartialType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { CreateCategoryInput } from './create-category.input';

@InputType()
export class UpdateCategoryInput extends PartialType(CreateCategoryInput) {
  @Field(() => String)
  @IsString({ message: 'ID must be a string' })
  id: string;
}
