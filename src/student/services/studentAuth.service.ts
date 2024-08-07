import { Injectable, UnauthorizedException } from '@nestjs/common';
import { StudentRepository } from '../repositories/student.repository';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class StudentAuthService {
    constructor(
        private readonly studentRepository: StudentRepository,
        private readonly jwtService: JwtService
    ) {}
    
    async studentLogin(input: { email: string; password: string }, res: Response) {
        const student = await this.studentRepository.findByEmail(input.email);
        
        if (!student) {
            throw new UnauthorizedException('Invalid email or password');
        }

        const isPasswordValid = await this.verifyPassword(input.password, student.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid email or password');
        }

        const payload = { 
            sub: student._id,
            email: student.email
        };

        const token = this.jwtService.sign(payload, { 
            secret: process.env.JWT_SECRET_KEY
        });
        console.log('generated tokennn', token);
        

        res.cookie('studentJwt', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000,
        });

        return {
            id: student._id,
            email: student.email,
            firstName: student.firstName,
            lastName: student.lastName,
            imageUrl:student.imageUrl
        };
    }

    private async verifyPassword(plainTextPassword: string, hashedPassword: string): Promise<boolean> {
        return bcrypt.compare(plainTextPassword, hashedPassword);
    }

    async studentLogout(res: Response) {
        res.cookie('studentJwt', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            expires: new Date(0),
        });

        return { message: 'Logged out successfully' };
    }
}