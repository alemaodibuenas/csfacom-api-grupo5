import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Usuario } from 'src/usuario/entities/usuario.entity';
import { UsuarioService } from 'src/usuario/usuario.service';
import { compareSync } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

export interface TokenProps {
  email: string;
  sub: string;
  permissions: string[];
  iat: number;
  exp: number;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly jwtService: JwtService,
  ) {}

  async login(user: Usuario) {
    const payload = {
      sub: user.id,
      email: user.email,
      permissions: user.permissions,
    };

    return {
      token: this.jwtService.sign(payload),
      user: user.pessoa,
      permissions: user.permissions,
    };
  }

  async validateUser(email: string, password: string) {
    let user: Usuario;
    try {
      user = await this.usuarioService.findOneOrFail({
        where: { email: email },
      });
    } catch (error) {
      return null;
    }

    const isPasswordValid = compareSync(password, user.password);
    if (!isPasswordValid) return null;

    return user;
  }

  async refresh(token: string) {
    try {
      const tokenDecode = (await this.jwtService.verifyAsync(
        token,
      )) as TokenProps;
      const payload = {
        email: tokenDecode.email,
        sub: tokenDecode.sub,
        permissions: tokenDecode.permissions,
      };
      return {
        access_token: this.jwtService.sign(payload),
      };
    } catch (error) {
      throw new HttpException('Token inválido', HttpStatus.BAD_REQUEST);
    }
  }
}
