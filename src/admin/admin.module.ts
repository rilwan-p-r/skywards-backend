import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { JwtModule } from '@nestjs/jwt';



@Module({
  providers: [AdminService],
  controllers: [AdminController],
  imports: [
    JwtModule.register({
      global:true,
      secret:`${process.env.SECRET_KEY}`,
      signOptions: {expiresIn: '1d'}
    })
  ]
})
export class AdminModule {}
