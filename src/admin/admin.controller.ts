import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { Response } from 'express';
import { JwtGuard } from './guards/jwtAuth.guard';


@Controller('admin')
export class AdminController {
    constructor(private readonly adminService:AdminService){}

    @UseGuards(JwtGuard)
    @Post('adminlogin')
    async login(
        @Body() input: { email: string; password: string },
        @Res({ passthrough: true }) res:Response
    ) {
        return this.adminService.adminlogin(input, res);
    }

}
