import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFile, UseGuards, UseInterceptors, } from '@nestjs/common';
import { TeachersAdminService } from '../services/teachersAdmin.service';
import { JwtAdminGuard } from 'src/guards/jwtAdminAuth.guard';
import { TeacherDto } from '../dto/Teacher.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { EditTeacherDto } from '../dto/EditTeacher.dto';
import { S3Service } from 'src/aws/awsS3.service';

@Controller('admin')
@UseGuards(JwtAdminGuard)
export class TeachersAdminController {
    constructor(
        private readonly teachersAdminService: TeachersAdminService,
        private readonly s3Service: S3Service,
    ) { }

    @Post('addteacher')
    @UseInterceptors(FileInterceptor('image'))
    async addTeacher(
        @Body() teacherDto: TeacherDto,
        @UploadedFile() file: Express.Multer.File

    ) {
        let imageUrl: string | undefined;
        if (file) {
            imageUrl = await this.s3Service.uploadFile(file);
        }
        const response = await this.teachersAdminService.addTeacher(teacherDto, imageUrl);
        return response;
    }

    @Get('teacherslist')
    async getTeachersList() {
        const teachers = await this.teachersAdminService.getTeachers();
        return teachers;
    }

    @Put('editTeacher/:teacherId')
    @UseInterceptors(FileInterceptor('image'))
    async editTeacher(
        @Param('teacherId') teacherId: string,
        @Body() editTeacherDto: EditTeacherDto,
        @UploadedFile() file: Express.Multer.File,
    ) {
        let imageUrl: string | undefined;
        if (file) {
            imageUrl = await this.s3Service.uploadFile(file);
        }
        const response = await this.teachersAdminService.editTeacher(teacherId, editTeacherDto, imageUrl)
        return response
    }

    @Delete('deleteTeacher/:teacherId')
    async deleteTeacher(@Param('teacherId') teacherId: string) {
        const response = await this.teachersAdminService.deleteTeacher(teacherId)
        return response;
    }

}