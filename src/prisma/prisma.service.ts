import * as argon2 from 'argon2';
import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(private config: ConfigService) {
    super();
  }

  async onModuleInit() {
    try {
      await this.$connect();
      const prisma = new PrismaClient();

      await prisma.user.upsert({
        where: {
          email: this.config.get('ADMIN_EMAIL')
        },
        update: {},
        create: {
          email: this.config.get('ADMIN_EMAIL'),
          password: await argon2.hash(this.config.get('ADMIN_PASSWORD')),
          name: this.config.get('ADMIN_NAME'),
          isAdmin: true
        }
      });

      const appConfig = await prisma.configuration.findMany();

      if (appConfig.length == 0) {
        await prisma.configuration.create({
          data: {
            updateRoutineDeadline: new Date(),
            totalPeriodsPerWeek: 6,
            maxPeriodsPerDay: 3
          }
        });
      }

      await prisma.day.createMany({
        data: [
          { id: 1, name: 'Saturday' },
          { id: 2, name: 'Sunday' },
          { id: 3, name: 'Monday' },
          { id: 4, name: 'Tuesday' },
          { id: 5, name: 'Wednesday' },
          { id: 6, name: 'Thursday' }
        ],
        skipDuplicates: true
      });

      await prisma.schedule.createMany({
        data: [
          {
            id: 1,
            from: '08:00 AM',
            to: '09:20 AM'
          },
          {
            id: 2,
            from: '09:30 AM',
            to: '10:50 AM'
          },
          {
            id: 3,
            from: '11:00 AM',
            to: '12:20 PM'
          },
          {
            id: 4,
            from: '12:30 PM',
            to: '01:50 PM'
          },
          {
            id: 5,
            from: '02:00 PM',
            to: '03:20 PM'
          },
          {
            id: 6,
            from: '03:30 PM',
            to: '04:50 PM'
          }
        ],
        skipDuplicates: true
      });
    } catch (e) {
      throw e;
    }
  }
  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
