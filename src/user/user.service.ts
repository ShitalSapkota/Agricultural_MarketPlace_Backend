import { Injectable, NotFoundException } from '@nestjs/common';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { LoggerService } from './user.logger.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';

export interface User {
  id: number;
  name: string;
  email: string;
}

@Injectable()
export class UserService {
  constructor(private readonly logger: LoggerService) {}

  private readonly usersFilePath = resolve(
    process.cwd(),
    'src/user/data/users.json',
  );
  private users: User[] = this.loadUsers();

  private loadUsers(): User[] {
    return JSON.parse(readFileSync(this.usersFilePath, 'utf8')) as User[];
  }

  private saveUsers(): void {
    writeFileSync(
      this.usersFilePath,
      `${JSON.stringify(this.users, null, 2)}\n`,
    );
  }

  private findUserIndex(id: number): number {
    const index = this.users.findIndex((user) => user.id === id);

    if (index === -1) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return index;
  }

  findAllUsers(name?: string): User[] {
    this.logger.log('Fetching all users');
    if (name) {
      return this.users.filter((user) =>
        user.name.toLowerCase().includes(name.toLowerCase()),
      );
    }
    return this.users;
  }

  createUser(createUserDto: CreateUserDto): User {
    const newUser: User = {
      id: this.users.length
        ? Math.max(...this.users.map((user) => user.id)) + 1
        : 1,
      ...createUserDto,
    };

    this.users.push(newUser);
    this.saveUsers();
    this.logger.log(`Created user ${newUser.id}`);
    return newUser;
  }

  findOneUser(id: number): User {
    return this.users[this.findUserIndex(id)];
  }

  updateUser(id: number, updateUserDto: UpdateUserDto): User {
    const user = this.findOneUser(id);
    Object.assign(user, updateUserDto);
    this.saveUsers();
    this.logger.log(`Updated user ${id}`);
    return user;
  }

  deleteUser(id: number): User {
    const index = this.findUserIndex(id);
    const [deletedUser] = this.users.splice(index, 1);

    this.saveUsers();
    this.logger.log(`Deleted user ${id}`);
    return deletedUser;
  }
}
