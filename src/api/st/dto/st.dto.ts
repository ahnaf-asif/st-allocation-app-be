import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class BookPeriodDto {
  @IsNumber({}, { message: 'select a valid day' })
  dayId: number;

  @IsNumber({}, { message: 'select a valid time' })
  scheduleId: number;

  @IsNumber({}, { message: 'select a valid room' })
  roomId: number;
}
