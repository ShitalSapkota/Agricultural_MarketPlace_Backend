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
    const configuredApiKey = process.env.API_KEY;

    if (!configuredApiKey || apiKey !== configuredApiKey) {
      throw new UnauthorizedException('Invalid API key');
    }

    next();
  }
}
