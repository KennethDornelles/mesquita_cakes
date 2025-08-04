import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateProductIngredientInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
