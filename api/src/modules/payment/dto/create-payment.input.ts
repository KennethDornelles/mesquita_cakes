import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsEnum, IsOptional } from 'class-validator';
import { PaymentMethod } from '../entities/payment.entity';

@InputType()
export class CreatePaymentInput {
  @Field(() => String, { description: 'Order ID to create payment for' })
  @IsString({ message: 'Order ID must be a string' })
  orderId: string;

  @Field(() => PaymentMethod, { description: 'Payment method to use' })
  @IsEnum(PaymentMethod, { message: 'Invalid payment method' })
  method: PaymentMethod;

  @Field(() => String, {
    nullable: true,
    description: 'Customer document for PIX',
  })
  @IsOptional()
  @IsString({ message: 'Customer document must be a string' })
  customerDocument?: string;

  @Field(() => String, { nullable: true, description: 'Customer name for PIX' })
  @IsOptional()
  @IsString({ message: 'Customer name must be a string' })
  customerName?: string;
}
