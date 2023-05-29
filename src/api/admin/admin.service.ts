import * as argon2 from 'argon2';
import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';
import { IServiceData, ServiceError } from '@/shared/interfaces';
import {
  AddRoomDto,
  AddScheduleDto,
  AddStDto,
  UpdateAccountDto,
  UpdateConfigurationDto,
  UpdateScheduleDto,
  UpdateStDto
} from './dto/admin.dto';
import { isEarlierTime } from '@/shared/helpers';
import { UserProxy } from '@/shared/async-storage';
import { AuthService } from '@/api/auth/auth.service';

@Injectable()
export class AdminService {
  constructor(
    private prisma: PrismaService,
    private userProxy: UserProxy,
    private authService: AuthService
  ) {}

  async updateAccount(updateAccountDto: UpdateAccountDto) {
    try {
      const user = await this.prisma.user.update({
        where: {
          id: this.userProxy.id
        },
        data: {
          email: updateAccountDto.email,
          name: updateAccountDto.name
        },
        select: {
          id: true,
          name: true,
          email: true,
          student_id: true,
          isAdmin: true,
          createdAt: true,
          updatedAt: true,
          password: true,
          course: true,
          section: true
        }
      });

      return { data: await this.authService.signToken(user) } as IServiceData;
    } catch (e) {
      return { prismaError: e } as IServiceData;
    }
  }

  async updateConfiguration(updateConfigurationDto: UpdateConfigurationDto) {
    try {
      const updatedConfiguration = await this.prisma.configuration.update({
        where: {
          id: 1
        },
        data: updateConfigurationDto
      });

      if (updatedConfiguration) {
        return { data: updatedConfiguration } as IServiceData;
      } else {
        const newConfiguration = await this.prisma.configuration.create({
          data: updatedConfiguration
        });
        return { data: newConfiguration } as IServiceData;
      }
    } catch (e) {
      return { prismaError: e } as IServiceData;
    }
  }

  async addSchedule(addScheduleDto: AddScheduleDto) {
    try {
      const schedule = await this.prisma.schedule.create({
        data: {
          ...addScheduleDto
        }
      });

      return { data: schedule } as IServiceData;
    } catch (e) {
      return { prismaError: e } as IServiceData;
    }
  }

  async updateSchedule(id: number, updateScheduleDto: UpdateScheduleDto) {
    try {
      const schedule = await this.prisma.schedule.update({
        where: {
          id
        },
        data: {
          ...updateScheduleDto
        }
      });

      return { data: schedule } as IServiceData;
    } catch (e) {
      return { prismaError: e } as IServiceData;
    }
  }

  async deleteSchedule(id: number) {
    try {
      const schedule = await this.prisma.schedule.delete({
        where: {
          id
        }
      });

      return { data: schedule } as IServiceData;
    } catch (e) {
      return { prismaError: e } as IServiceData;
    }
  }

  async getAllSts() {
    try {
      const allSts = await this.prisma.user.findMany({
        where: {
          isAdmin: false
        },

        select: {
          id: true,
          name: true,
          rawPassword: true,
          email: true,
          student_id: true,
          course: true,
          section: true
        },
        orderBy: {
          id: 'desc'
        }
      });

      return { data: allSts } as IServiceData;
    } catch (e) {
      return { prismaError: e } as IServiceData;
    }
  }

  async getRoutine() {
    try {
      const initialSchedules = await this.prisma.schedule.findMany({
        include: {
          periods: {
            include: {
              room: true,
              day: true
            }
          }
        }
      });

      const schedules = initialSchedules.sort(isEarlierTime);

      const days = await this.prisma.day.findMany({
        include: {
          periods: {
            include: {
              user: true,
              schedule: true,
              room: true
            }
          }
        }
      });

      const rooms = await this.prisma.room.findMany({});

      const routine = schedules.map((schedule) => ({
        schedule: `${schedule.from} - ${schedule.to}`,
        scheduleId: schedule.id,
        ...days.reduce((acc, { name, id }) => {
          acc[name] = rooms
            .filter(
              (room) =>
                schedule.periods.filter(
                  (period) => period.room.id === room.id && period.day.name === name
                ).length > 0
            )
            .map((individualRoom) => ({
              dayId: id,
              room: {
                roomId: individualRoom.id,
                name: individualRoom.name
              },
              sts: schedule.periods.filter(
                (period) => period.room.id === individualRoom.id && period.day.name === name
              ).length
            }));
          return acc;
        }, {})
      }));

      return { data: routine } as IServiceData;
    } catch (e) {
      return { prismaError: e } as IServiceData;
    }
  }

