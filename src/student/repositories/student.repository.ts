import { Injectable } from "@nestjs/common";
import { Student } from "../../student/schema/student.schema";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";

@Injectable()
export class StudentRepository {
    constructor(@InjectModel(Student.name) private studentModel: Model<Student>) { }

    async findByEmail(email:string){
        return await this.studentModel.findOne({email});
    }
    async findById(id:string){
        return await this.studentModel.findById({id});
    }
}