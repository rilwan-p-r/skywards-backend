import { Logger, Module } from '@nestjs/common';
import { AdminModule } from './admin/admin.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TeacherModule } from './teacher/teacher.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailService } from './email/email.service';
import { StudentModule } from './student/student.module';



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

    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port:465,
        secure:true,
        auth: {
          user: `${process.env.SENDER_EMAIL}`,
          pass: `${process.env.SENDER_PASS}`,
        },
        tls: {
          rejectUnauthorized: false,
          ciphers: 'SSLv3', 
        },
      },
    }),

    AdminModule,
    TeacherModule,
    StudentModule,
  ],
  controllers: [],
  providers: [EmailService],
})
export class AppModule { }
