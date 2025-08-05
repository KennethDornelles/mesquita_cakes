import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import { User } from '../../user/entities/user.entity';
import { Product } from '../../product/entities/product.entity';

@ObjectType()
export class CartItem {
  @Field(() => String)
  id: string;

  @Field(() => Int, { description: 'Quantity of items in cart' })
  quantity: number;

  @Field(() => Float, {
    nullable: true,
    description: 'Price snapshot when added to cart',
  })
  priceSnapshot?: number;

  @Field(() => String)
  userId: string;

  @Field(() => String)
  productId: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  @Field(() => User, { description: 'User who owns this cart item' })
  user: User;

  @Field(() => Product, { description: 'Product in cart' })
  product: Product;

  @Field(() => Float, { description: 'Total price for this cart item' })
  totalPrice: number;
}
