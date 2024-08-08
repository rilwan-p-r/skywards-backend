import { Body, Controller, Post, } from "@nestjs/common";
import { ForgotPasswordDto, NewPassword, VerifyOtpDto } from "../dto/forgotPassword.dto";
import { TeacherForgotPasswordService } from "../services/teacherForgotPassword.service";

@Controller('teacher')
export class TeacherForgotPasswordController{
    constructor(private readonly teacherForgotPasswordService:TeacherForgotPasswordService){}

    @Post('forgotPassword')
    async forgotpassword(
        @Body() forgotPasswordDto:ForgotPasswordDto,
    ) {
        console.log('controllerteacher',forgotPasswordDto);
        
        return this.teacherForgotPasswordService.forgotPassword(forgotPasswordDto);
    }

    @Post('verifyOtp')
    async verifyOtp(@Body() verifyOtpDto:VerifyOtpDto){
        return this.teacherForgotPasswordService.verifyOtp(verifyOtpDto);
    }

    @Post('changePassword')
    async changePassword(@Body() newPassword:NewPassword){
        console.log('back',newPassword);
        return this.teacherForgotPasswordService.changePassword(newPassword)
    }
}