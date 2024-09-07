import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { JwtStudentGuard } from "src/guards/jwtStudentAuth.guard";
import { LeaveStudentDto } from "../dto/leaveStudent.dto";
import { StudentLeaveService } from "../services/studentLeave.service";

@Controller('student')
export class StudentLeaveController {
  constructor(private readonly studentLeaveService: StudentLeaveService) { }

@UseGuards(JwtStudentGuard)
@Post('leaveApplyStudent')
async leaveApplyStudent(@Body() leaveStudentDto:LeaveStudentDto){
    const response = this.studentLeaveService.leaveApplyStudent(leaveStudentDto)
    return response;
}
}
