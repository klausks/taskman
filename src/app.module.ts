import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { PrismaService } from './providers/prisma.service';
import { UsersService } from './users/users.service';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import JwtAuthenticationGuard from './auth/guards/jwt-authentication.guard';

@Module({
  imports: [UsersModule, AuthModule],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthenticationGuard,
    },
  ],
})
export class AppModule {}
