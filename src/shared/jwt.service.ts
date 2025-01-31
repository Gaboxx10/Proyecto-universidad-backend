import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';

export interface JwtPayload {
    sub: string;
    username: string;   
    rol: string;
  }
  
@Injectable()
export class JwtService {
  constructor(private readonly jwtService: NestJwtService) {}

  generateAccessToken(payload: JwtPayload): string {
    return this.jwtService.sign(payload); 
  }

  generateRefreshToken(payload: JwtPayload): string {
    return this.jwtService.sign(payload); 
  }

  verifyToken(token: string): JwtPayload {
    return this.jwtService.verify(token);
  }

  decodeToken(token: string): JwtPayload {
    return this.jwtService.decode(token);
  }
}
