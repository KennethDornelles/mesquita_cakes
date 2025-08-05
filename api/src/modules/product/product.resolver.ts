import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { ProductService } from './product.service';
import { Product } from './entities/product.entity';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';

@Resolver(() => Product)
export class ProductResolver {
  constructor(private readonly productService: ProductService) {}

  @Mutation(() => Product)
  createProduct(
    @Args('createProductInput') createProductInput: CreateProductInput,
  ) {
    return this.productService.create(createProductInput);
  }

  @Query(() => [Product], { name: 'products' })
  findAll() {
    return this.productService.findAll();
  }

  @Query(() => Product, { name: 'product' })
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.productService.findOne(id);
  }

  @Query(() => Product, { name: 'productBySlug', nullable: true })
  findBySlug(@Args('slug') slug: string) {
    return this.productService.findBySlug(slug);
  }

  @Query(() => [Product], { name: 'productsByCategory' })
  findByCategory(@Args('categoryId', { type: () => ID }) categoryId: string) {
    return this.productService.findByCategory(categoryId);
  }

  @Query(() => [Product], { name: 'featuredProducts' })
  findFeatured() {
    return this.productService.findFeatured();
  }

  @Mutation(() => Product)
  updateProduct(
    @Args('updateProductInput') updateProductInput: UpdateProductInput,
  ) {
    return this.productService.update(
      updateProductInput.id,
      updateProductInput,
    );
  }

  @Mutation(() => Product)
  removeProduct(@Args('id', { type: () => ID }) id: string) {
    return this.productService.remove(id);
  }

  @Mutation(() => Product)
  updateProductStock(
    @Args('id', { type: () => ID }) id: string,
    @Args('quantity') quantity: number,
  ) {
    return this.productService.updateStock(id, quantity);
  }
}
