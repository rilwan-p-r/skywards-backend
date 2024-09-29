import { Injectable } from '@nestjs/common';
import { MCQCompetitionAdminRepository } from '../repositories/mcqCompetitionAdmin.repository';
import { CreateMCQCompetitionDto } from '../dto/CreateMCQCompetition.dto';

@Injectable()
export class MCQCompetitionAdminService {
  constructor(private readonly mcqCompetitionAdminRepository: MCQCompetitionAdminRepository) {}

  async createMCQCompetition(createMCQCompetitionDto: CreateMCQCompetitionDto) {
    return this.mcqCompetitionAdminRepository.create(createMCQCompetitionDto);
  }

  async getMCQCompetition(){
    return this.mcqCompetitionAdminRepository.getMCQCompetition()
  }
}