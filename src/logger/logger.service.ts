import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Pagination } from 'src/paginate/pagination';
import { PaginationOptionsInterface } from 'src/paginate/pagination.options.interface';
import { Like, Repository } from 'typeorm';
import { CreateLoggerDto } from './dto/create-logger.dto';
import { Logger } from './entities/logger.entity';

@Injectable()
export class LoggerService {
  constructor(
    @InjectRepository(Logger)
    private repository: Repository<Logger>,
  ) {}

  createPage = (
    results,
    total,
    options: PaginationOptionsInterface,
  ): Pagination<Logger> => {
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

    return new Pagination<Logger>({
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
  ): Promise<Pagination<Logger>> {
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
      order: { created_at: 'DESC' },
      take: options.limit,
      skip: options.offset,
    });

    return this.createPage(results, total, options);
  }

  async createLog(log: CreateLoggerDto) {
    const newLog = await this.repository.create(log);
    await this.repository.save(newLog, {
      data: {
        isCreatingLogs: true,
      },
    });
    return newLog;
  }
}
