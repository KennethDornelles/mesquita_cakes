import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Role } from '../../../enums';

@ObjectType()
export class User {
  @Field(() => ID)
  id: string;

  @Field()
  email: string;

  @Field()
  name: string;

  // Password não é exposto no GraphQL por segurança
  password: string;

  @Field(() => String, { nullable: true })
  phone?: string | null;

  @Field(() => String, { nullable: true })
  avatar?: string | null;

  @Field(() => Role)
  role: Role;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}
