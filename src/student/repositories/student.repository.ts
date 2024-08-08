import { Injectable } from "@nestjs/common";
import { Student } from "../../student/schema/student.schema";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import * as bcrypt from 'bcrypt'
import { newPasswordInterface } from "../interfaces/studentOtp.interface";

@Injectable()
export class StudentRepository {
    constructor(@InjectModel(Student.name) private studentModel: Model<Student>) { }

    async findByEmail(email:string){
        return await this.studentModel.findOne({email});
    }
    async findById(id:string){
        return await this.studentModel.findById({id});
    }

    async changePassword(newPassword: newPasswordInterface) {
        try {
            const hashedPassword = await bcrypt.hash(newPassword.newPassword, 10) //hashingggg here updated oness
            const changedStudent = await this.studentModel.updateOne(
                { email: newPassword.email },
                { $set: { password: hashedPassword } }
            );
            console.log('updatedpass',changedStudent);
            return changedStudent
        } catch (error) {
            console.log(error);
            throw error
        }
    }
}