import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { MessagesHelper } from 'src/helpers/messages.helper';

export class CreateFotoDto {
  @ApiProperty({
    example: 'foto',
  })
  @IsNotEmpty({ message: MessagesHelper.STRING_EMPTY })
  imagem: string;

  @ApiProperty({
    example: 'Tamanho Foto',
  })
  @IsNotEmpty({ message: MessagesHelper.STRING_EMPTY })
  tamanho: number;

  @ApiProperty({
    example: 'Tamanho Foto',
  })
  @IsNotEmpty({ message: MessagesHelper.STRING_EMPTY })
  nomeOriginal: string;

  @ApiProperty({
    example: 'keyName',
  })
  @IsNotEmpty({ message: MessagesHelper.STRING_EMPTY })
  key: string;
}
