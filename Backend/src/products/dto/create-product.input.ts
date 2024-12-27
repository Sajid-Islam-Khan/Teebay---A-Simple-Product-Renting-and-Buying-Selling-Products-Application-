import { InputType, Field, Int, Float } from '@nestjs/graphql';
import { Category } from '../category.entity';

@InputType()
export class CreateProductInput {
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

    @Field(() => [String])
    categories: string[]; // Array of category names

    @Field(() => Int)
    ownerId: number;
}
