import { Module } from '@nestjs/common';
import { PrismaModule } from '../../database/prisma/prisma.module';
import { CartItemService } from './cart-item.service';
import { CartItemResolver } from './cart-item.resolver';

@Module({
  imports: [PrismaModule],
  providers: [CartItemResolver, CartItemService],
  exports: [CartItemService],
})
export class CartItemModule {}
