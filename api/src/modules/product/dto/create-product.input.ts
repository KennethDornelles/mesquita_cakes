import { InputType, Field, Float, Int } from '@nestjs/graphql';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsArray,
  IsNumber,
  IsPositive,
  MinLength,
} from 'class-validator';

@InputType()
export class CreateProductInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  name: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  slug: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  description: string;

  @Field(() => Float)
  @IsNumber()
  @IsPositive()
  price: number;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  image?: string;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @Field(() => Int, { nullable: true, defaultValue: 0 })
  @IsOptional()
  @IsNumber()
  stock?: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  weight?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  calories?: number;

  @Field({ nullable: true, defaultValue: true })
  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @Field({ nullable: true, defaultValue: false })
  @IsOptional()
  @IsBoolean()
  featured?: boolean;

  @Field()
  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  allergens?: string[];
}
