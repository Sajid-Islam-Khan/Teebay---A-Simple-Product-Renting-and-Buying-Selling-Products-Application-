// src/app.resolver.ts
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UsersService } from './users/users.service';
import { CreateUserInput } from './users/dto/create-user.input';
import { UserEntity } from './users/users.entity'; // Assuming you're using UserEntity

@Resolver(() => UserEntity) // Resolver should be for the entity class (UserEntity)
export class AppResolver {
    constructor(private userService: UsersService) { }

    @Query(() => String)
    getHello(): string {
        return 'Hello World';
    }

    @Mutation(() => String) // Mutation should return a String (success message)
    async signup(@Args('signupInput') signupInput: CreateUserInput): Promise<string> {
        const result = await this.userService.signup(signupInput);
        return result.message; // Assuming the result has a message
    }
}
