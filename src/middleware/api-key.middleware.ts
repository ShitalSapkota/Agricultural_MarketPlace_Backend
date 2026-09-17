import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class ApiKeyMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const apiKey = req.headers['x-api-key'];
    if (apiKey !== 'secret-api-key123') {
      // apiKey is for testing purpose only, in production it should be stored in environment variables or a secure vault
      throw new UnauthorizedException('Invalid API key');
    }
    next();
  }
}
