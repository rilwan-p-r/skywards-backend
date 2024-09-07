import { Transform } from 'class-transformer';
import { IsString, IsEmail, IsNotEmpty, IsDate,} from 'class-validator';

export function TransformDate() {
  return Transform(({ value }) => value ? new Date(value) : null);
}

export class StudentDto {
  @IsString()
  @IsNotEmpty()
  readonly firstName: string;

  @IsString()
  @IsNotEmpty()
  readonly lastName: string;

  @IsDate()
  @IsNotEmpty()
  @TransformDate()
  readonly dateOfBirth: Date;

  @IsString()
  @IsNotEmpty()
  readonly gender: string;

  @IsString()
  readonly address: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'Please enter a correct email' })
  readonly email: string;

  @IsString()
  readonly phoneNumber: string;

  @IsString()
  readonly emergencyContact: string;

  @IsString()
  readonly bloodGroup: string;

  @IsDate()
  @IsNotEmpty()
  @TransformDate()
  readonly admissionDate: Date;

  @IsString()
  @IsNotEmpty()
  readonly batchId: string;
}
