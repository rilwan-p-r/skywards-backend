import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class StudentOtp extends Document {

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    otp: number;
    
    @Prop({ default: Date.now, expires: '2m' })
    createdAt: Date;
}

export const StudentOtpSchema = SchemaFactory.createForClass(StudentOtp);

StudentOtpSchema.index({ createdAt: 1 }, { expireAfterSeconds: 120 });