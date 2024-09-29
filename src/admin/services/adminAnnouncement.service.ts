import { Injectable } from '@nestjs/common';
import { CreateAnnouncementDto } from '../dto/CreateAnnouncement.dto';
import { AnnouncementRepository } from '../repositories/announcement.repository';

@Injectable()
export class AdminAnnouncementService {
  constructor(private readonly announcementRepository: AnnouncementRepository) {}

  create(createAnnouncementDto: CreateAnnouncementDto) {
    return this.announcementRepository.create(createAnnouncementDto);
  }

  findAll() {
    return this.announcementRepository.findAll();
  }
}