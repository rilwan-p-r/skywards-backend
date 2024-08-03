import { Module } from '@nestjs/common';
import { AdminauthService } from './services/adminAuth.service';
import { AdminAuthController } from './controllers/adminAuth.controller';
import { TeachersAdminController } from './controllers/teachersAdmin.controller';
import { JwtModule } from '@nestjs/jwt';
import { AwsModule } from '../aws/aws.module';
import { MulterModule } from '@nestjs/platform-express';
import { S3Service } from '../aws/aws.service';
import { TeacherRepository } from './repositories/teacher.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Teacher, TeacherSchema } from './schema/addTeacher.schema';
import { EmailModule } from '../email/email.module';
import { TeachersAdminService } from './services/teachersAdmin.services';
import * as dotenv from 'dotenv';
dotenv.config();

@Module({
  providers: [AdminauthService,TeacherRepository,TeachersAdminService],
  controllers: [AdminAuthController,TeachersAdminController],
  imports: [
    EmailModule,
    MongooseModule.forFeature([{ name: Teacher.name, schema: TeacherSchema }]),
    AwsModule,
    MulterModule.registerAsync({
      imports: [AwsModule],
      useFactory: async (s3Service: S3Service) => ({
        storage: s3Service.createMulterStorage(),
      }),
      inject: [S3Service],
    }),
    JwtModule.register({
      global:true,
      secret:`${process.env.SECRET_KEY}`,
      signOptions: {expiresIn: '1d'}
    }),
    
    
  ]
})
export class AdminModule {}
