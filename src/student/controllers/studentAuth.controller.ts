import { Body, Controller, Post, Res, UseGuards,  } from '@nestjs/common';
import { StudentAuthService } from '../services/studentAuth.service';
import { StudentLoginDto } from '../dto/StudentLogin.dto';
import { Response } from 'express';
import { JwtStudentGuard } from 'src/guards/jwtStudentAuth.guard';

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

    @UseGuards(JwtStudentGuard)
    @Post('logout')
    async adminLogout(@Res({ passthrough: true }) res: Response) {
        return this.studentAuthService.studentLogout(res);
    }

}
