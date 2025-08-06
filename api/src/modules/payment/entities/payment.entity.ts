import { ObjectType, Field, registerEnumType } from '@nestjs/graphql';
import { PaymentStatus } from '../../../enums';

export enum PaymentMethod {
  PIX = 'PIX',
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',
  CASH = 'CASH',
}

registerEnumType(PaymentMethod, {
  name: 'PaymentMethod',
  description: 'Available payment methods',
});

@ObjectType()
export class Payment {
  @Field(() => String)
  id: string;

  @Field(() => String)
  orderId: string;

  @Field(() => PaymentMethod)
  method: PaymentMethod;

  @Field(() => PaymentStatus)
  status: PaymentStatus;

  @Field(() => Number)
  amount: number;

  @Field(() => String, { nullable: true })
  transactionId?: string;

  @Field(() => String, { nullable: true })
  pixCode?: string;

  @Field(() => String, { nullable: true })
  pixQrCode?: string;

  @Field(() => Date, { nullable: true })
  expiresAt?: Date;

  @Field(() => Date, { nullable: true })
  paidAt?: Date;

  @Field(() => String, { nullable: true })
  failureReason?: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}
