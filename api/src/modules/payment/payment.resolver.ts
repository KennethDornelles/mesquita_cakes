import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { PaymentService } from './payment.service';
import { PixCheckoutResponse } from './dto/pix-checkout.dto';
import { User } from '../user/entities/user.entity';

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
}
