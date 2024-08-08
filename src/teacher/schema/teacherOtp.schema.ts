import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class TeacherOtp extends Document {

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    otp: number;
    
    @Prop({ default: Date.now, expires: '2m' })
    createdAt: Date;
}

export const TeacherOtpSchema = SchemaFactory.createForClass(TeacherOtp);

TeacherOtpSchema.index({ createdAt: 1 }, { expireAfterSeconds: 120 });