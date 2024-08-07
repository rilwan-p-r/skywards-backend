import { Body, Controller, Get, Post, UploadedFile, UseGuards, UseInterceptors, } from '@nestjs/common';
import { JwtAdminGuard } from 'src/guards/jwtAdminAuth.guard';
import { StudentDto } from '../dto/Student.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { StudentAdminService } from '../services/studentAdmin.service';

@Controller('admin')
export class StudentAdminController {
    constructor(
        private readonly studentAdminService:StudentAdminService,
    ) { }

    @UseGuards(JwtAdminGuard)
    @Post('addstudent')
    @UseInterceptors(FileInterceptor('image'))
    async addStudent(
        @Body() studentDto: StudentDto,
        @UploadedFile() file: Express.Multer.File
    ) {
        const response = await this.studentAdminService.addStudent(studentDto, file);
        return response;
    }

    @UseGuards(JwtAdminGuard)
    @Get('studentslist')
    async getStudentsList() {
        const students = await this.studentAdminService.getStudents();
        return students;
    }


}