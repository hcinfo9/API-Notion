import {
  Injectable,
  CanActivate,
  ExecutionContext,
  SetMetadata,
} from '@nestjs/common';

import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { User } from '../../interface/user.interface';

export const IS_AUTH_OPTIONAL = 'isAuthOptional';

export const OptionalAuth = () => SetMetadata(IS_AUTH_OPTIONAL, true);

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isAuthOptional = this.reflector.getAllAndOverride<boolean>(
      IS_AUTH_OPTIONAL,
      [context.getHandler(), context.getClass()],
    );

    const request: Request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) {
      if (isAuthOptional) {
        request.user = 'anonimo';
        return true;
      }
      return false;
    }

    try {
      const decoded = this.jwtService.verify(token) as User;
      request.user = decoded;
      return true;
    } catch (error) {
      console.error('Token verification error:', error);

      if (isAuthOptional) {
        request.user = null;
        return true;
      }
      return false;
    }
  }
}
