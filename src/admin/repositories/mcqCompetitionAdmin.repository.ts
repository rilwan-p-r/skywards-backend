import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MCQCompetition } from '../schema/mcqCompetition.schema';
import { CreateMCQCompetitionDto } from '../dto/CreateMCQCompetition.dto';

@Injectable()
export class MCQCompetitionAdminRepository {
  constructor(
    @InjectModel(MCQCompetition.name) private mcqCompetitionModel: Model<MCQCompetition>
  ) { }

  async create(createMCQCompetitionDto: CreateMCQCompetitionDto): Promise<MCQCompetition> {
    const createdMCQCompetition = new this.mcqCompetitionModel(createMCQCompetitionDto);
    return createdMCQCompetition.save();
  }

  async getMCQCompetition() {
    const response = await this.mcqCompetitionModel.find()
    return response;
  }
}