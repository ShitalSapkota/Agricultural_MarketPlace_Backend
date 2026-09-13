import { Injectable } from '@nestjs/common';
import { LoggerService } from './user.logger.js';

interface User {
  id: string;
  name: string;
  email: string;
}

@Injectable()
export class UserService {
  constructor(private readonly logger: LoggerService) {}

  private users: User[] = [
    { id: '1', name: 'John Doe', email: 'john.doe@example.com' },
    { id: '2', name: 'Jane Smith', email: 'jane.smith@example.com' },
  ];

  findAllUsers(name?: string): User[] {
    this.logger.log('Fetching all users');
    if (name) {
      return this.users.filter((user) =>
        user.name.toLowerCase().includes(name.toLowerCase()),
      );
    }
    return this.users;
  }
}
