import { Body, Controller, Get, Post, Query, UseGuards } from "@nestjs/common";
import { JwtStudentGuard } from "src/guards/jwtStudentAuth.guard";
import { LeaveStudentDto } from "../dto/leaveStudent.dto";
import { StudentLeaveService } from "../services/studentLeave.service";

@Controller('student')
@UseGuards(JwtStudentGuard)
export class StudentLeaveController {
  constructor(private readonly studentLeaveService: StudentLeaveService) { }

@Post('leaveApplyStudent')
async leaveApplyStudent(@Body() leaveStudentDto:LeaveStudentDto){
    const response = this.studentLeaveService.leaveApplyStudent(leaveStudentDto)
    return response;
}

  @Get('getMyLeaves')
  async getMyLeaves(@Query('studentId') studentId: string, @Query('month') month: string) {
    const response = await this.studentLeaveService.getMyLeaves(studentId, month);
    return response;
  }


}
