import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { UserProxy } from '@/shared/async-storage';
import { IServiceData, ServiceError } from '@/shared/interfaces';
import { BookPeriodDto } from '@/api/st/dto/st.dto';
import { isEarlierTime } from '@/shared/helpers';

@Injectable()
export class StService {
  constructor(private prisma: PrismaService, private userProxy: UserProxy) {}

  async getRooms() {
    try {
      const rooms = await this.prisma.room.findMany({});
      return { data: rooms } as IServiceData;
    } catch (e) {
      return { prismaError: e } as IServiceData;
    }
  }

  async getDays() {
    try {
      const rooms = await this.prisma.day.findMany({});
      return { data: rooms } as IServiceData;
    } catch (e) {
      return { prismaError: e } as IServiceData;
    }
  }

  async getSchedules() {
    try {
      const schedules = await this.prisma.schedule.findMany({});
      const sortedSchedule = schedules.sort(isEarlierTime);

      return { data: sortedSchedule } as IServiceData;
    } catch (e) {
      return { prismaError: e } as IServiceData;
    }
  }

  async getRoutine(userId: number) {
    if (userId !== this.userProxy.id && !this.userProxy.isAdmin) {
      return {
        businessError: {
          type: ServiceError.BAD_REQUEST,
          message: 'You are not allowed to see the routine for this user'
        }
      } as IServiceData;
    }

    try {
      const initialSchedules = await this.prisma.schedule.findMany({
        include: {
          periods: {
            where: {
              userId
            },
            include: {
              room: true,
              day: true
            }
          }
        }
      });

      const schedules = initialSchedules.sort(isEarlierTime);

      const routine = schedules
        .filter((schedule: any) => schedule.periods.length > 0)
        .map((schedule: any) => ({
          schedule: `${schedule.from} - ${schedule.to}`,
          ...schedule.periods.reduce((acc, { day, room }) => {
            acc[day.name] = room.name;
            return acc;
          }, {})
        }));

      return { data: routine } as IServiceData;
    } catch (e) {
      return { prismaError: e } as IServiceData;
    }
  }

  async getPeriods(userId: number) {
    if (userId !== this.userProxy.id && !this.userProxy.isAdmin) {
      return {
        businessError: {
          type: ServiceError.BAD_REQUEST,
          message: 'You are not allowed to search rooms for this user'
        }
      } as IServiceData;
    }

    try {
      const periods = await this.prisma.period.findMany({
        where: {
          userId
        },
        include: {
          user: true,
          schedule: true,
          room: true,
          day: true
        },
        orderBy: [{ dayId: 'asc' }, { scheduleId: 'asc' }]
      });

      return { data: periods } as IServiceData;
    } catch (e) {
      return { prismaError: e } as IServiceData;
    }
  }

  async checkRoomBookingAvailability(userId: number, dayId: number, scheduleId: number) {
    if (userId !== this.userProxy.id && !this.userProxy.isAdmin) {
      return {
        businessError: {
          type: ServiceError.BAD_REQUEST,
          message: 'You are not allowed to search rooms for this user'
        }
      } as IServiceData;
    }

    const config = await this.prisma.configuration.findUnique({
      where: { id: 1 }
    });

    const { updateRoutineDeadline, totalPeriodsPerWeek, maxPeriodsPerDay, minDaysPerWeek } = config;

    if (updateRoutineDeadline < new Date()) {
      return {
        businessError: {
          type: ServiceError.BAD_REQUEST,
          message: 'The deadline has passed already'
        }
      } as IServiceData;
    }

    try {
      const alreadyBookedAtTheTime = await this.prisma.period.findFirst({
        where: {
          userId,
          dayId,
          scheduleId
        }
      });

      if (alreadyBookedAtTheTime) {
        return {
          businessError: {
            type: ServiceError.BAD_REQUEST,
            message:
              'You have already booked a period at the selected time. If you want to change it, remove the existing period first'
          }
        } as IServiceData;
      }

      const alreadyBookedAtThisDay = await this.prisma.period.count({
        where: {
          userId,
          dayId
        }
      });

      if (alreadyBookedAtThisDay >= maxPeriodsPerDay) {
        return {
          businessError: {
            type: ServiceError.BAD_REQUEST,
            message: `You cannot book more than ${maxPeriodsPerDay} periods in a single day. Please select another day`
          }
        } as IServiceData;
      }

      const alreadySelectedPeriodDays = await this.prisma.period.findMany({
        where: {
          userId
        },
        select: {
          dayId: true
        }
      });

      return true;
    } catch (e) {
      return { prismaError: e } as IServiceData;
    }
  }

  async searchRooms(userId: number, dayId: number, scheduleId: number) {
    const resp = await this.checkRoomBookingAvailability(userId, dayId, scheduleId);
    if (resp !== true) {
      return resp as IServiceData;
    }

    try {
      const allRooms = await this.prisma.room.findMany({
        include: {
          periods: {
            where: {
              dayId,
              scheduleId
            }
          }
        }
      });

      const availableRooms = allRooms
        .filter((room) => room.capacity > room.periods.length)
        .map((room) => ({
          id: room.id,
          name: room.name,
          capacity: room.capacity,
          availableSeats: room.capacity - room.periods.length
        }));

      return { data: availableRooms } as IServiceData;
    } catch (e) {
      return { prismaError: e } as IServiceData;
    }
  }

  async bookPeriod(userId: number, bookPeriodDto: BookPeriodDto) {
    const resp = await this.checkRoomBookingAvailability(
      userId,
      bookPeriodDto.dayId,
      bookPeriodDto.scheduleId
    );
    if (resp !== true) {
      return resp as IServiceData;
    }

    try {
      const room = await this.prisma.room.findUnique({
        where: {
          id: bookPeriodDto.roomId
        },
        include: {
          periods: {
            where: {
              dayId: bookPeriodDto.dayId,
              scheduleId: bookPeriodDto.scheduleId
            }
          }
        }
      });

      if (room.periods.length >= room.capacity) {
        return {
          businessError: {
            type: ServiceError.BAD_REQUEST,
            message: 'The room is already full at this time'
          }
        } as IServiceData;
      }

      const period = await this.prisma.period.create({
        data: {
          userId: userId,
          roomId: bookPeriodDto.roomId,
          scheduleId: bookPeriodDto.scheduleId,
          dayId: bookPeriodDto.dayId
        }
      });

      return { data: period } as IServiceData;
    } catch (e) {
      return { prismaError: e } as IServiceData;
    }
  }

  async removePeriod(userId: number, periodId: number) {
    if (userId !== this.userProxy.id && !this.userProxy.isAdmin) {
      return {
        businessError: {
          type: ServiceError.BAD_REQUEST,
          message: 'You are not allowed to search rooms for this user'
        }
      } as IServiceData;
    }

    try {
      const period = await this.prisma.period.findUnique({
        where: {
          id: periodId
        }
      });

      if (period.userId !== userId) {
        return {
          businessError: {
            type: ServiceError.BAD_REQUEST,
            message: 'You are not allowed to remove this period'
          }
        } as IServiceData;
      }

      const deletedPeriod = await this.prisma.period.delete({
        where: {
          id: periodId
        }
      });

      return { data: periodId } as IServiceData;
    } catch (e) {
      return { prismaError: e } as IServiceData;
    }
  }
}
