import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Pagination } from 'src/paginate/pagination';
import { PaginationOptionsInterface } from 'src/paginate/pagination.options.interface';
import { FindOneOptions, Like, Repository } from 'typeorm';
import { CreatePessoaDto } from './dto/create-pessoa.dto';
import { UpdatePessoaDto } from './dto/update-pessoa.dto';
import { Pessoa } from './entities/pessoa.entity';

@Injectable()
export class PessoaService {
  constructor(
    @InjectRepository(Pessoa)
    private readonly repository: Repository<Pessoa>,
  ) {}

  createPage = (
    results,
    total,
    options: PaginationOptionsInterface,
  ): Pagination<Pessoa> => {
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
    return new Pagination<Pessoa>({
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
  ): Promise<Pagination<Pessoa>> {
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
      order: { nome: 'ASC' },
      take: options.limit,
      skip: options.offset,
    });

    return this.createPage(results, total, options);
  }

  create(createPessoaDto: CreatePessoaDto): Promise<Pessoa | any> {
    const pessoa = this.repository.create(createPessoaDto);
    return this.repository
      .save(pessoa)
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

  findAll(): Promise<Pessoa[]> {
    return this.repository.find({ order: { nome: 'ASC' } });
  }

  findOne(id: string): Promise<Pessoa> {
    return this.repository.findOneBy({
      id: id,
    });
  }

  async update(id: string, updatePessoaDto: UpdatePessoaDto): Promise<Pessoa> {
    const pessoa = await this.repository.preload({
      id: id,
      ...updatePessoaDto,
    });
    if (!pessoa) {
      throw new NotFoundException(`Pessoa ${id} not found`);
    }
    return this.repository.save(pessoa);
  }

  async remove(id: string) {
    const pessoa = await this.findOne(id);
    return this.repository.remove(pessoa);
  }

  async destroy(id: string) {
    await this.repository.findOneOrFail({ where: { id: id } });
    this.repository.softDelete({ id });
  }

  async findOneOrFail(options: FindOneOptions<Pessoa>): Promise<Pessoa> {
    try {
      return this.repository.findOneOrFail(options);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
}
