import { IsString, IsEmail, IsNotEmpty, IsDate, IsOptional } from 'class-validator';

export class StudentDto {
  @IsString()
  @IsNotEmpty()
  readonly firstName: string;

  @IsString()
  @IsNotEmpty()
  readonly lastName: string;

  @IsDate()
  @IsNotEmpty()
  readonly dateOfBirth: Date;

  @IsString()
  @IsNotEmpty()
  readonly gender: string;

  @IsString()
  @IsOptional()
  readonly address: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'Please enter a correct email' })
  readonly email: string;

  @IsString()
  @IsOptional()
  readonly phoneNumber: string;

  @IsString()
  @IsOptional()
  readonly emergencyContact: string;

  @IsString()
  @IsOptional()
  readonly bloodGroup: string;

  @IsDate()
  @IsNotEmpty()
  readonly admissionDate: Date;
}