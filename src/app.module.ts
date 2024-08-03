import { Logger, Module } from '@nestjs/common';
import { AdminModule } from './admin/admin.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TeacherController } from './teacher/teacher.controller';
import { TeacherService } from './teacher/teacher.service';
import { TeacherModule } from './teacher/teacher.module';



@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      envFilePath:'.env',
      isGlobal: true
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (ConfigService: ConfigService) => {
        const uri = ConfigService.get<string>('MONGO_URI');
        Logger.log(`MongoDB connected to ${uri}`, 'MongooseModule');
        return { uri };
      },
      inject: [ConfigService],
    }),
    AdminModule,
    TeacherModule,
  ],
  controllers: [TeacherController],
  providers: [TeacherService],
})
export class AppModule { }
