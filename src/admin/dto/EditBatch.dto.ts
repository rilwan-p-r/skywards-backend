import { IsString, IsInt, Min, IsOptional } from 'class-validator';

export class EditBatchDto {
  @IsString()
  @IsOptional()
  readonly courseId: string;

  @IsString()
  @IsOptional()
  readonly batch: string;
  
  @IsString()
  @IsOptional()
  readonly division: string;

  @IsString()
  @IsOptional()
  readonly teacherId: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  readonly noOfStudentsCapacity: number;
}
