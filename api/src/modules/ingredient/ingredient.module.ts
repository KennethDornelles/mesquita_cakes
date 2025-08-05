import { Module } from '@nestjs/common';
import { IngredientService } from './ingredient.service';
import { IngredientResolver } from './ingredient.resolver';
import { PrismaModule } from '../../database/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [IngredientResolver, IngredientService],
  exports: [IngredientService],
})
export class IngredientModule {}
