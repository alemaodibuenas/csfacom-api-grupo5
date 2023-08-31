import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, Matches } from 'class-validator';
import { RegExHelpers } from 'src/helpers/regex.helper';
import { MessagesHelper } from 'src/helpers/messages.helper';

export class UpdateUsuarioDontPassDto {
  @ApiProperty({
    example: '123@abc',
    description: `Necessário para realização do login/acesso ao sistema`,
  })
  @IsNotEmpty({ message: MessagesHelper.SENHA_EMPTY })
  @Matches(RegExHelpers.senha, {
    message: MessagesHelper.SENHA_VALID,
  }) // Validador de  senha forte, caso precise
  password: string;

  @ApiProperty({
    example: '123@abc',
    description: `Necessário para realização do login/acesso ao sistema`,
  })
  @IsOptional()
  currentPassword: string;
}
