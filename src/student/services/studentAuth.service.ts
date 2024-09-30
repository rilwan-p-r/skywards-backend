import { Injectable, UnauthorizedException } from '@nestjs/common';
import { StudentRepository } from '../repositories/student.repository';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class StudentAuthService {
    constructor(
        private readonly studentRepository: StudentRepository,
        private readonly jwtService: JwtService
    ) { }

    async   studentLogin(input: { email: string; password: string }, res: Response) {
        const student = await this.studentRepository.findByEmail(input.email);

        if (!student) {
            throw new UnauthorizedException('Invalid email or password');
        }

        const isPasswordValid = await this.verifyPassword(input.password, student.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid email or password');
        }

        const payload = {
            // sub: student._id,
            email: student.email
        };

        const tokens = await this.generateToken(payload.email);
        console.log('generated tokennn', tokens);

        this.setTokenCookie(res, 'studentAccessToken', tokens.accessToken, 24 * 60 * 60 * 1000);
        this.setTokenCookie(res, 'studentRefreshToken', tokens.refreshToken, 15 * 24 * 60 * 60 * 1000);

        return {
            _id: student._id,
            email: student.email,
            firstName: student.firstName,
            lastName: student.lastName,
            imageUrl: student.imageUrl,
            batchId:student.batchId
        };
    }

    async refreshTokens(refreshToken: string, res: Response) {
        const tokenRecord = await this.studentRepository.findOne(refreshToken);

        if (!tokenRecord) {
            throw new UnauthorizedException('Invalid Student Refresh Token');
        }

        const tokens = await this.generateToken(tokenRecord.email);

        this.setTokenCookie(res, 'studentAccessToken', tokens.accessToken, 24 * 60 * 60 * 1000);
        this.setTokenCookie(res, 'studentRefreshToken', tokens.refreshToken, 15 * 24 * 60 * 60 * 1000);

        return { message: 'Student tokens refreshed successfully' };
    }

    async generateToken(studentEmail: string) {
        const payload = { studentEmail };
        const accessToken = this.jwtService.sign(payload, { secret: process.env.SECRET_KEY, expiresIn: '15s' })
        const refreshToken = uuidv4();
        await this.studentRepository.storeRefreshToken(refreshToken, studentEmail)
        return {
            accessToken,
            refreshToken
        }
    }

    async studentLogout(res: Response) {
        this.clearTokenCookie(res, 'studentAccessToken');
        this.clearTokenCookie(res, 'studentRefreshToken');

        return { message: 'Logged out successfully' };
    }

    // private functions________________________________________________________________________________

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