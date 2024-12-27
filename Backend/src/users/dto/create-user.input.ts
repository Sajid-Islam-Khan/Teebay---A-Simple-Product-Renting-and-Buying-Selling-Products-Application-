import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsEmail, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

@InputType()
export class CreateUserInput {
    @Field()
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @Field()
    @IsString()
    @IsNotEmpty()
    lastName: string;

    @Field()
    @IsString()
    @IsNotEmpty()
    address: string;

    @Field()
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @Field()
    @IsString()
    @IsNotEmpty()
    @MinLength(10)
    @MaxLength(15)
    phoneNumber: string;

    @Field()
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    password: string;

    @Field()
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    confirmPassword: string;
}
