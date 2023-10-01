import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategy';
import { ControllerErrorHandler, ServiceErrorHandler } from '@/shared/error-handlers';
import { BrevoService } from '@/services/brevo/brevo.service';

@Module({
  imports: [JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, ServiceErrorHandler, ControllerErrorHandler, BrevoService]
})
export class AuthModule {}
