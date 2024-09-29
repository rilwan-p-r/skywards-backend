import { Injectable, BadRequestException } from '@nestjs/common';
import { MCQCompetitionStudentRepository } from '../repositories/mcqCompetitionStudent.repository';
import { AttendanceCheckResultInterface } from '../interfaces/attendanceCheckResult.interface';
import { Types } from 'mongoose';

@Injectable()
export class MCQCompetitionStudentService {
  constructor(private readonly mcqCompetitionStudentRepository: MCQCompetitionStudentRepository) {}

  async getMCQCompetition(studentId: string) {
    try {
      const objectId = new Types.ObjectId(studentId);
      return this.mcqCompetitionStudentRepository.getMCQCompetition(objectId);
    } catch (error) {
      console.error('Error in getMCQCompetition:', error);
      throw new BadRequestException('Invalid studentId provided');
    }
  }

  async checkCompetitionAttendance(studentId: string, mcqCompetitionId: string): Promise<AttendanceCheckResultInterface> {
    try {
      const studentObjectId = new Types.ObjectId(studentId);
      const competitionObjectId = new Types.ObjectId(mcqCompetitionId);
      return this.mcqCompetitionStudentRepository.checkCompetitionAttendance(studentObjectId, competitionObjectId);
    } catch (error) {
      console.error('Error in checkCompetitionAttendance:', error);
      throw new BadRequestException('Invalid studentId or mcqCompetitionId provided');
    }
  }

  async startCompetition(studentId: string, mcqCompetitionId: string) {
    try {
      const studentObjectId = new Types.ObjectId(studentId);
      const competitionObjectId = new Types.ObjectId(mcqCompetitionId);
        return this.mcqCompetitionStudentRepository.startCompetition(studentObjectId, competitionObjectId);
    }catch(error){
      console.log(error);
      throw error;
    }
  }

  async submitCompetition(studentId: string, mcqCompetitionId: string, answers: Record<string, number>) {
    try {
      const studentObjectId = new Types.ObjectId(studentId);
      const competitionObjectId = new Types.ObjectId(mcqCompetitionId);
      const competition = await this.mcqCompetitionStudentRepository.getMCQCompetitionById(competitionObjectId);
      if (!competition) {
        throw new BadRequestException('Competition not found');
      }

      const score = this.calculateScore(competition.questions, answers);
      const result = await this.mcqCompetitionStudentRepository.submitCompetition(studentObjectId, competitionObjectId, answers, score);
      return { score, result };
    } catch (error) {
      console.error('Error in submitCompetition:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Invalid studentId or mcqCompetitionId provided');
    }
  }

  private calculateScore(questions: any[], answers: Record<string, number>): number {
    let score = 0;
    questions.forEach(question => {
      if (answers[question._id] === question.correctAnswer) {
        score++;
      }
    });
    return score;
  }
}