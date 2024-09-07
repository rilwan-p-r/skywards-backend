import { Injectable } from "@nestjs/common";
import { CourseInterface } from "../interfaces/Course.interface";
import { CourseAdminRepository } from "../repositories/courseAdmin.repository";

@Injectable()
export class CourseAdminService {
    constructor(private readonly courseAdminRepository: CourseAdminRepository) { }

    async createCourse(values: CourseInterface) {
        try {
            const createdCourse = await this.courseAdminRepository.createCourse(values)
            console.log('createdCourse', createdCourse);
            return createdCourse;
        } catch (error) {
            throw new Error(`Failed to create course ${error.message}`);
        }
    }

    async getCourses() {
        try {
            const courses = await this.courseAdminRepository.findCourses()
            console.log('courses', courses);

            return courses
        } catch (error) {
            throw new Error(`Failed to fetch courses: ${error.message}`)
        }
    }
}