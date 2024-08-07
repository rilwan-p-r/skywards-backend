import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { MinLength } from 'class-validator';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt'

@Schema({ timestamps: true })
export class Student extends Document {
    @Prop({ required: true })
    firstName: string;

    @Prop({ required: true })
    lastName: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    @MinLength(8)
    password: string;

    @Prop({ required: true })
    imageUrl: string;

    @Prop({ required: true })
    dateOfBirth: Date;

    @Prop({ required: true })
    gender: string;

    @Prop({ required: true })
    address: string;

    @Prop({ required: true })
    phoneNumber: string;

    @Prop({ required: true })
    emergencyContact: string;

    @Prop({ required: false })
    bloodGroup: string;

    @Prop({ required: true })
    admissionDate: Date;

    @Prop({ default: true })
    verified: boolean;
}

export const StudentSchema = SchemaFactory.createForClass(Student);

// hash the password
StudentSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
    next();
});