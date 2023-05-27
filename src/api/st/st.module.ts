import { Module } from '@nestjs/common';
import { StService } from './st.service';
import { StController } from './st.controller';
import { PrismaService } from '@/prisma/prisma.service';
import { ControllerErrorHandler, ServiceErrorHandler } from '@/shared/error-handlers';
import { UserProxy } from '@/shared/async-storage';

@Module({
  controllers: [StController],
  providers: [StService, PrismaService, ServiceErrorHandler, ControllerErrorHandler, UserProxy]
})
export class StModule {}
