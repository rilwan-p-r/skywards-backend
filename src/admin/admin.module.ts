import { Module } from '@nestjs/common';
import { AdminauthService } from './services/adminAuth.service';
import { AdminAuthController } from './controllers/adminAuth.controller';
import { TeachersAdminController } from './controllers/teachersAdmin.controller';
import { JwtModule } from '@nestjs/jwt';
import { TeacherAdminRepository } from './repositories/teacherAdmin.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Teacher, TeacherSchema } from '../teacher/schema/teacher.schema';
import { TeachersAdminService } from './services/teachersAdmin.service';
import * as dotenv from 'dotenv';
import { StudentAdminController } from './controllers/studentsAdmin.controller';
import { StudentAdminService } from './services/studentAdmin.service';
import { StudentAdminRepository } from './repositories/studentAdmin.repository';
import { Student, StudentSchema } from '../student/schema/student.schema';
import { EmailService } from 'src/email/email.service';
import { AdminAuthRepository } from './repositories/adminAuth.repository';
import { AdminRefreshToken, AdminRefreshTokenSchema } from './schema/adminRefreshToken.schema';
import { Batch, BatchSchema } from './schema/batch.schema';
import { BatchAdminController } from './controllers/batchAdmin.controller';
import { BatchAdminService } from './services/batchAdmin.service';
import { BatchRepository } from './repositories/batchRepository';
import { Course, CourseSchema } from './schema/course.scehma';
import { CourseAdminService } from './services/courseAdmin.service';
import { CourseAdminRepository } from './repositories/courseAdmin.repository';
import { CourseAdminController } from './controllers/courseAdmin.controller';
import { MCQCompetitionAdminService } from './services/mcqCompetitionAdmin.service';
import { MCQCompetitionAdminRepository } from './repositories/mcqCompetitionAdmin.repository';
import { MCQCompetitionAdminController } from './controllers/mcqCompetitionAdmin.controller';
import { MCQCompetition, MCQCompetitionSchema } from './schema/mcqCompetition.schema';
import { S3Service } from 'src/aws/awsS3.service';
import { AdminAnnouncementController } from './controllers/adminAnnouncement.controller';
import { AdminAnnouncementService } from './services/adminAnnouncement.service';
import { AnnouncementRepository } from './repositories/announcement.repository';
import { Announcement, AnnouncementSchema } from './schema/announcement.schema';

dotenv.config();

@Module({
  providers: [
    AdminauthService, TeacherAdminRepository, TeachersAdminService, StudentAdminService,
    StudentAdminRepository, EmailService, AdminAuthRepository, BatchAdminService,
    BatchRepository, CourseAdminService, CourseAdminRepository, MCQCompetitionAdminService,
    MCQCompetitionAdminRepository, S3Service, AdminAnnouncementService, AnnouncementRepository],

  controllers: [
    AdminAuthController, TeachersAdminController, StudentAdminController,
    BatchAdminController, CourseAdminController, MCQCompetitionAdminController, AdminAnnouncementController],
  imports: [

    MongooseModule.forFeature([
      { name: Teacher.name, schema: TeacherSchema },
      { name: Student.name, schema: StudentSchema },
      { name: AdminRefreshToken.name, schema: AdminRefreshTokenSchema },
      { name: Batch.name, schema: BatchSchema },
      { name: Course.name, schema: CourseSchema },
      { name: MCQCompetition.name, schema: MCQCompetitionSchema },
      { name: Announcement.name, schema: AnnouncementSchema },
    ]),

    JwtModule.register({
      secret: `${process.env.SECRET_KEY}`,
      signOptions: { expiresIn: '1h' }
    }),


  ]
})
export class AdminModule { }
