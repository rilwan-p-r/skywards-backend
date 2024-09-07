import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Attendance } from "src/attendance/schema/attendance.schema";
import { CreateAttendanceDto } from "../dto/attendance.dto";
import { Types } from 'mongoose'
import { ObjectId } from 'bson';
import { GetMyAttendanceDto } from "src/student/dto/getMyAttendance.dto";
import { Student } from "src/student/schema/student.schema";


@Injectable()
export class AttendanceRepository {
    constructor(
        @InjectModel(Attendance.name) private readonly attendanceModel: Model<Attendance>,
        @InjectModel(Student.name) private readonly studentModel: Model<Student>,
    ) { }

    async getStudentsByBatchId(batchId: Types.ObjectId) {
        return await this.studentModel.find({ batchId }).populate('batchId');
    }

    async createAttendance(createAttendanceDto: CreateAttendanceDto): Promise<Attendance> {

        const attendanceValue = {
            ...createAttendanceDto,
            batchId: new Types.ObjectId(createAttendanceDto.batchId),
            teacherId: new Types.ObjectId(createAttendanceDto.teacherId),
            attendanceRecords: createAttendanceDto.attendanceRecords.map(record => ({
                ...record,
                studentId: new Types.ObjectId(record.studentId)
            })),
        };

        const newAttendance = new this.attendanceModel(attendanceValue);
        return newAttendance.save();
    }

    async findAttendanceExists(batchId: Types.ObjectId, date: unknown): Promise<boolean> {
        console.log(batchId, date);
        if (!ObjectId.isValid(batchId)) {
            throw new Error('Invalid batchId format');
        }
        const attendance = await this.attendanceModel.findOne({ batchId, date });
        console.log('attendance', attendance);
        return !!attendance;
    }

    async findMyAttendance(studentId: string, query: GetMyAttendanceDto) {
        const { month } = query;
        const startDate = new Date(month);
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + 1);
        endDate.setDate(0); // Last day of the month

        return this.attendanceModel.aggregate([
            {
                $match: {
                    date: { $gte: startDate, $lte: endDate },
                    'attendanceRecords.studentId': new Types.ObjectId(studentId)
                }
            },
            { $unwind: '$attendanceRecords' },
            {
                $match: {
                    'attendanceRecords.studentId': new Types.ObjectId(studentId)
                }
            },
            {
                $project: {
                    _id: 0,
                    date: 1,
                    present: '$attendanceRecords.present',
                    remarks: '$attendanceRecords.remarks'
                }
            },
            { $sort: { date: 1 } }
        ]);
    }

}