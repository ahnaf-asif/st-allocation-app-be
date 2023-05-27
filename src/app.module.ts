import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClsModule } from 'nestjs-cls';

import { PrismaModule } from '@/prisma/prisma.module';
import { AuthModule } from '@/api/auth/auth.module';
import { UserProxy } from '@/shared/async-storage';

import { AdminModule } from './api/admin/admin.module';
import { UserModule } from './api/user/user.module';
import { StModule } from './api/st/st.module';

@Module({
  imports: [
    ClsModule.forFeature(UserProxy),
    PrismaModule,
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    AdminModule,
    UserModule,
    StModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
