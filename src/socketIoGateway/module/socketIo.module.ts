import { Module } from '@nestjs/common';
import { SocketIoGateway } from '../SocketIo.gateway';
import { BatchChatRepository } from 'src/socketIoGateway/repositories/batchChat.repository';
import { BatchRepository } from 'src/admin/repositories/batchRepository';
import { MongooseModule } from '@nestjs/mongoose';
import { Batch, BatchSchema } from 'src/admin/schema/batch.schema';
import { BatchChat, BatchChatSchema } from 'src/socketIoGateway/schema/batchChat.schema';
import { Teacher, TeacherSchema } from 'src/teacher/schema/teacher.schema';
import { Student, StudentSchema } from 'src/student/schema/student.schema';
import { S3Service } from 'src/aws/awsS3.service';

@Module({
    imports: [MongooseModule.forFeature([
        { name: Batch.name, schema: BatchSchema },
        { name: BatchChat.name, schema: BatchChatSchema },
        { name: Teacher.name, schema: TeacherSchema },
        { name: Student.name, schema: StudentSchema },
    ])],
    providers: [SocketIoGateway, BatchChatRepository, BatchRepository, S3Service],
    exports: [SocketIoGateway]
})
export class SocketIoGatewayModule { }
