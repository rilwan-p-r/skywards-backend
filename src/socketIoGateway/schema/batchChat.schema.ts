import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class BatchChat extends Document {
  @Prop({ required: false, default: '' })
  text: string;

  @Prop({ type: Types.ObjectId, ref: 'Batch', required: true })
  batchId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Teacher', required: false })
  teacherId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Student', required: false })
  studentId: Types.ObjectId;

  @Prop({ type: [String], default: [] })
  fileUrls: string[];
}

export const BatchChatSchema = SchemaFactory.createForClass(BatchChat);