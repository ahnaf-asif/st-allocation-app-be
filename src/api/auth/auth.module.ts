import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategy';
import { ControllerErrorHandler, ServiceErrorHandler } from '@/shared/error-handlers';

@Module({
	imports: [JwtModule.register({})],
	controllers: [AuthController],
	providers: [AuthService, JwtStrategy, ServiceErrorHandler, ControllerErrorHandler]
})
export class AuthModule {}
