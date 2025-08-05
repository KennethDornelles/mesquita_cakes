import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';
import { CreateOrderInput } from './dto/create-order.input';
import { UpdateOrderInput } from './dto/update-order.input';
import { Order } from './entities/order.entity';
import { OrderStatus, PaymentStatus } from '../../enums';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async create(
    createOrderInput: CreateOrderInput,
    userId: string,
  ): Promise<Order> {
    const { items, addressId, paymentMethod, notes, deliveryDate } =
      createOrderInput;

    // Verificar se o endereço existe e pertence ao usuário
    const address = await this.prisma.address.findFirst({
      where: { id: addressId, userId },
    });

    if (!address) {
      throw new BadRequestException(
        'Address not found or does not belong to user',
      );
    }

    // Calcular totais
    let subtotal = 0;
    const orderItems: Array<{
      productId: string;
      quantity: number;
      price: Decimal;
    }> = [];

    for (const item of items) {
      const product = await this.prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) {
        throw new BadRequestException(`Product ${item.productId} not found`);
      }

      if (product.stock < item.quantity) {
        throw new BadRequestException(
          `Insufficient stock for product ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`,
        );
      }

      const itemTotal = item.price * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        price: new Decimal(item.price),
      });
    }

    // Taxa de entrega (pode ser calculada baseada no endereço ou ser fixa)
    const deliveryFee = 0; // Por enquanto gratuita

    const total = subtotal + deliveryFee;

    // Gerar número do pedido único
    const orderNumber = await this.generateOrderNumber();

    // Criar o pedido
    const order = await this.prisma.order.create({
      data: {
        orderNumber,
        status: OrderStatus.PENDING,
        total: new Decimal(total),
        subtotal: new Decimal(subtotal),
        deliveryFee: new Decimal(deliveryFee),
        paymentMethod,
        paymentStatus: PaymentStatus.PENDING,
        notes,
        deliveryDate: deliveryDate ? new Date(deliveryDate) : null,
        userId,
        addressId,
        items: {
          create: orderItems,
        },
      },
      include: {
        user: true,
        address: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    // Atualizar estoque dos produtos
    for (const item of items) {
      await this.prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });
    }

    return this.mapPrismaToOrder(order);
  }

  async findAll(): Promise<Order[]> {
    const orders = await this.prisma.order.findMany({
      include: {
        user: true,
        address: true,
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return orders.map((order) => this.mapPrismaToOrder(order));
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        user: true,
        address: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return this.mapPrismaToOrder(order);
  }

  async findByUser(userId: string): Promise<Order[]> {
    const orders = await this.prisma.order.findMany({
      where: { userId },
      include: {
        user: true,
        address: true,
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return orders.map((order) => this.mapPrismaToOrder(order));
  }

  async findByStatus(status: OrderStatus): Promise<Order[]> {
    const orders = await this.prisma.order.findMany({
      where: { status },
      include: {
        user: true,
        address: true,
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return orders.map((order) => this.mapPrismaToOrder(order));
  }

  async update(id: string, updateOrderInput: UpdateOrderInput): Promise<Order> {
    const existingOrder = await this.prisma.order.findUnique({
      where: { id },
    });

    if (!existingOrder) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    const order = await this.prisma.order.update({
      where: { id },
      data: {
        status: updateOrderInput.status,
        paymentStatus: updateOrderInput.paymentStatus,
        notes: updateOrderInput.notes,
        deliveryDate: updateOrderInput.deliveryDate
          ? new Date(updateOrderInput.deliveryDate)
          : undefined,
      },
      include: {
        user: true,
        address: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return this.mapPrismaToOrder(order);
  }

  async remove(id: string): Promise<Order> {
    const existingOrder = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
      },
    });

    if (!existingOrder) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    // Só permitir cancelamento se o pedido ainda não foi confirmado
    if (existingOrder.status !== OrderStatus.PENDING) {
      throw new BadRequestException(
        'Cannot cancel order that has already been confirmed',
      );
    }

    // Restaurar estoque dos produtos
    for (const item of existingOrder.items) {
      await this.prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            increment: item.quantity,
          },
        },
      });
    }

    const order = await this.prisma.order.delete({
      where: { id },
      include: {
        user: true,
        address: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return this.mapPrismaToOrder(order);
  }

  private async generateOrderNumber(): Promise<string> {
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');

    const orderCount = await this.prisma.order.count({
      where: {
        createdAt: {
          gte: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
          lt: new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate() + 1,
          ),
        },
      },
    });

    const orderNumber = `MC${dateStr}${String(orderCount + 1).padStart(4, '0')}`;
    return orderNumber;
  }

  private mapPrismaToOrder(prismaOrder: any): Order {
    return {
      id: prismaOrder.id,
      orderNumber: prismaOrder.orderNumber,
      status: prismaOrder.status,
      total: parseFloat(prismaOrder.total.toString()),
      subtotal: parseFloat(prismaOrder.subtotal.toString()),
      deliveryFee: parseFloat(prismaOrder.deliveryFee.toString()),
      paymentMethod: prismaOrder.paymentMethod,
      paymentStatus: prismaOrder.paymentStatus,
      notes: prismaOrder.notes,
      deliveryDate: prismaOrder.deliveryDate,
      userId: prismaOrder.userId,
      addressId: prismaOrder.addressId,
      createdAt: prismaOrder.createdAt,
      updatedAt: prismaOrder.updatedAt,
      user: prismaOrder.user,
      address: prismaOrder.address,
      items: prismaOrder.items,
    };
  }
}
