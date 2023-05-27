import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from '@/prisma/prisma.service';
import { ControllerErrorHandler, ServiceErrorHandler } from '@/shared/error-handlers';
import { UserProxy } from '@/shared/async-storage';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService, ServiceErrorHandler, ControllerErrorHandler, UserProxy]
})
export class UserModule {}
