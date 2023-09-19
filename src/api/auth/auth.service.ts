import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

import { AuthDto } from './dto';
import { PrismaService } from '@/prisma/prisma.service';
import { IServiceData, ServiceError } from '@/shared/interfaces';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService
  ) {}

  async login(loginDto: AuthDto) {
    try {
      const currentUser = await this.prisma.user.findUnique({
        where: {
          email: loginDto.email
        },

        select: {
          id: true,
          name: true,
          email: true,
          student_id: true,
          isAdmin: true,
          isSuperAdmin: true,
          createdAt: true,
          updatedAt: true,
          password: true,
          course: true,
          section: true
        }
      });

      if (!currentUser) {
        return {
          businessError: {
            type: ServiceError.FORBIDDEN,
            message: 'Invalid Credential(s)'
          }
        } as IServiceData;
      }

      const passwordMatches = await argon.verify(currentUser.password, loginDto.password);

      if (!passwordMatches) {
        return {
          businessError: {
            type: ServiceError.FORBIDDEN,
            message: 'Invalid Credential(s)'
          }
        } as IServiceData;
      }
      const { password, ...userWithoutPassword } = currentUser;
      return {
        data: await this.signToken(userWithoutPassword)
      } as IServiceData;
    } catch (e) {
      return {
        prismaError: e
      } as IServiceData;
    }
  }

  async signToken(user: object): Promise<{ token: string }> {
    const payload = {
      user
    };

    const secret = this.config.get('JWT_SECRET');

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '30h',
      secret: secret
    });

    return {
      token: token
    };
  }
}
