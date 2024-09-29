import { Body, Controller, Post, Req, Res, } from '@nestjs/common';
import { StudentAuthService } from '../services/studentAuth.service';
import { StudentLoginDto } from '../dto/StudentLogin.dto';
import { Request, Response } from 'express';

@Controller('student')
export class StudentAuthController {
    constructor(private readonly studentAuthService:StudentAuthService,
    ){}

    @Post('login')
    async studentLogin(
        @Body() studentLoginDto:StudentLoginDto,
        @Res({ passthrough: true }) res: Response
    ) {
        return this.studentAuthService.studentLogin(studentLoginDto, res);
    }

    @Post('logout')
    async adminLogout(@Res({ passthrough: true }) res: Response) {
        return this.studentAuthService.studentLogout(res);
    }

    @Post('refresh')
    async refreshToken(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        const refreshToken = req.cookies['studentRefreshToken'];
        return this.studentAuthService.refreshTokens(refreshToken, res);
    }

}
