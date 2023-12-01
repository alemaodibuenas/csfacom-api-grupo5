import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { CreateProjetoDto } from 'src/projetos/dto/create-projeto.dto';
import { Projeto } from 'src/projetos/entities/projeto.entity';
import { Usuario } from 'src/usuario/entities/usuario.entity';

export class CreatePessoaDto {
  @ApiProperty({ example: 'Nome' })
  @IsString()
  @IsNotEmpty()
  nome: string;

  @ApiProperty({ example: 'url foto' })
  @IsString()
  @IsNotEmpty()
  foto?: string;

  @ApiProperty({ example: 'Telefone' })
  @IsOptional()
  @IsString()
  telefone: string;

  @ApiProperty({ example: 'rga' })
  @IsOptional()
  @IsString()
  rga?: string;

  @ApiProperty({
    type: () => [CreateProjetoDto],
    example: [
      {
        /* dados do projeto */
      },
    ],
  })
  @IsOptional()
  @IsString({ each: true })
  projetos?: Projeto[];
}
