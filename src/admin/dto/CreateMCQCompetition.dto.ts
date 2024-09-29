import { IsString, IsNumber, IsDate, IsArray, ValidateNested, Min, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';

class QuestionDto {
  @IsString()
  question: string;

  @IsArray()
  @ArrayMinSize(4)
  @IsString({ each: true })
  options: string[];

  @IsNumber()
  @Min(0)
  correctAnswer: number;

  @IsNumber()
  @Min(1)
  score: number;
}

export class CreateMCQCompetitionDto {
  @IsString()
  competitionTitle: string;

  @IsString()
  competitionSummary: string;

  @IsNumber()
  @Min(1)
  timeLimit: number;

  @IsDate()
  @Type(() => Date)
  endDate: Date;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionDto)
  @ArrayMinSize(1)
  questions: QuestionDto[];
}