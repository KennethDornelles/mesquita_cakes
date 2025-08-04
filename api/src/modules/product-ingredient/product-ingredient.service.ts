import { Injectable } from '@nestjs/common';
import { CreateProductIngredientInput } from './dto/create-product-ingredient.input';
import { UpdateProductIngredientInput } from './dto/update-product-ingredient.input';

@Injectable()
export class ProductIngredientService {
  create(createProductIngredientInput: CreateProductIngredientInput) {
    return 'This action adds a new productIngredient';
  }

  findAll() {
    return `This action returns all productIngredient`;
  }

  findOne(id: number) {
    return `This action returns a #${id} productIngredient`;
  }

  update(id: number, updateProductIngredientInput: UpdateProductIngredientInput) {
    return `This action updates a #${id} productIngredient`;
  }

  remove(id: number) {
    return `This action removes a #${id} productIngredient`;
  }
}
