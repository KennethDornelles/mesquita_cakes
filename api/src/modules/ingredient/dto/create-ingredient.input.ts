import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString, Length } from 'class-validator';

@InputType()
export class CreateIngredientInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  @Length(1, 100)
  name: string;
}
