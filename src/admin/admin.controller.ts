import { Body, Controller, Post, Res,  } from '@nestjs/common';
import { AdminService } from './admin.service';
import { Response } from 'express';
// import { JwtGuard } from './guards/jwtAuth.guard';


@Controller('admin')
export class AdminController {
    constructor(private readonly adminService:AdminService){}

    @Post('login')
    async adminLogin(
        @Body() input: { email: string; password: string },
        @Res({ passthrough: true }) res:Response
    ) {
        console.log('resssssss',res.statusCode);
        
        return this.adminService.adminlogin(input, res);
    }
    
    // @UseGuards(JwtGuard)

}
