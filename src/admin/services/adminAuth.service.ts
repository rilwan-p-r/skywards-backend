import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { AdminAuthRepository } from '../repositories/AdminAuth.repository';

@Injectable()
export class AdminauthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly adminAuthRepository: AdminAuthRepository
    ) { }

    async adminlogin(input: any, res: Response) {
        console.log(input);

        const adminEmail = process.env.ADMIN_EMAIL
        const adminPassword = process.env.PASSWORD

        console.log('email:', adminEmail, 'pass:', adminPassword);
        console.log('bodyyy:', input.email, input.password);

        if (input.email === adminEmail && input.password === adminPassword) {
            console.log('heloooo');

            const tokens = await this.generateToken(adminEmail);

            console.log('generated tokennn', tokens.accessToken);

            res.cookie('adminJwt', tokens.accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 24 * 60 * 60 * 1000,
            });

            return {
                email: adminEmail,
            };

        } else {
            throw new UnauthorizedException('Invalid credentials');
        }
    }

    async refreshTokens(refreshToken: string) {
        const tokenRecord = await this.adminAuthRepository.findOne(refreshToken);

        if (!tokenRecord) {
            throw new UnauthorizedException('Invalid refresh token');
        }

        const payload = { email: tokenRecord.email };
        return this.generateToken(payload)
    }

    async generateToken(adminEmail) {
        const payload = { adminEmail };
        const accessToken = this.jwtService.sign(payload, { secret: process.env.SECRET_KEY })
        const refreshToken = uuidv4();
        await this.adminAuthRepository.storeRefreshToken(refreshToken, adminEmail)
        return {
            accessToken,
            refreshToken
        }
    }

    async adminLogout(res: Response) {
        res.cookie('adminJwt', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            expires: new Date(0),
        });

        return { message: 'Logged out successfully' };
    }
}