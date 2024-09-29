import { Injectable } from '@nestjs/common';
import { AnnouncementRepository } from 'src/admin/repositories/announcement.repository';


@Injectable()
export class StudentAnnouncementService {
  constructor(private readonly announcementRepository: AnnouncementRepository) {}

  

  findAll() {
    return this.announcementRepository.findAll();
  }
}