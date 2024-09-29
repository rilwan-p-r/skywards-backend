import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { BatchChat } from '../schema/batchChat.schema';

@Injectable()
export class BatchChatRepository {
  constructor(@InjectModel(BatchChat.name) private batchChatModel: Model<BatchChat>) {}

  async createMessage(
    text: string,
    batchId: string,
    senderId: string,
    senderType: 'teacher' | 'student',
    fileUrls: string[] = [],
  ): Promise<BatchChat> {
    console.log('Creating message:', { text, batchId, senderId, senderType, fileUrls });
  
    const messageData = {
      text: text || '',
      batchId: new Types.ObjectId(batchId),
      [senderType === 'teacher' ? 'teacherId' : 'studentId']: new Types.ObjectId(senderId),
      fileUrls,
    };
  
    const message = new this.batchChatModel(messageData);
    return message.save();
  }


  async getMessagesByBatchId(batchId: string): Promise<BatchChat[]> {
    return this.batchChatModel
      .find({ batchId: new Types.ObjectId(batchId) })
      .sort({ createdAt: 1 })
      .populate('studentId', 'firstName lastName imageUrl')
      .populate('teacherId', 'firstName lastName imageUrl')
      .exec();
  }

  async populateMessage(message: BatchChat): Promise<BatchChat> {
    return (await message
      .populate('studentId', 'firstName lastName imageUrl'))
    .populate('teacherId', 'firstName lastName imageUrl')
  }

  async deleteUserMessages(messageIds: string[], userId: string, role: 'student' | 'teacher'): Promise<string[]> {
    const query = {
      _id: { $in: messageIds.map(id => new Types.ObjectId(id)) },
      [role === 'teacher' ? 'teacherId' : 'studentId']: new Types.ObjectId(userId)
    };

    const deletedMessages = await this.batchChatModel.find(query);
    await this.batchChatModel.deleteMany(query);

    return deletedMessages.map(message => message._id.toString());
  }

}
