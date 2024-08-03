// src/email/email.module.ts
import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailService } from './email.service';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port:465,
        secure:true,
        auth: {
          user: `skywards121@gmail.com`,
          pass: `bjnh wwqe cash qtxn`,
        },
        tls: {
          rejectUnauthorized: false,
          ciphers: 'SSLv3', 
        },
      },
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}