import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import { User as PrismaUser } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserInput: CreateUserInput): Promise<User> {
    const { password, ...userData } = createUserInput;

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
      },
    });

    return this.mapPrismaUserToGraphQLUser(user);
  }

  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return users.map((user) => this.mapPrismaUserToGraphQLUser(user));
  }

  async findOne(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    return user ? this.mapPrismaUserToGraphQLUser(user) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    return user ? this.mapPrismaUserToGraphQLUser(user) : null;
  }

  async update(id: string, updateUserInput: UpdateUserInput): Promise<User> {
    const { password, ...userData } = updateUserInput;

    const updateData: any = { ...userData };

    // Se uma nova senha foi fornecida, fazer hash
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const user = await this.prisma.user.update({
      where: { id },
      data: updateData,
    });

    return this.mapPrismaUserToGraphQLUser(user);
  }

  async remove(id: string): Promise<User> {
    const user = await this.prisma.user.delete({
      where: { id },
    });

    return this.mapPrismaUserToGraphQLUser(user);
  }

  async validatePassword(user: User, password: string): Promise<boolean> {
    return await bcrypt.compare(password, user.password);
  }

  private mapPrismaUserToGraphQLUser(prismaUser: PrismaUser): User {
    return {
      ...prismaUser,
      role: prismaUser.role as any, // Cast necessário devido à diferença entre enums
    };
  }
}
