import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';
import { RegisterDto } from './dto/register.dto.js';
import { Roles } from './decorators/roles.decorator.js';
import { RoleGuard } from '../guards/role.guard.js';

interface AuthenticatedRequest extends Request {
  user: {
    userId: number;
    username: string;
    email: string;
    role: 'CUSTOMER' | 'FARMER' | 'ADMIN';
  };
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.signIn(loginDto.email, loginDto.password);
  }

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('CUSTOMER', 'FARMER', 'ADMIN')
  getProfile(@Req() request: AuthenticatedRequest) {
    return request.user;
  }
}
