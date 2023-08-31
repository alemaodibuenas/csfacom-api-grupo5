import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioController } from './usuario.controller';
import { Usuario } from './entities/usuario.entity';
import { UsuarioService } from './usuario.service';
import { PessoaService } from 'src/pessoa/pessoa.service';
import { Pessoa } from 'src/pessoa/entities/pessoa.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario]),
    TypeOrmModule.forFeature([Pessoa]),
  ],
  controllers: [UsuarioController],
  providers: [UsuarioService, PessoaService],
  exports: [UsuarioService],
})
export class UsuarioModule {}
