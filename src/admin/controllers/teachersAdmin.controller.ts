import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFile, UseGuards, UseInterceptors, } from '@nestjs/common';
import { TeachersAdminService } from '../services/teachersAdmin.service';
import { JwtAdminGuard } from 'src/guards/jwtAdminAuth.guard';
import { TeacherDto } from '../dto/Teacher.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { EditTeacherDto } from '../dto/EditTeacher.dto';

@Controller('admin')
export class TeachersAdminController {
    constructor(
        private readonly teachersAdminService: TeachersAdminService,
    ) { }

    @UseGuards(JwtAdminGuard)
    @Post('addteacher')
    @UseInterceptors(FileInterceptor('image'))
    async addTeacher(
        @Body() teacherDto: TeacherDto,
        @UploadedFile() file: Express.Multer.File
        
    ) {

        
        const response = await this.teachersAdminService.addTeacher(teacherDto, file);
        return response;
    }

    @UseGuards(JwtAdminGuard)
    @Get('teacherslist')
    async getTeachersList() {
        const teachers = await this.teachersAdminService.getTeachers();
        return teachers;
    }

    @UseGuards(JwtAdminGuard)
    @Put('editTeacher/:teacherId')
    @UseInterceptors(FileInterceptor('image'))
    async editTeacher(
        @Param('teacherId') teacherId:string,
        @Body() editTeacherDto:EditTeacherDto,
        @UploadedFile() file:Express.Multer.File,
    ){
        const response = await this.teachersAdminService.editTeacher(teacherId, editTeacherDto, file)
        return response
    }

    @UseGuards(JwtAdminGuard)
    @Delete('deleteTeacher/:teacherId')
    async deleteTeacher(@Param('teacherId')teacherId:string){
        const response = await this.teachersAdminService.deleteTeacher(teacherId)
        return response;
    }

}