  async filterUsersInRoutine(dayId: number, scheduleId: number, roomId: number) {
    try {
      const users = await this.prisma.user.findMany({
        where: {
          periods: {
            some: {
              dayId,
              roomId,
              scheduleId
            }
          }
        },
        select: {
          name: true,
          email: true,
          student_id: true,
          course: true,
          section: true
        }
      });

      return { data: users } as IServiceData;
    } catch (e) {
      return { prismaError: e } as IServiceData;
    }
  }

  async addSt(addStDto: AddStDto) {
    try {
      const stExistsInEmail = await this.prisma.user.findUnique({
        where: {
          email: addStDto.email
        }
      });

      const stExistsInStudentId = await this.prisma.user.findUnique({
        where: {
          student_id: addStDto.student_id
        }
      });

      if (stExistsInEmail) {
        return {
          businessError: {
            type: ServiceError.BAD_REQUEST,
            message: 'email:Email already exists'
          }
        } as IServiceData;
      }

      if (stExistsInStudentId) {
        return {
          businessError: {
            type: ServiceError.BAD_REQUEST,
            message: 'student_id:Student Id already exists'
          }
        } as IServiceData;
      }

      const randomPassword = Math.random().toString(36).slice(-8);

      const newSt = await this.prisma.user.create({
        data: {
          ...addStDto,
          password: await argon2.hash(randomPassword),
          rawPassword: randomPassword
        }
      });

      return { data: newSt } as IServiceData;
    } catch (e) {
      return { prismaError: e } as IServiceData;
    }
  }

  async updateSt(id: number, updateStDto: UpdateStDto) {
    try {
      const updatedSt = await this.prisma.user.update({
        where: {
          id: id
        },
        data: {
          ...updateStDto
        }
      });
      if (!updatedSt) {
        return {
          businessError: {
            type: ServiceError.NOT_FOUND,
            message: 'email:User Not found'
          }
        } as IServiceData;
      }

      return { data: updatedSt } as IServiceData;
    } catch (e) {
      return { prismaError: e } as IServiceData;
    }
  }

  async deleteSt(id: number) {
    try {
      const deletedSt = await this.prisma.user.delete({
        where: {
          id: id
        }
      });

      if (!deletedSt) {
        return {
          businessError: {
            type: ServiceError.BAD_REQUEST,
            message: 'email:User already deleted'
          }
        } as IServiceData;
      }

      return { data: deletedSt } as IServiceData;
    } catch (e) {
      return { prismaError: e } as IServiceData;
    }
  }

  async getAllRooms() {
    try {
      const allRooms = await this.prisma.room.findMany({
        select: {
          id: true,
          name: true,
          capacity: true
        },

        orderBy: {
          id: 'desc'
        }
      });

      return { data: allRooms } as IServiceData;
    } catch (e) {
      return { prismaError: e } as IServiceData;
    }
  }

  async addRoom(addRoomDto: AddRoomDto) {
    try {
      const existingRoom = await this.prisma.room.findUnique({
        where: {
          name: addRoomDto.name
        }
      });

      if (existingRoom) {
        return {
          businessError: {
            type: ServiceError.BAD_REQUEST,
            message: 'name:room with this name already exists'
          }
        } as IServiceData;
      } else {
        const newRoom = await this.prisma.room.create({
          data: {
            name: addRoomDto.name,
            capacity: addRoomDto.capacity
          }
        });

        return { data: newRoom } as IServiceData;
      }
    } catch (e) {
      return { prismaError: e } as IServiceData;
    }
  }

  async updateRoom(roomId: number, updateRoomDto: AddRoomDto) {
    try {
      const updatedRoom = await this.prisma.room.update({
        where: {
          id: roomId
        },
        data: {
          name: updateRoomDto.name,
          capacity: updateRoomDto.capacity
        }
      });

      if (updatedRoom) {
        return { data: updateRoomDto } as IServiceData;
      } else {
        return {
          businessError: {
            type: ServiceError.NOT_FOUND,
            message: 'name:Room not found'
          }
        };
      }
    } catch (e) {
      return { prismaError: e } as IServiceData;
    }
  }

  async deleteRoom(id: number) {
    try {
      const deletedRoom = await this.prisma.room.delete({
        where: {
          id: id
        }
      });

      return { data: deletedRoom } as IServiceData;
    } catch (e) {
      return { prismaError: e } as IServiceData;
    }
  }
}
