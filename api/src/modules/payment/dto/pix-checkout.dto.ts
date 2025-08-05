import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class PixCheckoutResponse {
  @Field(() => String)
  paymentId: string;

  @Field(() => String)
  pixCode: string;

  @Field(() => String)
  pixQrCode: string;

  @Field(() => Int)
  expiresInMinutes: number;

  @Field(() => String)
  instructions: string;

  @Field(() => Number)
  amount: number;
}

@ObjectType()
export class CheckoutSession {
  @Field(() => String)
  sessionId: string;

  @Field(() => String)
  orderId: string;

  @Field(() => String)
  status: string;

  @Field(() => Date)
  expiresAt: Date;
}
