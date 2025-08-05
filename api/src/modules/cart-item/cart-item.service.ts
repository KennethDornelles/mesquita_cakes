import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';
import { CreateCartItemInput } from './dto/create-cart-item.input';
import { UpdateCartItemInput } from './dto/update-cart-item.input';
import { CartItem } from './entities/cart-item.entity';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class CartItemService {
  constructor(private prisma: PrismaService) {}

  async addToCart(
    createCartItemInput: CreateCartItemInput,
    userId: string,
  ): Promise<CartItem> {
    const { productId, quantity } = createCartItemInput;

    // Verificar se o produto existe e está ativo
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    if (!product.active) {
      throw new ConflictException('Product is not available');
    }

    // Verificar se há estoque suficiente
    if (product.stock < quantity) {
      throw new ConflictException(
        `Insufficient stock. Available: ${product.stock}, requested: ${quantity}`,
      );
    }

    // Verificar se já existe um item no carrinho para este produto
    const existingCartItem = await this.prisma.cartItem.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    let cartItem;

    if (existingCartItem) {
      // Se já existe, atualizar a quantidade
      const newQuantity = existingCartItem.quantity + quantity;

      // Verificar se a nova quantidade não excede o estoque
      if (product.stock < newQuantity) {
        throw new ConflictException(
          `Insufficient stock. Available: ${product.stock}, total requested: ${newQuantity}`,
        );
      }

      cartItem = await this.prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: {
          quantity: newQuantity,
          priceSnapshot: product.price,
        },
        include: {
          user: true,
          product: {
            include: {
              category: true,
              ingredients: {
                include: {
                  ingredient: true,
                },
              },
              reviews: {
                include: {
                  user: true,
                },
              },
              orderItems: true,
            },
          },
        },
      });
    } else {
      // Se não existe, criar novo
      cartItem = await this.prisma.cartItem.create({
        data: {
          userId,
          productId,
          quantity,
          priceSnapshot: product.price,
        },
        include: {
          user: true,
          product: {
            include: {
              category: true,
              ingredients: {
                include: {
                  ingredient: true,
                },
              },
              reviews: {
                include: {
                  user: true,
                },
              },
              orderItems: true,
            },
          },
        },
      });
    }

    return this.mapPrismaToCartItem(cartItem);
  }

  async getUserCart(userId: string): Promise<CartItem[]> {
    const cartItems = await this.prisma.cartItem.findMany({
      where: { userId },
      include: {
        user: true,
        product: {
          include: {
            category: true,
            ingredients: {
              include: {
                ingredient: true,
              },
            },
            reviews: {
              include: {
                user: true,
              },
            },
            orderItems: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return cartItems.map((item) => this.mapPrismaToCartItem(item));
  }

  async getCartSummary(userId: string) {
    const cartItems = await this.getUserCart(userId);

    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cartItems.reduce(
      (sum, item) => sum + item.totalPrice,
      0,
    );

    return {
      items: cartItems,
      totalItems,
      totalPrice,
      itemCount: cartItems.length,
    };
  }

  async findOne(id: string, userId: string): Promise<CartItem> {
    const cartItem = await this.prisma.cartItem.findUnique({
      where: { id },
      include: {
        user: true,
        product: {
          include: {
            category: true,
            ingredients: {
              include: {
                ingredient: true,
              },
            },
            reviews: {
              include: {
                user: true,
              },
            },
            orderItems: true,
          },
        },
      },
    });

    if (!cartItem) {
      throw new NotFoundException(`Cart item with ID ${id} not found`);
    }

    // Verificar se o item pertence ao usuário
    if (cartItem.userId !== userId) {
      throw new ForbiddenException('You can only access your own cart items');
    }

    return this.mapPrismaToCartItem(cartItem);
  }

  async updateQuantity(
    updateCartItemInput: UpdateCartItemInput,
    userId: string,
  ): Promise<CartItem> {
    const { id, quantity } = updateCartItemInput;

    const existingCartItem = await this.prisma.cartItem.findUnique({
      where: { id },
      include: {
        product: true,
      },
    });

    if (!existingCartItem) {
      throw new NotFoundException(`Cart item with ID ${id} not found`);
    }

    // Verificar se o item pertence ao usuário
    if (existingCartItem.userId !== userId) {
      throw new ForbiddenException('You can only update your own cart items');
    }

    // Verificar se há estoque suficiente
    if (existingCartItem.product.stock < quantity) {
      throw new ConflictException(
        `Insufficient stock. Available: ${existingCartItem.product.stock}, requested: ${quantity}`,
      );
    }

    const cartItem = await this.prisma.cartItem.update({
      where: { id },
      data: {
        quantity,
        priceSnapshot: existingCartItem.product.price,
      },
      include: {
        user: true,
        product: {
          include: {
            category: true,
            ingredients: {
              include: {
                ingredient: true,
              },
            },
            reviews: {
              include: {
                user: true,
              },
            },
            orderItems: true,
          },
        },
      },
    });

    return this.mapPrismaToCartItem(cartItem);
  }

  async removeFromCart(id: string, userId: string): Promise<CartItem> {
    const existingCartItem = await this.prisma.cartItem.findUnique({
      where: { id },
      include: {
        user: true,
        product: {
          include: {
            category: true,
            ingredients: {
              include: {
                ingredient: true,
              },
            },
            reviews: {
              include: {
                user: true,
              },
            },
            orderItems: true,
          },
        },
      },
    });

    if (!existingCartItem) {
      throw new NotFoundException(`Cart item with ID ${id} not found`);
    }

    // Verificar se o item pertence ao usuário
    if (existingCartItem.userId !== userId) {
      throw new ForbiddenException('You can only delete your own cart items');
    }

    const cartItem = await this.prisma.cartItem.delete({
      where: { id },
      include: {
        user: true,
        product: {
          include: {
            category: true,
            ingredients: {
              include: {
                ingredient: true,
              },
            },
            reviews: {
              include: {
                user: true,
              },
            },
            orderItems: true,
          },
        },
      },
    });

    return this.mapPrismaToCartItem(cartItem);
  }

  async clearCart(userId: string): Promise<{ count: number }> {
    const result = await this.prisma.cartItem.deleteMany({
      where: { userId },
    });

    return { count: result.count };
  }

  async removeProductFromAllCarts(
    productId: string,
  ): Promise<{ count: number }> {
    const result = await this.prisma.cartItem.deleteMany({
      where: { productId },
    });

    return { count: result.count };
  }

  private mapPrismaToCartItem(prismaCartItem: any): CartItem {
    const priceToUse =
      prismaCartItem.priceSnapshot || prismaCartItem.product.price;
    const totalPrice =
      this.decimalToNumber(priceToUse) * prismaCartItem.quantity;

    return {
      id: prismaCartItem.id,
      quantity: prismaCartItem.quantity,
      priceSnapshot: prismaCartItem.priceSnapshot
        ? this.decimalToNumber(prismaCartItem.priceSnapshot)
        : undefined,
      userId: prismaCartItem.userId,
      productId: prismaCartItem.productId,
      createdAt: prismaCartItem.createdAt,
      updatedAt: prismaCartItem.updatedAt,
      user: prismaCartItem.user,
      product: prismaCartItem.product,
      totalPrice,
    };
  }

  private decimalToNumber(decimal: Decimal | number): number {
    if (typeof decimal === 'number') {
      return decimal;
    }
    return parseFloat(decimal.toString());
  }
}
