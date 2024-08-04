import { Module } from '@nestjs/common';
import { S3Service } from './awsS3.service';

@Module({
  providers: [S3Service],
  exports: [S3Service] 
})
export class AwsS3Module {}
