import { Module } from '@nestjs/common';
import { IngredientService } from './ingredient.service';
import { IngredientResolver } from './ingredient.resolver';

@Module({
  providers: [IngredientResolver, IngredientService],
})
export class IngredientModule {}
