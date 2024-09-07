import { Injectable, NotFoundException, } from '@nestjs/common';
import { BatchRepository } from '../repositories/batchRepository';
import { Types } from 'mongoose';
import { BatchDto } from '../dto/Batch.dto';
import { EditBatchDto } from '../dto/editBatch.dto';

@Injectable()
export class BatchAdminService {
    constructor(
        private readonly batchAdminRepository: BatchRepository
    ) { }

    async createBatch(BatchValue: BatchDto) {
        try {
            const newBatch = {
                ...BatchValue,
                courseId: new Types.ObjectId(BatchValue.courseId),
                teacherId: new Types.ObjectId(BatchValue.teacherId)
            };
            const batch = await this.batchAdminRepository.createBatch(newBatch);
            console.log(batch);
            return batch;
        } catch (error) {
            throw new Error(`Failed to create batch: ${error.message}`);
        }
    }

    async getBatches() {
        try {
            const batches = await this.batchAdminRepository.findbatches();
            console.log('batches', batches);
            return batches;
        } catch (error) {
            throw new Error(`Failed to fetch batches: ${error.message}`);
        }
    }

    async editBatch(batchId: string, editBatchDto: EditBatchDto) {
        try {
            const existingBatch = await this.batchAdminRepository.findByBatchId(new Types.ObjectId(batchId))
            if (!existingBatch) {
                throw new NotFoundException('Batch not founded')
            }
            const updatedValues = {
                ...existingBatch.toObject(),
                ...editBatchDto,
                ...(editBatchDto.courseId && { courseId: new Types.ObjectId(editBatchDto.courseId) }),
                ...(editBatchDto.teacherId && { teacherId: new Types.ObjectId(editBatchDto.teacherId) }),
            };
            const updatedBatch = await this.batchAdminRepository.updateBatch(new Types.ObjectId(batchId), updatedValues)
            return {
                message: 'Batch updated successfully',
                updatedBatch
            }
        } catch (error) {
            console.log(error);
            throw new Error('Failed  to update batch');
        }
    }

}