import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminModule } from './admin/admin.module';
import { ConfigModule } from '@nestjs/config';
// import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      envFilePath:'.env',
      isGlobal: true
    }),
    // MongooseModule.forRootAsync({
    //   imports: [ConfigModule],
    //   useFactory: async (config) => ({
    //     uri:`${process.env.DB_URI}`,
    //   }),
    // }),
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
