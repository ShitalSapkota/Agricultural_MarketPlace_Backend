import { Test, TestingModule } from '@nestjs/testing';
import { hash } from 'bcrypt';
import { db } from '../prisma/db.js';
import { UserService } from './user.service.js';
import { LoggerService } from './user.logger.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';

describe('UserService', () => {
  let service: UserService;
  let johnId: number;
  let janeId: number;
  const createdIds: number[] = [];
  const testSuffix = `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  beforeEach(async () => {
    const passwordHash = await hash('test-password', 10);
    const john = await db.orm.public.User.create({
      name: 'John Doe',
      email: `john.${testSuffix}@example.com`,
      passwordHash,
    });
    const jane = await db.orm.public.User.create({
      name: 'Jane Smith',
      email: `jane.${testSuffix}@example.com`,
      passwordHash,
    });

    johnId = john.id;
    janeId = jane.id;
    createdIds.push(johnId, janeId);

    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, LoggerService],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  afterEach(async () => {
    for (const id of createdIds.splice(0)) {
      await db.orm.public.User.where({ id }).delete();
    }
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('finds a user by ID', async () => {
    await expect(service.findOneUser(johnId)).resolves.toMatchObject({
      id: johnId,
      name: 'John Doe',
    });
  });

  it('creates a user', async () => {
    const create: CreateUserDto = {
      name: 'Alice Johnson',
      email: `alice.${testSuffix}@example.com`,
      passwordHash: await hash('test-password', 10),
    };

    const user = await service.createUser(create);
    createdIds.push(user.id);

    expect(user).toMatchObject({
      name: create.name,
      email: create.email,
    });
    expect(user).not.toHaveProperty('passwordHash');
  });

  it('updates a user', async () => {
    const update: UpdateUserDto = { name: 'Johnny Doe' };

    await expect(service.updateUser(johnId, update)).resolves.toMatchObject({
      id: johnId,
      name: 'Johnny Doe',
    });
  });

  it('deletes a user', async () => {
    await service.deleteUser(janeId);

    await expect(service.findOneUser(janeId)).rejects.toThrow(
      `User with ID ${janeId} not found`,
    );
  });

  it('throws when a user does not exist', async () => {
    await expect(service.findOneUser(-1)).rejects.toThrow(
      'User with ID -1 not found',
    );
  });
});
