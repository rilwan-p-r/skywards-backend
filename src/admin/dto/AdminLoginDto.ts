import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator"


export class AdminLoginDto{

    @IsNotEmpty()
    @IsEmail({},{message:'please enter valid email'})
    readonly email:string

    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    readonly password:string
}