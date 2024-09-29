import { Body, Controller, Get, Param, Post, Put, UseGuards, } from '@nestjs/common';
import { JwtAdminGuard } from 'src/guards/jwtAdminAuth.guard';
import { BatchAdminService } from '../services/batchAdmin.service';
import { BatchDto } from '../dto/Batch.dto';
import { EditBatchDto } from '../dto/editBatch.dto';


@Controller('admin')
@UseGuards(JwtAdminGuard)
export class BatchAdminController {
    constructor(
        private readonly batchAdminService: BatchAdminService,
    ) { }

    @Post('createBatch')
    async createBatch(
        @Body() batchDto: BatchDto,
    ) {
        const response = await this.batchAdminService.createBatch(batchDto);
        return response;
    }

    @Get('getBatchList')
    async etBatches() {
        const response = await this.batchAdminService.getBatches();
        return response;
    }

    @Put('editBatch/:batchId')
    async editBatch(
        @Param('batchId') batchId: string,
        @Body() editBatchDto: EditBatchDto) {
            const response = await this.batchAdminService.editBatch(batchId,editBatchDto)
            return response;
    }


}