import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class Address {
  @Field(() => ID)
  id: string;

  @Field()
  street: string;

  @Field()
  number: string;

  @Field(() => String, { nullable: true })
  complement?: string;

  @Field()
  neighborhood: string;

  @Field()
  city: string;

  @Field()
  state: string;

  @Field()
  zipCode: string;

  @Field()
  isDefault: boolean;

  @Field()
  userId: string;

  // Relacionamentos - serão resolvidos via field resolvers
  user?: any;
}
