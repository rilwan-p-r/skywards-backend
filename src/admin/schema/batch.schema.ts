import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Batch extends Document {
    @Prop({ type:Types.ObjectId, ref: 'Course', required: true})
    courseId: Types.ObjectId;

    @Prop({ required: true })
    batch: string;
    
    @Prop({ required: true })
    division: string;
    
    @Prop({ type: Types.ObjectId, ref: 'Teacher', required: true })
    teacherId: Types.ObjectId;

    @Prop({ required: true })
    noOfStudentsCapacity: number;

}

export const BatchSchema = SchemaFactory.createForClass(Batch);
