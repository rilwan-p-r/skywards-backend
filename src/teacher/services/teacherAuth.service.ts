import { Injectable, UnauthorizedException } from '@nestjs/common';
import { TeacherRepository } from '../repositories/teacher.repository';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

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
            sub: teacher._id,
            email: teacher.email
        };

        const token = this.jwtService.sign(payload, { 
            secret: process.env.JWT_SECRET_KEY,
            expiresIn: '24h'
        });

        res.cookie('teacherJwt', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000,
        });

        return {
            id: teacher._id,
            email: teacher.email,
            firstName: teacher.firstName,
            lastName: teacher.lastName,
            imageUrl: teacher.imageUrl,
        };
    }

    private async verifyPassword(plainTextPassword: string, hashedPassword: string): Promise<boolean> {
        return bcrypt.compare(plainTextPassword, hashedPassword);
    }

    async teacherLogout(res: Response) {
        res.cookie('teacherJwt', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            expires: new Date(0),
        });

        return { message: 'Logged out successfully' };
    }
}