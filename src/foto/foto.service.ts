import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { fstat } from 'fs';
import { FindOneOptions, Repository } from 'typeorm';
import { promisify } from 'util';
import { CreateFotoDto } from './dto/create-foto.dto';
import { UpdateFotoDto } from './dto/update-foto.dto';
import { FotoEntity } from './entities/foto.entity';
// import { S3 } from 'aws-sdk';

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
    foto.key = file.key;
    return this.fotoRepository
      .save(foto)
      .then(() => {
        return {
          status: true,
          mensagem: { foto },
        };
      })
      .catch((error) => {
        return {
          status: false,
          mensagem: 'Houve um erro no envio do arquivo.',
          error: error,
        };
      });
  }

  async update(id: string, data: UpdateFotoDto) {
    const foto = await this.findOneOrFail({ where: { id: id } });
    this.fotoRepository.merge(foto, data);
    return await this.fotoRepository.save(foto);
  }

  async destroy(id: string) {
    const foto = await this.fotoRepository.findOneOrFail({ where: { id: id } });

    const deleteResponse = this.fotoRepository.softDelete({ id });

    if (!(await deleteResponse).affected) {
      throw new NotFoundException(id);
    } else {
      this.deleteFileToObjectStorage(foto.key);
    }
  }

  deleteFileToObjectStorage = async (key) => {
    const s3 = this.getS3();

    const params = {
      Bucket: process.env.BUCKET_NAME,
      Key: key,
    };
    try {
      // await s3.deleteObject(params).promise();
    } catch (e) {
      console.log(e);
    }
  };

  uploadFileToObjectStorage = async (file, tipo) => {
    const key = this.getNameFile(file);
    const s3 = this.getS3();

    const params = {
      Bucket: process.env.BUCKET_NAME,
      Key: tipo + key,
      Body: file.buffer,
      ACL: 'public-read',
    };

    //see: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#upload-property
    // const { Location } = await s3.upload(params).promise();
    file.filename = Location;
    file.key = tipo + key;
    return this.store(file);
  };

  getS3() {
    // return new S3({
    //   accessKeyId: process.env.BUCKET_ACCESS_KEY_ID,
    //   secretAccessKey: process.env.BUCKET_SECRET_ACCESS_KEY,
    //   endpoint: process.env.BUCKET_ENDPOINT,
    // });
  }

  getNameFile = (file) => {
    const uniqueSuffix = Date.now() + '' + Math.round(Math.random() * 1e9);
    const fileExtension = file.originalname.split('.').pop();

    return uniqueSuffix + '.' + fileExtension;
  };
}
