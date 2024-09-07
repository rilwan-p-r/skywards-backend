import { Injectable } from "@nestjs/common";
import { TeacherRepository } from "../repositories/teacher.repository";
import {Types} from 'mongoose'
@Injectable()
export class TeacherService{
    constructor(
        private readonly teacherRepository:TeacherRepository,
    ){}

    async getBatchesAndCoursesByTeacherId(teacherId: string) {
        try {
            const batchesWithCourses = await this.teacherRepository.getBatchesAndCoursesByTeacherId(new Types.ObjectId(teacherId));
            return batchesWithCourses;
        } catch (error) {
            console.log(error);
            throw new Error('Error fetching batches and courses for teacher');
        }
    }
    
    async getTeacherById(teacherId:string){
        try{
            const existingTeacher = await this.teacherRepository.findTeacherById(new Types.ObjectId(teacherId))
            return existingTeacher;
        }catch(error){

        }
    }

}