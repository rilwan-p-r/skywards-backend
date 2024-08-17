import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtAdminGuard extends AuthGuard('adminAccessToken') {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const token = request.cookies ? request.cookies.adminAccessToken : null;
    console.log('token',token);
    
    if (!token) {
      throw new UnauthorizedException('Admin Token Not Found');
    }

    try {
      const secretKey = process.env.SECRET_KEY;
      const decoded = jwt.verify(token, secretKey) as { adminEmail: string };
      
      const adminEmail = process.env.ADMIN_EMAIL;

      if (decoded.adminEmail !== adminEmail) {
        throw new UnauthorizedException('Incorrect payload');
      }

      request.adminEmail = adminEmail;
      return true;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new UnauthorizedException('Admin Token expired');
      } else if (error instanceof jwt.JsonWebTokenError) {
        throw new UnauthorizedException('Invalid token');
      } else {
        throw new UnauthorizedException('Authentication error');
      }
    }
    
  }
}
