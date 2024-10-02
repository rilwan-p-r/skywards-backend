import { Body, Controller, Delete, Get, Param, Post, Put, Query, UploadedFile, UseGuards, UseInterceptors, } from '@nestjs/common';
import { JwtAdminGuard } from 'src/guards/jwtAdminAuth.guard';
import { StudentDto } from '../dto/Student.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { StudentAdminService } from '../services/studentAdmin.service';
import { EditStudentDto } from '../dto/EditStudent.dto';
import { S3Service } from 'src/aws/awsS3.service';

@Controller('admin')
@UseGuards(JwtAdminGuard)
export class StudentAdminController {
    constructor(
        private readonly studentAdminService: StudentAdminService,
        private readonly s3Service: S3Service,
    ) { }

    @Post('addstudent')
    @UseInterceptors(FileInterceptor('image'))
    async addStudent(
        @Body() studentDto: StudentDto,
        @UploadedFile() file: Express.Multer.File
    ) {
        let imageUrl: string | undefined;
        if (file) {
            imageUrl = await this.s3Service.uploadFile(file);
        }
        const response = await this.studentAdminService.addStudent(studentDto, imageUrl);
        return response;
    }

    @Get('studentslist')
    async getStudentsList(
        @Query('page') page: number = 1, 
        @Query('limit') limit: number = 10,
        @Query('search') search: string = '') {
      const result = await this.studentAdminService.getStudents(page, limit, search);
      return result;
    }
    @Get('studentCount')
    async getStudentCount(){
    const result = await this.studentAdminService.getStudentsCount()
    return result;
}

    @Get('getStudentsByBatchId/:batchId')
    async getStudentsByBatchId(@Param('batchId') batchId: string) {
        const response = await this.studentAdminService.getStudentsByBatchId(batchId);
        return response;
    }

    @Put('editStudent/:studentId')
    @UseInterceptors(FileInterceptor('image'))
    async editStudent(
        @Param('studentId') studentId: string,
        @Body() editStudentDto: EditStudentDto,
        @UploadedFile() file: Express.Multer.File) {
            let imageUrl: string | undefined;
        if (file) {
            imageUrl = await this.s3Service.uploadFile(file);
        }
        const response = await this.studentAdminService.editStudent(studentId, editStudentDto, imageUrl)
        console.log('Edit response:', response);
        return response
    }

    @Delete('deleteStudent/:studentId')
    async deleteStudent(@Param('studentId') studentId: string) {
        const response = await this.studentAdminService.deleteStudent(studentId)
        return response;
    }
}