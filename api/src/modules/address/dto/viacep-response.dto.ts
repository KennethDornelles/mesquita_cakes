import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class ViaCepResponse {
  @Field()
  cep: string;

  @Field()
  logradouro: string;

  @Field()
  complemento: string;

  @Field()
  bairro: string;

  @Field()
  localidade: string;

  @Field()
  uf: string;

  @Field()
  ibge: string;

  @Field()
  gia: string;

  @Field()
  ddd: string;

  @Field()
  siafi: string;

  @Field({ nullable: true })
  erro?: boolean;
}
