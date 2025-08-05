import { Module } from '@nestjs/common';
import { ProductIngredientService } from './product-ingredient.service';
import { ProductIngredientResolver } from './product-ingredient.resolver';
import { PrismaModule } from '../../database/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [ProductIngredientResolver, ProductIngredientService],
  exports: [ProductIngredientService],
})
export class ProductIngredientModule {}
