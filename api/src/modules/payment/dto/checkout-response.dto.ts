import { ObjectType, Field } from '@nestjs/graphql';
import { Payment } from '../entities/payment.entity';

@ObjectType()
export class CheckoutResponse {
  @Field(() => Payment)
  payment: Payment;

  @Field(() => String, { nullable: true })
  pixQrCode?: string;

  @Field(() => String, { nullable: true })
  pixCopyPaste?: string;

  @Field(() => Number, { nullable: true })
  expiresInMinutes?: number;

  @Field(() => String, { nullable: true })
  instructions?: string;
}

@ObjectType()
export class PaymentStatusResponse {
  @Field(() => String)
  paymentId: string;

  @Field(() => String)
  status: string;

  @Field(() => Boolean)
  isPaid: boolean;

  @Field(() => Date, { nullable: true })
  paidAt?: Date;
}
