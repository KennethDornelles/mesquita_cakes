import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { CategoryModule } from './modules/category/category.module';
import { ProductModule } from './modules/product/product.module';
import { IngredientModule } from './modules/ingredient/ingredient.module';
import { ProductIngredientModule } from './modules/product-ingredient/product-ingredient.module';
import { ReviewModule } from './modules/review/review.module';
import { AddressModule } from './modules/address/address.module';
import { CartItemModule } from './modules/cart-item/cart-item.module';
import { OrderModule } from './modules/order/order.module';
import { OrderItemModule } from './modules/order-item/order-item.module';
import { PaymentModule } from './modules/payment/payment.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    CategoryModule,
    ProductModule,
    IngredientModule,
    ProductIngredientModule,
    ReviewModule,
    AddressModule,
    CartItemModule,
    OrderModule,
    OrderItemModule,
    PaymentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
