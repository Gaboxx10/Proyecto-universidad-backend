import { Controller, Post, Body, UseGuards, UnauthorizedException} from '@nestjs/common';
import { AuthService } from './auth.service';
import { loginUserDto } from './dto/login-user.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService
  ) {}

  @Post('/login')
  @UseGuards(LocalAuthGuard)
  async login(@Body() user: loginUserDto) {
    const userLogin = await this.authService.validateUser(
      user.user_name,
      user.password,
    );
    return this.authService.login(userLogin);
  }
}
