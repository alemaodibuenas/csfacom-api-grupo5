import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Usuario } from './entities/usuario.entity';
import { hashSync } from 'bcrypt';
import { UpdateUsuarioDontPassDto } from './dto/update-usuario-dont-pass.dto';
import { PessoaService } from 'src/pessoa/pessoa.service';
import { Pessoa } from 'src/pessoa/entities/pessoa.entity';
import { MESSAGES } from '@nestjs/core/constants';
import { MessagesHelper } from 'src/helpers/messages.helper';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    @InjectRepository(Pessoa)
    private readonly usuarioRepositoryVendor: Repository<Pessoa>,
  ) {}

  async findAll() {
    return await this.usuarioRepository.find({
      select: ['id', 'email', 'created_at'],
    });
  }

  async countUsers() {
    return await this.usuarioRepository.count();
  }

  async findOneOrFail(options: FindOneOptions<Usuario>): Promise<Usuario> {
    try {
      return this.usuarioRepository.findOneOrFail(options);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async store(data: CreateUsuarioDto) {
    const user = await this.usuarioRepository.create(data);
    return await this.usuarioRepository.save(user);
  }

  async update(id: string, data: UpdateUsuarioDto) {
    const user = await this.findOneOrFail({ where: { id: id } });
    this.usuarioRepository.merge(user, data);

    const userEdit = await this.usuarioRepository.save(user);
    if (userEdit) {
      delete userEdit.password;
      return {
        status: false,
        mensagem: userEdit,
      };
    }
    return {
      status: false,
      mensagem: 'Erro! Não foi possível executar a solicitação.',
    };
  }

  async updatePassAdmin(id: string, data: UpdateUsuarioDontPassDto) {
    if (data.password) {
      data.password = hashSync(data.password, 10);
    }

    const user = await this.findUserWithPessoaIdd(id);
    this.usuarioRepository.merge(user, data);

    const userEdit = await this.usuarioRepository.save(user);
    if (userEdit) {
      return {
        status: false,
        mensagem: 'Senha alterada com sucesso!',
      };
    }
    return {
      status: false,
      mensagem: 'Erro! Não foi possível executar a solicitação.',
    };
  }

  async updatePass(id: string, data: UpdateUsuarioDontPassDto) {
    if (data.currentPassword) {
      data.currentPassword = hashSync(data.currentPassword, 10);
    } else {
      return {
        status: false,
        mensagem: MessagesHelper.SENHA_VALID_OLD,
      };
    }

    if (data.password) {
      data.password = hashSync(data.password, 10);
    }

    const user = await this.findUserWithPessoaIdd(id);
    this.usuarioRepository.merge(user, data);

    const userEdit = await this.usuarioRepository.save(user);
    if (userEdit) {
      return {
        status: false,
        mensagem: 'Senha alterada com sucesso!',
      };
    }
    return {
      status: false,
      mensagem: 'Erro! Não foi possível executar a solicitação.',
    };
  }

  async findUserWithPessoaIdd(id: string): Promise<Usuario> {
    return await this.usuarioRepository.findOne({
      relations: {
        pessoa: true,
      },
      where: {
        pessoa: {
          id: id,
        },
      },
    });
  }

  codificaTexto(texto: string) {
    let resultado = '';
    for (let i = 0; i < texto.length; i++) {
      const codigo = texto.charCodeAt(i);
      resultado += codigo.toString();
    }
    return resultado;
  }

  async destroy(id: string) {
    const user = await this.findUserWithPessoaIdd(id);
    if (user) {
      await this.usuarioRepository.findOneOrFail({
        where: { id: user.id },
      });
      const maximo = 99999;
      const seed = Math.floor(Math.random() * (maximo + 1));
      user.email = this.codificaTexto(user.email + seed);
      await this.update(user.id, user);
      this.usuarioRepository.softDelete(user.id);
      this.usuarioRepositoryVendor.softDelete(id);

      return {};
    }
    return {
      status: false,
      mensagem: 'Erro! Não foi possível executar a solicitação.',
    };
  }
}
