import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { CreateAttendanceDto } from "../../attendance/dto/attendance.dto";
import { AttendanceService } from "src/attendance/services/attendance.service";
import { CheckAttendanceDto } from "../../attendance/dto/check-attendance.dto";
import { JwtTeacherGuard } from "src/guards/jwtTeacherAuth.guard";

@Controller('teacher')
@UseGuards(JwtTeacherGuard)
export class studentsAttendanceTeacherController {
    constructor(private readonly attendanceService: AttendanceService) { }

    @Get('getStudentsByBatchId/:batchId')
    async getStudentsByBatchId(@Param('batchId') batchId: string) {
        const response = await this.attendanceService.getStudentsByBatchId(batchId);
        return response;
    }
    
    @Post('submitAttendanceData')
    async submitAttendanceData(@Body() createAttendanceDto: CreateAttendanceDto) {
        const response = await this.attendanceService.submitAttendanceData(createAttendanceDto);
        return response;
    }

    @Post('check-exists')
    async checkAttendanceExists(@Body() checkAttendanceDto: CheckAttendanceDto) {
        const exists = await this.attendanceService.checkAttendanceExists(checkAttendanceDto);
        return { exists };
    }
}