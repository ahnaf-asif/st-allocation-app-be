import { Controller, Post, Body, HttpCode, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { ControllerErrorHandler } from '@/shared/error-handlers';
import { IServiceData } from '@/shared/interfaces';
import { ForgotPasswordDto, ResetPasswordDto } from '@/api/auth/dto/auth.dto';

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

  @Post('/forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    const resp: IServiceData = await this.authService.forgotPassword(forgotPasswordDto);
    return this.controllerErrorHandler.handleResponse(resp);
  }
  @Get('/check-token-validity/:token')
  async checkTokenValidity(@Param('token') token: string) {
    const resp: IServiceData = await this.authService.checkTokenValidity(token);
    return this.controllerErrorHandler.handleResponse(resp);
  }

  @Post('/password-reset')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    const resp: IServiceData = await this.authService.resetPassword(resetPasswordDto);
    return this.controllerErrorHandler.handleResponse(resp);
  }
}
