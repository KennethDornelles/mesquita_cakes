import { ObjectType, Field, ID, Float, Int } from '@nestjs/graphql';
import { Category } from '../../category/entities/category.entity';

@ObjectType()
export class Product {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  slug: string;

  @Field()
  description: string;

  @Field(() => Float)
  price: number;

  @Field(() => String, { nullable: true })
  image?: string | null;

  @Field(() => [String], { nullable: true })
  images?: string[];

  @Field(() => Int)
  stock: number;

  @Field(() => Float, { nullable: true })
  weight?: number | null;

  @Field(() => Int, { nullable: true })
  calories?: number | null;

  @Field()
  active: boolean;

  @Field()
  featured: boolean;

  @Field()
  categoryId: string;

  @Field(() => [String], { nullable: true })
  allergens?: string[];

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  // Relacionamentos
  @Field(() => Category, { nullable: true })
  category?: Category;
}
