import { Controller, UseGuards, Get, Param, Query, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { JwtStudentGuard } from 'src/guards/jwtStudentAuth.guard';
import { MCQCompetitionStudentService } from '../services/mcqCompetitionStudent.service';

@Controller('student')
@UseGuards(JwtStudentGuard)
export class MCQCompetitionStudentController {
  constructor(private readonly mcqCompetitionStudentService: MCQCompetitionStudentService) {}


  @Get('getMCQCompetition/:studentId')
  async getMCQCompetition(@Param('studentId') studentId: string) {
    try {
      return await this.mcqCompetitionStudentService.getMCQCompetition(studentId);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('An error occurred while fetching the MCQ Competition', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('checkMCQAttendance/:competitionId')
  async checkCompetitionAttendance(
    @Query('studentId') studentId: string,
    @Param('competitionId') mcqCompetitionId: string
  ) {
    return this.mcqCompetitionStudentService.checkCompetitionAttendance(studentId, mcqCompetitionId);
  }

  @Post('startMCQCompetition/:mcqCompetitionId')
  async startCompetition(
    @Query('studentId') studentId: string,
    @Param('mcqCompetitionId') mcqCompetitionId: string
  ) {
    return this.mcqCompetitionStudentService.startCompetition(studentId, mcqCompetitionId);
  }

  @Post('submitMCQCompetition/:mcqCompetitionId')
  async submitCompetition(
    @Query('studentId') studentId: string,
    @Param('mcqCompetitionId') mcqCompetitionId: string,
    @Body('answers') answers: Record<string, number>
  ) {
    return this.mcqCompetitionStudentService.submitCompetition(studentId, mcqCompetitionId, answers);
  }

}