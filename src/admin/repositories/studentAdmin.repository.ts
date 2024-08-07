import { Injectable } from "@nestjs/common";
import { Student } from "../../student/schema/student.schema";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { StudentInterface } from "../interfaces/student.interface";

@Injectable()
export class StudentAdminRepository {
    constructor(@InjectModel(Student.name) private studentModel: Model<Student>) { }

    async createStudent(student: StudentInterface): Promise<Student>{
        const addstudent = new this.studentModel(student)
        return addstudent.save()
    }

    async findByEmail(email:string){
        return await this.studentModel.findOne({email});
    }

    async findStudents(){
        return await this.studentModel.find();
    }

}