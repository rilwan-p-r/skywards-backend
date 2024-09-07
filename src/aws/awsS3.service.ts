// s3.service.ts
import { Injectable } from '@nestjs/common';
import { S3Client } from '@aws-sdk/client-s3';
import * as multerS3 from 'multer-s3';


@Injectable()
export class S3Service {
  private s3Client: S3Client;

  constructor() {
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  createMulterStorage() {
    return multerS3({
      s3: this.s3Client,
      bucket: process.env.AWS_S3_BUCKET,
      acl: 'public-read',
      metadata: (req, file, cb) => {
        cb(null, { fieldName: file.fieldname });
      },
      key: (req, file, cb) => {
        console.log("i'm file",file);
        
        cb(null, `${Date.now().toString()}-${file.originalname}`);
      },
    });
  }
}
