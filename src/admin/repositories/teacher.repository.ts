import { Injectable } from "@nestjs/common";
import { Teacher } from "../schema/teacher.schema";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { TeacherInterface } from "../interfaces/teacher.interface";

@Injectable()
export class TeacherRepository {
    constructor(@InjectModel(Teacher.name) private teacherModel: Model<Teacher>) { }

    async createTeacher(teacher: TeacherInterface): Promise<Teacher>{
        const addteacher = new this.teacherModel(teacher)
        return addteacher.save()
    }

    async findByEmail(email:string){
        return await this.teacherModel.findOne({email});
    }

    async findTeachers(){
        return await this.teacherModel.find()
    }

}