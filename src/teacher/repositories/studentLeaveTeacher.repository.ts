import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { LeaveApplyStudent } from "src/student/schema/LeaveApplyStudent.schema";
import {Types} from'mongoose'
@Injectable()
export class StudentLeaveTeacherRepository {
    constructor(
        @InjectModel(LeaveApplyStudent.name) private readonly LeaveApplyStudentModel:Model<LeaveApplyStudent>
    ) { }

    async getAppliedLeavesByBatchId(batchId:Types.ObjectId){
        return await this.LeaveApplyStudentModel.find({batchId})
        .populate('studentId', 'firstName lastName email')
        .sort({createdAt:-1})
        .exec();
    }

    async handleLeaveApplication(leaveId: Types.ObjectId, action: 'approve' | 'reject') {
        const status = action === 'approve' ? 'approved' : 'rejected';
        return await this.LeaveApplyStudentModel.findByIdAndUpdate(
            leaveId,
            { status },
            { new: true }
        ).exec();
    }
}