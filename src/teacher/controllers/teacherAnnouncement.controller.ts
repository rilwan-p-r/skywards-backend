import { Controller, Get, UseGuards,} from '@nestjs/common';
import { JwtTeacherGuard } from 'src/guards/jwtTeacherAuth.guard';
import { TeacherAnnouncementService } from '../services/teacherAnnouncement.service';


@Controller('teacher')
@UseGuards(JwtTeacherGuard)
export class TeacherAnnouncementController {
  constructor(private readonly announcementService: TeacherAnnouncementService) {}
  
  
  @Get('getAnnouncements')
  findAll() {
    return this.announcementService.findAll();
  }

}