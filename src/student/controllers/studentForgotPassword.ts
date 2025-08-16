import { Body, Controller, Post, } from "@nestjs/common";
import { ForgotPasswordDto, NewPassword, VerifyOtpDto } from "../dto/forgotPassword.dto";
import { StudentForgotPasswordService } from "../services/studentForgotPassword.service";

@Controller('student')
export class StudentForgotPasswordController {
    constructor(private readonly studentForgotPasswordService: StudentForgotPasswordService) { }

    @Post('forgotPassword')
    async forgotpassword(
        @Body() forgotPasswordDto: ForgotPasswordDto,
    ) {
        console.log('controller',forgotPasswordDto);
        
        return this.studentForgotPasswordService.forgotPassword(forgotPasswordDto);
    }

    @Post('verifyOtp')
    async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
        return this.studentForgotPasswordService.verifyOtp(verifyOtpDto);
    }

    @Post('changePassword')
    async changePassword(@Body() newPassword: NewPassword) {
        console.log('backkkkkkkkkkk', newPassword);
        return this.studentForgotPasswordService.changePassword(newPassword)
    }
}