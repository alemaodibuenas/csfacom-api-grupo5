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
  Req,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger/dist';
import { ProjetosService } from './projetos.service';
import { CreateProjetoDto } from './dto/create-projeto.dto';
import { UpdateProjetoDto } from './dto/update-projeto.dto';
import { Pagination } from 'src/paginate/pagination';
import { Projeto } from './entities/projeto.entity';
import PermissionGuard from 'src/auth/permissions/permission.guard';
import Permission from 'src/auth/permissions/permission.enum';
import { MessagesHelper } from 'src/helpers/messages.helper';

@ApiTags('projetos')
@Controller('projetos')
export class ProjetosController {
  constructor(private readonly projetosService: ProjetosService) {}

  @Post()
  create(@Body() createProjetoDto: CreateProjetoDto) {
    return this.projetosService.create(createProjetoDto);
  }

  @Get()
  async index(@Req() request): Promise<Pagination<Projeto>> {
    const like = ['title', 'description'];
    return await this.projetosService.paginate(
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
  async findOne(@Param('id') id: string) {
    const projetos = await this.projetosService.findOne(id);

    return {
      status: !!projetos,
      data: projetos || MessagesHelper.DADOS_EMPTY,
    };
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePessoaDto: UpdateProjetoDto) {
    return this.projetosService.update(id, updatePessoaDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(PermissionGuard(Permission.Admin))
  async destroy(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.projetosService.destroy(id);
  }
}
