import { Module } from '@nestjs/common';
import { AdminauthService } from './services/adminAuth.service';
import { AdminAuthController } from './controllers/adminAuth.controller';
import { TeachersAdminController } from './controllers/teachersAdmin.controller';
import { JwtModule } from '@nestjs/jwt';
import { AwsS3Module } from 'src/aws/awsS3.module';
import { MulterModule } from '@nestjs/platform-express';
import { S3Service } from '../aws/awsS3.service';
import { TeacherRepository } from './repositories/teacher.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Teacher, TeacherSchema } from './schema/teacher.schema';
import { EmailModule } from '../email/email.module';
import { TeachersAdminService } from './services/teachersAdmin.services';
import * as dotenv from 'dotenv';
import { StudentAdminController } from './controllers/studentsAdmin.controller';
import { StudentAdminService } from './services/studentAdmin.service';
import { StudentRepository } from './repositories/student.repository';
import { Student, StudentSchema } from './schema/student.schema';
dotenv.config();

@Module({
  providers: [AdminauthService, TeacherRepository, TeachersAdminService, StudentAdminService, StudentRepository],
  controllers: [AdminAuthController, TeachersAdminController, StudentAdminController],
  imports: [
    EmailModule,

    MongooseModule.forFeature([{ name: Teacher.name, schema: TeacherSchema }]),
    MongooseModule.forFeature([{ name: Student.name, schema: StudentSchema }]),

    AwsS3Module,

    MulterModule.registerAsync({
      imports: [AwsS3Module],
      useFactory: async (s3Service: S3Service) => ({
        storage: s3Service.createMulterStorage(),
      }),
      inject: [S3Service],
    }),

    JwtModule.register({
      global: true,
      secret: `${process.env.SECRET_KEY}`,
      signOptions: { expiresIn: '1d' }
    }),


  ]
})
export class AdminModule { }
