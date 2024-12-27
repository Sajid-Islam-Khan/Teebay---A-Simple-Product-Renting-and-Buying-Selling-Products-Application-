import { ObjectType, Field, Int } from '@nestjs/graphql';
import { IsString, IsEmail, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

@ObjectType()
export class UserEntity {
    @Field(() => Int)
    id: number;

    @Field()
    firstName: string;

    @Field()
    lastName: string;

    @Field()
    email: string;

    @Field()
    phoneNumber: string;

    @Field()
    address: string;

    @Field()
    password: string;

    @Field()
    confirmPassword: string;
}
