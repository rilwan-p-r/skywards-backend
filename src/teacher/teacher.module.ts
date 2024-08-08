import { Module } from '@nestjs/common';
import { TeacherAuthService } from './services/teacherAuth.service';
import { TeacherAuthController } from './controllers/teacherAuth.controller';
import { TeacherRepository } from './repositories/teacher.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Teacher, TeacherSchema } from './schema/teacher.schema';
import { JwtModule } from '@nestjs/jwt';
import { TeacherForgotPasswordService } from './services/teacherForgotPassword.service';
import { TeacherForgotPasswordController } from './controllers/teacherForgotPassword.controller';
import { EmailService } from 'src/email/email.service';
import { TeacherOtpRepository } from './repositories/teacherOtp.repository';
import { TeacherOtp, TeacherOtpSchema } from './schema/teacherOtp.schema';

@Module({
  providers: [TeacherAuthService, TeacherRepository,TeacherForgotPasswordService, EmailService, TeacherOtpRepository],
  controllers: [TeacherAuthController, TeacherForgotPasswordController],
  imports:[
    MongooseModule.forFeature([{ name: Teacher.name, schema: TeacherSchema }]),
    MongooseModule.forFeature([{ name: TeacherOtp.name, schema: TeacherOtpSchema }]),

    JwtModule.register({
      secret: `${process.env.SECRET_KEY}`,
      signOptions: { expiresIn: '1d' }
    }),
  ]
})
export class TeacherModule {}
