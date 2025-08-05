import { ObjectType, Field } from '@nestjs/graphql';
import { Product } from '../../product/entities/product.entity';

@ObjectType()
export class Category {
  @Field(() => String)
  id: string;

  @Field(() => String, { description: 'Category name' })
  name: string;

  @Field(() => String, { description: 'URL-friendly slug' })
  slug: string;

  @Field(() => String, { nullable: true, description: 'Category description' })
  description?: string;

  @Field(() => String, { nullable: true, description: 'Category image URL' })
  image?: string;

  @Field(() => Boolean, { description: 'Whether category is active' })
  active: boolean;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  @Field(() => [Product], { description: 'Products in this category' })
  products: Product[];
}
