import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
  ObjectType,
  Field,
  Int,
  Float,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CartItemService } from './cart-item.service';
import { CartItem } from './entities/cart-item.entity';
import { CreateCartItemInput } from './dto/create-cart-item.input';
import { UpdateCartItemInput } from './dto/update-cart-item.input';
import { User } from '../user/entities/user.entity';
import { Product } from '../product/entities/product.entity';
import { PrismaService } from '../../database/prisma/prisma.service';

@ObjectType()
export class CartSummary {
  @Field(() => [CartItem])
  items: CartItem[];

  @Field(() => Int)
  totalItems: number;

  @Field(() => Float)
  totalPrice: number;

  @Field(() => Int)
  itemCount: number;
}

@ObjectType()
export class CartClearResult {
  @Field(() => Int)
  count: number;
}

@Resolver(() => CartItem)
export class CartItemResolver {
  constructor(
    private readonly cartItemService: CartItemService,
    private readonly prisma: PrismaService,
  ) {}

  @Mutation(() => CartItem)
  @UseGuards(JwtAuthGuard)
  addToCart(
    @Args('createCartItemInput') createCartItemInput: CreateCartItemInput,
    @CurrentUser() user: User,
  ) {
    return this.cartItemService.addToCart(createCartItemInput, user.id);
  }

  @Query(() => [CartItem], { name: 'myCart' })
  @UseGuards(JwtAuthGuard)
  getUserCart(@CurrentUser() user: User) {
    return this.cartItemService.getUserCart(user.id);
  }

  @Query(() => CartSummary, { name: 'cartSummary' })
  @UseGuards(JwtAuthGuard)
  getCartSummary(@CurrentUser() user: User) {
    return this.cartItemService.getCartSummary(user.id);
  }

  @Query(() => CartItem, { name: 'cartItem' })
  @UseGuards(JwtAuthGuard)
  findOne(
    @Args('id', { type: () => String }) id: string,
    @CurrentUser() user: User,
  ) {
    return this.cartItemService.findOne(id, user.id);
  }

  @Mutation(() => CartItem)
  @UseGuards(JwtAuthGuard)
  updateCartItem(
    @Args('updateCartItemInput') updateCartItemInput: UpdateCartItemInput,
    @CurrentUser() user: User,
  ) {
    return this.cartItemService.updateQuantity(updateCartItemInput, user.id);
  }

  @Mutation(() => CartItem)
  @UseGuards(JwtAuthGuard)
  removeFromCart(
    @Args('id', { type: () => String }) id: string,
    @CurrentUser() user: User,
  ) {
    return this.cartItemService.removeFromCart(id, user.id);
  }

  @Mutation(() => CartClearResult)
  @UseGuards(JwtAuthGuard)
  clearCart(@CurrentUser() user: User) {
    return this.cartItemService.clearCart(user.id);
  }

  @ResolveField(() => User)
  async user(@Parent() cartItem: CartItem): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id: cartItem.userId },
    });
    return user as any;
  }

  @ResolveField(() => Product)
  async product(@Parent() cartItem: CartItem): Promise<Product> {
    const product = await this.prisma.product.findUnique({
      where: { id: cartItem.productId },
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
    });
    return product as any;
  }

  @ResolveField(() => Float)
  totalPrice(@Parent() cartItem: CartItem): number {
    return cartItem.totalPrice;
  }
}
