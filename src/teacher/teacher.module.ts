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
import { TeacherRefreshToken, TeacherRefreshTokenSchema } from './schema/teacherRefreshToken.schema';
import { Batch, BatchSchema } from 'src/admin/schema/batch.schema';
import { TeacherService } from './services/teacher.service';
import { TeacherController } from './controllers/teacher.controller';
import { studentsAttendanceTeacherController,} from './controllers/studentsAttendanceTeacher.controller';
import { AttendanceService } from 'src/attendance/services/attendance.service';
import { AttendanceRepository } from '../attendance/repositories/attendance.repository';
import { Attendance, AttendanceSchema } from 'src/attendance/schema/attendance.schema';
import { Student, StudentSchema } from 'src/student/schema/student.schema';

@Module({
  providers: [TeacherAuthService, TeacherRepository,TeacherForgotPasswordService, EmailService, TeacherOtpRepository, TeacherService, AttendanceService, AttendanceRepository],//
  controllers: [TeacherAuthController, TeacherForgotPasswordController, TeacherController, studentsAttendanceTeacherController],//
  imports:[
    MongooseModule.forFeature([
      { name: Teacher.name, schema: TeacherSchema },
      { name: TeacherOtp.name, schema: TeacherOtpSchema },
      { name: TeacherRefreshToken.name, schema: TeacherRefreshTokenSchema },
      { name: Batch.name, schema: BatchSchema},
      { name: Attendance.name, schema: AttendanceSchema},
      {name:Student.name, schema:StudentSchema}

    ]),

    JwtModule.register({
      secret: `${process.env.SECRET_KEY}`,
      signOptions: { expiresIn: '1d' }
    }),
  ]
  
})
export class TeacherModule {}
