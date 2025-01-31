import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';  // Usamos AuthGuard de Passport

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}  
