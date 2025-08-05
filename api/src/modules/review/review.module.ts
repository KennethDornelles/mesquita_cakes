import { Module } from '@nestjs/common';
import { PrismaModule } from '../../database/prisma/prisma.module';
import { ReviewService } from './review.service';
import { ReviewResolver } from './review.resolver';

@Module({
  imports: [PrismaModule],
  providers: [ReviewResolver, ReviewService],
  exports: [ReviewService],
})
export class ReviewModule {}
