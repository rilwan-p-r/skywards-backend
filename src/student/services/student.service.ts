import { Injectable, NotFoundException } from "@nestjs/common";
import { StudentRepository } from "../repositories/student.repository";
import {Types} from 'mongoose'
import { AttendanceRepository } from "src/attendance/repositories/attendance.repository";
import { GetMyAttendanceDto } from "../dto/getMyAttendance.dto";
import { BatchRepository } from "src/admin/repositories/batchRepository";
@Injectable()
export class StudentService{
    constructor(
        private readonly studentRepository:StudentRepository,
        private readonly attendanceRepository: AttendanceRepository,
        private readonly batchRepository:BatchRepository,
        
    ){}
    
    async getStudentById(studentId:string){
        try{
            const existingStudent = await this.studentRepository.findStudentById(new Types.ObjectId(studentId))
            return existingStudent;
        }catch(error){

        }
    }

    async getMyAttendance(studentId: string, query: GetMyAttendanceDto) {
        const student = await this.studentRepository.findStudentById(new Types.ObjectId(studentId));
        if (!student) {
          throw new NotFoundException('Student not found');
        }
        return this.attendanceRepository.findMyAttendance(studentId, query);
      }

      async getBatcheAndCourse(batchId:string){
        const batchDetails = await this.batchRepository.findBatchWithDetails(new Types.ObjectId(batchId));
        if (!batchDetails) {
            throw new NotFoundException('Batch not found');
        }
        return batchDetails;
    }

    async getStudentsByBatchId(batchId: string) {
      try {
          const students = await this.attendanceRepository.getStudentsByBatchId(new Types.ObjectId(batchId));
          if (!students || students.length === 0) {
              return { statusCode: 204, data: [] };
          }
          return { data: students }
      } catch (error) {
          throw new Error(`Failed to fetch students for batch ${batchId}: ${error.message}`);
      }
  }

      
    }

