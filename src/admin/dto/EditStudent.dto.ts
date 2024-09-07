import { Transform } from "class-transformer";
import { IsDate, IsOptional, IsString } from "class-validator";

export function TransformDate() {
    return Transform(({ value }) => value ? new Date(value) : null);
  }
  
export class EditStudentDto{
    @IsOptional()
    @IsString()
    readonly firstName?:string;

    @IsOptional()
    @IsString()
    readonly lastName?:string;
    
    @IsDate()
    @IsOptional()
    @TransformDate()
    readonly dateOfBirth?: Date;

    @IsOptional()
    @IsString()
    readonly gender?:string;
    
    @IsOptional()
    @IsString()
    readonly address?:string;

    @IsOptional()
    @IsString()
    readonly email?:string;

    @IsOptional()
    @IsString()
    readonly phoneNumber?:string;

    @IsOptional()
    @IsString()
    readonly emergencyContact?:string;

    @IsOptional()
    @IsString()
    readonly bloodGroup?:string;

    @IsDate()
    @IsOptional()
    @TransformDate()
    readonly admissionDate?: Date;
    
    @IsOptional()
    @IsString()
    readonly batchId?:string;

    }