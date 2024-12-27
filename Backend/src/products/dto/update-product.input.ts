import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsBoolean, IsArray, IsNumber, IsOptional } from 'class-validator';

@InputType()
export class UpdateProductInput {
    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    name?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    description?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsNumber()
    price?: number;

    @Field({ nullable: true })
    @IsOptional()
    @IsNumber()
    rentalPrice?: number;

    @Field(() => [String], { nullable: true })
    @IsOptional()
    @IsArray()
    categories?: string[]; // Categories by name

    @Field({ nullable: true })
    @IsOptional()
    @IsBoolean()
    isForSale?: boolean;

    @Field({ nullable: true })
    @IsOptional()
    @IsBoolean()
    isForRent?: boolean;
}
