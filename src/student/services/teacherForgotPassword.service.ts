import { Injectable, UnauthorizedException } from '@nestjs/common';
import { StudentRepository } from '../repositories/student.repository';
// import { Response } from 'express';
import { EmailService } from 'src/email/email.service';
import { generateOtp } from 'src/utils/generateOtp';
import { newPasswordInterface, studentOtpInterface } from '../interfaces/studentOtp.interface';
import { StudentOtpRepository } from '../repositories/studentOtp.repository';

@Injectable()
export class StudentForgotPasswordService {
    constructor(
        private readonly studentRepository: StudentRepository,
        private readonly emailService: EmailService,
        private readonly studentOtpRepository: StudentOtpRepository,
    ) { }

    async forgotPassword(input: { email: string }) {
        const student = await this.studentRepository.findByEmail(input.email);
        console.log(student);

        if (!student) {
            throw new UnauthorizedException('Invalid email');
        }
        const otp = generateOtp(6)
        const studentOtp: studentOtpInterface = {
            email: student?.email,
            otp
        }

        await this.studentOtpRepository.deleteOtpByEmail(student.email);

        const createdStudentOtp = await this.studentOtpRepository.createOtp(studentOtp)

        return this.emailService.sendOTP(createdStudentOtp?.email, createdStudentOtp?.otp)
    }

    async verifyOtp(inputOtp:studentOtpInterface) {
        console.log('service',inputOtp);
        
        const emailOfOtp = await this.studentOtpRepository.findEmailOfOtp(inputOtp.email)
        console.log(emailOfOtp);
        
        if (!emailOfOtp || emailOfOtp.otp !== inputOtp.otp) {
            throw new UnauthorizedException('Invalid OTP');
          }    
        await this.studentOtpRepository.deleteOtpByEmail(inputOtp.email);

        return { message: 'OTP verified successfully' };
    }

    async changePassword(newPasswowrd:newPasswordInterface){
        console.log('service',newPasswowrd);
        await this.studentRepository.changePassword(newPasswowrd)
    }
}