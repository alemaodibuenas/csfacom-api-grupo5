import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { Usuario } from 'src/usuario/entities/usuario.entity';

export class CreatePessoaDto {
  @ApiProperty({ example: 'Nome' })
  @IsString()
  @IsNotEmpty()
  nome: string;

  @ApiProperty({ example: 'Endereço' })
  @IsString()
  @IsNotEmpty()
  endereco: string;

  @ApiProperty({ example: 'Telefone' })
  @IsOptional()
  @IsString()
  telefone: string;

  @ApiProperty({ example: 'Documento' })
  @IsOptional()
  @IsString()
  documento: string;

  @ApiProperty({ example: 'Tipo de Documento' })
  @IsOptional()
  @IsString()
  tipoDocumentoo: string;
}
