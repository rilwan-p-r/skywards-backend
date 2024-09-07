import { Module } from '@nestjs/common';
import { StudentAuthService } from './services/studentAuth.service';
import { StudentAuthController } from './controllers/studentAuth.controller';
import { StudentRepository } from './repositories/student.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Student, StudentSchema } from './schema/student.schema';
import { JwtModule } from '@nestjs/jwt';
import { StudentForgotPasswordService } from './services/studentForgotPassword.service';
import { StudentForgotPasswordController } from './controllers/studentForgotPassword';
import { StudentOtp, StudentOtpSchema } from './schema/studentOtp.schema';
import { EmailService } from 'src/email/email.service';
import { StudentOtpRepository } from './repositories/studentOtp.repository';
import { StudentRefreshToken, StudentRefreshTokenSchema } from './schema/studentRefreshToken.schema';
import { StudentController } from './controllers/student.controller';
import { StudentService } from './services/student.service';
import { Attendance, AttendanceSchema } from 'src/attendance/schema/attendance.schema';
import { AttendanceRepository } from 'src/attendance/repositories/attendance.repository';
import { BatchRepository } from 'src/admin/repositories/batchRepository';
import { Batch, BatchSchema } from 'src/admin/schema/batch.schema';
import { StudentLeaveController } from './controllers/studentLeave.controller';
import { StudentLeaveService } from './services/studentLeave.service';
import { StudentLeaveRepository } from './repositories/studentLeave.repository';
import { LeaveApplyStudent, LeaveApplyStudentSchema } from './schema/LeaveApplyStudent.schema';

@Module({
  providers: [StudentAuthService, StudentRepository, StudentForgotPasswordService, EmailService, StudentOtpRepository, StudentService, AttendanceRepository, BatchRepository,  StudentLeaveService, StudentLeaveRepository],
  controllers: [StudentAuthController, StudentForgotPasswordController, StudentController, StudentLeaveController],
  imports: [
    MongooseModule.forFeature([
      { name: Student.name, schema: StudentSchema },
      { name: StudentOtp.name, schema: StudentOtpSchema },
      { name: StudentRefreshToken.name, schema: StudentRefreshTokenSchema },
      { name: Attendance.name, schema: AttendanceSchema },
      { name: Batch.name, schema: BatchSchema },
      { name: LeaveApplyStudent.name, schema: LeaveApplyStudentSchema },
    ]),
    JwtModule.register({
      secret: `${process.env.SECRET_KEY}`,
      signOptions: { expiresIn: '1d' }
    }),
  ]
})
export class StudentModule {}
