import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger/dist';
import Permission from 'src/auth/permissions/permission.enum';
import PermissionGuard from 'src/auth/permissions/permission.guard';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { UsuarioService } from './usuario.service';
import { UpdateUsuarioDontPassDto } from './dto/update-usuario-dont-pass.dto';
import { PessoaService } from 'src/pessoa/pessoa.service';
import { Pessoa } from 'src/pessoa/entities/pessoa.entity';
import { CreateUsuarioDtoStart } from './dto/create-usuario-start.dto';

@ApiTags('usuario')
@Controller('usuario')
// @UseGuards(AuthGuard('jwt'))
export class UsuarioController {
  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly pessoaService: PessoaService,
  ) {}

  @Get()
  @UseGuards(PermissionGuard(Permission.Admin, Permission.UsuarioRead))
  async index() {
    return await this.usuarioService.findAll();
  }

  @Post()
  @UseGuards(PermissionGuard(Permission.Admin, Permission.UsuarioPost, Permission.Giovanni))
  async store(@Body() body: CreateUsuarioDto) {
    return await this.usuarioService.store(body);
  }

  @Post('/addAdmin/')
  async storeOne(@Body() body: CreateUsuarioDtoStart) {
    const zeroUser = await this.usuarioService.countUsers();
    body.permissions = [Permission.Admin];
    if (zeroUser !== 0) {
      return {};
    }
    const createPessoaDto = {
      nome: 'Admin',
      endereco: 'sem',
      telefone: '000',
      documento: 'sem',
      tipoDocumentoo: 'sem',
    };

    const pessoa = await this.pessoaService.create(createPessoaDto);
    body.pessoa = pessoa.mensagem as Pessoa;
    if (body?.pessoa?.id) {
      const user = await this.usuarioService.store(body);
      delete user.password;
      return user;
    } else return 'Erro ao criar Admin';
  }

  @Get(':id')
  @UseGuards(PermissionGuard(Permission.Admin, Permission.Pessoa))
  async show(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.usuarioService.findOneOrFail({ where: { id: id } });
  }

  @Get('pessoa/:id')
  @UseGuards(PermissionGuard(Permission.Admin, Permission.Pessoa))
  async findPessoa(@Param('id', new ParseUUIDPipe()) id: string) {
    const usuario = await this.usuarioService.findUserWithPessoaIdd(id);

    delete usuario.password;

    if (usuario)
      return {
        status: true,
        mensagem: usuario,
      };

    return {
      status: false,
      mensagem: 'Usuário não identificado!',
    };
  }

  @Patch(':id')
  @UseGuards(PermissionGuard(Permission.Admin, Permission.Pessoa))
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: UpdateUsuarioDto,
  ) {
    return await this.usuarioService.update(id, body);
  }

  @Patch('/pass/:id')
  @UseGuards(PermissionGuard(Permission.Admin, Permission.Pessoa))
  async updatePass(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: UpdateUsuarioDontPassDto,
  ) {
    return await this.usuarioService.updatePass(id, body);
  }
  @Patch('/passAdmin/:id')
  @UseGuards(PermissionGuard(Permission.Admin))
  async updatePassAdmin(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: UpdateUsuarioDontPassDto,
  ) {
    return await this.usuarioService.updatePassAdmin(id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(PermissionGuard(Permission.Admin))
  async destroy(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.usuarioService.destroy(id);
  }
}
