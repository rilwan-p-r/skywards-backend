import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { MinLength } from 'class-validator';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt'

@Schema({ timestamps: true })
export class Teacher extends Document {
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
    subject:string;
    
    @Prop({required:true})
    address:string;
    
    @Prop({required:true})
    yearsOfExperience:number;

    @Prop({ default: true })
    verified: boolean;
    
}

export const TeacherSchema = SchemaFactory.createForClass(Teacher);


// Add a pre-save hook to hash the password
TeacherSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
    next();
});

// Add a method to verify password
TeacherSchema.methods.verifyPassword = async function(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
};