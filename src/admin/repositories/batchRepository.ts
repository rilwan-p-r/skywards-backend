import { Injectable } from "@nestjs/common";
import { Model, } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Batch } from "../schema/batch.schema";
import { BatchInterface, } from "../interfaces/Batch.interface";
import { Types } from 'mongoose';
@Injectable()
export class BatchRepository {
    constructor(@InjectModel(Batch.name) private BatchModel: Model<Batch>) { }

    async createBatch(batch: BatchInterface): Promise<Batch> {
        const createBatch = new this.BatchModel(batch);
        return createBatch.save();
    }

    async findbatches(): Promise<Batch[]> {
        return await this.BatchModel.find().populate('teacherId').populate('courseId').exec();
    }
    async findByBatchId(batchId: Types.ObjectId): Promise<Batch | null> {
        return this.BatchModel.findById(batchId).exec();
    }

    async updateBatch(batchId: Types.ObjectId, updatedValues: Partial<BatchInterface>): Promise<Batch | null> {
        return this.BatchModel.findByIdAndUpdate(batchId, updatedValues, { new: true }).exec();
    }

    async findBatchWithDetails(batchId:Types.ObjectId){
        return this.BatchModel.findById(batchId)
        .populate('courseId')
        .populate('teacherId')
        .exec();
    }

}
