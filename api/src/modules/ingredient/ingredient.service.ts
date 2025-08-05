import { Injectable } from '@nestjs/common';
import { CreateIngredientInput } from './dto/create-ingredient.input';
import { UpdateIngredientInput } from './dto/update-ingredient.input';

@Injectable()
export class IngredientService {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  create(createIngredientInput: CreateIngredientInput) {
    return 'This action adds a new ingredient';
  }

  findAll() {
    return `This action returns all ingredient`;
  }

  findOne(id: number) {
    return `This action returns a #${id} ingredient`;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(id: number, updateIngredientInput: UpdateIngredientInput) {
    return `This action updates a #${id} ingredient`;
  }

  remove(id: number) {
    return `This action removes a #${id} ingredient`;
  }
}
