// review.service.ts
import { Injectable } from '@nestjs/common';
import { CreateReviewDto } from '../dto/review.dto';
import { Review } from '../schema/review.schema';
import { ReviewRepository } from '../repositories/review.repository';

@Injectable()
export class ReviewService {
  constructor(private readonly reviewRepository: ReviewRepository) {}

  async createReview(createReviewDto: CreateReviewDto): Promise<Review> {
    return this.reviewRepository.create(createReviewDto);
  }

  async getAllReviews(): Promise<Review[]> {
    return this.reviewRepository.findAll();
  }
}
