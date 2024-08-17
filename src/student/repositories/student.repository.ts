import { Injectable } from "@nestjs/common";
import { Student } from "../../student/schema/student.schema";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import * as bcrypt from 'bcrypt'
import { newPasswordInterface } from "../interfaces/studentOtp.interface";
import { StudentRefreshToken } from "../schema/studentRefreshToken.schema";

@Injectable()
export class StudentRepository {
    constructor(
        @InjectModel(Student.name) private readonly studentModel: Model<Student>,
        @InjectModel(StudentRefreshToken.name) private readonly studentRefreshTokenModel: Model<StudentRefreshToken>
) { }

    async findByEmail(email:string){
        const student = await this.studentModel.findOne({email});
        console.log('finded', student);
        return student
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

    async findOne(refreshToken: string) {
        return this.studentRefreshTokenModel.findOne({
            token: refreshToken,
            expiryDate: { $gte: new Date() }
        });
    }

    async storeRefreshToken(token: string, studentEmail: string) {
        console.log('studentAuthrepooooo', studentEmail);
        const email = studentEmail
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 15);
        await this.studentRefreshTokenModel.updateOne(
            {  email },
            { $set: { expiryDate, token } },
            { upsert: true })
    }

}