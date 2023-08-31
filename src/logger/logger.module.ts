import { Module } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { LoggerController } from './logger.controller';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Logger } from './entities/logger.entity';
import { CustomLogger } from './customLogger';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([Logger])],
  providers: [CustomLogger, LoggerService],
  controllers: [LoggerController],
  exports: [CustomLogger],
})
export class LoggerModule {}
