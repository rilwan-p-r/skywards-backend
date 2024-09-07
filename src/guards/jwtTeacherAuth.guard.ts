import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import * as jwt from 'jsonwebtoken';
import { TeacherRepository } from 'src/teacher/repositories/teacher.repository';

@Injectable()
export class JwtTeacherGuard extends AuthGuard('teacherAccessToken') {
  constructor(private readonly teacherRepository: TeacherRepository) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.cookies ? request.cookies.teacherAccessToken : null;

    if (!token) {
      throw new UnauthorizedException('Teacher Token Not Found');
    }

    try {
      const secretKey = process.env.SECRET_KEY;
      const decoded = jwt.verify(token, secretKey) as { teacherEmail: string };
      console.log('decored teacherrr',decoded);
      
      const teacher = await this.teacherRepository.findByEmail(decoded.teacherEmail);
console.log('findedTeacher',teacher);

      if (!teacher) {
        throw new UnauthorizedException('Teacher not found');   
      }

      request.teacher = teacher;
      return true;
    } catch (error) {
      console.log("jwtteachererror:",error);
      if (error instanceof jwt.TokenExpiredError) {
        throw new UnauthorizedException('Teacher Token expired');
      } else if (error instanceof jwt.JsonWebTokenError) {
        throw new UnauthorizedException('Invalid Token');
        
      } else {
        throw new UnauthorizedException('Authentication failed');
      }
    }
  }
}