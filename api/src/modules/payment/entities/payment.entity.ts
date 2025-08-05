import { ObjectType, Field, registerEnumType } from '@nestjs/graphql';

export enum PaymentMethod {
  PIX = 'PIX',
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',
  CASH = 'CASH',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  PAID = 'PAID',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
}

registerEnumType(PaymentMethod, {
  name: 'PaymentMethod',
  description: 'Available payment methods',
});

registerEnumType(PaymentStatus, {
  name: 'PaymentStatus',
  description: 'Payment status options',
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
