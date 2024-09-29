import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { JwtAdminGuard } from "src/guards/jwtAdminAuth.guard";
import { CourseDto } from "../dto/Course.dto";
import { CourseAdminService } from "../services/courseAdmin.service";
@Controller('admin')
@UseGuards(JwtAdminGuard)
export class CourseAdminController{
    constructor(
        private readonly courseAdminService:CourseAdminService,
    ){

    }

    @Post('createCourse')
    async createCourse(@Body() courseDto:CourseDto ){
        console.log('courseDto',courseDto);
        
        const response = this.courseAdminService.createCourse(courseDto)
        return response;
    }

    @Get('getCourseList')
    async etBatches(){
        const response = await this.courseAdminService.getCourses();
        return response;
    }

}