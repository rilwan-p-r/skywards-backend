import { Body, Controller, Post, Req, Res, UseGuards,} from '@nestjs/common';
import { TeacherLoginDto } from '../dto/teacherLogin.dto';
import { TeacherAuthService } from '../services/teacherAuth.service';
import { Request, Response } from 'express';
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

    @Post('refresh')
    async refreshToken(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        const refreshToken = req.cookies['teacherRefreshToken'];
        return this.teacherAuthService.refreshTokens(refreshToken, res);
    }

}   
