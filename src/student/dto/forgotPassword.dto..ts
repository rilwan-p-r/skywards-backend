import { IsEmail, IsNotEmpty, IsNumber, IsString,} from "class-validator"


export class ForgotPasswordDto{

    @IsNotEmpty()
    @IsEmail({},{message:'please enter valid email'})
    readonly email:string
}

export class VerifyOtpDto{
    
    @IsNotEmpty()
    @IsEmail({},{message:'please enter valid email'})
    readonly email:string

    @IsNumber()
    @IsNotEmpty()
    readonly otp:number
}

export class NewPassword{
    @IsNotEmpty()
    @IsEmail({},{message:'please enter valid email'})
    readonly email:string

    @IsNotEmpty()
    @IsString()
    readonly newPassword:string;
}
