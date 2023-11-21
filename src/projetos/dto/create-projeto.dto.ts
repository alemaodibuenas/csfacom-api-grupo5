import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateProjetoDto {
  @ApiProperty({ example: 'Icon' })
  @IsString()
  @IsNotEmpty()
  icon: string;

  @ApiProperty({ example: 'Título' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Descrição' })
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty({ example: 'url' })
  @IsOptional()
  @IsString()
  url: string;
}
