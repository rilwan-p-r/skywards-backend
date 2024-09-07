import { IsDateString, IsString, IsBoolean, IsArray, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

class AttendanceRecordDto {
  @IsString()
  studentId: string;

  @IsBoolean()
  present: boolean;

  @IsString()
  @IsOptional()
  remarks?: string;
}

export class CreateAttendanceDto {
  @IsDateString()
  date: string;

  @IsString()
  batchId: string;

  @IsString()
  teacherId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttendanceRecordDto)
  attendanceRecords: AttendanceRecordDto[];
}