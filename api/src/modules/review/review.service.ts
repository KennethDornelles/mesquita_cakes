import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';
import { CreateReviewInput } from './dto/create-review.input';
import { UpdateReviewInput } from './dto/update-review.input';
import { Review } from './entities/review.entity';

@Injectable()
export class ReviewService {
  constructor(private prisma: PrismaService) {}

  async create(
    createReviewInput: CreateReviewInput,
    userId: string,
  ): Promise<Review> {
    const { rating, comment, productId } = createReviewInput;

    // Verificar se o produto existe
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    // Verificar se o usuário já fez uma review para este produto
    const existingReview = await this.prisma.review.findFirst({
      where: {
        userId,
        productId,
      },
    });

    if (existingReview) {
      throw new ConflictException(
        'You have already reviewed this product. Use update instead.',
      );
    }

    const review = await this.prisma.review.create({
      data: {
        rating,
        comment,
        userId,
        productId,
      },
      include: {
        user: true,
        product: true,
      },
    });

    return this.mapPrismaToReview(review);
  }

  async findAll(): Promise<Review[]> {
    const reviews = await this.prisma.review.findMany({
      include: {
        user: true,
        product: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return reviews.map((review) => this.mapPrismaToReview(review));
  }

  async findOne(id: string): Promise<Review> {
    const review = await this.prisma.review.findUnique({
      where: { id },
      include: {
        user: true,
        product: true,
      },
    });

    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }

    return this.mapPrismaToReview(review);
  }

  async findByProductId(productId: string): Promise<Review[]> {
    const reviews = await this.prisma.review.findMany({
      where: { productId },
      include: {
        user: true,
        product: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return reviews.map((review) => this.mapPrismaToReview(review));
  }

  async findByUserId(userId: string): Promise<Review[]> {
    const reviews = await this.prisma.review.findMany({
      where: { userId },
      include: {
        user: true,
        product: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return reviews.map((review) => this.mapPrismaToReview(review));
  }

  async getProductRatingStats(productId: string) {
    const stats = await this.prisma.review.aggregate({
      where: { productId },
      _avg: { rating: true },
      _count: { rating: true },
    });

    const ratingDistribution = await this.prisma.review.groupBy({
      by: ['rating'],
      where: { productId },
      _count: { rating: true },
      orderBy: { rating: 'asc' },
    });

    return {
      averageRating: stats._avg.rating || 0,
      totalReviews: stats._count.rating,
      ratingDistribution: ratingDistribution.map((item) => ({
        rating: item.rating,
        count: item._count.rating,
      })),
    };
  }

  async update(
    id: string,
    updateReviewInput: UpdateReviewInput,
    userId: string,
  ): Promise<Review> {
    const existingReview = await this.prisma.review.findUnique({
      where: { id },
      include: {
        user: true,
        product: true,
      },
    });

    if (!existingReview) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }

    // Verificar se o usuário é o dono da review
    if (existingReview.userId !== userId) {
      throw new ForbiddenException('You can only update your own reviews');
    }

    const { rating, comment } = updateReviewInput;

    const review = await this.prisma.review.update({
      where: { id },
      data: {
        ...(rating !== undefined && { rating }),
        ...(comment !== undefined && { comment }),
      },
      include: {
        user: true,
        product: true,
      },
    });

    return this.mapPrismaToReview(review);
  }

  async remove(id: string, userId: string): Promise<Review> {
    const existingReview = await this.prisma.review.findUnique({
      where: { id },
      include: {
        user: true,
        product: true,
      },
    });

    if (!existingReview) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }

    // Verificar se o usuário é o dono da review
    if (existingReview.userId !== userId) {
      throw new ForbiddenException('You can only delete your own reviews');
    }

    const review = await this.prisma.review.delete({
      where: { id },
      include: {
        user: true,
        product: true,
      },
    });

    return this.mapPrismaToReview(review);
  }

  private mapPrismaToReview(prismaReview: any): Review {
    return {
      id: prismaReview.id,
      rating: prismaReview.rating,
      comment: prismaReview.comment,
      userId: prismaReview.userId,
      productId: prismaReview.productId,
      createdAt: prismaReview.createdAt,
      updatedAt: prismaReview.updatedAt,
      user: prismaReview.user,
      product: prismaReview.product,
    };
  }
}
