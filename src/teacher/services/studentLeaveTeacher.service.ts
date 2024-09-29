import { Injectable } from "@nestjs/common";
import { StudentLeaveTeacherRepository } from "../repositories/studentLeaveTeacher.repository";
import {Types} from 'mongoose'
@Injectable()
export class StudentLeaveTeacherService{
    constructor(
        private readonly studentLeaveTeacherRepository:StudentLeaveTeacherRepository
    ){}

    async getAppliedLeavesByBatchId(batchId:string){
        const response=await this.studentLeaveTeacherRepository.getAppliedLeavesByBatchId(new Types.ObjectId(batchId))
        return response
    }

    async handleLeaveApplication(leaveId: string, action: 'approve' | 'reject') {
        const response = await this.studentLeaveTeacherRepository.handleLeaveApplication(new Types.ObjectId(leaveId), action);
        return response;
    }
}