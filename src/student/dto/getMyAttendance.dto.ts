import { IsString, IsNotEmpty, Matches } from 'class-validator';

export class GetMyAttendanceDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{4}-\d{2}$/, { message: 'Month must be in YYYY-MM format' })
  month: string;
}