import { Injectable } from "@nestjs/common";
import { LeaveStudentDto } from "../dto/leaveStudent.dto";
import { StudentLeaveRepository } from "../repositories/studentLeave.repository";

@Injectable()
export class StudentLeaveService{
    constructor(
        private readonly studentLeaveRepository:StudentLeaveRepository
    ){

    }
    async leaveApplyStudent(leaveStudentDto: LeaveStudentDto) {
        return this.studentLeaveRepository.leaveApplyStudent(leaveStudentDto);
      }
}