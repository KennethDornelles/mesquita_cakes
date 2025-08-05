import {
  Resolver,
  Query,
  Mutation,
  Args,
  ID,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { OrderItemService } from './order-item.service';
import { OrderItem } from './entities/order-item.entity';
import { CreateOrderItemInput } from './dto/create-order-item.input';
import { UpdateOrderItemInput } from './dto/update-order-item.input';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../decorators';
import { Role } from '../../enums';
import { Order } from '../order/entities/order.entity';
import { Product } from '../product/entities/product.entity';
import { PrismaService } from '../../database/prisma/prisma.service';

@Resolver(() => OrderItem)
export class OrderItemResolver {
  constructor(
    private readonly orderItemService: OrderItemService,
    private readonly prisma: PrismaService,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Mutation(() => OrderItem)
  createOrderItem(
    @Args('createOrderItemInput') createOrderItemInput: CreateOrderItemInput,
  ) {
    return this.orderItemService.create(createOrderItemInput);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Query(() => [OrderItem], { name: 'orderItems' })
  findAll() {
    return this.orderItemService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => OrderItem, { name: 'orderItem' })
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.orderItemService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [OrderItem], { name: 'orderItemsByOrder' })
  findByOrder(@Args('orderId', { type: () => ID }) orderId: string) {
    return this.orderItemService.findByOrder(orderId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Mutation(() => OrderItem)
  updateOrderItem(
    @Args('updateOrderItemInput') updateOrderItemInput: UpdateOrderItemInput,
  ) {
    return this.orderItemService.update(
      updateOrderItemInput.id,
      updateOrderItemInput,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Mutation(() => OrderItem)
  removeOrderItem(@Args('id', { type: () => ID }) id: string) {
    return this.orderItemService.remove(id);
  }

  // Field Resolvers
  @ResolveField(() => Order)
  async order(@Parent() orderItem: OrderItem) {
    return this.prisma.order.findUnique({
      where: { id: orderItem.orderId },
    });
  }

  @ResolveField(() => Product)
  async product(@Parent() orderItem: OrderItem) {
    return this.prisma.product.findUnique({
      where: { id: orderItem.productId },
    });
  }
}
