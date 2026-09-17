import { Test, TestingModule } from '@nestjs/testing';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { UserService } from './user.service.js';
import { LoggerService } from './user.logger.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';

describe('UserService', () => {
  let service: UserService;
  const usersFilePath = fileURLToPath(
    new URL('./data/users.json', import.meta.url),
  );
  const originalUsers = readFileSync(usersFilePath, 'utf8');
  const defaultUsers = [
    { id: 1, name: 'John Doe', email: 'john.doe@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com' },
  ];

  beforeEach(async () => {
    writeFileSync(usersFilePath, `${JSON.stringify(defaultUsers, null, 2)}\n`);

    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, LoggerService],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  afterAll(() => {
    writeFileSync(usersFilePath, originalUsers);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('finds a user by ID', () => {
    expect(service.findOneUser(1)).toEqual({
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
    });
  });

  it('creates a user', () => {
    const create: CreateUserDto = {
      name: 'Alice Johnson',
      email: 'alice.johnson@example.com',
    };

    expect(service.createUser(create)).toEqual({
      id: 3,
      ...create,
    });
  });

  it('updates a user', () => {
    const update: UpdateUserDto = { name: 'Johnny Doe' };

    expect(service.updateUser(1, update).name).toBe('Johnny Doe');
  });

  it('deletes a user', () => {
    service.deleteUser(2);

    expect(() => service.findOneUser(2)).toThrow('User with ID 2 not found');
  });

  it('throws when a user does not exist', () => {
    expect(() => service.findOneUser(99)).toThrow('User with ID 99 not found');
  });
});
