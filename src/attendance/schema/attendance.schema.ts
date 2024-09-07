import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ _id: false })
class AttendanceRecord {
    @Prop({ type: Types.ObjectId, ref: 'Student', required: true })
    studentId: Types.ObjectId;

    @Prop({ required: true })
    present: boolean;

    @Prop()
    remarks?: string;
}

const AttendanceRecordSchema = SchemaFactory.createForClass(AttendanceRecord);

@Schema({ timestamps: true })
export class Attendance extends Document {
    @Prop({ type: Types.ObjectId, ref: 'Batch', required: true })
    batchId: Types.ObjectId;

    @Prop({ required: true })
    date: Date;

    @Prop({ type: Types.ObjectId, ref: 'Teacher', required: true })
    teacherId: Types.ObjectId;

    @Prop({ type: [AttendanceRecordSchema], required: true })
    attendanceRecords: AttendanceRecord[];
}

export const AttendanceSchema = SchemaFactory.createForClass(Attendance);