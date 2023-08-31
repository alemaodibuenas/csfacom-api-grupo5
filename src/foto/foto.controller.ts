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
  Put,
  UseInterceptors,
  UploadedFile,
  Res,
  UploadedFiles,
  UseGuards,
} from '@nestjs/common';
import { FotoService } from './foto.service';
import { CreateFotoDto } from './dto/create-foto.dto';
import { UpdateFotoDto } from './dto/update-foto.dto';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { FotoEntity } from './entities/foto.entity';
import { AuthGuard } from '@nestjs/passport';

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
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(@UploadedFile() file) {
    return await this.fotoService.uploadFileToObjectStorage(file, 'image_');
  }
  @Post('documento')
  @UseInterceptors(FileInterceptor('file'))
  async uploadDocumento(@UploadedFile() file) {
    return await this.fotoService.uploadFileToObjectStorage(file, 'documento_');
  }

  // @Patch(':id')
  // async update(
  //   @Param('id', new ParseUUIDPipe()) id: string,
  //   @Body() body: UpdateFotoDto,
  // ) {
  //   return await this.fotoService.update(id, body);
  // }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async destroy(@Param('id', new ParseUUIDPipe()) id: string) {
    await this.fotoService.destroy(id);
  }
}

// {
// "fieldname": "image",
// "originalname": "SER-2-5-411x565-1.webp",
// "encoding": "7bit",
// "mimetype": "image/webp",
// "destination": "./uploads",
// "filename": "a1e4e1203fd7815d4ed216951765495e",
// "path": "uploads/a1e4e1203fd7815d4ed216951765495e",
// "size": 29200
// }
