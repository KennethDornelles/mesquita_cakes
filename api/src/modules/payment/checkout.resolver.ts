import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CheckoutService } from './checkout.service';
import { PixCheckoutResponse } from './dto/pix-checkout.dto';
import { User } from '../user/entities/user.entity';

@Resolver()
export class CheckoutResolver {
  constructor(private readonly checkoutService: CheckoutService) {}

  @Mutation(() => PixCheckoutResponse)
  @UseGuards(JwtAuthGuard)
  createPixCheckout(
    @Args('orderId', { type: () => String }) orderId: string,
    @CurrentUser() user: User,
  ) {
    return this.checkoutService.createPixCheckout(orderId, user.id);
  }

  @Mutation(() => Boolean, { description: 'Simulate PIX payment approval' })
  @UseGuards(JwtAuthGuard)
  simulatePixPayment(
    @Args('orderId', { type: () => String }) orderId: string,
    @CurrentUser() user: User,
  ) {
    return this.checkoutService.simulatePixPayment(orderId, user.id);
  }
}
