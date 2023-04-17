import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';

import {
  ExpirationJwtCustom,
  TokenPayload,
} from './interfaces/auth.interfaces';
import { comparePasswords } from '../util/compare-password.util';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async getAuthenticatedUser(email: string, plainTextPassword: string) {
    const user = await this.usersService.findUserByEmail(email);
    console.log(
      'user',
      await this.verifyPassword(plainTextPassword, user?.password),
    );
    try {
      await this.verifyPassword(plainTextPassword, user?.password);
      delete user.password;
      return user;
    } catch (e) {
      throw new HttpException(
        'email ou senha estão incorretos',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ) {
    const isPasswordMatching = await comparePasswords(
      plainTextPassword,
      hashedPassword,
    );
    console.log('isPasswordMatching', isPasswordMatching);
    if (!isPasswordMatching) {
      throw new HttpException(
        'email ou senha estão incorretos',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  public getCookieWithJwtToken(userId: number, token: string) {
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
      'JWT_EXPIRATION_TIME',
    )}; SameSite=None; Secure`;
  }

  public getJwtToken(
    userId: number,
    expirationJwtCustom?: ExpirationJwtCustom,
  ) {
    const payload: TokenPayload = { userId };
    return this.jwtService.sign(payload, expirationJwtCustom);
  }

  public getCookieForLogOut() {
    return 'Authentication=; HttpOnly; Path=/; Max-Age=0; SameSite=None; Secure';
  }
}
