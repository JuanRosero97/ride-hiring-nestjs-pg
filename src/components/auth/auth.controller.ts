import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthGuard } from './guards/login-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LoginAuthGuard)
  @Post('/signin')
  async signin(@Req() req) {
    return await this.authService.signIn(req.user);
  }
}
