import { InputType, Field, ID } from '@nestjs/graphql';
import {
  IsOptional,
  IsString,
  IsBoolean,
  Matches,
  Length,
} from 'class-validator';

@InputType()
export class UpdateAddressInput {
  @Field(() => ID)
  id: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @Matches(/^\d{5}-?\d{3}$/, { message: 'CEP deve ter o formato 00000-000' })
  zipCode?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @Length(1, 255)
  street?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @Length(1, 20)
  number?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @Length(0, 255)
  complement?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  neighborhood?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  city?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @Length(2, 2)
  state?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}
