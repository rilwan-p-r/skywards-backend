import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StudentMCQAttempt } from '../schema/StudentMCQAttempt.schema';
import { Types } from 'mongoose';
import { MCQCompetition } from 'src/admin/schema/mcqCompetition.schema';

@Injectable()
export class MCQCompetitionStudentRepository {
  constructor(
    @InjectModel(MCQCompetition.name) private mcqCompetitionModel: Model<MCQCompetition>,
    @InjectModel(StudentMCQAttempt.name) private studentMCQAttemptModel: Model<StudentMCQAttempt>
  ) { }

  async getMCQCompetition(studentId: Types.ObjectId) {
    const currentDate = new Date();
  
    // Fetch all competitions (both expired and upcoming)
    const competitions = await this.mcqCompetitionModel.find().sort({ endDate: 1 }).lean();
  
    // Fetch all student attempts
    const attempts = await this.studentMCQAttemptModel.find({ studentId });
  
    // Create a map to easily lookup competitions the student attempted
    const attemptsMap = new Map(attempts.map(attempt => [attempt.mcqCompetitionId.toString(), attempt]));
    console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',attemptsMap);
  
    // Filter and combine competitions:
    const combinedCompetitions = competitions
      .filter(competition => {
        const attempt = attemptsMap.get(competition._id.toString());
        
        // Show upcoming competitions or expired ones only if the student has submitted
        return competition.endDate > currentDate || (attempt && attempt.completed);
      })
      .map(competition => {
        const attempt = attemptsMap.get(competition._id.toString());
        return {
          ...competition,
          attempted: !!attempt,
          score: attempt ? attempt.score : undefined,
          submittedDate: attempt && attempt.updatedAt ? attempt.updatedAt.toISOString() : undefined
        };
      });
  
    return combinedCompetitions;
  }
  



  async checkCompetitionAttendance(studentId: Types.ObjectId, mcqCompetitionId: Types.ObjectId) {
    const attempt = await this.studentMCQAttemptModel.findOne({
      studentId,
      mcqCompetitionId
    });
  
    if (attempt) {
      return {
        attempted: true,
        score: attempt.score,
        submittedDate: attempt.updatedAt ? attempt.updatedAt.toISOString() : undefined
      };
    } else {
      return {
        attempted: false
      };
    }
  }



  async startCompetition(studentId: Types.ObjectId, mcqCompetitionId: Types.ObjectId): Promise<StudentMCQAttempt> {
    const existingAttempt = await this.studentMCQAttemptModel.findOne({
      studentId,
      mcqCompetitionId
    });
  
    if (existingAttempt) {
      return existingAttempt;
    }
    const newAttempt = new this.studentMCQAttemptModel({
      studentId: new Types.ObjectId(studentId),
      mcqCompetitionId: new Types.ObjectId(mcqCompetitionId)
    });
  
    return newAttempt.save();
  }

  async getMCQCompetitionById(mcqCompetitionId: Types.ObjectId): Promise<MCQCompetition | null> {
    return this.mcqCompetitionModel.findById(mcqCompetitionId).exec();
  }

  async submitCompetition(studentId: Types.ObjectId, mcqCompetitionId: Types.ObjectId, answers: Record<string, number>, score: number): Promise<StudentMCQAttempt> {
    const attempt = await this.studentMCQAttemptModel.findOneAndUpdate(
      {
        studentId,
        mcqCompetitionId
      },
      {
        answers: Object.values(answers),
        score,
        completed: true
      },
      { new: true, upsert: true }
    );
    return attempt;
  }
}