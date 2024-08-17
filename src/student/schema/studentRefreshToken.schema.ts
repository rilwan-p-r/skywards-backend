import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class StudentRefreshToken extends Document {

    @Prop({ required: true })
    token: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    expiryDate: Date;
}

export const StudentRefreshTokenSchema = SchemaFactory.createForClass(StudentRefreshToken);