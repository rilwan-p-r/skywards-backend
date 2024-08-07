import { Module } from '@nestjs/common';
import { StudentAuthService } from './services/studentAuth.service';
import { StudentAuthController } from './controllers/studentAuth.controller';
import { StudentRepository } from './repositories/student.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Student, StudentSchema } from './schema/student.schema';
import { JwtModule } from '@nestjs/jwt';

@Module({
  providers: [StudentAuthService, StudentRepository],
  controllers: [StudentAuthController],
  imports: [
    MongooseModule.forFeature([{ name: Student.name, schema: StudentSchema }]),

    JwtModule.register({
      secret: `${process.env.SECRET_KEY}`,
      signOptions: { expiresIn: '1d' }
    }),
  ]
})
export class StudentModule {}
