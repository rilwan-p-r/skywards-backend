import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
class Question {
  @Prop({ required: true })
  question: string;

  @Prop({ type: [String], required: true })
  options: string[];

  @Prop({ required: true })
  correctAnswer: number;

  @Prop({ required: true })
  score: number;
}

@Schema({ timestamps: true })
export class MCQCompetition extends Document {
  @Prop({ required: true })
  competitionTitle: string;

  @Prop({ required: true })
  competitionSummary: string;

  @Prop({ required: true })
  timeLimit: number;

  @Prop({ required: true })
  endDate: Date;

  @Prop({ type: [Question], required: true })
  questions: Question[];
}

export const MCQCompetitionSchema = SchemaFactory.createForClass(MCQCompetition);