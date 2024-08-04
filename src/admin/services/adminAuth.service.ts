import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

@Injectable()
export class AdminauthService {
    constructor(
        private readonly jwtService: JwtService,
    ) { }

    async adminlogin(input: any, res: Response) {
        const adminEmail = process.env.ADMIN_EMAIL
        const adminPassword = process.env.PASSWORD

        console.log('email:', adminEmail, 'pass:', adminPassword);
        console.log('bodyyy:', input.email, input.password);

        if (input.email === adminEmail && input.password === adminPassword) {
            const payload = { adminEmail };
            const token = this.jwtService.sign(payload, { secret: process.env.SECRET_KEY })
            console.log('generated tokennn', token);

            res.cookie('adminJwt', token, {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                maxAge: 24 * 60 * 60 * 1000,
            });

            return {
                email: payload.adminEmail,
                accessToken: token,
            };

        } else {
            throw new UnauthorizedException('Invalid credentials');
        }
    }

    async adminLogout(res: Response) {
        res.cookie('adminJwt', '', {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            expires: new Date(0),
        });

        return { message: 'Logged out successfully' };
    }

}