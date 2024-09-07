import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFile, UseGuards, UseInterceptors, } from '@nestjs/common';
import { JwtAdminGuard } from 'src/guards/jwtAdminAuth.guard';
import { StudentDto } from '../dto/Student.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { StudentAdminService } from '../services/studentAdmin.service';
import { EditStudentDto } from '../dto/EditStudent.dto';

@Controller('admin')
export class StudentAdminController {
    constructor(
        private readonly studentAdminService: StudentAdminService,
    ) { }

    @UseGuards(JwtAdminGuard)
    @Post('addstudent')
    @UseInterceptors(FileInterceptor('image'))
    async addStudent(
        @Body() studentDto: StudentDto,
        @UploadedFile() file: Express.Multer.File
    ) {
        console.log('addingFileessssssssssssssssss', file);
        console.log('studentDto', studentDto);
        const response = await this.studentAdminService.addStudent(studentDto, file);
        return response;
    }

    @UseGuards(JwtAdminGuard)
    @Get('studentslist')
    async getStudentsList() {
        const students = await this.studentAdminService.getStudents();
        return students;
    }

    @UseGuards(JwtAdminGuard)
    @Get('getStudentsByBatchId/:batchId')
    async getStudentsByBatchId(@Param('batchId') batchId: string) {
        const response = await this.studentAdminService.getStudentsByBatchId(batchId);
        return response;
    }

    @UseGuards(JwtAdminGuard)
    @Put('editStudent/:studentId')
    @UseInterceptors(FileInterceptor('image'))
    async editStudent(
        @Param('studentId') studentId: string,
        @Body() editStudentDto: EditStudentDto,
        @UploadedFile() file: Express.Multer.File) {

        console.log('editingFilesssssssssssssss:', file);

        const response = await this.studentAdminService.editStudent(studentId, editStudentDto, file)
        console.log('Edit response:', response);
        return response
    }

    @UseGuards(JwtAdminGuard)
    @Delete('deleteStudent/:studentId')
    async deleteStudent(@Param('studentId') studentId: string) {
        const response = await this.studentAdminService.deleteStudent(studentId)
        return response;
    }
}