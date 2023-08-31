import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Pagination } from 'src/paginate/pagination';
import { Logger } from './entities/logger.entity';
import { LoggerService } from './logger.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('logger')
@Controller('logger')
@UseGuards(AuthGuard('jwt'))
export class LoggerController {
  constructor(private readonly loggerService: LoggerService) {}

  @Get()
  async index(@Req() request): Promise<Pagination<Logger>> {
    const like = ['message', 'level', 'created_at'];
    return await this.loggerService.paginate(
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
}
