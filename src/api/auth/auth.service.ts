import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

import { AuthDto } from './dto';
import { PrismaService } from '@/prisma/prisma.service';
import { IServiceData, ServiceError } from '@/shared/interfaces';
import { ForgotPasswordDto, ResetPasswordDto } from '@/api/auth/dto/auth.dto';
import { passwordResetToken } from '@/shared/helpers';
import { BrevoService } from '@/services/brevo/brevo.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
    private brevo: BrevoService
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

  async generatePasswordResetToken() {
    while (true) {
      let token = passwordResetToken();

      const resetToken = await this.prisma.forgotPassword.findUnique({
        where: {
          token: token
        }
      });

      if (!resetToken) {
        return token;
      }
    }
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: forgotPasswordDto.email
      }
    });

    if (user) {
      const token = await this.generatePasswordResetToken();

      const newPasswordRequest = await this.prisma.forgotPassword.create({
        data: {
          token: token,
          user: {
            connect: {
              id: user.id
            }
          }
        }
      });

      await this.brevo.sendPasswordResetLink(
        { name: 'BRACU ST Panel', email: this.config.get('BREVO_MAIL_SENDER') },
        [{ name: user.name, email: user.email }],
        'BRACU ST Panel Password Reset',
        token
      );
    }

    return { data: 'done' } as IServiceData;
  }

  async checkTokenValidity(token: string) {
    try {
      const forgotPassword = await this.prisma.forgotPassword.findUnique({
        where: {
          token: token
        },
        include: {
          user: true
        }
      });

      if (forgotPassword) {
        return { data: forgotPassword.user } as IServiceData;
      } else {
        return {
          businessError: {
            type: ServiceError.FORBIDDEN,
            message: 'Invalid Token'
          }
        } as IServiceData;
      }
    } catch (e) {
      return {
        prismaError: e
      } as IServiceData;
    }
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    try {
      if (resetPasswordDto.password !== resetPasswordDto.confirmPassword) {
        return {
          businessError: {
            type: ServiceError.FORBIDDEN,
            message: 'Passwords do not match'
          }
        } as IServiceData;
      }
      const forgotPassword = await this.prisma.forgotPassword.findUnique({
        where: {
          token: resetPasswordDto.token
        },
        include: {
          user: true
        }
      });

      if (forgotPassword) {
        const hashedPassword = await argon.hash(resetPasswordDto.password);

        const updatedUser = await this.prisma.user.update({
          where: {
            id: forgotPassword.user.id
          },
          data: {
            password: hashedPassword
          }
        });

        await this.prisma.forgotPassword.delete({
          where: {
            id: forgotPassword.id
          }
        });

        return { data: updatedUser } as IServiceData;
      } else {
        return {
          businessError: {
            type: ServiceError.FORBIDDEN,
            message: 'Invalid Token'
          }
        } as IServiceData;
      }
    } catch (e) {
      return {
        prismaError: e
      } as IServiceData;
    }
  }
}
