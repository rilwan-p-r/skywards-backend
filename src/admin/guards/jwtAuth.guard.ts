import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtGuard extends AuthGuard('adminJwt') {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const token = request.cookies ? request.cookies.adminJwt : null;
    console.log('requestttt',request);
    console.log('tokennnn',token);

    if (!token) {
      throw new UnauthorizedException('No token found');
    }

    try {
        const secretKey = process.env.SECRET_KEY;
        const decoded = jwt.verify(token, secretKey) as { adminEmail: string };
        console.log('decodeddd', decoded);
        

      const adminEmail = process.env.ADMIN_EMAIL;

      if (decoded.adminEmail !== adminEmail) {
        throw new UnauthorizedException('Incorrect payload');
      }

      request.adminEmail = adminEmail;
      return true;
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new UnauthorizedException('Invalid : ',error.message);
      } else if (error instanceof jwt.TokenExpiredError) {
        throw new UnauthorizedException('Token expired');
      } else {
        throw new UnauthorizedException(error.message);
      }
    }
  }
}
