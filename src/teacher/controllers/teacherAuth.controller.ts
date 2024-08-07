import { Body, Controller, Post, Res, UseGuards,} from '@nestjs/common';
import { TeacherLoginDto } from '../dto/teacherLogin.dto';
import { TeacherAuthService } from '../services/teacherAuth.service';
import { Response } from 'express';
import { JwtTeacherGuard } from 'src/guards/jwtTeacherAuth.guard';

@Controller('teacher')
export class TeacherAuthController {
    constructor(private readonly teacherAuthService:TeacherAuthService ){}

    @Post('login')
    async teacherLogin(
        @Body() teacherLoginDto:TeacherLoginDto,
        @Res({ passthrough: true }) res: Response
    ) {
        return this.teacherAuthService.teacherLogin(teacherLoginDto, res);
    }

    @UseGuards(JwtTeacherGuard)
    @Post('logout')
    async adminLogout(@Res({ passthrough: true }) res: Response) {
        return this.teacherAuthService.teacherLogout(res);
    }
}
