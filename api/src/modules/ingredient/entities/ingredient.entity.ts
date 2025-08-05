import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class Ingredient {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  // Relacionamentos - serão resolvidos via field resolvers
  products?: any[];
}
