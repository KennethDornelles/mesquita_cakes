import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

@InputType()
export class FindByCepInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  @Matches(/^\d{5}-?\d{3}$/, { message: 'CEP deve ter o formato 00000-000' })
  cep: string;
}
