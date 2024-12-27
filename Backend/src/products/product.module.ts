import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductResolver } from './product.resolver';
import { PrismaService } from '../../prisma/prisma.service';
import { Category } from './category.entity'; // Import category entity to use in relations

@Module({
    imports: [],
    providers: [ProductService, ProductResolver, PrismaService],
})
export class ProductModule { }
