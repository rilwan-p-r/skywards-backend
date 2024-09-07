import { Injectable } from "@nestjs/common";
import { Teacher } from "../schema/teacher.schema";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { newPasswordInterface } from "../interfaces/teacherOtp.interface";
import * as bcrypt from 'bcrypt'
import { TeacherRefreshToken } from "../schema/teacherRefreshToken.schema";
import { Types } from 'mongoose'
import { Batch } from "src/admin/schema/batch.schema";

@Injectable()
export class TeacherRepository {
    constructor(
        @InjectModel(Teacher.name) private teacherModel: Model<Teacher>,
        @InjectModel(TeacherRefreshToken.name) private readonly teacherRefreshTokenModel: Model<TeacherRefreshToken>,
        @InjectModel(Batch.name) private readonly batchModel: Model<Batch>,
    ) { }

    async findByEmail(email: string) {
        console.log(email);
        return await this.teacherModel.findOne({ email });
    }

    async changePassword(newPassword: newPasswordInterface) {
        try {
            const hashedPassword = await bcrypt.hash(newPassword.newPassword, 10) //hashingggg here updated oness
            const changeTeacher = await this.teacherModel.updateOne(
                { email: newPassword.email },
                { $set: { password: hashedPassword } }
            );
            console.log('updatedpass', changeTeacher);
            return changeTeacher
        } catch (error) {
            console.log(error);
            throw error
        }
    }

    async findOne(refreshToken: string) {
        return this.teacherRefreshTokenModel.findOne({
            token: refreshToken,
            expiryDate: { $gte: new Date() }
        });
    }

    async storeRefreshToken(token: string, studentEmail: string) {
        console.log('teacherAuthrepooooo', studentEmail);
        const email = studentEmail
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 15);
        await this.teacherRefreshTokenModel.updateOne(
            { email },
            { $set: { expiryDate, token } },
            { upsert: true })
    }

    async getBatchesAndCoursesByTeacherId(teacherId: Types.ObjectId) {
        return await this.batchModel.aggregate([
            { $match: { teacherId: teacherId } },
            {
                $lookup: {
                    from: 'courses',
                    localField: 'courseId',
                    foreignField: '_id',
                    as: 'course'
                }
            },
            { $unwind: '$course' },
            {
                $project: {
                    _id: 1,
                    batch: 1,
                    division: 1,
                    'course._id': 1,
                    'course.course': 1
                }
            }
        ]).exec();
    }

    async findTeacherById(teacherId:Types.ObjectId){
        return this.teacherModel.findById(teacherId)
    }

}