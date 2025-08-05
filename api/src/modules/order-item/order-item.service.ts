import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';
import { CreateOrderItemInput } from './dto/create-order-item.input';
import { UpdateOrderItemInput } from './dto/update-order-item.input';
import { OrderItem } from './entities/order-item.entity';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class OrderItemService {
  constructor(private prisma: PrismaService) {}

  async create(createOrderItemInput: CreateOrderItemInput): Promise<OrderItem> {
    const { orderId, productId, quantity, price } = createOrderItemInput;

    // Verificar se o pedido existe
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    // Verificar se o produto existe
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    // Verificar se há estoque suficiente
    if (product.stock < quantity) {
      throw new BadRequestException(
        `Insufficient stock for product ${product.name}. Available: ${product.stock}, Requested: ${quantity}`,
      );
    }

    // Criar o item do pedido
    const orderItem = await this.prisma.orderItem.create({
      data: {
        orderId,
        productId,
        quantity,
        price: new Decimal(price),
      },
    });

    // Atualizar estoque do produto
    await this.prisma.product.update({
      where: { id: productId },
      data: {
        stock: {
          decrement: quantity,
        },
      },
    });

    return this.mapPrismaToOrderItem(orderItem);
  }

  async findAll(): Promise<OrderItem[]> {
    const orderItems = await this.prisma.orderItem.findMany({
      include: {
        order: true,
        product: true,
      },
    });

    return orderItems.map((item) => this.mapPrismaToOrderItem(item));
  }

  async findOne(id: string): Promise<OrderItem> {
    const orderItem = await this.prisma.orderItem.findUnique({
      where: { id },
      include: {
        order: true,
        product: true,
      },
    });

    if (!orderItem) {
      throw new NotFoundException(`OrderItem with ID ${id} not found`);
    }

    return this.mapPrismaToOrderItem(orderItem);
  }

  async findByOrder(orderId: string): Promise<OrderItem[]> {
    const orderItems = await this.prisma.orderItem.findMany({
      where: { orderId },
      include: {
        order: true,
        product: true,
      },
    });

    return orderItems.map((item) => this.mapPrismaToOrderItem(item));
  }

  async update(
    id: string,
    updateOrderItemInput: UpdateOrderItemInput,
  ): Promise<OrderItem> {
    const existingOrderItem = await this.prisma.orderItem.findUnique({
      where: { id },
      include: { product: true },
    });

    if (!existingOrderItem) {
      throw new NotFoundException(`OrderItem with ID ${id} not found`);
    }

    const { quantity, price } = updateOrderItemInput;

    // Se a quantidade está sendo alterada, verificar estoque
    if (quantity && quantity !== existingOrderItem.quantity) {
      const quantityDifference = quantity - existingOrderItem.quantity;

      if (quantityDifference > 0) {
        // Aumentando quantidade - verificar se há estoque
        if (existingOrderItem.product.stock < quantityDifference) {
          throw new BadRequestException(
            `Insufficient stock for product ${existingOrderItem.product.name}. Available: ${existingOrderItem.product.stock}, Needed: ${quantityDifference}`,
          );
        }

        // Decrementar estoque
        await this.prisma.product.update({
          where: { id: existingOrderItem.productId },
          data: {
            stock: {
              decrement: quantityDifference,
            },
          },
        });
      } else {
        // Diminuindo quantidade - retornar estoque
        await this.prisma.product.update({
          where: { id: existingOrderItem.productId },
          data: {
            stock: {
              increment: Math.abs(quantityDifference),
            },
          },
        });
      }
    }

    const orderItem = await this.prisma.orderItem.update({
      where: { id },
      data: {
        quantity,
        price: price ? new Decimal(price) : undefined,
      },
      include: {
        order: true,
        product: true,
      },
    });

    return this.mapPrismaToOrderItem(orderItem);
  }

  async remove(id: string): Promise<OrderItem> {
    const existingOrderItem = await this.prisma.orderItem.findUnique({
      where: { id },
      include: { product: true },
    });

    if (!existingOrderItem) {
      throw new NotFoundException(`OrderItem with ID ${id} not found`);
    }

    // Restaurar estoque
    await this.prisma.product.update({
      where: { id: existingOrderItem.productId },
      data: {
        stock: {
          increment: existingOrderItem.quantity,
        },
      },
    });

    const orderItem = await this.prisma.orderItem.delete({
      where: { id },
      include: {
        order: true,
        product: true,
      },
    });

    return this.mapPrismaToOrderItem(orderItem);
  }

  private mapPrismaToOrderItem(prismaOrderItem: any): OrderItem {
    return {
      id: prismaOrderItem.id,
      quantity: prismaOrderItem.quantity,
      price: parseFloat(prismaOrderItem.price.toString()),
      orderId: prismaOrderItem.orderId,
      productId: prismaOrderItem.productId,
      order: prismaOrderItem.order,
      product: prismaOrderItem.product,
    };
  }
}
