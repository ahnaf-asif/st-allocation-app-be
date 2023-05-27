import * as argon2 from 'argon2';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { UpdatePasswordDto } from '@/api/user/dto';
import { UserProxy } from '@/shared/async-storage';
import { IServiceData, ServiceError } from '@/shared/interfaces';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService, private userProxy: UserProxy) {}

  async getConfiguration() {
    try {
      const configuration = await this.prisma.configuration.findUnique({
        where: {
          id: 1
        }
      });

      if (configuration) {
        return { data: configuration } as IServiceData;
      } else {
        return {
          businessError: {
            type: ServiceError.NOT_FOUND,
            message: 'configuration file not found'
          }
        };
      }
    } catch (e) {
      return { prismaError: e } as IServiceData;
    }
  }

  async changePassword(id: number, changePasswordDto: UpdatePasswordDto) {
    if (this.userProxy.id !== id && !this.userProxy.isAdmin) {
      console.log(this.userProxy.isAdmin);
      return {
        businessError: {
          type: ServiceError.BAD_REQUEST,
          message: 'You do not have permission to change the password for this user'
        }
      } as IServiceData;
    }

    try {
      const currentUser = await this.prisma.user.findUnique({
        where: {
          id: id
        }
      });

      if (!currentUser) {
        return {
          businessError: {
            type: ServiceError.NOT_FOUND,
            message: 'user not found'
          }
        } as IServiceData;
      }

      const passwordMatches = await argon2.verify(
        currentUser.password,
        changePasswordDto.oldPassword
      );

      if (!passwordMatches) {
        return {
          businessError: {
            type: ServiceError.BAD_REQUEST,
            message: 'The current password is incorrect'
          }
        } as IServiceData;
      }

      const updatedUser = await this.prisma.user.update({
        where: {
          id: id
        },
        data: {
          password: await argon2.hash(changePasswordDto.newPassword),
          rawPassword: changePasswordDto.newPassword
        },
        select: {
          id: true,
          name: true,
          email: true,
          isAdmin: true,
          createdAt: true,
          updatedAt: true,
          password: true,
          course: true
        }
      });

      return {
        data: updatedUser
      } as IServiceData;
    } catch (e) {
      return {
        prismaError: e
      } as IServiceData;
    }
  }
}
