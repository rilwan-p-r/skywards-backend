import { IsString, IsNumber, IsEmail, IsNotEmpty } from 'class-validator';

export class TeacherDto {
  @IsString()
  readonly firstName: string;

  @IsString()
  readonly lastName: string;

  @IsString()
  readonly address: string;
  
  @IsNotEmpty()
  @IsEmail({},{message:'Please enter correct email'})
  readonly email: string;

  @IsString()
  readonly subject: string;

  @IsNumber()
  readonly yearsOfExperience: number;
}
