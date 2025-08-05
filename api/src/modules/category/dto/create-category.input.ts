import { InputType, Field } from '@nestjs/graphql';
import {
  IsString,
  IsOptional,
  IsBoolean,
  Length,
  IsUrl,
} from 'class-validator';

@InputType()
export class CreateCategoryInput {
  @Field(() => String, { description: 'Category name' })
  @IsString({ message: 'Name must be a string' })
  @Length(2, 100, { message: 'Name must be between 2 and 100 characters' })
  name: string;

  @Field(() => String, { description: 'URL-friendly slug' })
  @IsString({ message: 'Slug must be a string' })
  @Length(2, 100, { message: 'Slug must be between 2 and 100 characters' })
  slug: string;

  @Field(() => String, { nullable: true, description: 'Category description' })
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  @Length(1, 500, {
    message: 'Description must be between 1 and 500 characters',
  })
  description?: string;

  @Field(() => String, { nullable: true, description: 'Category image URL' })
  @IsOptional()
  @IsString({ message: 'Image must be a string' })
  @IsUrl({}, { message: 'Image must be a valid URL' })
  image?: string;

  @Field(() => Boolean, {
    nullable: true,
    description: 'Whether category is active',
  })
  @IsOptional()
  @IsBoolean({ message: 'Active must be a boolean' })
  active?: boolean;
}
