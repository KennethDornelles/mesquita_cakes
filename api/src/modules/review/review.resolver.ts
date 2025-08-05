import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ReviewService } from './review.service';
import { Review } from './entities/review.entity';
import { CreateReviewInput } from './dto/create-review.input';
import { UpdateReviewInput } from './dto/update-review.input';
import { User } from '../user/entities/user.entity';
import { Product } from '../product/entities/product.entity';
import { PrismaService } from '../../database/prisma/prisma.service';

@Resolver(() => Review)
export class ReviewResolver {
  constructor(
    private readonly reviewService: ReviewService,
    private readonly prisma: PrismaService,
  ) {}

  @Mutation(() => Review)
  @UseGuards(JwtAuthGuard)
  createReview(
    @Args('createReviewInput') createReviewInput: CreateReviewInput,
    @CurrentUser() user: User,
  ) {
    return this.reviewService.create(createReviewInput, user.id);
  }

  @Query(() => [Review], { name: 'reviews' })
  findAll() {
    return this.reviewService.findAll();
  }

  @Query(() => Review, { name: 'review' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.reviewService.findOne(id);
  }

  @Query(() => [Review], { name: 'reviewsByProduct' })
  findByProductId(
    @Args('productId', { type: () => String }) productId: string,
  ) {
    return this.reviewService.findByProductId(productId);
  }

  @Query(() => [Review], { name: 'reviewsByUser' })
  @UseGuards(JwtAuthGuard)
  findByUserId(@CurrentUser() user: User) {
    return this.reviewService.findByUserId(user.id);
  }

  @Mutation(() => Review)
  @UseGuards(JwtAuthGuard)
  updateReview(
    @Args('updateReviewInput') updateReviewInput: UpdateReviewInput,
    @CurrentUser() user: User,
  ) {
    return this.reviewService.update(
      updateReviewInput.id,
      updateReviewInput,
      user.id,
    );
  }

  @Mutation(() => Review)
  @UseGuards(JwtAuthGuard)
  removeReview(
    @Args('id', { type: () => String }) id: string,
    @CurrentUser() user: User,
  ) {
    return this.reviewService.remove(id, user.id);
  }

  @ResolveField(() => User)
  async user(@Parent() review: Review): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id: review.userId },
    });
    return user as any;
  }

  @ResolveField(() => Product)
  async product(@Parent() review: Review): Promise<Product> {
    const product = await this.prisma.product.findUnique({
      where: { id: review.productId },
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
}
