import { Injectable } from "@nestjs/common";
import { Teacher } from "../../teacher/schema/teacher.schema";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { TeacherInterface } from "../interfaces/teacher.interface";
import { Types } from 'mongoose';
@Injectable()
export class TeacherAdminRepository {
    constructor(@InjectModel(Teacher.name) private teacherModel: Model<Teacher>) { }

    async createTeacher(teacher: TeacherInterface): Promise<Teacher> {
        const addteacher = new this.teacherModel(teacher)
        return addteacher.save()
    }

    async findByEmail(email: string) {
        return await this.teacherModel.findOne({ email });
    }

    async findTeachers() {
        return await this.teacherModel.find()
    }

    async findByTeacherId(teacherId: Types.ObjectId): Promise<Teacher | null> {
        return this.teacherModel.findById({ _id: teacherId });
    }

    async updateTeacher(teacherId:Types.ObjectId,updatedValues:Partial<TeacherInterface>){
        const response  = await this.teacherModel.findByIdAndUpdate(teacherId,updatedValues,{new:true}).exec();
        return response;
    }

    async deleteTeacher(teacherId:Types.ObjectId){
        return this.teacherModel.findByIdAndDelete(teacherId,{new:true}).exec();
    }

}