import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CourseInterface } from "../interfaces/Course.interface";
import { Course } from "../schema/course.scehma";

@Injectable()
export class CourseAdminRepository{
    constructor(@InjectModel(Course.name) private courseModel: Model<Course>,){}
    

    async createCourse(course: CourseInterface): Promise<Course> {
        const createCourse = new this.courseModel(course);
        return createCourse.save();
    }

    async findCourses(): Promise<Course[]> {
        return await this.courseModel.find().exec();
    }

}