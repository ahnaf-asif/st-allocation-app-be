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

      const userCount = await prisma.user.count();

      if (userCount === 0) {
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
      }

      const appConfig = await prisma.configuration.findMany();

      if (appConfig.length == 0) {
        await prisma.configuration.create({
          data: {
            updateRoutineDeadline: new Date(),
            totalPeriodsPerWeek: 6,
            maxPeriodsPerDay: 3,
            minDaysPerWeek: 3
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
