import { Module } from '@nestjs/common';
import { ProductIngredientService } from './product-ingredient.service';
import { ProductIngredientResolver } from './product-ingredient.resolver';

@Module({
  providers: [ProductIngredientResolver, ProductIngredientService],
})
export class ProductIngredientModule {}
