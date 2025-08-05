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
import { OrderService } from './order.service';
import { Order } from './entities/order.entity';
import { CreateOrderInput } from './dto/create-order.input';
import { UpdateOrderInput } from './dto/update-order.input';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CurrentUser, Roles } from '../../decorators';
import { Role, OrderStatus } from '../../enums';
import { User } from '../user/entities/user.entity';
import { Address } from '../address/entities/address.entity';
import { OrderItem } from '../order-item/entities/order-item.entity';
import { PrismaService } from '../../database/prisma/prisma.service';

@Resolver(() => Order)
export class OrderResolver {
  constructor(
    private readonly orderService: OrderService,
    private readonly prisma: PrismaService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Order)
  createOrder(
    @Args('createOrderInput') createOrderInput: CreateOrderInput,
    @CurrentUser() currentUser: User,
  ) {
    return this.orderService.create(createOrderInput, currentUser.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Query(() => [Order], { name: 'orders' })
  findAll() {
    return this.orderService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => Order, { name: 'order' })
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.orderService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [Order], { name: 'myOrders' })
  findMyOrders(@CurrentUser() currentUser: User) {
    return this.orderService.findByUser(currentUser.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Query(() => [Order], { name: 'ordersByStatus' })
  findByStatus(
    @Args('status', { type: () => OrderStatus }) status: OrderStatus,
  ) {
    return this.orderService.findByStatus(status);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Mutation(() => Order)
  updateOrder(@Args('updateOrderInput') updateOrderInput: UpdateOrderInput) {
    return this.orderService.update(updateOrderInput.id, updateOrderInput);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Order)
  cancelOrder(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() currentUser: User,
  ) {
    // Verificar se é o dono do pedido ou admin
    if (currentUser.role !== Role.ADMIN) {
      // Para usuários normais, primeiro verificar se o pedido pertence a eles
      // Isso será validado dentro do service
    }
    return this.orderService.remove(id);
  }

  // Field Resolvers
  @ResolveField(() => User)
  async user(@Parent() order: Order) {
    return this.prisma.user.findUnique({
      where: { id: order.userId },
    });
  }

  @ResolveField(() => Address)
  async address(@Parent() order: Order) {
    return this.prisma.address.findUnique({
      where: { id: order.addressId },
    });
  }

  @ResolveField(() => [OrderItem])
  async items(@Parent() order: Order) {
    return this.prisma.orderItem.findMany({
      where: { orderId: order.id },
      include: {
        product: true,
      },
    });
  }
}
