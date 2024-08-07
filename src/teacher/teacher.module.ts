import { Module } from '@nestjs/common';
import { TeacherAuthService } from './services/teacherAuth.service';
import { TeacherAuthController } from './controllers/teacherAuth.controller';
import { TeacherRepository } from './repositories/teacher.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Teacher, TeacherSchema } from './schema/teacher.schema';
import { JwtModule } from '@nestjs/jwt';

@Module({
  providers: [TeacherAuthService, TeacherRepository],
  controllers: [TeacherAuthController],
  imports:[
    MongooseModule.forFeature([{ name: Teacher.name, schema: TeacherSchema }]),

    JwtModule.register({
      secret: `${process.env.SECRET_KEY}`,
      signOptions: { expiresIn: '1d' }
    }),
  ]
})
export class TeacherModule {}
