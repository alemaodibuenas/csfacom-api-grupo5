import { Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import Permission from './permissions/permission.enum';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Req() req) {
    return await this.authService.login(req.user);
  }

  @Post('refresh')
  async refreshToken(@Query('token') token: string) {
    const tokenToRefresh = token;
    return this.authService.refresh(tokenToRefresh);
  }

  @Get('permissoes')
  async index() {
    return Object.values(Permission);
  }
}
