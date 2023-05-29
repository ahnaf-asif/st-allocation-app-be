import {
  IsDateString,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min
} from 'class-validator';

export class UpdateAccountDto {
  @IsEmail({}, { message: 'Enter a valid email' })
  @IsNotEmpty({ message: 'Email canont be empty' })
  email: string;

  @IsString({ message: 'Enter a valid name' })
  @IsNotEmpty({ message: 'Name cannot be empty' })
  name: string;
}

export class UpdateConfigurationDto {
  @IsDateString({ strict: false }, { message: 'Please enter a valid date' })
  updateRoutineDeadline: Date;

  @IsNumber({}, { message: 'Enter a valid number' })
  @Min(1, { message: 'Total periods must be at least 1' })
  totalPeriodsPerWeek: number;

  @IsNumber({}, { message: 'Enter a valid number' })
  @Min(1, { message: 'Total periods per day must be at least 1' })
  maxPeriodsPerDay: number;
}

export class AddRoomDto {
  @IsString({ message: 'name:Room Name has to be a text' })
  @IsNotEmpty({ message: 'name:Room Name cannot be empty' })
  name: string;

  @IsInt({ message: 'capacity:capacity has to be a number' })
  @Min(1, { message: 'capacity:capacity has to be at least 1' })
  capacity: number;
}

export class AddStDto {
  @IsString({ message: 'name:Enter a valid name' })
  @IsNotEmpty({ message: 'name:Name cannot be empty' })
  name: string;

  @IsEmail({}, { message: 'name:Enter a valid email' })
  email: string;

  @IsString({ message: 'name:Enter a valid course' })
  @IsNotEmpty({ message: 'name:Course cannot be empty' })
  course: string;

  @IsInt({ message: 'section: Enter a valid section number' })
  @IsNotEmpty({ message: 'section: Section cannot be empty' })
  section: number;

  @IsString({ message: 'student_id:Enter a valid student id' })
  @IsNotEmpty({ message: 'student_id:Student id cannot be empty' })
  student_id: string;
}

export class UpdateStDto {
  @IsString({ message: 'name:Enter a valid name' })
  @IsNotEmpty({ message: 'name:Name cannot be empty' })
  name: string;

  @IsString({ message: 'name:Enter a valid course' })
  @IsNotEmpty({ message: 'name:Course cannot be empty' })
  course: string;

  @IsInt({ message: 'section: Enter a valid section number' })
  @IsNotEmpty({ message: 'section: Section cannot be empty' })
  section: number;
}

export class AddScheduleDto {
  @IsString({ message: 'Enter a valid string' })
  @IsNotEmpty({ message: 'from:from cannot be empty' })
  from: string;

  @IsString({ message: 'Enter a valid string' })
  @IsNotEmpty({ message: 'from:from cannot be empty' })
  to: string;
}

export class UpdateScheduleDto extends AddScheduleDto {}
