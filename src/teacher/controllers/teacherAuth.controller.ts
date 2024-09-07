import { Body, Controller, Post, Req, Res,} from '@nestjs/common';
import { TeacherLoginDto } from '../dto/teacherLogin.dto';
import { TeacherAuthService } from '../services/teacherAuth.service';
import { Request, Response } from 'express';

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
