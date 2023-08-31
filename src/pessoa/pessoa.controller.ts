import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  HttpStatus,
  HttpCode,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PessoaService } from './pessoa.service';
import { CreatePessoaDto } from './dto/create-pessoa.dto';
import { UpdatePessoaDto } from './dto/update-pessoa.dto';
import { ApiTags } from '@nestjs/swagger';
import { Pessoa } from './entities/pessoa.entity';
import { Pagination } from 'src/paginate/pagination';
import { AuthGuard } from '@nestjs/passport';
import Permission from 'src/auth/permissions/permission.enum';
import PermissionGuard from 'src/auth/permissions/permission.guard';

@ApiTags('Pessoa')
@Controller('pessoa')
@UseGuards(AuthGuard('jwt'))
export class PessoaController {
  constructor(private readonly pessoaService: PessoaService) {}

  @Post()
  create(@Body() createPessoaDto: CreatePessoaDto) {
    return this.pessoaService.create(createPessoaDto);
  }

  @Get()
  async index(@Req() request): Promise<Pagination<Pessoa>> {
    const like = [
      'nome',
      'endereco',
      'telefone',
      'documento',
      'tipoDocumentoo',
    ];
    return await this.pessoaService.paginate(
      {
        limit: request.query.hasOwnProperty('limit') ? request.query.limit : 10,
        offset: request.query.hasOwnProperty('offset')
          ? request.query.offset
          : 0,
        like: request.query.hasOwnProperty('like') ? request.query.like : 'all',
      },
      like,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pessoaService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePessoaDto: UpdatePessoaDto) {
    return this.pessoaService.update(id, updatePessoaDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(PermissionGuard(Permission.Admin))
  async destroy(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.pessoaService.destroy(id);
  }
}
