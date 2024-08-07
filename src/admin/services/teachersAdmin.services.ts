import { ConflictException, Injectable,} from '@nestjs/common';
import { TeacherDto } from '../dto/Teacher.dto';
import { TeacherInterface } from '../interfaces/teacher.interface';
import { TeacherAdminRepository } from '../repositories/teacherAdmin.repository';
import { generatePassword } from '../../utils/generatePassword';
import { EmailService } from '../../email/email.service';

@Injectable()
export class TeachersAdminService {
    constructor(
        private readonly teacherAdminRepository: TeacherAdminRepository,
        private readonly emailService:EmailService
    ) { }

    async addTeacher(teacherDto: TeacherDto, file: Express.Multer.File): Promise<TeacherInterface> {
        const imageUrl = (file as any).location;
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
        console.log('created....',createdTeacher);
        
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

}