import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { StService } from './st.service';
import { ControllerErrorHandler } from '@/shared/error-handlers';
import { IServiceData } from '@/shared/interfaces';
import { AuthAccess } from '@/guards';

import { BookPeriodDto } from './dto/st.dto';

@ApiBearerAuth()
@UseGuards(AuthAccess)
@ApiTags('st')
@Controller('st')
export class StController {
  constructor(
    private readonly stService: StService,
    private controllerErrorHandler: ControllerErrorHandler
  ) {}

  @Get('/rooms')
  async getRooms() {
    const resp: IServiceData = await this.stService.getRooms();
    return this.controllerErrorHandler.handleResponse(resp);
  }

  @Get('/days')
  async getDays() {
    const resp: IServiceData = await this.stService.getDays();
    return this.controllerErrorHandler.handleResponse(resp);
  }

  @Get('/schedules')
  async getSchedules() {
    const resp: IServiceData = await this.stService.getSchedules();
    return this.controllerErrorHandler.handleResponse(resp);
  }

  @Get('/routine/:id')
  async getRoutine(@Param('id', ParseIntPipe) id: number) {
    const resp: IServiceData = await this.stService.getRoutine(+id);
    return this.controllerErrorHandler.handleResponse(resp);
  }

  @Get('/periods/:id')
  async getPeriods(@Param('id', ParseIntPipe) userId: number) {
    const resp: IServiceData = await this.stService.getPeriods(+userId);
    return this.controllerErrorHandler.handleResponse(resp);
  }

  @Get('/search-rooms/:id')
  async searchRooms(
    @Param('id', ParseIntPipe) userId: number,
    @Query('dayId', ParseIntPipe) dayId: number,
    @Query('scheduleId', ParseIntPipe) scheduleId: number
  ) {
    const resp: IServiceData = await this.stService.searchRooms(+userId, +dayId, +scheduleId);
    return this.controllerErrorHandler.handleResponse(resp);
  }

  @Post('/book-period/:id')
  async bookPeriod(@Param('id', ParseIntPipe) id: number, @Body() bookPeriodDto: BookPeriodDto) {
    const resp: IServiceData = await this.stService.bookPeriod(+id, bookPeriodDto);
    return this.controllerErrorHandler.handleResponse(resp);
  }

  @Delete('/remove-period/:userId/:periodId')
  async removePeriod(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('periodId', ParseIntPipe) periodId: number
  ) {
    const resp: IServiceData = await this.stService.removePeriod(+userId, +periodId);
    return this.controllerErrorHandler.handleResponse(resp);
  }
}
