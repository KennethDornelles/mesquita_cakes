import {
  ObjectType,
  Field,
  ID,
  Float,
  registerEnumType,
} from '@nestjs/graphql';
import { OrderStatus, PaymentStatus } from '../../../enums';

// Registrar enums para GraphQL
registerEnumType(OrderStatus, {
  name: 'OrderStatus',
  description: 'Status do pedido',
});

registerEnumType(PaymentStatus, {
  name: 'PaymentStatus',
  description: 'Status do pagamento',
});

@ObjectType()
export class Order {
  @Field(() => ID)
  id: string;

  @Field()
  orderNumber: string;

  @Field(() => OrderStatus)
  status: OrderStatus;

  @Field(() => Float)
  total: number;

  @Field(() => Float)
  subtotal: number;

  @Field(() => Float)
  deliveryFee: number;

  @Field()
  paymentMethod: string;

  @Field(() => PaymentStatus)
  paymentStatus: PaymentStatus;

  @Field(() => String, { nullable: true })
  notes?: string;

  @Field(() => Date, { nullable: true })
  deliveryDate?: Date;

  @Field()
  userId: string;

  @Field()
  addressId: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  // Relacionamentos - serão resolvidos via field resolvers
  user?: any;
  address?: any;
  items?: any[];
}
