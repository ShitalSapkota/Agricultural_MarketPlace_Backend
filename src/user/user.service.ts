import { Injectable, NotFoundException } from '@nestjs/common';
import { db } from '../prisma/db.js';
import { LoggerService } from './user.logger.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';

type DatabaseUser = NonNullable<
  Awaited<ReturnType<typeof db.orm.public.User.first>>
>;

type CreateUserData = CreateUserDto & {
  passwordHash: string;
};
export type User = DatabaseUser;
export type SafeUser = Omit<DatabaseUser, 'passwordHash'>;

@Injectable()
export class UserService {
  constructor(private readonly logger: LoggerService) {}

  private toSafeUser(user: DatabaseUser): SafeUser {
    const { passwordHash: _, ...safeUser } = user;
    return safeUser;
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    const user = await db.orm.public.User.where((record) =>
      record.email.eq(email),
    ).first();

    return user ?? undefined;
  }

  async createUser(createUserDto: CreateUserData): Promise<SafeUser> {
    const user = await db.orm.public.User.create(createUserDto);

    this.logger.log(`Created user ${user.id}`);

    const { passwordHash: _, ...safeUser } = user;
    return safeUser;
  }

  async findAllUsers(name?: string): Promise<SafeUser[]> {
    this.logger.log('Fetching all users');

    const users = name
      ? await db.orm.public.User.where((user) =>
          user.name.ilike(`%${name}%`),
        ).all()
      : await db.orm.public.User.all();

    return users.map((user) => this.toSafeUser(user));
  }

  async findOneUser(id: number): Promise<SafeUser> {
    const user = await db.orm.public.User.first({ id });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return this.toSafeUser(user);
  }

  async updateUser(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<SafeUser> {
    await this.findOneUser(id);

    const user = await db.orm.public.User.where({ id }).update(updateUserDto);

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    this.logger.log(`Updated user ${id}`);
    return this.toSafeUser(user);
  }

  async deleteUser(id: number): Promise<SafeUser> {
    const user = await db.orm.public.User.first({ id });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    await db.orm.public.User.where({ id }).delete();

    this.logger.log(`Deleted user ${id}`);
    return this.toSafeUser(user);
  }
}
