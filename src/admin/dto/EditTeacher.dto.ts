import { Transform } from 'class-transformer';
import { IsString, IsNumber, IsEmail, IsOptional } from 'class-validator';

export class EditTeacherDto {
  @IsString()
  @IsOptional()
  readonly firstName: string;

  @IsString()
  @IsOptional()
  readonly lastName: string;

  @IsString()
  @IsOptional()
  readonly address: string;
  
  @IsOptional()
  @IsEmail({},{message:'Please enter correct email'})
  readonly email: string;

  @IsString()
  @IsOptional()
  readonly subject: string;

  @IsOptional()
  @Transform(({ value }) => (value ? Number(value) : value), { toClassOnly: true })
  @IsNumber({}, { message: 'Years of experience must be a number' })
  readonly yearsOfExperience?: number;
}
