import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class CartItem {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
