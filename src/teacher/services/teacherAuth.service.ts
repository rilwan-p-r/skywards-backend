import { Injectable, UnauthorizedException } from '@nestjs/common';
import { TeacherRepository } from '../repositories/teacher.repository';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TeacherAuthService {
    constructor(
        private readonly teacherRepository: TeacherRepository,
        private readonly jwtService: JwtService
    ) {}
    
    async teacherLogin(input: { email: string; password: string }, res: Response) {
        const teacher = await this.teacherRepository.findByEmail(input.email);
        console.log(teacher);
        
        if (!teacher) {
            throw new UnauthorizedException('Invalid email or password');
        }

        const isPasswordValid = await this.verifyPassword(input.password, teacher.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid email or password');
        }

        const payload = { 
            // sub: teacher._id,
            email: teacher.email
        };

        const tokens = await this.generateToken(payload.email);
        console.log('generated tokennn', tokens);

        this.setTokenCookie(res, 'teacherAccessToken', tokens.accessToken, 24 * 60 * 60 * 1000);
        this.setTokenCookie(res, 'teacherRefreshToken', tokens.refreshToken, 15 * 24 * 60 * 60 * 1000);

        return {
            _id: teacher._id,
            email: teacher.email,
            firstName: teacher.firstName,
            lastName: teacher.lastName,
            imageUrl: teacher.imageUrl,
        };
    }

    async refreshTokens(refreshToken: string, res: Response) {
        const tokenRecord = await this.teacherRepository.findOne(refreshToken);

        if (!tokenRecord) {
            throw new UnauthorizedException('Invalid Teacher Refresh Token');
        }

        const tokens = await this.generateToken(tokenRecord.email);

        this.setTokenCookie(res, 'teacherAccessToken', tokens.accessToken, 24 * 60 * 60 * 1000);
        this.setTokenCookie(res, 'teacherRefreshToken', tokens.refreshToken, 15 * 24 * 60 * 60 * 1000);

        return { message: 'Teacher tokens refreshed successfully' };
    }

    async generateToken(teacherEmail: string) {
        const payload = { teacherEmail };
        const accessToken = this.jwtService.sign(payload, { secret: process.env.SECRET_KEY, expiresIn: '15s' })
        const refreshToken = uuidv4();
        await this.teacherRepository.storeRefreshToken(refreshToken, teacherEmail)
        return {
            accessToken,
            refreshToken
        }
    }

    

    async teacherLogout(res: Response) {
        this.clearTokenCookie(res, 'teacherAccessToken');
        this.clearTokenCookie(res, 'teacherRefreshToken');

        return { message: 'Logged out successfully' };
    }


// Private functions____________________________________________________________________________________

    private async verifyPassword(plainTextPassword: string, hashedPassword: string): Promise<boolean> {
        return bcrypt.compare(plainTextPassword, hashedPassword);
    }

    private setTokenCookie(res: Response, name: string, value: string, maxAge: number) {
        res.cookie(name, value, {
            httpOnly: true,
            secure: process.env.NODE_ENV == 'production',
            sameSite: 'none',
            maxAge: maxAge,
        });
    }

    private clearTokenCookie(res: Response, name: string) {
        res.cookie(name, '', {
            httpOnly: true,
            secure: process.env.NODE_ENV == 'production',
            sameSite: 'none',
            expires: new Date(0),
        });
    }
}