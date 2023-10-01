import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdatePasswordDto {
  @IsOptional()
  oldPassword: string;

  @IsString({ message: 'newPassword:Please enter a valid password' })
  @MinLength(8, { message: 'newPassword:Password Must be at least 8 characters' })
  newPassword: string;
}
