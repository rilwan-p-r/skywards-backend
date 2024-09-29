import { Controller, Get, Param, Query, UseGuards } from "@nestjs/common";
import { StudentService } from "../services/student.service";
import { GetMyAttendanceDto } from "../dto/getMyAttendance.dto";
import { JwtStudentGuard } from "src/guards/jwtStudentAuth.guard";

@Controller('student')
@UseGuards(JwtStudentGuard)
export class StudentController {
  constructor(private readonly studentService: StudentService) { }


  @Get('getStudentById/:studentId')
  async getStudentById(@Param('studentId') studentId: string) {
    const response = await this.studentService.getStudentById(studentId)
    return response
  }

  @Get('getMyAttendanceStudentById/:studentId/attendance')
  async getMyAttendance(
    @Param('studentId') studentId: string,
    @Query() query: GetMyAttendanceDto
  ) {
    return this.studentService.getMyAttendance(studentId, query);
  }

  @Get('getBatchAndCourseByBatchId/:batchId')
  async getBatcheAndCourse(@Param('batchId') batchId:string){
    return this.studentService.getBatcheAndCourse(batchId)
  }

  @Get('getStudentsByBatchId/:batchId')
  async getStudentsByBatchId(@Param('batchId') batchId: string) {
      const response = await this.studentService.getStudentsByBatchId(batchId);
      return response;
  }
}
