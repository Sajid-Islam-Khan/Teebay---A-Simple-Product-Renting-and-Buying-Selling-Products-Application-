// src/products/product.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Product } from './product.entity';
import { Category } from './category.entity';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';

@Injectable()
export class ProductService {
    constructor(private readonly prisma: PrismaService) { }


    // Fetch all categories
    async getCategories(): Promise<Category[]> {
        return this.prisma.category.findMany(); // Fetch categories from database
    }

    //Method to Create Products
    async create(createProductInput: CreateProductInput): Promise<Product> {
        const { categories, ownerId, ...productData } = createProductInput;
        const categoryConnections = await Promise.all(
            categories.map((categoryName) =>
                this.prisma.category.findUnique({
                    where: { name: categoryName },
                })
            )
        );
        const validCategories = categoryConnections.filter(Boolean);

        if (validCategories.length !== categories.length) {
            throw new Error('Some categories are invalid.');
        }
        const product = await this.prisma.product.create({
            data: {
                ...productData,
                ownerId,
                categories: {
                    connect: validCategories.map((category) => ({ id: category.id })),
                },
            },
            include: {
                categories: true,
            },
        });

        return product;
    }

    // Method to fetch all products with their categories
    async getAllProducts(): Promise<Product[]> {
        return this.prisma.product.findMany({
            include: {
                categories: true,
            },
        });
    }

    // Method to fetch a product by its ID with categories
    async getProductById(id: number): Promise<Product> {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: {
                categories: true,
            },
        });

        if (!product) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }

        return product;
    }

    // Method to update a product by its ID
    async updateProduct(id: number, updateProductInput: UpdateProductInput): Promise<Product> {
        const { categories, ...productData } = updateProductInput;
        const existingProduct = await this.prisma.product.findUnique({
            where: { id },
            include: { categories: true },
        });

        if (!existingProduct) {
            throw new Error('Product not found');
        }

        const categoryRecords = await this.prisma.category.findMany({
            where: {
                name: { in: categories },
            },
        });

        const updatedProduct = await this.prisma.product.update({
            where: { id },
            data: {
                ...productData,
                categories: {
                    set: categoryRecords.map((category) => ({ id: category.id })),
                },
            },
            include: { categories: true },
        });

        return updatedProduct;
    }

    async deleteProduct(id: number): Promise<Product> {
        // Delete associated transactions first
        await this.prisma.transaction.deleteMany({
            where: { productId: id },
        });

        // Then delete the product
        return this.prisma.product.delete({
            where: { id },
            include: { categories: true },
        });
    }

    // Method to find products by Owner id
    async getProductsByOwner(ownerId: number): Promise<Product[]> {
        const products = await this.prisma.product.findMany({
            where: { ownerId },
            include: {
                categories: true,
            },
        });
        return products;
    }



    //Method to Buy a Product
    async buyProduct(productId: number, buyerId: number): Promise<Product> {
        const product = await this.prisma.product.update({
            where: { id: productId },
            data: {
                status: 'SOLD',
                isForSale: false,
                isForRent: false,
            },
            include: {
                categories: true,
            },
        });

        await this.prisma.transaction.create({
            data: {
                productId,
                buyerId,
                type: 'BUY',
            },
        });

        return product;
    }


    async rentProduct(
        productId: number,
        renterId: number,
        rentDuration: number,
    ): Promise<Product> {
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
            include: { categories: true },
        });

        if (!product) {
            throw new Error('Product not found.');
        }

        if (!product.isForRent) {
            throw new Error('This product is not available for rent.');
        }

        const updatedProduct = await this.prisma.product.update({
            where: { id: productId },
            data: {
                status: 'RENTED',
                isForRent: false,
            },
            include: { categories: true },
        });

        await this.prisma.transaction.create({
            data: {
                productId,
                renterId,
                type: 'RENT',
                createdAt: new Date(),
            },
        });

        return updatedProduct;
    }

    // Method to see sold products by owner
    async getSoldProductsByOwner(ownerId: number): Promise<Product[]> {
        const soldProducts = await this.prisma.product.findMany({
            where: {
                ownerId,
                status: 'SOLD',
            },
            include: {
                categories: true,
            },
        });
        return soldProducts;
    }

    // Method to see lent products by owner
    async getRentedProductsByOwner(ownerId: number): Promise<Product[]> {
        const rentedProducts = await this.prisma.product.findMany({
            where: {
                ownerId,
                status: 'RENTED',
            },
            include: {
                categories: true,
            },
        });
        return rentedProducts;
    }

    // Method to see bought products by owner
    async getBoughtProductsByUser(buyerId: number): Promise<Product[]> {
        const transactions = await this.prisma.transaction.findMany({
            where: {
                buyerId,
                type: 'BUY',
            },
            include: {
                product: {
                    include: {
                        categories: true,
                    },
                },
            },
        });

        const products = transactions.map((transaction) => transaction.product);

        return products;
    }

    // Method to see borrowed products by owner
    async getBorrowedProductsByUser(renterId: number): Promise<Product[]> {
        const transactions = await this.prisma.transaction.findMany({
            where: {
                renterId,
                type: 'RENT',
            },
            include: {
                product: {
                    include: {
                        categories: true,
                    },
                },
            },
        });


        const products = transactions.map((transaction) => transaction.product);

        return products;
    }


}
