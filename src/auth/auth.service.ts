import { Injectable, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateAuthDto } from './dto/create-auth.dto';
import { User } from 'src/interface/user.interface';
import * as bcrypt from 'bcrypt';
import { omit } from 'lodash';
import Redis from 'ioredis';

@Injectable()
export class AuthService {
  constructor(
    @Inject('REDIS_CLIENT') private readonly redisClient: Redis,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<Omit<User, 'password'> | null> {
    const userString = await this.redisClient.get(`user:${email}`);
    if (userString) {
      const user = JSON.parse(userString) as User;
      if (await bcrypt.compare(password, user.password)) {
        return omit(user, ['password']);
      }
    }
    return null;
  }

  async login(createAuthDto: CreateAuthDto) {
    if (!createAuthDto.email || !createAuthDto.password) {
      throw new Error('Email e senha são obrigatórios');
    }
    const user = await this.validateUser(
      createAuthDto.email,
      createAuthDto.password,
    );

    if (!user) {
      throw new Error('Credenciais inválidas');
    }
    const payload = {
      email: user.email,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(createAuthDto: CreateAuthDto) {
    const existingUser = await this.redisClient.get(
      `user:${createAuthDto.email}`,
    );

    if (existingUser) {
      throw new Error('Usuário já existe');
    }

    const hashedPassword = await bcrypt.hash(createAuthDto.password, 10);
    const newUser = await this.redisClient.set(
      `e-mail:${createAuthDto.email}`,
      `password:${hashedPassword}`,
    );

    return omit([newUser, 'password']);
  }

  async logout(createAuthDto: CreateAuthDto) {
    await this.redisClient.del(
      `email:${createAuthDto.email}`,
      `password:${createAuthDto.password}`,
    );
  }
}
