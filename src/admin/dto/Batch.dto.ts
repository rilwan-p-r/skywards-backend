import { IsString, IsNotEmpty, IsInt, Min } from 'class-validator';

export class BatchDto {
  @IsString()
  @IsNotEmpty()
  readonly courseId: string;

  @IsString()
  @IsNotEmpty()
  readonly batch: string;
  
  @IsString()
  @IsNotEmpty()
  readonly division: string;

  @IsString()
  @IsNotEmpty()
  readonly teacherId: string;

  @IsInt()
  @Min(1)
  @IsNotEmpty()
  readonly noOfStudentsCapacity: number;
}
