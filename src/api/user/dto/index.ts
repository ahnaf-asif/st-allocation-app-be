import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UpdatePasswordDto {
  @IsString({ message: 'oldPassword:Please enter a valid password' })
  @MinLength(8, { message: 'oldPassword:Password Must be at least 8 characters' })
  oldPassword: string;

  @IsString({ message: 'newPassword:Please enter a valid password' })
  @MinLength(8, { message: 'newPassword:Password Must be at least 8 characters' })
  newPassword: string;
}
