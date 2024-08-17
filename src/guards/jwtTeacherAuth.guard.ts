import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import * as jwt from 'jsonwebtoken';
import { TeacherRepository } from 'src/teacher/repositories/teacher.repository';

@Injectable()
export class JwtTeacherGuard extends AuthGuard('teachertJwt') {
  constructor(private readonly teacherRepository: TeacherRepository) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.cookies ? request.cookies.teacherJwt : null;

    if (!token) {
      throw new UnauthorizedException('Teacher Token Not Found');
    }

    try {
      const secretKey = process.env.SECRET_KEY;
      const decoded = jwt.verify(token, secretKey) as { email: string };
      console.log('decored teacherrr',decoded);
      
      const teacher = await this.teacherRepository.findByEmail(decoded.email);

      if (!teacher) {
        throw new UnauthorizedException('Teacher not found');
      }

      request.teacher = teacher;
      return true;
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new UnauthorizedException('Invalid token');
      } else if (error instanceof jwt.TokenExpiredError) {
        throw new UnauthorizedException('Teacher Token expired');
      } else {
        throw new UnauthorizedException('Authentication failed');
      }
    }
  }
}