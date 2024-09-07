import { Types } from 'mongoose';

export interface BatchInterface {
  courseId: Types.ObjectId;
  division: string;
  batch: string;
  teacherId: Types.ObjectId;
  noOfStudentsCapacity: number;
}
