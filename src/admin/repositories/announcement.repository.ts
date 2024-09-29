import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateAnnouncementDto } from '../dto/CreateAnnouncement.dto';
import { Announcement } from '../schema/announcement.schema';

@Injectable()
export class AnnouncementRepository {
  constructor(
    @InjectModel(Announcement.name) private announcementModel: Model<Announcement>,
  ) {}

  async create(createAnnouncementDto: CreateAnnouncementDto): Promise<Announcement> {
    const createdAnnouncement = new this.announcementModel(createAnnouncementDto);
    return createdAnnouncement.save();
  }

  async findAll(): Promise<Announcement[]> {
    return this.announcementModel.find().exec();
  }


}