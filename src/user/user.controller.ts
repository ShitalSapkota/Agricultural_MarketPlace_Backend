import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { UserService } from './user.service.js';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // GET /user
  @Get()
  getUsers(@Query('name') name: string) {
    return this.userService.findAllUsers(name);

    // if (name) {
    //   return users.filter((user) =>
    //     user.name.toLowerCase().includes(name.toLowerCase()),
    //   );
    // }
  }

  // GET /user/:id
  @Get(':id')
  getUserById(@Param('id') id: string) {
    // Implementation for getting user by ID
    return { id, name: 'John Doe' }; // Example response
  }

  // POST /user
  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    // Implementation for creating a new user
    return { data: createUserDto, message: 'User created successfully' }; // Example response
  }

  // PUT /user/:id
  @Put(':id')
  updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    // Implementation for updating a user
    return { id, data: updateUserDto, message: 'User updated successfully' }; // Example response
  }

  // DELETE /user/:id
  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    // Implementation for deleting a user
  }
}
