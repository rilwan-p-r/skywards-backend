import { Injectable, UnauthorizedException } from '@nestjs/common';
import { TeacherRepository } from '../repositories/teacher.repository';
// import { Response } from 'express';
import { EmailService } from 'src/email/email.service';
import { generateOtp } from 'src/utils/generateOtp';
import { newPasswordInterface, teacherOtpInterface } from '../interfaces/teacherOtp.interface';
import { TeacherOtpRepository } from '../repositories/teacherOtp.repository';

@Injectable()
export class TeacherForgotPasswordService {
    constructor(
        private readonly teacherRepository: TeacherRepository,
        private readonly emailService: EmailService,
        private readonly teacherOtpRepository: TeacherOtpRepository,
    ) { }

    async forgotPassword(input: { email: string }) {
        const teacher = await this.teacherRepository.findByEmail(input.email);
        console.log(teacher);

        if (!teacher) {
            throw new UnauthorizedException('Invalid email');
        }
        const otp = generateOtp(6)
        const teacherOtp: teacherOtpInterface = {
            email: teacher?.email,
            otp
        }

        await this.teacherOtpRepository.deleteOtpByEmail(teacher.email);

        const createdTeacherOtp = await this.teacherOtpRepository.createOtp(teacherOtp)

        return this.emailService.sendOTP(createdTeacherOtp?.email, createdTeacherOtp?.otp)
    }

    async verifyOtp(inputOtp:teacherOtpInterface) {
        console.log('service',inputOtp);
        
        const emailOfOtp = await this.teacherOtpRepository.findEmailOfOtp(inputOtp.email)
        console.log(emailOfOtp);
        
        if (!emailOfOtp || emailOfOtp.otp !== inputOtp.otp) {
            throw new UnauthorizedException('Invalid OTP');
          }    
        await this.teacherOtpRepository.deleteOtpByEmail(inputOtp.email);

        return { message: 'OTP verified successfully' };
    }

    async changePassword(newPasswowrd:newPasswordInterface){
        console.log('service',newPasswowrd);
        await this.teacherRepository.changePassword(newPasswowrd)
    }
}