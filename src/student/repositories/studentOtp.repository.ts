import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { StudentOtp } from "../schema/studentOtp.schema";
import { studentOtpInterface } from "../interfaces/studentOtp.interface"; 

@Injectable()
export class StudentOtpRepository {
    constructor(@InjectModel(StudentOtp.name) private studentOtpModel: Model<StudentOtp>) { }

    async createOtp(studentOtp:studentOtpInterface):Promise<StudentOtp>{
        console.log(studentOtp);
        const createdStudentOtp = new this.studentOtpModel(studentOtp)
        return createdStudentOtp.save()
    }

    async deleteOtpByEmail(email: string): Promise<void> {
        await this.studentOtpModel.deleteMany({ email }).exec();
    }

    async findEmailOfOtp(email:string){
         const findedEmail=await this.studentOtpModel.findOne({email}).exec();
         console.log('findedEmail',findedEmail);
         return findedEmail
         
    }
}