import { ConflictException, Injectable, NotFoundException, } from '@nestjs/common';
import { TeacherDto } from '../dto/Teacher.dto';
import { TeacherInterface } from '../interfaces/teacher.interface';
import { TeacherAdminRepository } from '../repositories/teacherAdmin.repository';
import { generatePassword } from '../../utils/generatePassword';
import { EmailService } from '../../email/email.service';
import { EditTeacherDto } from '../dto/EditTeacher.dto';
import { Types } from 'mongoose'

@Injectable()
export class TeachersAdminService {
    constructor(
        private readonly teacherAdminRepository: TeacherAdminRepository,
        private readonly emailService: EmailService
    ) { }

    async addTeacher(teacherDto: TeacherDto, file: Express.Multer.File): Promise<TeacherInterface> {
        const imageUrl = (file as any).location
        
        const existingTeacher = await this.teacherAdminRepository.findByEmail(teacherDto.email);

        if (existingTeacher) {
            throw new ConflictException('Teacher with this email already exists');
        }

        const randomPassword = generatePassword(8);
        console.log('passs', randomPassword);

        const newTeacher: TeacherInterface = {
            ...teacherDto,
            imageUrl,
            verified: false,
            password: randomPassword
        };


        await this.emailService.sendTeacherCredentials(teacherDto.email, randomPassword);

        const createdTeacher = await this.teacherAdminRepository.createTeacher(newTeacher);
        console.log('created....', createdTeacher);

        return createdTeacher;
    }

    async getTeachers() {
        try {
            const teachers = await this.teacherAdminRepository.findTeachers();
            console.log(teachers);
            return teachers;
        } catch (error) {
            throw new Error(`Failed to fetch teachers: ${error.message}`);
        }
    }

    async editTeacher(teacherID: string, editTeacherDto: EditTeacherDto, file: Express.Multer.File) {
        try {
            const objectId = new Types.ObjectId(teacherID)
            const existingTeacher = await this.teacherAdminRepository.findByTeacherId(objectId)
            if (!existingTeacher) {
                throw new NotFoundException('Teacher not founded')
            }
            let imageUrl = existingTeacher.imageUrl
            if (file) {
                imageUrl = (file as any).location
            }
            const updatedValues = {
                ...editTeacherDto,
                imageUrl,
            }
            const updatedTeacher = await this.teacherAdminRepository.updateTeacher(objectId, updatedValues)
            return {
                message: 'Teacher updated successfully',
                updatedTeacher
            };
        } catch (error) {
            console.log(error);
            throw new Error;
        }
    }

    async deleteTeacher(teacherId: string) {
        try {
            const objectId = new Types.ObjectId(teacherId)
            const existingTeacher = await this.teacherAdminRepository.findByTeacherId(objectId)
            if (!existingTeacher) {
                throw new NotFoundException('Teacher not founded')
            }
            const response = await this.teacherAdminRepository.deleteTeacher(objectId)
            return response
        } catch (error) {
            console.log(error);
            throw new Error;
        }
    }

}