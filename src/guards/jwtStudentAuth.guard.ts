import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import * as jwt from 'jsonwebtoken';
import { StudentRepository } from 'src/student/repositories/student.repository';

@Injectable()
export class JwtStudentGuard extends AuthGuard('studentJwt') {
  constructor(private readonly studentRepository: StudentRepository) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    // const token = request.cookies?.studentJwt;
    const token = request.cookies ? request.cookies.studentJwt : null;
    console.log('studentTokennn',token);
    
    if (!token) {
      throw new UnauthorizedException('No token found');
    }

    try {
      const secretKey = process.env.SECRET_KEY;
      const decoded = jwt.verify(token, secretKey) as { email: string };
      console.log('decoded emailll',decoded);
      
      const student = await this.studentRepository.findByEmail(decoded.email);

      if (!student) {
        throw new UnauthorizedException('Student not found');
      }

      request.student = student;
      return true;
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new UnauthorizedException('Invalid token');
      } else if (error instanceof jwt.TokenExpiredError) {
        throw new UnauthorizedException('Token expired');
      } else {
        throw new UnauthorizedException('Authentication failed');
      }
    }
  }
}