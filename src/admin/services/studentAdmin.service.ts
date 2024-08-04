import { ConflictException, Injectable,} from '@nestjs/common';
import { StudentDto } from '../dto/Student.dto';
import { StudentInterface } from '../interfaces/student.interface';
import { StudentRepository } from '../repositories/student.repository';
import { generatePassword } from '../../utils/generatePassword';
import { EmailService } from '../../email/email.service';

@Injectable()
export class StudentAdminService {
    constructor(
        private readonly studentRepository: StudentRepository,
        private readonly emailService:EmailService
    ) { }

    async addStudent(studentDto: StudentDto, file: Express.Multer.File): Promise<StudentInterface> {
        const imageUrl = (file as any).location;
        const existingStudent = await this.studentRepository.findByEmail(studentDto.email);
    
        if (existingStudent) {
            throw new ConflictException('Student with this email already exists');
        }
    
        const randomPassword = generatePassword(8);
        console.log('passs', randomPassword);
    
        const newStudent: StudentInterface = {
            ...studentDto,
            imageUrl,
            verified: false,
            password: randomPassword
        };

        
        await this.emailService.sendStudentCredentials(studentDto.email, randomPassword);

        const createdStudent = await this.studentRepository.createStudent(newStudent);
        console.log('created....',createdStudent);
        
        return createdStudent;
    }
}