import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserInput } from './dto/create-user.input';
import { LoginInput } from './dto/login.input';
import * as bcrypt from 'bcryptjs';
import { UserEntity } from './users.entity';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async signup(createUserInput: CreateUserInput): Promise<{ message: string; userId: number }> {
        const { firstName, lastName, email, phoneNumber, address, password, confirmPassword } = createUserInput;

        if (password !== confirmPassword) {
            throw new Error('Passwords do not match');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await this.prisma.user.create({
            data: {
                firstName,
                lastName,
                email,
                phoneNumber,
                address,
                password: hashedPassword,
                confirmPassword: hashedPassword,
            },
        });

        return { message: 'User created successfully', userId: user.id };
    }


    async getAllUsers(): Promise<UserEntity[]> {
        return this.prisma.user.findMany();
    }

    async getUserById(userId: number) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new NotFoundException(`User with ID ${userId} not found`);
        }
        return user;
    }

    async login(loginInput: LoginInput): Promise<{ userId: number }> {
        const { email, password } = loginInput;

        const user = await this.prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            throw new Error('Invalid email or password');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new Error('Invalid email or password');
        }

        return { userId: user.id };
    }

}
