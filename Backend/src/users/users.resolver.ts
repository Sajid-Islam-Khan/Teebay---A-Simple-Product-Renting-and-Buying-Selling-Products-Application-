import { UsePipes, ValidationPipe } from '@nestjs/common';
import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { CreateUserInput } from './dto/create-user.input';
import { UserEntity } from './users.entity';
import { LoginInput } from './dto/login.input';

@Resolver(() => UserEntity)
export class UsersResolver {
    constructor(private readonly usersService: UsersService) { }

    @Query(() => [UserEntity])
    async getUsers(): Promise<UserEntity[]> {
        return this.usersService.getAllUsers();
    }

    @Query(() => UserEntity)
    async getUserById(@Args('userId') userId: number): Promise<UserEntity> {
        return this.usersService.getUserById(userId);
    }


    @Mutation(() => String)
    @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
    async signup(@Args('signupInput') signupInput: CreateUserInput): Promise<string> {
        const result = await this.usersService.signup(signupInput);
        return result.message;
    }

    @Mutation(() => Number)
    @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
    async login(@Args('loginInput') loginInput: LoginInput): Promise<number> {
        const result = await this.usersService.login(loginInput);
        return result.userId;
    }
}
