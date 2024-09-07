import { Injectable } from "@nestjs/common";
import { CreateAttendanceDto } from "src/attendance/dto/attendance.dto";
import { AttendanceRepository } from "src/attendance/repositories/attendance.repository";
import { CheckAttendanceDto } from "../dto/check-attendance.dto";
import { Types } from 'mongoose';

@Injectable()
export class AttendanceService {
    constructor(private readonly AttendanceRepository: AttendanceRepository,
    ) { }

    async getStudentsByBatchId(batchId: string) {
        try {
            const students = await this.AttendanceRepository.getStudentsByBatchId(new Types.ObjectId(batchId));
            if (!students || students.length === 0) {
                return { statusCode: 204, data: [] };
            }
            return { data: students }
        } catch (error) {
            throw new Error(`Failed to fetch students for batch ${batchId}: ${error.message}`);
        }
    }

    async submitAttendanceData(createAttendanceDto: CreateAttendanceDto) {
        const createdAttendance = await this.AttendanceRepository.createAttendance(createAttendanceDto);
        return createdAttendance;
    }

    async checkAttendanceExists(checkAttendanceDto: CheckAttendanceDto): Promise<boolean> {
        console.log("Input DTO:", checkAttendanceDto);

        const { batchId, date } = checkAttendanceDto;
        console.log("Parsed batchId:", new Types.ObjectId(batchId));
        console.log("Parsed date:", new Date(date));

        const attendance = await this.AttendanceRepository.findAttendanceExists(new Types.ObjectId(batchId),new Date(date));
        console.log("Repository result:", attendance);

        return attendance;
    }
}