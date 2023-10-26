import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateNoticiaDto {
  @ApiProperty({ example: 'imagem' })
  @IsString()
  @IsNotEmpty()
  image: string;

  @ApiProperty({ example: 'Título' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Texto' })
  @IsOptional()
  @IsString()
  text: string;
}
