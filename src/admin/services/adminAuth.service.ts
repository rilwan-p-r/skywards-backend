import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { AdminAuthRepository } from '../repositories/adminAuth.repository';

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

            this.setTokenCookie(res, 'adminAccessToken', tokens.accessToken, 24 * 60 * 60 * 1000);
            this.setTokenCookie(res, 'adminRefreshToken', tokens.refreshToken, 15 * 24 * 60 * 60 * 1000);

            return {
                email: adminEmail,
            };

        } else {
            throw new UnauthorizedException('Invalid credentials');
        }
    }

    async refreshTokens(refreshToken: string,  res: Response) {
        const tokenRecord = await this.adminAuthRepository.findOne(refreshToken);

        if (!tokenRecord) {
            throw new UnauthorizedException('Invalid Admin Refresh Token');
        }

        const tokens = await this.generateToken(tokenRecord.email);

        this.setTokenCookie(res, 'adminAccessToken', tokens.accessToken, 24 * 60 * 60 * 1000);;
        this.setTokenCookie(res, 'adminRefreshToken', tokens.refreshToken, 15 * 24 * 60 * 60 * 1000);

        return { message: 'Admin tokens refreshed successfully' };
    }   

    async generateToken(adminEmail: string) {
        const payload = { adminEmail };
        const accessToken = this.jwtService.sign(payload, { secret: process.env.SECRET_KEY, expiresIn: '10s' })
        const refreshToken = uuidv4();
        await this.adminAuthRepository.storeRefreshToken(refreshToken, adminEmail)
        return {
            accessToken,
            refreshToken
        }
    }

    async adminLogout(res: Response) {
        this.clearTokenCookie(res, 'adminAccessToken');
        this.clearTokenCookie(res, 'adminRefreshToken');

        return { message: 'Logged out successfully' };
    }


    private setTokenCookie(res: Response, name: string, value: string, maxAge: number) {
        res.cookie(name, value, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: maxAge,
        });
    }

    private clearTokenCookie(res: Response, name: string) {
        res.cookie(name, '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            expires: new Date(0),
        });
    }
}