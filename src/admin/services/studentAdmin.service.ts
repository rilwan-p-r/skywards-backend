import { ConflictException, Injectable, NotFoundException, } from '@nestjs/common';
import { StudentDto } from '../dto/Student.dto';
import { StudentInterface } from '../interfaces/student.interface';
import { StudentAdminRepository } from '../repositories/studentAdmin.repository';
import { generatePassword } from '../../utils/generatePassword';
import { EmailService } from '../../email/email.service';
import { Types } from 'mongoose';
import { EditStudentDto } from '../dto/EditStudent.dto';


@Injectable()
export class StudentAdminService {
    constructor(
        private readonly studentAdminRepository: StudentAdminRepository,
        private readonly emailService: EmailService,
    ) { }

    async addStudent(studentDto: StudentDto, file: Express.Multer.File): Promise<StudentInterface> {
        const imageUrl = (file as any).location;
        const existingStudent = await this.studentAdminRepository.findByEmail(studentDto.email);

        if (existingStudent) {
            throw new ConflictException('Student with this email already exists');
        }

        const randomPassword = generatePassword(8);
        console.log('passs', randomPassword);

        const newStudent: StudentInterface = {
            ...studentDto,
            imageUrl,
            verified: false,
            password: randomPassword,
            batchId: new Types.ObjectId(studentDto.batchId)
        };

        await this.emailService.sendStudentCredentials(studentDto.email, randomPassword);
        const createdStudent = await this.studentAdminRepository.createStudent(newStudent);
        console.log('createdStudent', createdStudent);

        return createdStudent;
    }

    async getStudents(): Promise<StudentInterface[]> {
        try {
            const students = await this.studentAdminRepository.findStudents();
            console.log(students);
            return students;
        } catch (error) {
            throw new Error(`Failed to fetch students: ${error.message}`);
        }
    }

    async getStudentsByBatchId(batchId: string) {
        try {
            const students = await this.studentAdminRepository.getStudentsByBatchId(new Types.ObjectId(batchId));
            if (!students || students.length === 0) {
                return { statusCode: 204, data: [] };
            }
            return { data: students }
        } catch (error) {
            throw new Error(`Failed to fetch students for batch ${batchId}: ${error.message}`);
        }
    }

    async editStudent(studentId: string, editStudentDto: EditStudentDto, file?: Express.Multer.File) {
        try {
            const objectId = new Types.ObjectId(studentId);

            const existingStudent = await this.studentAdminRepository.findBystudentId(objectId);
            if (!existingStudent) {
                throw new NotFoundException('Student not found');
            }

            let imageUrl = existingStudent.imageUrl;
            if (file) {
                console.log('fileeee', file);

                imageUrl = (file as any).location;
            }

            const updatedValues = {
                ...editStudentDto,
                imageUrl,
                batchId: new Types.ObjectId(editStudentDto.batchId)
            };
            const updatedStudent = await this.studentAdminRepository.updateStudent(objectId, updatedValues);
            return {
                message: 'Student updated successfully',
                updatedStudent
            };
        } catch (error) {
            console.error(error);
            throw new Error('Failed to update student');
        }
    }

    async deleteStudent(studentId: string) {
        try {
            const objectId = new Types.ObjectId(studentId);
            const existingStudent = await this.studentAdminRepository.findBystudentId(objectId)
            if (!existingStudent) {
                throw new NotFoundException('Student Not Found')
            }
            const deletedStudent = await this.studentAdminRepository.deleteStudentById(objectId);
            return deletedStudent
        } catch (error) {
            throw new Error('Failed To Delete Student')
        }

    }

}
