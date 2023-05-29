import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { PrismaService } from '@/prisma/prisma.service';
import { ControllerErrorHandler, ServiceErrorHandler } from '@/shared/error-handlers';
import { UserProxy } from '@/shared/async-storage';
import { JwtStrategy } from '@/api/auth/strategy';
import { AuthService } from '@/api/auth/auth.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [AdminController],
  providers: [
    AdminService,
    ServiceErrorHandler,
    ControllerErrorHandler,
    UserProxy,
    JwtStrategy,
    ConfigService,
    AuthService,
    PrismaService,
    JwtService
  ]
})
export class AdminModule {}
