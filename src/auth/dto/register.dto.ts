import { IsString, MinLength } from 'class-validator';
import { CreateUserDto } from '../../user/dto/create-user.dto.js';

export class RegisterDto extends CreateUserDto {
  @IsString()
  @MinLength(8)
  password: string;
}
