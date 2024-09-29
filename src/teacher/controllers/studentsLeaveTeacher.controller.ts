import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { StudentLeaveTeacherService } from "../services/studentLeaveTeacher.service";
import { JwtTeacherGuard } from "src/guards/jwtTeacherAuth.guard";

@Controller('teacher')
@UseGuards(JwtTeacherGuard)
export class StudentLeaveTeacherController{
    constructor(
        private readonly studentLeaveTeacherService:StudentLeaveTeacherService,
    ){ }

    @Get('studentsAppliedLeave/:batchId')
    async getAppliedLeavesByBatchId(@Param('batchId') batchId:string){
        const response = await this.studentLeaveTeacherService.getAppliedLeavesByBatchId(batchId)
        return response;
    }

    @Post('handleLeaveApplication/:leaveId')
    async handleLeaveApplication(
        @Param('leaveId') leaveId: string,
        @Body('action') action: 'approve' | 'reject'
    ) {
        const response = await this.studentLeaveTeacherService.handleLeaveApplication(leaveId, action);
        return response;
    }


}