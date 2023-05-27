import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { ControllerErrorHandler } from '@/shared/error-handlers';
import { IServiceData } from '@/shared/interfaces';

@ApiTags('auth')
@Controller('/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private controllerErrorHandler: ControllerErrorHandler
  ) {}

  @HttpCode(200)
  @Post('/login')
  async login(@Body() loginDto: AuthDto) {
    const resp: IServiceData = await this.authService.login(loginDto);
    return this.controllerErrorHandler.handleResponse(resp);
  }
}
