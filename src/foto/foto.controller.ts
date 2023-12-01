import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseUUIDPipe,
  HttpStatus,
  HttpCode,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FotoService } from './foto.service';
import { CreateFotoDto } from './dto/create-foto.dto';
import { UpdateFotoDto } from './dto/update-foto.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { FilesInterceptor } from '@nestjs/platform-express';

@ApiTags('foto')
@Controller('foto')
@UseGuards(AuthGuard('jwt'))
export class FotoController {
  constructor(private readonly fotoService: FotoService) {}

  @Get()
  async index() {
    return await this.fotoService.findAll();
  }

  @Post()
  @UseInterceptors(FilesInterceptor('images'))
  async uploadImage(@UploadedFile() file) {
    return await this.fotoService.store(file);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async destroy(@Param('id', new ParseUUIDPipe()) id: string) {
    await this.fotoService.destroy(id);
  }
}
