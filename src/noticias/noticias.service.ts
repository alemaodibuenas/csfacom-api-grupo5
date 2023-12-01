import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Pagination } from 'src/paginate/pagination';
import { PaginationOptionsInterface } from 'src/paginate/pagination.options.interface';
import { FindOneOptions, Like, Repository } from 'typeorm';
import { CreateNoticiaDto } from './dto/create-noticia.dto';
import { UpdateNoticiaDto } from './dto/update-noticia.dto';
import { Noticia } from './entities/noticia.entity';
import { removerCaracteresEspeciais } from 'src/helpers/utils';

@Injectable()
export class NoticiasService {
  constructor(
    @InjectRepository(Noticia)
    private readonly repository: Repository<Noticia>,
  ) {}

  createPage = (
    results,
    total,
    options: PaginationOptionsInterface,
  ): Pagination<Noticia> => {
    const offset = Number(options.offset);
    const limit = Number(options.limit);
    const page = Number(total);

    const nextOffset = offset + limit >= page ? null : offset + limit;

    const previusOffset =
      offset > 0 ? (offset - limit < 0 ? 0 : offset - limit) : null;
    const lastOffset = offset + limit > page ? null : page - limit;

    const next =
      nextOffset !== null
        ? 'offset=' + nextOffset + '&limit=' + options.limit
        : null;

    const previous =
      previusOffset !== null && total > 0
        ? 'offset=' + previusOffset + '&limit=' + options.limit
        : null;

    const last =
      lastOffset !== null && next !== null
        ? 'offset=' + lastOffset + '&limit=' + options.limit
        : null;

    const page_total = Math.ceil(total / limit);
    const status = true;
    return new Pagination<Noticia>({
      status,
      results,
      total,
      page_total,
      next,
      previous,
      last,
    });
  };

  async paginate(
    options: PaginationOptionsInterface,
    optionsLike: string[],
    customWhere = {},
  ): Promise<Pagination<Noticia>> {
    let optionWhere = {};
    optionWhere = customWhere;
    if (options.like !== 'all') {
      const optionsLikes = optionsLike.map((like) => {
        return { [like]: Like('%' + options.like + '%'), ...customWhere };
      });
      optionWhere = optionsLikes;
    }

    const [results, total] = await this.repository.findAndCount({
      where: optionWhere,
      order: { title: 'ASC' },
      take: options.limit,
      skip: options.offset,
    });

    return this.createPage(results, total, options);
  }

  create(createNoticiaDto: CreateNoticiaDto): Promise<Noticia | any> {
    const url = createNoticiaDto.title;
    createNoticiaDto['url'] = removerCaracteresEspeciais(url);
    const noticia = this.repository.create(createNoticiaDto);
    return this.repository
      .save(noticia)
      .then((resultado) => {
        return {
          status: true,
          mensagem: resultado,
        };
      })
      .catch((error) => {
        return {
          status: false,
          mensagem: error,
        };
      });
  }

  findAll(): Promise<Noticia[]> {
    return this.repository.find({ order: { title: 'ASC' } });
  }

  findOne(id: string): Promise<Noticia> {
    return this.repository.findOneBy({
      id: id,
    });
  }

  async update(
    id: string,
    updateNoticiaDto: UpdateNoticiaDto,
  ): Promise<Noticia> {
    const noticia = await this.repository.preload({
      id: id,
      ...updateNoticiaDto,
    });
    if (!noticia) {
      throw new NotFoundException(`Noticia ${id} not found`);
    }
    return this.repository.save(noticia);
  }

  async remove(id: string) {
    const noticia = await this.findOne(id);
    return this.repository.remove(noticia);
  }

  async destroy(id: string) {
    await this.repository.findOneOrFail({ where: { id: id } });
    this.repository.softDelete({ id });
  }

  async findOneOrFail(options: FindOneOptions<Noticia>): Promise<Noticia> {
    try {
      return this.repository.findOneOrFail(options);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
}
