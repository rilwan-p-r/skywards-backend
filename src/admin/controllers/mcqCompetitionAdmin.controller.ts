import { Controller, Post, UseGuards, Body, Get } from '@nestjs/common';
import { JwtAdminGuard } from 'src/guards/jwtAdminAuth.guard';
import { MCQCompetitionAdminService } from '../services/mcqCompetitionAdmin.service';
import { CreateMCQCompetitionDto } from '../dto/CreateMCQCompetition.dto';

@Controller('admin')
@UseGuards(JwtAdminGuard)
export class MCQCompetitionAdminController {
  constructor(private readonly mcqCompetitionAdminService: MCQCompetitionAdminService) {}

  @Post('addMCQCompetition')
  async addMCQCompetition(@Body() createMCQCompetitionDto: CreateMCQCompetitionDto) {
    return this.mcqCompetitionAdminService.createMCQCompetition(createMCQCompetitionDto);
  }

  @Get('getMCQCompetition')
  async getMCQCompetition(){
    return this.mcqCompetitionAdminService.getMCQCompetition()
  }

}