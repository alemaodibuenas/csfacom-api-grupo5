import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Pagination } from 'src/paginate/pagination';
import { PaginationOptionsInterface } from 'src/paginate/pagination.options.interface';
import { FindOneOptions, Like, Repository } from 'typeorm';
import { CreateProjetoDto } from './dto/create-projeto.dto';
import { UpdateProjetoDto } from './dto/update-projeto.dto';
import { Projeto } from './entities/projeto.entity';

@Injectable()
export class ProjetosService {
  constructor(
    @InjectRepository(Projeto)
    private readonly repository: Repository<Projeto>,
  ) {}

  createPage = (
    results,
    total,
    options: PaginationOptionsInterface,
  ): Pagination<Projeto> => {
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
    return new Pagination<Projeto>({
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
  ): Promise<Pagination<Projeto>> {
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

  create(createProjetoDto: CreateProjetoDto): Promise<Projeto | any> {
    const projeto = this.repository.create(createProjetoDto);
    return this.repository
      .save(projeto)
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

  findAll(): Promise<Projeto[]> {
    return this.repository.find({ order: { title: 'ASC' } });
  }

  findOne(id: string): Promise<Projeto> {
    return this.repository.findOneBy({
      id: id,
    });
  }

  async update(
    id: string,
    updateProjetoDto: UpdateProjetoDto,
  ): Promise<Projeto> {
    const projeto = await this.repository.preload({
      id: id,
      ...updateProjetoDto,
    });
    if (!projeto) {
      throw new NotFoundException(`Projeto ${id} not found`);
    }
    return this.repository.save(projeto);
  }

  async remove(id: string) {
    const projeto = await this.findOne(id);
    return this.repository.remove(projeto);
  }

  async destroy(id: string) {
    await this.repository.findOneOrFail({ where: { id: id } });
    this.repository.softDelete({ id });
  }

  async findOneOrFail(options: FindOneOptions<Projeto>): Promise<Projeto> {
    try {
      return this.repository.findOneOrFail(options);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
}
