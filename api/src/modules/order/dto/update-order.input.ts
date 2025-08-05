import { InputType, Field, ID } from '@nestjs/graphql';
import { IsOptional, IsDateString, IsString, IsEnum } from 'class-validator';
import { OrderStatus, PaymentStatus } from '../../../enums';

@InputType()
export class UpdateOrderInput {
  @Field(() => ID)
  id: string;

  @Field(() => OrderStatus, { nullable: true })
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @Field(() => PaymentStatus, { nullable: true })
  @IsOptional()
  @IsEnum(PaymentStatus)
  paymentStatus?: PaymentStatus;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  notes?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  deliveryDate?: string;
}
