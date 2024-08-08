import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { TeacherOtp } from "../schema/teacherOtp.schema";
import { teacherOtpInterface } from "../interfaces/teacherOtp.interface";

@Injectable()
export class TeacherOtpRepository {
    constructor(@InjectModel(TeacherOtp.name) private teacherOtpModel: Model<TeacherOtp>) { }

    async createOtp(teacherOtp:teacherOtpInterface):Promise<TeacherOtp>{
        console.log(teacherOtp);
        const createdTeaacherOtp = new this.teacherOtpModel(teacherOtp)
        return createdTeaacherOtp.save()
    }

    async deleteOtpByEmail(email: string): Promise<void> {
        await this.teacherOtpModel.deleteMany({ email }).exec();
    }

    async findEmailOfOtp(email:string){
         const findedEmail=await this.teacherOtpModel.findOne({email}).exec();
         console.log('findedEmail',findedEmail);
         return findedEmail
         
    }
}