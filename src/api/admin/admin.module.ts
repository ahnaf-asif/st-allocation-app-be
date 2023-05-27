import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { PrismaService } from '@/prisma/prisma.service';
import { ControllerErrorHandler, ServiceErrorHandler } from '@/shared/error-handlers';
import { UserProxy } from '@/shared/async-storage';

@Module({
  controllers: [AdminController],
  providers: [AdminService, PrismaService, ServiceErrorHandler, ControllerErrorHandler, UserProxy]
})
export class AdminModule {}
