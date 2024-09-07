import { Body, Controller, Post, Req, Res, UseGuards,} from '@nestjs/common';
import { AdminauthService } from '../services/adminAuth.service';
import { Request, Response } from 'express';
import { JwtAdminGuard } from 'src/guards/jwtAdminAuth.guard';
import { AdminLoginDto } from '../dto/AdminLogin.dto';

@Controller('admin')
export class AdminAuthController {
    constructor(
        private readonly adminauthService: AdminauthService,
    ) { }

    @Post('login')
    async adminLogin(
        @Body() adminLoginDto: AdminLoginDto,
        @Res({ passthrough: true }) res: Response
    ) {
        console.log('bbbbb',adminLoginDto);
        return this.adminauthService.adminlogin(adminLoginDto, res);
    }

    @UseGuards(JwtAdminGuard)
    @Post('logout')
    async adminLogout(@Res({ passthrough: true }) res: Response) {
        return this.adminauthService.adminLogout(res);
    }

    @Post('refresh')
    async refreshToken(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        const refreshToken = req.cookies['adminRefreshToken'];
        return this.adminauthService.refreshTokens(refreshToken, res);
    }
}