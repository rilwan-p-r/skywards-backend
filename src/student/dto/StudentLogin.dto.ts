import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator"


export class StudentLoginDto{

    @IsNotEmpty()
    @IsEmail({},{message:'please enter valid email'})
    readonly email:string

    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    readonly password:string
}