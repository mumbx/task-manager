import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthViewMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies?.token;

    if (token) {
      try {
        const payload = this.jwtService.verify(token);
        res.locals.user = payload;
      } catch (err) {
        res.locals.user = null;
      }
    } else {
      res.locals.user = null;
    }

    next();
  }
}
