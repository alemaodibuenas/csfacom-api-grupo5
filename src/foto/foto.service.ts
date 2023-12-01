import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { CreateFotoDto } from './dto/create-foto.dto';
import { UpdateFotoDto } from './dto/update-foto.dto';
import { FotoEntity } from './entities/foto.entity';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FotoService {
  constructor(
    @InjectRepository(FotoEntity)
    private readonly fotoRepository: Repository<FotoEntity>,
  ) {}

  async findAll() {
    return await this.fotoRepository.find({
      select: ['id', 'imagem', 'tamanho', 'nomeOriginal', 'created_at'],
    });
  }

  async findOneOrFail(
    options: FindOneOptions<FotoEntity>,
  ): Promise<FotoEntity> {
    try {
      return this.fotoRepository.findOneOrFail(options);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async store(file) {
    const foto = new FotoEntity();
    foto.imagem = file.filename;
    foto.nomeOriginal = file.originalname;
    foto.tamanho = file.size;

    const uploadPath = path.join(__dirname, '..', 'uploads'); // Altere conforme necessário o caminho onde deseja salvar as imagens localmente

    // Certifique-se de que o diretório de uploads exista
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    const filePath = path.join(uploadPath, foto.imagem);

    // Salva a imagem localmente
    fs.writeFileSync(filePath, file.buffer);

    // Salva as informações da foto no banco de dados
    return this.fotoRepository
      .save(foto)
      .then(() => {
        return {
          status: true,
          mensagem: { foto },
        };
      })
      .catch((error) => {
        // Lida com erros ao salvar no banco de dados
        return {
          status: false,
          mensagem: 'Houve um erro no envio do arquivo.',
          error: error,
        };
      });
  }

  async destroy(id: string) {
    const foto = await this.fotoRepository.findOneOrFail({ where: { id: id } });

    const deleteResponse = await this.fotoRepository.softDelete({ id });

    if (!(await deleteResponse).affected) {
      throw new NotFoundException(id);
    } else {
      this.deleteFileLocally(foto.imagem);
    }
  }

  deleteFileLocally = async (filename) => {
    const filePath = path.join(__dirname, '..', 'uploads', filename);

    try {
      fs.unlinkSync(filePath);
    } catch (e) {
      console.log(e);
    }
  };
}
