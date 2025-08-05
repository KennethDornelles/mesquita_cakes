import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class ProductIngredient {
  @Field(() => ID)
  id: string;

  @Field()
  productId: string;

  @Field()
  ingredientId: string;

  // Relacionamentos - serão resolvidos via field resolvers
  product?: any;
  ingredient?: any;
}
