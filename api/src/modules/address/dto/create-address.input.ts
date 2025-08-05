import { InputType, Field } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsBoolean,
  Matches,
  Length,
} from 'class-validator';

@InputType()
export class CreateAddressInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  @Matches(/^\d{5}-?\d{3}$/, { message: 'CEP deve ter o formato 00000-000' })
  zipCode: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  @Length(1, 255)
  street: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  @Length(1, 20)
  number: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @Length(0, 255)
  complement?: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  @Length(1, 100)
  neighborhood: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  @Length(1, 100)
  city: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  @Length(2, 2)
  state: string;

  @Field({ nullable: true, defaultValue: false })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}
