// src/products/product.resolver.ts
import { Resolver, Mutation, Args, Query, Int } from '@nestjs/graphql';
import { ProductService } from './product.service';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { Product } from './product.entity';

@Resolver(() => Product)
export class ProductResolver {
    constructor(private readonly productService: ProductService) { }

    @Mutation(() => Product)
    async createProduct(
        @Args('createProductInput') createProductInput: CreateProductInput,
    ): Promise<Product> {
        return this.productService.create(createProductInput);
    }

    // Query to fetch all products with their categories
    @Query(() => [Product])
    async getAllProducts(): Promise<Product[]> {
        return this.productService.getAllProducts();
    }

    // Query to fetch a single product by ID with its categories
    @Query(() => Product)
    async getProductById(@Args('id') id: number): Promise<Product> {
        return this.productService.getProductById(id);
    }

    @Mutation(() => Product)
    async updateProduct(
        @Args('id', { type: () => Int }) id: number, // Product ID to update
        @Args('updateProductInput') updateProductInput: UpdateProductInput, // New data to update
    ): Promise<Product> {
        return this.productService.updateProduct(id, updateProductInput);
    }

    @Mutation(() => Product)
    async deleteProduct(
        @Args('id', { type: () => Int }) id: number,
    ): Promise<Product> {
        return this.productService.deleteProduct(id);
    }

    // In your GraphQL Resolver
    @Query(() => [Product])
    async getProductsByOwner(
        @Args('ownerId', { type: () => Int }) ownerId: number
    ): Promise<Product[]> {
        return this.productService.getProductsByOwner(ownerId);
    }


    // Mutation to buy a product
    @Mutation(() => Product)
    async buyProduct(
        @Args('productId', { type: () => Int }) productId: number,
        @Args('buyerId', { type: () => Int }) buyerId: number,
    ): Promise<Product> {
        return this.productService.buyProduct(productId, buyerId);
    }

    // Mutation to rent a product
    @Mutation(() => Product)
    async rentProduct(
        @Args('productId', { type: () => Int }) productId: number,
        @Args('renterId', { type: () => Int }) renterId: number,
        @Args('rentDuration', { type: () => Int }) rentDuration: number, // Rent duration in days
    ): Promise<Product> {
        return this.productService.rentProduct(productId, renterId, rentDuration);
    }

    //Sold Products
    @Query(() => [Product])
    async getSoldProductsByOwner(
        @Args('ownerId', { type: () => Int }) ownerId: number
    ): Promise<Product[]> {
        return this.productService.getSoldProductsByOwner(ownerId);
    }

    // Lent Products
    @Query(() => [Product])
    async getRentedProductsByOwner(
        @Args('ownerId', { type: () => Int }) ownerId: number
    ): Promise<Product[]> {
        return this.productService.getRentedProductsByOwner(ownerId);
    }

    // Bought Products
    @Query(() => [Product])
    async getBoughtProductsByUser(
        @Args('buyerId', { type: () => Int }) buyerId: number
    ): Promise<Product[]> {
        return this.productService.getBoughtProductsByUser(buyerId);
    }

    // Borrowed Products
    @Query(() => [Product])
    async getBorrowedProductsByUser(
        @Args('renterId', { type: () => Int }) renterId: number
    ): Promise<Product[]> {
        return this.productService.getBorrowedProductsByUser(renterId);
    }

}
