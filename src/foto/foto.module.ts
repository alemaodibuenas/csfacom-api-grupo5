import { Module } from '@nestjs/common';
import { FotoService } from './foto.service';
import { FotoController } from './foto.controller';
import { FotoEntity } from './entities/foto.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([FotoEntity])],
  controllers: [FotoController],
  providers: [FotoService],
})
export class FotoModule {}
