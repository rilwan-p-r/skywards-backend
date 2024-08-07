import { Injectable } from "@nestjs/common";
import { Teacher } from "../schema/teacher.schema";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";

@Injectable()
export class TeacherRepository {
    constructor(@InjectModel(Teacher.name) private teacherModel: Model<Teacher>) { }

    async findByEmail(email:string){
        console.log(email);
        
        return await this.teacherModel.findOne({email});
    }
}