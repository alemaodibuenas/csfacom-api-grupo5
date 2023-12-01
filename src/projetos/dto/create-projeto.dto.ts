import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateProjetoDto {
  @ApiProperty({ example: 'Imagem' })
  @IsString()
  @IsNotEmpty()
  imagem: string;

  @ApiProperty({ example: 'Título' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Descrição' })
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty({ example: 'texto' })
  @IsOptional()
  @IsString()
  texto: string;
}
