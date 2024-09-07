import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { LeaveApplyStudent } from "../schema/LeaveApplyStudent.schema";
import { Model } from "mongoose";
import { LeaveStudentDto } from "../dto/leaveStudent.dto";
import {Types} from 'mongoose'
@Injectable()
export class StudentLeaveRepository {
  constructor(
    @InjectModel(LeaveApplyStudent.name) private readonly leaveApplyStudentModel: Model<LeaveApplyStudent>,
  ) {}

  async leaveApplyStudent(leaveStudentDto: LeaveStudentDto): Promise<LeaveApplyStudent> {
    const {studentId,batchId,...otherValues} = leaveStudentDto;


    const newLeaveApplication = new this.leaveApplyStudentModel({
      ...otherValues,
      studentId:new Types.ObjectId(studentId),
      batchId:new Types.ObjectId(batchId)
    });
    return newLeaveApplication.save();
  }
}