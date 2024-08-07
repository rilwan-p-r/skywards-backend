import { Body, Controller, Post, Res, UseGuards,} from '@nestjs/common';
import { AdminauthService } from '../services/adminAuth.service';
import { Response } from 'express';
import { JwtAdminGuard } from 'src/guards/jwtAdminAuth.guard';
import { AdminLoginDto } from '../dto/adminLogin.dto';

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
        console.log('resssssss', res.statusCode);
        return this.adminauthService.adminlogin(adminLoginDto, res);
    }

    @UseGuards(JwtAdminGuard)
    @Post('logout')
    async adminLogout(@Res({ passthrough: true }) res: Response) {
        return this.adminauthService.adminLogout(res);
    }
}