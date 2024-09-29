import { Controller, Post, Body, Get,} from '@nestjs/common';
import { CreateAnnouncementDto } from '../dto/CreateAnnouncement.dto';
import { AdminAnnouncementService } from '../services/adminAnnouncement.service';


@Controller('admin')
export class AdminAnnouncementController {
  constructor(private readonly adminAnnouncementService: AdminAnnouncementService) {}

  @Post('createAnnouncement')
  create(@Body() createAnnouncementDto: CreateAnnouncementDto) {
    return this.adminAnnouncementService.create(createAnnouncementDto);
  }

  @Get('getAnnouncements')
  findAll() {
    return this.adminAnnouncementService.findAll();
  }

}