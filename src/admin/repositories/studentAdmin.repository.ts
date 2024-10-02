import { Injectable } from "@nestjs/common";
import { Student } from "../../student/schema/student.schema";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { StudentInterface } from "../interfaces/student.interface";
import { Types } from 'mongoose';
import { response } from "express";

@Injectable()
export class StudentAdminRepository {
  constructor(@InjectModel(Student.name) private studentModel: Model<Student>) { }

  async createStudent(student: StudentInterface): Promise<Student> {
    const addstudent = new this.studentModel(student)
    return addstudent.save()
  }

  async findByEmail(email: string) {
    return await this.studentModel.findOne({ email });
  }

  async getStudentsCount(){
    return await this.studentModel.find();
  }

  async findStudents(page: number, limit: number, search: string) {
    const skip = (page - 1) * limit;
    const searchQuery = search
      ? {
        $or: [
          { firstName: { $regex: search, $options: 'i' } },
          { lastName: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ]
      }
      : {};
    const students = await this.studentModel
      .find(searchQuery)
      .skip(skip)
      .limit(limit)
      .populate({
        path: 'batchId',
        populate: {
          path: 'courseId'
        }
      });

    const total = await this.studentModel.countDocuments(searchQuery);

    return {
      students,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  async getStudentsByBatchId(batchId: Types.ObjectId) {
    return await this.studentModel.find({ batchId }).populate('batchId');
  }

  async findBystudentId(studentId: Types.ObjectId): Promise<Student | null> {
    return await this.studentModel.findById(studentId).exec();
  }

  async updateStudent(studentId: Types.ObjectId, updateData: Partial<StudentInterface>): Promise<Student | null> {
    const resonse = this.studentModel.findByIdAndUpdate(studentId, updateData, { new: true }).exec();
    console.log(response);
    return resonse
  }

  async deleteStudentById(studentId: Types.ObjectId) {
    const response = await this.studentModel.deleteOne({ _id: studentId })
    return response
  }
}   