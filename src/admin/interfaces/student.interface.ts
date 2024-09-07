import { Types } from 'mongoose';

export interface StudentInterface {
    // _id?: Types.ObjectId;
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    gender: string;
    address: string;
    email: string;
    phoneNumber: string;
    emergencyContact: string;
    bloodGroup?: string;
    admissionDate: Date;
    imageUrl: string;
    verified: boolean;
    password: string;
    batchId: Types.ObjectId;
}