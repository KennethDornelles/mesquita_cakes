import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class ProductIngredient {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
