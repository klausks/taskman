import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { UsersService } from '../../users/users.service';
import { TokenPayload } from '../interfaces/auth.interfaces';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt
        .fromExtractors([(request: Request) => request.headers.authorization || request?.cookies?.Authentication]),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: TokenPayload) {
    return this.userService.findOne(payload.userId).catch((e) => {
      throw new HttpException(`${e}`, HttpStatus.BAD_REQUEST);
    });
  }
}
