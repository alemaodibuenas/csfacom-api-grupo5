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
import { NoticiasService } from './noticias.service';
import { CreateNoticiaDto } from './dto/create-noticia.dto';
import { UpdateNoticiaDto } from './dto/update-noticia.dto';
import { Pagination } from 'src/paginate/pagination';
import { Noticia } from './entities/noticia.entity';
import PermissionGuard from 'src/auth/permissions/permission.guard';
import Permission from 'src/auth/permissions/permission.enum';

@ApiTags('noticias')
@Controller('noticias')
export class NoticiasController {
  constructor(private readonly noticiasService: NoticiasService) {}

  @Post()
  create(@Body() createNoticiaDto: CreateNoticiaDto) {
    return this.noticiasService.create(createNoticiaDto);
  }

  @Get()
  async index(@Req() request): Promise<Pagination<Noticia>> {
    const like = ['image', 'title', 'text'];
    return await this.noticiasService.paginate(
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
    return this.noticiasService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePessoaDto: UpdateNoticiaDto) {
    return this.noticiasService.update(id, updatePessoaDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(PermissionGuard(Permission.Admin))
  async destroy(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.noticiasService.destroy(id);
  }
}
