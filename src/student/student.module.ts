import { Module } from '@nestjs/common';
import { StudentAuthService } from './services/studentAuth.service';
import { StudentAuthController } from './controllers/studentAuth.controller';
import { StudentRepository } from './repositories/student.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Student, StudentSchema } from './schema/student.schema';
import { JwtModule } from '@nestjs/jwt';
import { StudentForgotPasswordService } from './services/teacherForgotPassword.service';
import { StudentForgotPasswordController } from './controllers/studentForgotPassword';
import { StudentOtp, StudentOtpSchema } from './schema/studentOtp.schema';
import { EmailService } from 'src/email/email.service';
import { StudentOtpRepository } from './repositories/studentOtp.repository';

@Module({
  providers: [StudentAuthService, StudentRepository, StudentForgotPasswordService, EmailService, StudentOtpRepository],
  controllers: [StudentAuthController, StudentForgotPasswordController],
  imports: [
    MongooseModule.forFeature([{ name: Student.name, schema: StudentSchema }]),
    MongooseModule.forFeature([{ name: StudentOtp.name, schema: StudentOtpSchema }]),

    JwtModule.register({
      secret: `${process.env.SECRET_KEY}`,
      signOptions: { expiresIn: '1d' }
    }),
  ]
})
export class StudentModule {}
