import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, } from 'mongoose';

@Schema({ timestamps: true })
export class Course extends Document {
    @Prop({ required: true })
    course: string;

    @Prop({ required: true })
    description: string;
    
    @Prop({ required: true, type: [String] })   
    subjects: string[];
    

}

export const CourseSchema = SchemaFactory.createForClass(Course);
