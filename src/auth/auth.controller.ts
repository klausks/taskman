import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiTags, ApiAcceptedResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginResponse } from './dto/login-response.dto';
import { LoginDto } from './dto/login.dto';
import { RequestWithUser } from './interfaces/auth.interfaces';
import { Public } from './decorators/is-public.decorator';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @Public()
  @HttpCode(200)
  @Post('login')
  @ApiBody({ type: LoginDto })
  @ApiAcceptedResponse({
    description: 'The record has been accepted.',
    type: LoginResponse,
  })
  async login(@Body() login: LoginDto, @Res() res: Response) {
    const user = await this.authService.getAuthenticatedUser(
      login.email,
      login.password,
    );
    const authorization = this.authService.getJwtToken(user.id);
    const cookie = this.authService.getCookieWithJwtToken(
      user.id,
      authorization,
    );
    res.setHeader('Set-Cookie', cookie);
    res.send({ authorization, user });
  }

  @Public()
  @Post('signUp')
  @ApiBody({ type: CreateUserDto })
  async signUp(@Body() signUpDto: CreateUserDto) {
    return this.userService.create(signUpDto);
  }

  @Get()
  authenticate(@Req() request: RequestWithUser) {
    return request.user;
  }
}
