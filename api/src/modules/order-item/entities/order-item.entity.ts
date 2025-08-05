import { ObjectType, Field, ID, Float } from '@nestjs/graphql';

@ObjectType()
export class OrderItem {
  @Field(() => ID)
  id: string;

  @Field()
  quantity: number;

  @Field(() => Float)
  price: number;

  @Field()
  orderId: string;

  @Field()
  productId: string;

  // Relacionamentos - serão resolvidos via field resolvers
  order?: any;
  product?: any;
}
