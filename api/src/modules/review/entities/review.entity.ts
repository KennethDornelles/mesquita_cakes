import { ObjectType, Field, Int } from '@nestjs/graphql';
import { User } from '../../user/entities/user.entity';
import { Product } from '../../product/entities/product.entity';

@ObjectType()
export class Review {
  @Field(() => String)
  id: string;

  @Field(() => Int, { description: 'Rating from 1 to 5' })
  rating: number;

  @Field(() => String, { nullable: true, description: 'Optional comment' })
  comment?: string;

  @Field(() => String)
  userId: string;

  @Field(() => String)
  productId: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  @Field(() => User, { description: 'User who made the review' })
  user: User;

  @Field(() => Product, { description: 'Product being reviewed' })
  product: Product;
}
