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

    async addStudent(studentDto: StudentDto, imageUrl?: string): Promise<StudentInterface> {
        const existingStudent = await this.studentAdminRepository.findByEmail(studentDto.email);

        if (existingStudent) {
            throw new ConflictException('Student with this email already exists');
        }

        const randomPassword = generatePassword(8);

        const newStudent: StudentInterface = {
            ...studentDto,
            imageUrl,
            verified: false,
            password: randomPassword,
            batchId: new Types.ObjectId(studentDto.batchId)
        };

        await this.emailService.sendStudentCredentials(studentDto.email, randomPassword);
        const createdStudent = await this.studentAdminRepository.createStudent(newStudent);

        return createdStudent;
    }

    async getStudentsCount(){
        try{
            const count = await this.studentAdminRepository.getStudentsCount()
            return count
        }catch(error){
            throw new Error
        }
    }

    async getStudents(page: number = 1, limit: number = 10, search: string = ''): Promise<any> {
        try {
            const result = await this.studentAdminRepository.findStudents(page, limit, search);
            return result;
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

    async editStudent(studentId: string, editStudentDto: EditStudentDto, newImageUrl?: string) {
        try {
            const objectId = new Types.ObjectId(studentId);

            const existingStudent = await this.studentAdminRepository.findBystudentId(objectId);
            if (!existingStudent) {
                throw new NotFoundException('Student not found');
            }

            const updatedValues = {
                ...editStudentDto,
                imageUrl: newImageUrl || existingStudent.imageUrl,
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
