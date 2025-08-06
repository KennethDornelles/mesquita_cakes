import { Resolver, Mutation, Args, Query, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CurrentUser, Roles } from '../../decorators';
import { PaymentService } from './payment.service';
import { PixCheckoutResponse } from './dto/pix-checkout.dto';
import { Payment } from './entities/payment.entity';
import { User } from '../user/entities/user.entity';
import { Role } from '../../enums';

@Resolver()
export class PaymentResolver {
  constructor(private readonly paymentService: PaymentService) {}

  @Mutation(() => PixCheckoutResponse)
  @UseGuards(JwtAuthGuard)
  createPixCheckout(
    @Args('orderId', { type: () => String }) orderId: string,
    @CurrentUser() user: User,
  ): Promise<PixCheckoutResponse> {
    return this.paymentService.createPixCheckout(orderId, user.id);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  simulatePixPayment(
    @Args('orderId', { type: () => String }) orderId: string,
    @CurrentUser() user: User,
  ): Promise<boolean> {
    return this.paymentService.simulatePixPayment(orderId, user.id);
  }

  @Query(() => [Payment], { name: 'payments' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  findAllPayments(): Promise<Payment[]> {
    return this.paymentService.findAll();
  }

  @Query(() => Payment, { name: 'payment' })
  @UseGuards(JwtAuthGuard)
  findPayment(@Args('id', { type: () => ID }) id: string): Promise<Payment> {
    return this.paymentService.findOne(id);
  }

  @Query(() => [Payment], { name: 'paymentsByOrder' })
  @UseGuards(JwtAuthGuard)
  findPaymentsByOrder(
    @Args('orderId', { type: () => String }) orderId: string,
    @CurrentUser() user: User,
  ): Promise<Payment[]> {
    return this.paymentService.findByOrder(orderId, user.id);
  }

  @Query(() => [Payment], { name: 'myPayments' })
  @UseGuards(JwtAuthGuard)
  findMyPayments(@CurrentUser() user: User): Promise<Payment[]> {
    return this.paymentService.findByUser(user.id);
  }
}
