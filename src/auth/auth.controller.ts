import { Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import Permission from './permissions/permission.enum';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  @ApiOperation({ summary: 'Login com email e senha' }) // Adicione esta anotação para descrever a operação
  @ApiBody({
    // Use esta anotação para descrever os parâmetros do corpo (email e senha)
    description: 'Credenciais de login',
    type: LoginDto, // Substitua 'LoginDto' pela classe ou interface que define email e senha
  })
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
