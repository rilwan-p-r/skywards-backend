import { Controller, Get, UseGuards,} from '@nestjs/common';
import { StudentAnnouncementService } from '../services/studentAnnouncement.service';
import { JwtStudentGuard } from 'src/guards/jwtStudentAuth.guard';

@Controller('student')
@UseGuards(JwtStudentGuard)
export class StudentAnnouncementController {
  constructor(private readonly announcementService: StudentAnnouncementService) {}


  @Get('getAnnouncements')
  findAll() {
    return this.announcementService.findAll();
  }

}