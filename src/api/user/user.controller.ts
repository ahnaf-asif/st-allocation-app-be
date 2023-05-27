import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { ControllerErrorHandler } from '@/shared/error-handlers';
import { AuthAccess } from '@/guards';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IServiceData } from '@/shared/interfaces';
import { UpdatePasswordDto } from '@/api/user/dto';

@ApiTags('user')
@ApiBearerAuth()
@UseGuards(AuthAccess)
@Controller('/user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private controllerErrorHandler: ControllerErrorHandler
  ) {}

  @Get('/configuration')
  async getConfiguration() {
    const resp: IServiceData = await this.userService.getConfiguration();
    return this.controllerErrorHandler.handleResponse(resp);
  }

  @Patch('/change-password/:id')
  async changePassword(@Param('id') id: number, @Body() changePasswordDto: UpdatePasswordDto) {
    const resp: IServiceData = await this.userService.changePassword(+id, changePasswordDto);
    return this.controllerErrorHandler.handleResponse(resp);
  }
}
