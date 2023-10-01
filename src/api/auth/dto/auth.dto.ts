import { IsEmail, IsNotEmpty, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthDto {
  @ApiProperty({ example: 'admin@gmail.com' })
  @IsNotEmpty({ message: 'Email cannot be empty' })
  @IsEmail({}, { message: 'Please enter a valid email' })
  email: string;

  @ApiProperty({ example: 'password' })
  @IsNotEmpty({ message: 'Password cannot be empty' })
  @Length(8, 256, { message: 'Password must have at least 8 characters' })
  password: string;
}

export class ForgotPasswordDto {
  @ApiProperty({ example: 'email@gmail.com' })
  @IsNotEmpty({ message: 'Email cannot be empty' })
  @IsEmail({}, { message: 'Please enter a valid email' })
  email: string;
}

export class ResetPasswordDto {
  @ApiProperty({ example: 'password123' })
  @IsNotEmpty({ message: 'Password cannot be empty' })
  @Length(8, 256, { message: 'Password must have at least 8 characters' })
  password: string;

  @ApiProperty({ example: 'password123' })
  @IsNotEmpty({ message: 'Confirm Password cannot be empty' })
  @Length(8, 256, { message: 'Password must have at least 8 characters' })
  confirmPassword: string;

  @ApiProperty({ example: 'token' })
  @IsNotEmpty({ message: 'Token cannot be empty' })
  token: string;
}
