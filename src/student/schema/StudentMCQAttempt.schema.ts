import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class StudentMCQAttempt extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Student', required: true })
  studentId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'MCQCompetition', required: true })
  mcqCompetitionId: Types.ObjectId;

  @Prop({ type: [Number], default: [] })
  answers: number[];

  @Prop({ type: Number, default: 0 })
  score: number;

  @Prop({ type: Boolean, default: false })
  completed: boolean;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const StudentMCQAttemptSchema = SchemaFactory.createForClass(StudentMCQAttempt);