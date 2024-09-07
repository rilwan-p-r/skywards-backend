import { IsDateString, IsString } from "class-validator";

export class CheckAttendanceDto {
    @IsString()
    batchId: string;
  
    @IsDateString()
    date: string;
  }
  