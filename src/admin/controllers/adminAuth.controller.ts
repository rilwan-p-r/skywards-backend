import { Body, Controller, Post, Res, UseGuards,} from '@nestjs/common';
import { AdminauthService } from '../services/adminAuth.service';
import { Response } from 'express';
import { JwtAdminGuard } from 'src/guards/jwtAdminAuth.guard';
import { AdminLoginDto } from '../dto/adminLogin.dto';
import { RefreshTokenDto } from '../dto/refreshToken.dto';

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
    async refreshToken(@Body() refreshTokenDto:RefreshTokenDto){
        return this.adminauthService.refreshTokens(refreshTokenDto.refreshToken)
    }
}