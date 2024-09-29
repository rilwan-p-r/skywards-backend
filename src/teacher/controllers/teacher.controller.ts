import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { TeacherService } from "../services/teacher.service";
import { JwtTeacherGuard } from "src/guards/jwtTeacherAuth.guard";

@Controller('teacher')
@UseGuards(JwtTeacherGuard)
export class TeacherController{
    constructor(private readonly teacherService:TeacherService){}

    @Get('getBatchesAndCoursesByTeacherId/:teacherId')
    async getBatchesAndCoursesByTeacherId(@Param('teacherId') teacherId: string) {
        const response = await this.teacherService.getBatchesAndCoursesByTeacherId(teacherId);
        return response;
    }

    @Get('getTeacherById/:teacherId')
    async getTeacherById(@Param('teacherId') teacherId:string){
        const response = await this.teacherService.getTeacherById(teacherId)
        return response
    }
}