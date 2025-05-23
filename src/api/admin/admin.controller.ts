import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Res,
  UseGuards
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { AdminAccess, SuperAdminAccess } from '@/guards';
import { ControllerErrorHandler } from '@/shared/error-handlers';
import { IServiceData } from '@/shared/interfaces';
import {
  AddRoomDto,
  AddScheduleDto,
  AddStDto,
  UpdateAccountDto,
  UpdateConfigurationDto,
  UpdateScheduleDto,
  UpdateStDto
} from './dto/admin.dto';

import * as Papa from 'papaparse';

@ApiBearerAuth()
@UseGuards(AdminAccess)
@ApiTags('admin')
@Controller('/admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private controllerErrorHandler: ControllerErrorHandler
  ) {}

  @Patch('/update-account')
  async updateAccount(@Body() updateAccountDto: UpdateAccountDto) {
    const resp: IServiceData = await this.adminService.updateAccount(updateAccountDto);
    return this.controllerErrorHandler.handleResponse(resp);
  }

  @Patch('/configuration')
  async updateConfiguration(@Body() updateConfiguration: UpdateConfigurationDto) {
    const resp: IServiceData = await this.adminService.updateConfiguration(updateConfiguration);
    return this.controllerErrorHandler.handleResponse(resp);
  }

  @Get('/sts')
  async getAllSts() {
    const resp: IServiceData = await this.adminService.getAllSts();
    return this.controllerErrorHandler.handleResponse(resp);
  }

  @Get('/routine')
  async getRoutine() {
    const resp: IServiceData = await this.adminService.getRoutine();
    return this.controllerErrorHandler.handleResponse(resp);
  }

  @Patch('/schedules/update/:id')
  async updateSchedule(
    @Param('id', ParseIntPipe) scheduleId: number,
    @Body() updateScheduleDto: UpdateScheduleDto
  ) {
    const resp: IServiceData = await this.adminService.updateSchedule(
      +scheduleId,
      updateScheduleDto
    );
    return this.controllerErrorHandler.handleResponse(resp);
  }

  @Delete('/schedules/delete/:id')
  async deleteSchedule(@Param('id', ParseIntPipe) scheduleId: number) {
    const resp: IServiceData = await this.adminService.deleteSchedule(+scheduleId);
    return this.controllerErrorHandler.handleResponse(resp);
  }

  @Post('/schedules/add')
  async addSchedule(@Body() addScheduleDto: AddScheduleDto) {
    const resp: IServiceData = await this.adminService.addSchedule(addScheduleDto);
    return this.controllerErrorHandler.handleResponse(resp);
  }

  @Get('/routine/filter')
  async filterUsersInRoutine(
    @Query('dayId', ParseIntPipe) dayId: number,
    @Query('scheduleId', ParseIntPipe) scheduleId: number,
    @Query('roomId', ParseIntPipe) roomId: number
  ) {
    const resp: IServiceData = await this.adminService.filterUsersInRoutine(
      +dayId,
      +scheduleId,
      +roomId
    );
    return this.controllerErrorHandler.handleResponse(resp);
  }

  @Post('/sts/add')
  async addSt(@Body() addStDto: AddStDto) {
    const resp: IServiceData = await this.adminService.addSt(addStDto);
    return this.controllerErrorHandler.handleResponse(resp);
  }

  @Patch('/sts/update/:id')
  async updateSt(@Param('id') id: number, @Body() updateStDto: UpdateStDto) {
    const resp: IServiceData = await this.adminService.updateSt(+id, updateStDto);
    return this.controllerErrorHandler.handleResponse(resp);
  }

  @Delete('/sts/delete/:id')
  async deleteSt(@Param('id') id: number) {
    const resp: IServiceData = await this.adminService.deleteSt(+id);
    return this.controllerErrorHandler.handleResponse(resp);
  }

  @Get('/rooms')
  async getAllRooms() {
    const resp: IServiceData = await this.adminService.getAllRooms();
    return this.controllerErrorHandler.handleResponse(resp);
  }

  @Post('/rooms/add')
  async addRoom(@Body() addRoomDto: AddRoomDto) {
    const resp: IServiceData = await this.adminService.addRoom(addRoomDto);
    return this.controllerErrorHandler.handleResponse(resp);
  }

  @Patch('/rooms/update/:id')
  async updateRoom(@Param('id') id: number, @Body() updateRoomDto: AddRoomDto) {
    const resp: IServiceData = await this.adminService.updateRoom(+id, updateRoomDto);
    return this.controllerErrorHandler.handleResponse(resp);
  }

  @Delete('/rooms/delete/:id')
  async deleteRoom(@Param('id') id: number) {
    const resp: IServiceData = await this.adminService.deleteRoom(+id);
    return this.controllerErrorHandler.handleResponse(resp);
  }

  @Get('/super/admins')
  async getAllAdmins() {
    const resp: IServiceData = await this.adminService.getAllAdmins();
    return this.controllerErrorHandler.handleResponse(resp);
  }

  @UseGuards(SuperAdminAccess)
  @Post('/super/add-admin')
  async addAdmin(@Body() addAdminDto: UpdateAccountDto) {
    const resp: IServiceData = await this.adminService.addAdmin(addAdminDto);
    return this.controllerErrorHandler.handleResponse(resp);
  }

  @UseGuards(SuperAdminAccess)
  @Delete('/super/remove-admin/:id')
  async removeAdmin(@Param('id') id: number) {
    const resp: IServiceData = await this.adminService.removeAdmin(+id);
    return this.controllerErrorHandler.handleResponse(resp);
  }

  @UseGuards(AdminAccess)
  @Get('/download-routine/:roomID')
  async downloadRoutine(@Param('roomID') roomID: number) {
    const resp: IServiceData = await this.adminService.downloadRoutine(+roomID);
    return Papa.unparse(resp.data as []);
  }

  @UseGuards(AdminAccess)
  @Post('/reset-routine')
  async resetRoutine() {
    const resp: IServiceData = await this.adminService.resetRoutine();
    return this.controllerErrorHandler.handleResponse(resp);
  }
}
