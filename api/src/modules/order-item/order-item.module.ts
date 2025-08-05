import { Module } from '@nestjs/common';
import { OrderItemService } from './order-item.service';
import { OrderItemResolver } from './order-item.resolver';
import { PrismaModule } from '../../database/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [OrderItemResolver, OrderItemService],
  exports: [OrderItemService],
})
export class OrderItemModule {}
