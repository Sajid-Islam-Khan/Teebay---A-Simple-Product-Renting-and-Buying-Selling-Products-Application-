import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import { Category } from './category.entity';

@ObjectType()
export class Product {
    @Field(() => Int)
    id: number;

    @Field()
    name: string;

    @Field()
    description: string;

    @Field(() => Float)
    price: number;

    @Field(() => Float)
    rentalPrice: number;

    @Field()
    isForSale: boolean;

    @Field()
    isForRent: boolean;

    @Field()
    status: string; // AVAILABLE, SOLD, RENTED

    @Field(() => Int)
    ownerId: number;

    @Field(() => [Category])
    categories: Category[];
}
