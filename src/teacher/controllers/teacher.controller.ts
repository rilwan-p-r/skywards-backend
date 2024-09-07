import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { TeacherService } from "../services/teacher.service";
import { JwtTeacherGuard } from "src/guards/jwtTeacherAuth.guard";

@Controller('teacher')
export class TeacherController{
    constructor(private readonly teacherService:TeacherService){}

    @UseGuards(JwtTeacherGuard)
    @Get('getBatchesAndCoursesByTeacherId/:teacherId')
    async getBatchesAndCoursesByTeacherId(@Param('teacherId') teacherId: string) {
        const response = await this.teacherService.getBatchesAndCoursesByTeacherId(teacherId);
        return response;
    }

    @UseGuards(JwtTeacherGuard)
    @Get('getTeacherById/:teacherId')
    async getTeacherById(@Param('teacherId') teacherId:string){
        const response = await this.teacherService.getTeacherById(teacherId)
        return response
    }
}