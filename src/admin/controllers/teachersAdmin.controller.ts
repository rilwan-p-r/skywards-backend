import { Body, Controller, Get, Post, UploadedFile, UseGuards, UseInterceptors, } from '@nestjs/common';
import { TeachersAdminService } from '../services/teachersAdmin.services';
import { JwtGuard } from '../guards/jwtAuth.guard';
import { TeacherDto } from '../dto/Teacher.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('admin')
export class TeachersAdminController {
    constructor(
        private readonly teachersAdminService: TeachersAdminService,
    ) { }

    @UseGuards(JwtGuard)
    @Post('addteacher')
    @UseInterceptors(FileInterceptor('image'))
    async addTeacher(
        @Body() teacherDto: TeacherDto,
        @UploadedFile() file: Express.Multer.File
    ) {
        const response = await this.teachersAdminService.addTeacher(teacherDto, file);
        return response;
    }

    @UseGuards(JwtGuard)
    @Get('teacherslist')
    async getTeachersList() {
        const teachers = await this.teachersAdminService.getTeachersList();
        return teachers;
    }

}