import { Injectable } from '@nestjs/common';
import { CreateCartItemInput } from './dto/create-cart-item.input';
import { UpdateCartItemInput } from './dto/update-cart-item.input';

@Injectable()
export class CartItemService {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  create(createCartItemInput: CreateCartItemInput) {
    return 'This action adds a new cartItem';
  }

  findAll() {
    return `This action returns all cartItem`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cartItem`;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(id: number, updateCartItemInput: UpdateCartItemInput) {
    return `This action updates a #${id} cartItem`;
  }

  remove(id: number) {
    return `This action removes a #${id} cartItem`;
  }
}
